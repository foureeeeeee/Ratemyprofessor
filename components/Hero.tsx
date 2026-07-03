import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search, BookOpen, ChevronDown } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';
import { Professor, Course } from '../types';
import AnimatedContent from './AnimatedContent';
import { WhyItMatters } from './WhyItMatters';

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

  const scrollToWhyItMatters = () => {
    document.getElementById('why-it-matters-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-[calc(100vh-7rem)] overflow-y-auto snap-y snap-mandatory scroll-smooth relative bg-slate-50">
      {/* Search & Hero Screen */}
      <div className="relative overflow-hidden h-full min-h-[550px] flex items-center justify-center pb-12 snap-start shrink-0">
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
          className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-[-2rem]"
        >
          <div className="inline-flex items-center justify-center mb-8 group">
            <div className="p-4 bg-white shadow-md border border-slate-200 rounded-full mx-auto align-middle group-hover:shadow-lg transition-shadow">
               <BookOpen className="w-8 h-8 text-slate-800 group-hover:animate-bounce" />
            </div>
          </div>
          
          <p className="text-sm md:text-base uppercase tracking-[0.2em] font-bold text-slate-500 mb-3">
            Universiti Kebangsaan Malaysia
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-6 tracking-tight leading-tight">
            <span className="italic font-medium">Academic Review Index</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Verified course and instructor evaluations from real UKM students.
          </p>
          
          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-300 focus-within:ring-4 focus-within:ring-slate-900/5 focus-within:border-slate-400 transition-all duration-300 group">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="pl-6 pr-4 text-slate-400">
                <Search className="w-6 h-6 group-focus-within:animate-pulse group-focus-within:text-slate-900 transition-colors" strokeWidth={2} />
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
                className="h-14 px-8 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all shadow-md flex items-center gap-2 pr-8 ml-2 whitespace-nowrap group/btn"
              >
                Search <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Lightweight Stats Row */}
          <div className="mt-4 flex justify-center items-center gap-3 text-xs md:text-sm font-medium text-slate-400 select-none">
            <span>49,000+ Students</span>
            <span className="text-slate-300 font-bold">•</span>
            <span>13 Faculties</span>
            <span className="text-slate-300 font-bold">•</span>
            <span>Est. 1970</span>
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

        {/* Floating Elegant Scroll Indicator */}
        <div 
          onClick={scrollToWhyItMatters}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs font-semibold text-slate-400 select-none cursor-pointer hover:text-slate-600 transition-colors z-20 group"
        >
          <span>Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-slate-500">
            <div className="w-1.5 h-2.5 bg-slate-400 rounded-full animate-bounce group-hover:bg-slate-600" />
          </div>
        </div>
      </div>

      {/* "Why It Matters" Interactive Animation Section */}
      <WhyItMatters />

      {/* Elegant Dark Embedded Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-8 relative z-10 snap-end shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
             <p className="font-serif font-bold text-slate-300">Universiti Kebangsaan Malaysia</p>
             <p className="text-xs mt-1">Management Information System &copy; 2025</p>
          </div>
          <div className="text-xs">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="mx-2">•</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};