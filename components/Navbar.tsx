import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Shield } from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser?: User | null;
  onTriggerLogin: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<Props> = ({ currentUser, onTriggerLogin, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to determine if a link is active
  const navClass = (path: string) => 
    location.pathname === path 
      ? "text-ukm-blue font-bold px-3 py-2 rounded-lg bg-blue-50/50 transition-colors" 
      : "text-slate-600 font-medium hover:text-ukm-blue hover:bg-slate-50/50 px-3 py-2 rounded-lg transition-colors";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Area */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group" onClick={closeMobileMenu}>
              <div className="p-2 bg-white/50 backdrop-blur-sm rounded-lg group-hover:bg-blue-50/80 transition-colors border border-white/50 shadow-sm">
                <BookOpen className="h-6 w-6 text-ukm-blue" />
              </div>
              <span className="font-serif font-bold text-xl md:text-2xl tracking-tight text-slate-900 group-hover:text-ukm-blue transition-colors">
                UKM Academic
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center space-x-1 mr-4">
              <Link to="/" className={navClass('/')}>Home</Link>
              <Link to="/professors" className={navClass('/professors')}>Faculty</Link>
              <Link to="/courses" className={navClass('/courses')}>Courses</Link>
              <Link to="/my-courses" className={navClass('/my-courses')}>My Learning</Link>
              <Link to="/dashboard" className={navClass('/dashboard')}>Analytics</Link>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-sm font-medium text-slate-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span>{currentUser.name}</span>
                  {currentUser.isVerified && <Shield className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-white/60 backdrop-blur-sm border border-white/60 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm hover:bg-white/80 hover:text-red-700 hover:border-red-200/80 transition-all shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={onTriggerLogin}
                className="bg-ukm-blue/90 backdrop-blur-sm text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-blue-900 transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-white/50 backdrop-blur-sm rounded-lg border border-transparent hover:border-white/50"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-md">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-white/50 hover:text-ukm-blue transition-colors">Home</Link>
            <Link to="/professors" onClick={closeMobileMenu} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-white/50 hover:text-ukm-blue transition-colors">Faculty</Link>
            <Link to="/courses" onClick={closeMobileMenu} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-white/50 hover:text-ukm-blue transition-colors">Courses</Link>
            <Link to="/my-courses" onClick={closeMobileMenu} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-white/50 hover:text-ukm-blue transition-colors">My Learning</Link>
            <Link to="/dashboard" onClick={closeMobileMenu} className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-white/50 hover:text-ukm-blue transition-colors">Analytics</Link>
            
            <div className="pt-4 mt-2 border-t border-white/40">
              {currentUser ? (
                <div className="space-y-4 px-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 pb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    {currentUser.name}
                  </div>
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-center px-4 py-2 border border-white/60 bg-white/50 backdrop-blur-sm rounded-lg text-base font-medium text-slate-700 hover:bg-white/80 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onTriggerLogin();
                    closeMobileMenu();
                  }}
                  className="w-full text-center px-4 py-2.5 bg-ukm-blue/90 backdrop-blur-md rounded-lg text-base font-bold text-white hover:bg-blue-900 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};