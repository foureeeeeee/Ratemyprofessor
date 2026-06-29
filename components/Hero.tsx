import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search, BookOpen } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';
import { Professor, Course } from '../types';
import AnimatedContent from './AnimatedContent';

interface Props {
  professors?: Professor[];
  courses?: Course[];
}

export const Hero: React.FC<Props> = ({ professors = [], courses = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    
    if (term) {
      const courseMatch = courses.some(c => 
        c.code.toLowerCase().includes(term) || 
        c.name.toLowerCase().includes(term)
      );

      const profMatch = professors.some(p => 
        p.name.toLowerCase().includes(term)
      );

      if (courseMatch && !profMatch) {
        navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate(`/professors?search=${encodeURIComponent(searchTerm)}`);
      }
    } else {
      navigate('/professors');
    }
  };

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
      <div className="absolute inset-0 z-0 opacity-100 mix-blend-multiply">
        <ParticlesBackground 
          particleCountFactor={2000}
          baseSpeed={0.3}
          particleColor="#64748b"
          lineColor="rgba(100, 116, 139, 0.3)"
          mouseForce={-0.8}
          connectDistance={180}
        />
      </div>
      
      {/* Subtle radial gradient to center content visually */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f8fafc_90%)] pointer-events-none"></div>
      
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="back.out(1.7)"
        initialOpacity={0}
        animateOpacity
        scale={0.8}
        threshold={0.1}
        delay={0.2}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-[-4rem]"
      >
        <div className="inline-flex items-center justify-center mb-8">
          <div className="p-4 bg-white shadow-md border border-slate-200 rounded-full mx-auto align-middle">
             <BookOpen className="w-8 h-8 text-slate-800" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight leading-tight">
          Universiti Kebangsaan Malaysia <br className="hidden md:block" />
          <span className="text-slate-600 italic font-medium">Academic Review Index</span>
        </h1>

        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Access verified course and instructor evaluations. Empowering students with transparent academic insights to make informed enrollment decisions.
        </p>
        
        {/* Search Box */}
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-300 focus-within:ring-4 focus-within:ring-slate-900/5 focus-within:border-slate-400 transition-all duration-300">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="pl-6 pr-4 text-slate-400">
              <Search className="w-6 h-6" strokeWidth={2} />
            </div>
            <input 
              type="text" 
              className="w-full h-14 bg-transparent text-slate-900 outline-none font-sans text-xl placeholder:text-slate-400 font-medium"
              placeholder="Search faculty, courses, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="h-14 px-8 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all shadow-md flex items-center gap-2 pr-8 ml-2 whitespace-nowrap"
            >
              Search <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </form>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Reviews
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Authentic Insights
          </div>
          <Link to="/admin/login" className="flex items-center gap-1 hover:text-ukm-blue transition-colors underline underline-offset-4 decoration-slate-300">
            Administrator Access &rarr;
          </Link>
        </div>
      </AnimatedContent>
    </div>
  );
};