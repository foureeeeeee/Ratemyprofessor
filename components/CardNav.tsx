import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import './CardNav.css';

export interface CardNavLink {
  label: string;
  href?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links?: CardNavLink[];
}

interface CardNavProps {
  logo?: string | React.ReactNode;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  currentUser?: { name: string; email: string; isVerified?: boolean } | null;
  onTriggerLogin?: () => void;
  onLogout?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
}

export const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  currentUser,
  onTriggerLogin,
  onLogout,
  onExpandedChange
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Detect dark base color for dynamic high-contrast UI theming
  const isDarkBase = baseColor === '#0f172a' || baseColor === '#111827' || baseColor === '#003366' || baseColor === '#1e293b';

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLDivElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight; // force repaint

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      onExpandedChange?.(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => {
        setIsExpanded(false);
        onExpandedChange?.(false);
      });
      tl.reverse();
    }
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (isExpanded) {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => {
        setIsExpanded(false);
        onExpandedChange?.(false);
      });
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) {
      cardsRef.current[i] = el;
    }
  };

  // Handle Auth CTA Button
  const handleCtaClick = () => {
    if (currentUser) {
      if (onLogout) onLogout();
    } else {
      if (onTriggerLogin) onTriggerLogin();
    }
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || (isDarkBase ? '#ffffff' : '#1e293b') }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            {typeof logo === 'string' && logo ? (
              <img src={logo} alt={logoAlt} className="logo" />
            ) : (
              <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                <BookOpen className={`h-5 w-5 group-hover:animate-bounce ${isDarkBase ? 'text-amber-400' : 'text-ukm-blue'}`} />
                <span className={`font-serif font-bold text-sm md:text-base tracking-tight group-hover:text-ukm-blue transition-colors ${
                  isDarkBase ? 'text-white' : 'text-slate-900'
                }`}>
                  UKM Academic
                </span>
              </Link>
            )}
            
            {/* User profile info inside the top bar */}
            {currentUser && (
              <div className={`hidden sm:flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full border text-[10px] font-medium shadow-sm transition-colors ${
                isDarkBase 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
                  : 'bg-emerald-50 border-emerald-100 text-emerald-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="card-nav-cta-button"
            onClick={handleCtaClick}
            style={{ 
              backgroundColor: buttonBgColor || (isDarkBase ? '#334155' : '#003366'), 
              color: buttonTextColor || '#fff' 
            }}
          >
            {currentUser ? 'Sign Out' : 'Sign In'}
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => {
                  if (lnk.onClick) {
                    return (
                      <button
                        key={`${lnk.label}-${i}`}
                        type="button"
                        className="nav-card-link text-left w-full border-none bg-transparent p-0 flex items-center gap-1.5 text-inherit"
                        onClick={() => {
                          lnk.onClick?.();
                          closeMenu();
                        }}
                        aria-label={lnk.ariaLabel}
                      >
                        <ArrowUpRight className="nav-card-link-icon w-4 h-4" aria-hidden="true" />
                        {lnk.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={`${lnk.label}-${i}`}
                      className="nav-card-link text-inherit"
                      to={lnk.href || '/'}
                      aria-label={lnk.ariaLabel}
                      onClick={closeMenu}
                    >
                      <ArrowUpRight className="nav-card-link-icon w-4 h-4" aria-hidden="true" />
                      {lnk.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
