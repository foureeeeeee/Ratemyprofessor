import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search, BookOpen, ChevronDown } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';
import { Professor, Course } from '../types';
import AnimatedContent from './AnimatedContent';
import { WhyItMatters } from './WhyItMatters';

// @ts-ignore
import libraryBg from '../src/assets/images/university_library_bg_1784716518650.jpg';

interface Props {
  professors?: Professor[];
  courses?: Course[];
  onNavbarThemeChange?: (theme: 'light' | 'dark') => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Hero: React.FC<Props> = ({ 
  professors = [], 
  courses = [], 
  onNavbarThemeChange,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload image for a perfect fade-in animation once fully loaded
    const img = new Image();
    img.src = libraryBg;
    if (img.complete) {
      setIsBgLoaded(true);
    } else {
      img.onload = () => {
        setIsBgLoaded(true);
      };
    }

    // Keep the navbar theme dark for the entire premium dark homepage
    onNavbarThemeChange?.('dark');
    return () => {
      onNavbarThemeChange?.('light');
    };
  }, [onNavbarThemeChange]);

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
    <div ref={containerRef} className="h-[calc(100vh-7rem)] overflow-y-auto snap-y snap-mandatory scroll-smooth relative bg-slate-950">
      {/* Search & Hero Screen */}
      <div className="relative overflow-hidden h-full min-h-[550px] flex items-center justify-center pb-12 snap-start shrink-0">
        
        {/* Layer 1: Base Library Image with Soft Blur */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${libraryBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(5px)',
            opacity: isBgLoaded ? 1 : 0,
            transform: isBgLoaded ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Layer 2: Premium Dark Navy Gradient Overlay */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 15, 35, 0.55) 0%, rgba(12, 24, 52, 0.65) 45%, rgba(10, 18, 40, 0.72) 100%)',
          }}
        />
        
        {/* Layer 3: Particle Animation (~70% reduced density, slowed speed, clear subtle visibility) */}
        <div 
          className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-1000 ease-out"
          style={{
            opacity: isBgLoaded ? 1 : 0,
          }}
        >
          <ParticlesBackground 
            particleCountFactor={6500}                  // 70% reduction in density relative to original 2000
            baseSpeed={0.12}                             // Calm, slow ambient AI movement
            particleColor="rgba(255, 255, 255, 0.55)"   // Crisp visible nodes
            lineColor="rgba(255, 255, 255, 0.15)"       // Clearly visible subtle constellation lines
            mouseForce={-0.4}                            // Subtle interactive reaction to cursor
            connectDistance={150}                        // Balanced line connections
          />
        </div>
        
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
            <div className="p-4 bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-full mx-auto align-middle hover:bg-white/10 transition-all duration-300">
               <BookOpen className="w-8 h-8 text-slate-200 group-hover:animate-bounce" strokeWidth={1.5} />
            </div>
          </div>
          
          <p className="text-sm md:text-base uppercase tracking-[0.25em] font-bold text-slate-400 mb-3">
            Universiti Kebangsaan Malaysia
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight leading-tight">
            <span className="italic font-medium">Rate My Professor</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Verified course and instructor evaluations from real UKM students.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-2xl shadow-slate-950/40 border border-slate-200 focus-within:ring-4 focus-within:ring-white/10 focus-within:border-slate-300 transition-all duration-300 group">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="pl-4 pr-2 text-slate-400">
                <Search className="w-5 h-5 group-focus-within:animate-pulse group-focus-within:text-slate-900 transition-colors" strokeWidth={2} />
              </div>
              <input 
                id="hero-search-input"
                type="text" 
                className="w-full h-11 bg-transparent text-slate-900 outline-none font-sans text-sm md:text-base placeholder:text-slate-400 font-medium"
                placeholder="Search faculty, courses, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="h-11 px-5 bg-slate-900 text-white rounded-lg font-bold text-sm md:text-base hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all shadow-md flex items-center gap-1.5 ml-1.5 pr-5 whitespace-nowrap group/btn"
              >
                Search <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Lightweight Stats Row */}
          <div className="mt-4 flex justify-center items-center gap-3 text-xs md:text-sm font-medium text-slate-400 select-none">
            <span>49,000+ Students</span>
            <span className="text-slate-600 font-bold">•</span>
            <span>13 Faculties</span>
            <span className="text-slate-600 font-bold">•</span>
            <span>Est. 1970</span>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Reviews
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Authentic Insights
            </div>
            <Link to="/admin/login" className="flex items-center gap-1 hover:text-blue-400 transition-colors underline underline-offset-4 decoration-slate-600">
              Administrator Access &rarr;
            </Link>
          </div>
        </AnimatedContent>

        {/* Floating Elegant Scroll Indicator */}
        <div 
          onClick={scrollToWhyItMatters}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs font-semibold text-slate-400/80 select-none cursor-pointer hover:text-slate-200 transition-colors z-20 group"
        >
          <span>Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-slate-750 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-slate-500">
            <div className="w-1.5 h-2.5 bg-slate-500 rounded-full animate-bounce group-hover:bg-slate-300" />
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
            <span onClick={onOpenPrivacy} className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="mx-2">•</span>
            <span onClick={onOpenTerms} className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};