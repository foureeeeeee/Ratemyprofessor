import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { Course, Review, User, SmpEnrollment, Professor } from '../types';
import { supabase } from '../services/supabase';

interface Props {
  currentUser: User | null;
  courses: Course[];
  reviews: Review[];
  professors: Professor[];
}

export const StudentDashboard: React.FC<Props> = ({ currentUser, courses, reviews, professors }) => {
  const [enrollments, setEnrollments] = useState<SmpEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!currentUser?.email) return;
      
      try {
        const { data, error } = await supabase
          .from('mock_smp_enrollments')
          .select('*')
          .eq('student_email', currentUser.email);
          
        if (error) throw error;
        setEnrollments(data || []);
      } catch (err) {
        console.error("Error fetching enrollments", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Find reviews authored by this user
  // (Assuming studentName is stored or matched. If the reviews table doesn't have email, 
  // we can only match by verified status and student_name, but we assume they use their matric number/name)
  // Actually, since reviews table has student_name, and currentUser.name is derived from email, 
  // let's match by studentName === currentUser.name
  const userReviews = reviews.filter(r => r.studentName === currentUser.name);

  // Filter enrollments based on whether they have reviewed the course
  const pendingCourses = enrollments
    .filter(enrollment => !userReviews.some(r => r.courseCode === enrollment.course_code))
    .map(enrollment => courses.find(c => c.code === enrollment.course_code))
    .filter((c): c is Course => c !== undefined);

  const completedCourses = enrollments
    .filter(enrollment => userReviews.some(r => r.courseCode === enrollment.course_code))
    .map(enrollment => courses.find(c => c.code === enrollment.course_code))
    .filter((c): c is Course => c !== undefined);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <BookOpen className="w-8 h-8 animate-pulse" />
          <p className="font-medium animate-pulse">Loading Academic Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-slate-900">My Courses</h1>
        <p className="text-slate-600 mt-2">Manage your SMP enrollment verifications and pending reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Pending Reviews */}
        <div>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Pending Reviews</h2>
          </div>
          
          {pendingCourses.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-medium">
              You have no pending course reviews. Complete your SMP enrollments to unlock more courses.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map(course => {
                const courseProfessors = course.professorIds
                  .map(id => professors.find(p => p.id === id))
                  .filter((p): p is Professor => p !== undefined);

                return (
                  <div key={course.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg mb-2">Needs Review</span>
                      <h3 className="font-bold text-lg text-slate-900">{course.code}</h3>
                      <p className="text-slate-600 text-sm font-medium">{course.name}</p>
                    </div>
                    
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instructors</h4>
                      {courseProfessors.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {courseProfessors.map(prof => (
                            <Link 
                              key={prof.id}
                              to={`/professors/${prof.id}?action=review&course=${course.code}`}
                              className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                            >
                              <span className="text-sm font-medium text-slate-800 group-hover:text-blue-700">{prof.name}</span>
                              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">Review</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No instructors assigned yet.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Reviews */}
        <div>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Completed</h2>
          </div>
          
          {completedCourses.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-medium">
              You haven't reviewed any of your enrolled courses yet.
            </div>
          ) : (
            <div className="space-y-4">
              {completedCourses.map(course => (
                <div key={course.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm opacity-75">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg mb-2">
                        <CheckCircle className="w-3 h-3" /> Reviewed
                      </span>
                      <h3 className="font-bold text-lg text-slate-900">{course.code}</h3>
                      <p className="text-slate-600 text-sm font-medium">{course.name}</p>
                    </div>
                    <Link 
                      to={`/courses/${course.id}`}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors shrink-0"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
