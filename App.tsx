
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfessorList } from './components/ProfessorList';
import { CourseList } from './components/CourseList';
import { CourseDetails } from './components/CourseDetails';
import { ProfessorDetails } from './components/ProfessorDetails';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentLoginModal } from './components/StudentLoginModal';
import { MOCK_PROFESSORS, MOCK_REVIEWS, MOCK_COURSES } from './constants';
import { Professor, Review, Course, User, Report } from './types';
import { Loader2, BookOpenCheck } from 'lucide-react';
import { supabase } from './services/supabase';

export default function App() {
  // Centralized state to simulate a database
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]); // New Reports State
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsRes, coursesRes, reviewsRes, reportsRes] = await Promise.all([
          supabase.from('professors').select('*'),
          supabase.from('courses').select('*'),
          supabase.from('reviews').select('*'),
          supabase.from('reports').select('*')
        ]);

        if (professorsRes.error) throw professorsRes.error;
        if (coursesRes.error) throw coursesRes.error;
        if (reviewsRes.error) throw reviewsRes.error;
        if (reportsRes.error) throw reportsRes.error;

        // Map snake_case to camelCase
        const mappedProfessors = professorsRes.data.map(p => ({
          id: p.id,
          name: p.name,
          department: p.department,
          title: p.title,
          image: p.image,
          averageRating: p.average_rating,
          reviewCount: p.review_count
        }));

        const mappedCourses = coursesRes.data.map(c => ({
          id: c.id,
          code: c.code,
          name: c.name,
          department: c.department,
          description: c.description,
          professorIds: c.professor_ids || []
        }));

        const mappedReviews = reviewsRes.data.map(r => ({
          id: r.id,
          professorId: r.professor_id,
          studentName: r.student_name,
          rating: r.rating,
          difficulty: r.difficulty,
          tags: r.tags || [],
          comment: r.comment,
          courseCode: r.course_code,
          date: r.date,
          clarity: r.clarity,
          fairness: r.fairness,
          communication: r.communication,
          expertise: r.expertise,
          approachability: r.approachability,
          forCredit: r.for_credit,
          attendance: r.attendance,
          wouldTakeAgain: r.would_take_again,
          grade: r.grade,
          textbookUsed: r.textbook_used,
          verified: r.verified
        }));

        const mappedReports = reportsRes.data.map(r => ({
          id: r.id,
          targetId: r.target_id,
          targetType: r.target_type,
          reason: r.reason,
          details: r.details,
          status: r.status,
          timestamp: r.timestamp,
          reporterEmail: r.reporter_email
        }));

        // Fallback to mock data if Supabase tables are empty (for initial setup)
        setProfessors(mappedProfessors.length > 0 ? mappedProfessors : MOCK_PROFESSORS);
        setCourses(mappedCourses.length > 0 ? mappedCourses : MOCK_COURSES);
        setReviews(mappedReviews.length > 0 ? mappedReviews : MOCK_REVIEWS);
        setReports(mappedReports);
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
        // Fallback to mock data on error
        setProfessors(MOCK_PROFESSORS);
        setCourses(MOCK_COURSES);
        setReviews(MOCK_REVIEWS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Set up Supabase Auth Listener for Magic Link Logins
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        handleStudentLogin(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        handleStudentLogin(session.user.email);
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Recalculate professor ratings when reviews change
  useEffect(() => {
    if (professors.length === 0) return;

    setProfessors(prevProfs => {
      const updated = prevProfs.map(prof => {
        const profReviews = reviews.filter(r => r.professorId === prof.id);
        if (profReviews.length === 0) return prof;

        const avg = profReviews.reduce((acc, curr) => acc + curr.rating, 0) / profReviews.length;
        const newAvg = parseFloat(avg.toFixed(1));
        
        // Only return new object if data changed
        if (prof.averageRating === newAvg && prof.reviewCount === profReviews.length) {
          return prof;
        }

        return {
          ...prof,
          averageRating: newAvg,
          reviewCount: profReviews.length
        };
      });
      
      const hasChanges = updated.some((p, i) => p !== prevProfs[i]);
      return hasChanges ? updated : prevProfs;
    });
  }, [reviews]);

  // --- CRUD Handlers ---

  const handleAddReview = async (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    try {
      await supabase.from('reviews').insert({
        id: newReview.id,
        professor_id: newReview.professorId,
        student_name: newReview.studentName,
        rating: newReview.rating,
        difficulty: newReview.difficulty,
        tags: newReview.tags,
        comment: newReview.comment,
        course_code: newReview.courseCode,
        date: newReview.date,
        clarity: newReview.clarity,
        fairness: newReview.fairness,
        communication: newReview.communication,
        expertise: newReview.expertise,
        approachability: newReview.approachability,
        for_credit: newReview.forCredit,
        attendance: newReview.attendance,
        would_take_again: newReview.wouldTakeAgain,
        grade: newReview.grade,
        textbook_used: newReview.textbookUsed,
        verified: newReview.verified
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      await supabase.from('reviews').delete().eq('id', id);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleAddProfessor = async (newProfessor: Professor) => {
    setProfessors(prev => [newProfessor, ...prev]);
    try {
      await supabase.from('professors').insert({
        id: newProfessor.id,
        name: newProfessor.name,
        department: newProfessor.department,
        title: newProfessor.title,
        image: newProfessor.image,
        average_rating: newProfessor.averageRating,
        review_count: newProfessor.reviewCount
      });
    } catch (error) {
      console.error("Error adding professor:", error);
    }
  };

  const handleUpdateProfessor = async (updatedProfessor: Professor) => {
    setProfessors(prev => prev.map(p => p.id === updatedProfessor.id ? updatedProfessor : p));
    try {
      await supabase.from('professors').update({
        name: updatedProfessor.name,
        department: updatedProfessor.department,
        title: updatedProfessor.title,
        image: updatedProfessor.image,
        average_rating: updatedProfessor.averageRating,
        review_count: updatedProfessor.reviewCount
      }).eq('id', updatedProfessor.id);
    } catch (error) {
      console.error("Error updating professor:", error);
    }
  };

  const handleDeleteProfessor = async (id: string) => {
    setProfessors(prev => prev.filter(p => p.id !== id));
    try {
      await supabase.from('professors').delete().eq('id', id);
    } catch (error) {
      console.error("Error deleting professor:", error);
    }
  };

  const handleAddCourse = async (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    try {
      await supabase.from('courses').insert({
        id: newCourse.id,
        code: newCourse.code,
        name: newCourse.name,
        department: newCourse.department,
        description: newCourse.description,
        professor_ids: newCourse.professorIds
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    try {
      await supabase.from('courses').update({
        code: updatedCourse.code,
        name: updatedCourse.name,
        department: updatedCourse.department,
        description: updatedCourse.description,
        professor_ids: updatedCourse.professorIds
      }).eq('id', updatedCourse.id);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // --- Reporting Handlers ---
  const handleReportContent = async (report: Omit<Report, 'id' | 'status' | 'timestamp'>) => {
    const newReport: Report = {
      ...report,
      id: crypto.randomUUID(), // Use UUID for Supabase
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    try {
      await supabase.from('reports').insert({
        id: newReport.id,
        target_id: newReport.targetId,
        target_type: newReport.targetType,
        reason: newReport.reason,
        details: newReport.details,
        status: newReport.status,
        timestamp: newReport.timestamp,
        reporter_email: newReport.reporterEmail
      });
    } catch (error) {
      console.error("Error adding report:", error);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'dismiss' | 'delete', adminMessage?: string) => {
    const report = reports.find(r => r.id === reportId);
    
    // Notify User
    if (report && report.reporterEmail) {
      const resolution = action === 'dismiss' ? 'Approved (Report Dismissed)' : 'Rejected (Content Removed)';
      
      const subject = encodeURIComponent(`Update on your report regarding ${report.targetType}`);
      let bodyText = `Your report has been reviewed by our administration team.\n\n`;
      bodyText += `Resolution: ${resolution}\n`;
      
      if (adminMessage) {
        bodyText += `\nMessage from Admin:\n"${adminMessage}"\n`;
      }
      
      bodyText += `\nThank you for helping keep our community safe and accurate.`;
      
      const body = encodeURIComponent(bodyText);
      
      // Open default email client with pre-filled content
      window.location.href = `mailto:${report.reporterEmail}?subject=${subject}&body=${body}`;
    }

    const newStatus = action === 'dismiss' ? 'dismissed' : 'resolved';
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: newStatus };
      }
      return r;
    }));

    try {
      await supabase.from('reports').update({ status: newStatus }).eq('id', reportId);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  // --- Auth Handlers ---
  
  const handleLogin = () => setIsAdmin(true);
  const handleLogout = () => setIsAdmin(false);

  const handleStudentLogin = (email: string) => {
    const namePart = email.split('@')[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    setCurrentUser({
      name: name,
      email: email,
      isVerified: true
    });
    setIsLoginModalOpen(false);
  };

  const handleRequireLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleStudentLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="relative z-10 flex flex-col items-center">
          <BookOpenCheck className="w-16 h-16 text-blue-800 mb-6 animate-pulse" />
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">UKM Academic Portal</h1>
          <p className="text-sm text-slate-500 font-medium">Loading System Data...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 relative">
        
        <Navbar 
          currentUser={currentUser} 
          onTriggerLogin={handleRequireLogin} 
          onLogout={handleStudentLogout}
        />
        
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Hero professors={professors} courses={courses} />} />
            <Route 
              path="/professors" 
              element={
                <ProfessorList 
                  professors={professors} 
                  reviews={reviews} 
                  onAddProfessor={handleAddProfessor}
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                />
              } 
            />
            <Route 
              path="/courses" 
              element={
                <CourseList 
                  courses={courses}
                  professors={professors} 
                  reviews={reviews} 
                  onAddCourse={handleAddCourse}
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                />
              } 
            />
            <Route 
              path="/courses/:id" 
              element={
                <CourseDetails 
                  courses={courses}
                  professors={professors} 
                  reviews={reviews}
                  onAddReview={handleAddReview} 
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                  onReport={handleReportContent}
                />
              } 
            />
            <Route 
              path="/professors/:id" 
              element={
                <ProfessorDetails 
                  professors={professors} 
                  reviews={reviews} 
                  onAddReview={handleAddReview}
                  currentUser={currentUser}
                  onRequireLogin={handleRequireLogin}
                  onReport={handleReportContent}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard professors={professors} reviews={reviews} />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={handleLogin} />} 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                isAdmin ? (
                  <AdminDashboard 
                    professors={professors}
                    courses={courses}
                    reviews={reviews}
                    reports={reports}
                    onAddProfessor={handleAddProfessor}
                    onUpdateProfessor={handleUpdateProfessor}
                    onDeleteProfessor={handleDeleteProfessor}
                    onAddCourse={handleAddCourse}
                    onUpdateCourse={handleUpdateCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onDeleteReview={handleDeleteReview}
                    onResolveReport={handleResolveReport}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {isLoginModalOpen && (
          <StudentLoginModal 
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleStudentLogin}
          />
        )}

        <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
               <p className="font-serif font-bold text-slate-900">Universiti Kebangsaan Malaysia</p>
               <p className="text-xs mt-1">Management Information System &copy; 2025</p>
            </div>
            <div className="text-xs">
              <span className="hover:text-blue-700 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="mx-2">•</span>
              <span className="hover:text-blue-700 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
