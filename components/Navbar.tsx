import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, Shield } from 'lucide-react';
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
      ? "bg-terminal-light text-terminal-black px-4 py-1 font-bold uppercase tracking-tight" 
      : "text-terminal-light hover:text-terminal-accent px-4 py-1 uppercase tracking-tight transition-colors";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-terminal-black border-b-2 border-terminal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Area */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group" onClick={closeMobileMenu}>
              <Terminal className="h-6 w-6 text-terminal-accent" />
              <span className="font-bold text-xl tracking-tighter text-terminal-light group-hover:text-terminal-accent transition-colors">
                RATE_MY_PROF_<span className="animate-blink">_</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex border border-terminal-gray p-1">
              <Link to="/" className={navClass('/')}>Home</Link>
              <div className="w-px bg-terminal-gray mx-1"></div>
              <Link to="/professors" className={navClass('/professors')}>Profs</Link>
              <div className="w-px bg-terminal-gray mx-1"></div>
              <Link to="/courses" className={navClass('/courses')}>Courses</Link>
              <div className="w-px bg-terminal-gray mx-1"></div>
              <Link to="/dashboard" className={navClass('/dashboard')}>Data</Link>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-terminal-accent px-3 py-1 text-terminal-accent text-xs font-bold uppercase">
                  <div className="w-2 h-2 bg-terminal-accent rounded-none animate-pulse"></div>
                  <span>{currentUser.name}</span>
                  {currentUser.isVerified && <Shield className="w-3 h-3" />}
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-terminal-gray text-terminal-light px-4 py-2 text-xs font-bold uppercase hover:bg-terminal-accent hover:text-terminal-black transition-colors"
                >
                  [ LOGOUT ]
                </button>
              </div>
            ) : (
              <button 
                onClick={onTriggerLogin}
                className="bg-terminal-gray text-terminal-light px-4 py-2 text-xs font-bold uppercase hover:bg-terminal-accent hover:text-terminal-black transition-colors"
              >
                [ LOGIN ]
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-terminal-light hover:bg-terminal-gray"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-terminal-black border-b-2 border-terminal-light">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-l-4 border-terminal-accent ml-4 my-4">
            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-terminal-light hover:bg-terminal-gray hover:text-terminal-accent uppercase">Home</Link>
            <Link to="/professors" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-terminal-light hover:bg-terminal-gray hover:text-terminal-accent uppercase">Professors</Link>
            <Link to="/courses" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-terminal-light hover:bg-terminal-gray hover:text-terminal-accent uppercase">Courses</Link>
            <Link to="/dashboard" onClick={closeMobileMenu} className="block px-3 py-2 text-base font-medium text-terminal-light hover:bg-terminal-gray hover:text-terminal-accent uppercase">Analytics</Link>
            
            <div className="pt-4 mt-4 border-t border-terminal-gray">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-terminal-accent font-bold uppercase">
                    USER: {currentUser.name}
                  </div>
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-terminal-gray hover:text-red-400 uppercase"
                  >
                    [ LOGOUT ]
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onTriggerLogin();
                    closeMobileMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-terminal-light hover:bg-terminal-gray hover:text-terminal-accent uppercase"
                >
                  [ ACCESS PORTAL ]
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};