import React, { useState, useEffect } from 'react';

interface NavbarProps {
  activeSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection = 'home' }) => {
  const [isInHomeSection, setIsInHomeSection] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverLightBg, setIsOverLightBg] = useState(false);

  useEffect(() => {
    let wheelCount = 0;
    let hasDecreased = false;

    const handleWheel = (e: WheelEvent) => {
      // Only count downward wheel movements
      if (e.deltaY > 0 && !hasDecreased) {
        wheelCount++;

        // After 3 wheel scrolls, decrease the navbar width
        if (wheelCount >= 3) {
          setIsInHomeSection(false);
          hasDecreased = true;
        }
      }
    };

    const handleScroll = () => {
      // Reset when scrolling back to top
      if (window.scrollY < 50) {
        wheelCount = 0;
        hasDecreased = false;
        setIsInHomeSection(true);
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 animate-slide-down-navbar ${isInHomeSection ? 'w-[95%] sm:w-[98%] max-w-7xl' : 'w-[90%] sm:w-[70%] lg:w-[60%] xl:w-[53%] max-w-3xl'}`}>
      <div className="bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.03] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.2)] rounded-3xl border border-white/[0.18] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 flex items-center justify-between relative overflow-hidden before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-50 before:-z-10 after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/[0.15] after:to-transparent after:animate-shimmer hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5),0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_30px_rgba(255,255,255,0.08)] transition-all duration-500">
        {/* Logo on the left */}
        <div className="flex items-center z-10">
          <img
            src="/rise-logo.png"
            alt="Rise AI Logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>

        {/* Hamburger Menu Button - Mobile, Tablet, Foldable & Nest Hub */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden flex flex-col gap-1.5 z-10"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''} ${isOverLightBg ? 'bg-black' : 'bg-white'}`}></span>
          <span className={`block w-6 h-0.5 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''} ${isOverLightBg ? 'bg-black' : 'bg-white'}`}></span>
          <span className={`block w-6 h-0.5 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''} ${isOverLightBg ? 'bg-black' : 'bg-white'}`}></span>
        </button>

        {/* Navigation buttons - Large Desktop Only */}
        <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-4 lg:gap-6">
          <button
            onClick={() => scrollToSection('home')}
            className={`font-medium transition-all px-3 lg:px-4 py-2 rounded-full text-sm lg:text-base ${
              activeSection === 'home'
                ? 'bg-black text-white'
                : isOverLightBg
                ? 'text-black hover:text-gray-700'
                : 'text-white hover:text-gray-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className={`font-medium transition-all px-3 lg:px-4 py-2 rounded-full text-sm lg:text-base ${
              activeSection === 'services'
                ? 'bg-black text-white'
                : isOverLightBg
                ? 'text-black hover:text-gray-700'
                : 'text-white hover:text-gray-200'
            }`}
          >
            Services
          </button>
        </div>

        {/* Get Your Service button - Large Desktop Only */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={() => scrollToSection('contact')}
            className={`font-medium transition-all px-4 lg:px-6 py-2 rounded-full text-sm lg:text-base ${
              activeSection === 'contact'
                ? 'bg-black text-white border border-white/40'
                : isOverLightBg
                ? 'bg-white/30 text-black hover:bg-white/40 backdrop-blur-sm border border-black/40'
                : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm border border-white/40'
            }`}
          >
            Get Your Service
          </button>
        </div>
      </div>

      {/* Mobile, Tablet, Foldable & Nest Hub Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.18] shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.2)] overflow-hidden relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-50 before:-z-10 after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/[0.15] after:to-transparent after:animate-shimmer">
          <div className="flex flex-col">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium transition-all px-6 py-3 text-left ${
                activeSection === 'home'
                  ? 'bg-black text-white'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/20'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`font-medium transition-all px-6 py-3 text-left ${
                activeSection === 'services'
                  ? 'bg-black text-white'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/20'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-medium transition-all px-6 py-3 text-left ${
                activeSection === 'contact'
                  ? 'bg-black text-white'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/20'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Get Your Service
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
