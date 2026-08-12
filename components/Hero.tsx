import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search, BookOpen, ChevronDown } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';
import { Professor, Course } from '../types';
import AnimatedContent from './AnimatedContent';
import { WhyItMatters } from './WhyItMatters';

// @ts-ignore
import libraryBg from '../src/assets/images/d8753ab1ccde7ca176e9dc432e0920eef36de5c20025f67a43e1ff00526c002c.png';

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

    // Set navbar theme to light initially, and watch scroll position to transition to dark when scrolling to WhyItMatters
    onNavbarThemeChange?.('light');

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;
      // As user scrolls down towards WhyItMatters (dark section), align navbar with dark theme
      if (scrollTop > clientHeight * 0.35) {
        onNavbarThemeChange?.('dark');
      } else {
        onNavbarThemeChange?.('light');
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
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
    <div ref={containerRef} className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth relative bg-slate-50">
      {/* Search & Hero Screen */}
      <div className="relative isolate overflow-hidden h-screen min-h-[600px] flex items-center justify-center pb-12 pt-16 snap-start shrink-0">
        
        {/* Pixel Grid — background effect */}
        <div
          data-aifx="blocky"
          className="absolute inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
        ></div>

        {/* Soft subtle glow directly behind hero text for pristine contrast on grid */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[950px] h-[500px] bg-white/20 rounded-full blur-3xl pointer-events-none z-[4]"
        />
        
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
          className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-[-1.5rem]"
        >
          <div className="inline-flex items-center justify-center mb-7 group">
            <div className="p-4 bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/60 border border-slate-200/80 rounded-full mx-auto align-middle hover:bg-white transition-all duration-300">
               <BookOpen className="w-8 h-8 text-blue-900 group-hover:animate-bounce" strokeWidth={1.5} />
            </div>
          </div>
          
          <p className="text-sm md:text-base uppercase tracking-[0.25em] font-bold text-blue-900 mb-3">
            Universiti Kebangsaan Malaysia
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-5 tracking-tight leading-tight">
            <span className="italic font-medium">Rate My Professor</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-7 font-normal leading-relaxed">
            Verified course and instructor evaluations from real UKM students.
          </p>
          
          {/* Search Box - Focal Brightest Object */}
          <div className="max-w-3xl mx-auto bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-300/50 border border-slate-200/80 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300 group">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="pl-4 pr-2 text-slate-400">
                <Search className="w-5 h-5 group-focus-within:animate-pulse group-focus-within:text-blue-600 transition-colors" strokeWidth={2.2} />
              </div>
              <input 
                id="hero-search-input"
                type="text" 
                className="w-full h-11 bg-transparent text-slate-900 outline-none font-sans text-sm md:text-base placeholder:text-slate-400 font-semibold"
                placeholder="Search faculty, courses, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-[14px] font-bold text-sm md:text-base hover:-translate-y-[1px] active:translate-y-0 transition-all shadow-md shadow-blue-500/25 hover:shadow-lg flex items-center gap-1.5 ml-1.5 pr-6 whitespace-nowrap group/btn"
              >
                Search <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Lightweight Stats Row */}
          <div className="mt-4 flex justify-center items-center gap-3 text-xs md:text-sm font-medium text-slate-500 select-none">
            <span>49,000+ Students</span>
            <span className="text-slate-300 font-bold">•</span>
            <span>13 Faculties</span>
            <span className="text-slate-300 font-bold">•</span>
            <span>Est. 1970</span>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Reviews
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Authentic Insights
            </div>
            <Link to="/admin/login" className="flex items-center gap-1 hover:text-blue-600 text-slate-600 transition-colors underline underline-offset-4 decoration-slate-300">
              Administrator Access &rarr;
            </Link>
          </div>
        </AnimatedContent>

        {/* Floating Elegant Scroll Indicator */}
        <div 
          onClick={scrollToWhyItMatters}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 select-none cursor-pointer hover:text-slate-900 transition-colors z-20 group"
        >
          <span>Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-slate-500">
            <div className="w-1.5 h-2.5 bg-slate-400 rounded-full animate-bounce group-hover:bg-slate-700" />
          </div>
        </div>
      </div>

      {/* "Why It Matters" Interactive Animation Section */}
      <WhyItMatters />

      {/* Embedded Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 relative z-10 snap-end shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
             <p className="font-serif font-bold text-slate-800">Universiti Kebangsaan Malaysia</p>
             <p className="text-xs mt-1">Management Information System &copy; 2025</p>
          </div>
          <div className="text-xs">
            <span onClick={onOpenPrivacy} className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="mx-2">•</span>
            <span onClick={onOpenTerms} className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};