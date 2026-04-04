import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Professor } from '../types';

interface Props {
  professor: Professor;
}

export const ProfessorCard: React.FC<Props> = ({ professor }) => {
  // Generate a simplistic rating bar
  const ratingBar = "#####".substring(0, Math.round(professor.averageRating)).padEnd(5, '-');

  return (
    <Link to={`/professors/${professor.id}`} className="block group h-full">
      <div className="h-full bg-terminal-black border-2 border-terminal-gray hover:border-terminal-light transition-all duration-200 relative hover:shadow-[8px_8px_0_#e5e5e5] flex flex-col">
        
        {/* Header Decoration */}
        <div className="h-6 border-b-2 border-terminal-gray bg-terminal-gray/10 flex items-center justify-between px-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-terminal-gray rounded-full"></div>
            <div className="w-2 h-2 bg-terminal-gray rounded-full"></div>
          </div>
          <span className="text-[10px] text-terminal-gray uppercase">ID: {professor.id}</span>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-4 border-2 border-terminal-light p-1">
             <img 
               src={professor.image} 
               alt={professor.name} 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
             />
          </div>
          
          <h3 className="text-lg font-bold text-terminal-light uppercase tracking-tight group-hover:text-terminal-accent transition-colors">
            {professor.name}
          </h3>
          <p className="text-xs text-terminal-gray uppercase mt-1 mb-4 border-b border-terminal-gray/50 pb-2 w-full">
            {professor.title}
          </p>

          <div className="w-full text-left space-y-2 text-xs font-mono text-terminal-light mt-auto">
            <div className="flex justify-between">
              <span className="text-terminal-gray">DEPT:</span>
              <span className="uppercase">{professor.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-gray">RATING:</span>
              <span className="text-terminal-accent">[{ratingBar}] {professor.averageRating.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-gray">REVIEWS:</span>
              <span>{professor.reviewCount}</span>
            </div>
          </div>
        </div>
        
        {/* Footer Button */}
        <div className="border-t-2 border-terminal-gray p-2 group-hover:bg-terminal-light group-hover:text-terminal-black transition-colors">
           <div className="flex items-center justify-between text-xs font-bold uppercase">
             <span>ACCESS_FILE</span>
             <ArrowRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    </Link>
  );
};