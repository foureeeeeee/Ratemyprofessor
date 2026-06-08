import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { Professor } from '../types';

interface Props {
  professor: Professor;
}

export const ProfessorCard: React.FC<Props> = ({ professor }) => {
  return (
    <Link to={`/professors/${professor.id}`} className="block group h-full">
      <div className="h-full bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl hover:border-blue-300 hover:shadow-lg hover:bg-white/95 transition-all duration-300 flex flex-col overflow-hidden">
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200">
               <img 
                 src={professor.image} 
                 alt={professor.name} 
                 className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
               />
            </div>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-sm font-medium">
               <Star className="w-4 h-4 fill-current" />
               {professor.averageRating.toFixed(1)}
            </div>
          </div>
          
          <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
            {professor.name}
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-4">
            {professor.title}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
             <span className="text-slate-600 font-medium">{professor.department}</span>
             <span className="text-slate-500">{professor.reviewCount} Reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
};