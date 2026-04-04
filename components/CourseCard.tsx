import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Course, Professor, Review } from '../types';

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

  const ratingBar = "#####".substring(0, Math.round(averageRating)).padEnd(5, '.');
  const teachingProfs = professors.filter(p => course.professorIds.includes(p.id));

  return (
    <Link 
      to={`/courses/${course.id}`}
      className="block group h-full"
    >
      <div className="h-full bg-terminal-black border-2 border-terminal-gray hover:border-terminal-accent transition-all duration-200 relative hover:shadow-[8px_8px_0_#d4ff00] flex flex-col">
        
        <div className="p-4 border-b border-terminal-gray flex justify-between items-center bg-terminal-gray/10">
          <span className="font-bold text-terminal-accent text-lg tracking-widest">{course.code}</span>
          <span className="text-xs text-terminal-gray uppercase">V.1.0</span>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-terminal-light mb-3 uppercase leading-tight group-hover:text-terminal-accent transition-colors">
            {course.name}
          </h3>
          <p className="text-xs text-terminal-gray mb-6 font-mono leading-relaxed uppercase border-l-2 border-terminal-gray pl-2">
            {course.description || "NO_DESCRIPTION_AVAILABLE."}
          </p>

          <div className="mt-auto space-y-2">
            <div className="flex justify-between text-xs text-terminal-light font-mono border-b border-dashed border-terminal-gray pb-1">
                <span>RATING:</span>
                <span className="text-terminal-accent">[{ratingBar}] {averageRating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-terminal-gray">
                <span className="block mb-1">INSTRUCTORS:</span>
                <div className="flex flex-wrap gap-1">
                    {teachingProfs.length > 0 ? teachingProfs.slice(0, 3).map(p => (
                        <span key={p.id} className="bg-terminal-gray text-terminal-black px-1 uppercase">
                            {p.name.split(' ').pop()}
                        </span>
                    )) : <span className="text-terminal-gray/50">TBA</span>}
                    {teachingProfs.length > 3 && <span className="bg-terminal-gray text-terminal-black px-1">+{teachingProfs.length - 3}</span>}
                </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-terminal-gray p-2 group-hover:bg-terminal-accent group-hover:text-terminal-black transition-colors">
           <div className="flex items-center justify-between text-xs font-bold uppercase">
             <span>READ_REVIEWS</span>
             <ArrowRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    </Link>
  );
};