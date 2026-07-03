import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, BookOpen } from 'lucide-react';
import { Course, Professor, Review } from '../types';
import BorderGlow from './BorderGlow';

interface Props {
  course: Course;
  professors: Professor[];
  reviews: Review[];
}

export const CourseCard: React.FC<Props> = ({ course, professors, reviews }) => {
  const courseReviews = reviews.filter(r => r.courseCode === course.code);
  
  const averageRating = courseReviews.length > 0
    ? courseReviews.reduce((acc, r) => acc + r.rating, 0) / courseReviews.length
    : 0;

  const teachingProfs = professors.filter(p => course.professorIds.includes(p.id));

  return (
    <Link 
      to={`/courses/${course.id}`}
      className="block group h-full"
    >
      <BorderGlow
        edgeSensitivity={30}
        glowColor="210 100 60"
        backgroundColor="#ffffff"
        borderRadius={12}
        glowRadius={20}
        glowIntensity={1.0}
        coneSpread={25}
        animated={false}
        colors={['#3b82f6', '#8b5cf6', '#0ea5e9']}
        className="h-full"
      >
        <div className="h-full bg-white/70 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <span className="font-bold text-ukm-blue border border-blue-200 bg-blue-50 px-2.5 py-1 rounded text-sm tracking-wide">{course.code}</span>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
               <Star className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:animate-pulse" />
               {averageRating > 0 ? averageRating.toFixed(1) : '—'}
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
              {course.name}
            </h3>
            <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
              {course.description || "Course description not available."}
            </p>

            <div className="mt-auto space-y-3">
              <div className="text-xs text-slate-500">
                  <span className="block font-medium mb-1 text-slate-400 uppercase tracking-wider">Instructors</span>
                  <div className="flex flex-wrap gap-1.5">
                      {teachingProfs.length > 0 ? teachingProfs.slice(0, 3).map(p => (
                          <span key={p.id} className="bg-slate-100 text-slate-700 px-2 py-1 object-cover rounded-md font-medium text-xs">
                              {p.name.split(' ').pop()}
                          </span>
                      )) : <span className="text-slate-400 italic">To be announced</span>}
                      {teachingProfs.length > 3 && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium text-xs">+{teachingProfs.length - 3}</span>}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </BorderGlow>
    </Link>
  );
};