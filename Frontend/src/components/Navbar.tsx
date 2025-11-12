import React, { useState, useEffect } from 'react';
import GlassSurface from './GlassSurface';

interface NavbarProps {
  activeSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection = 'home' }) => {
  const [isInHomeSection, setIsInHomeSection] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isOverLightBg = false; // Keep as constant for now

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
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={24}
        brightness={55}
        opacity={0.9}
        blur={12}
        displace={0}
        backgroundOpacity={0.05}
        saturation={1.2}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="!px-4 sm:!px-6 md:!px-8 lg:!px-10 xl:!px-12 !py-2 !flex !items-center !justify-between relative overflow-hidden hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)] transition-all duration-500"
      >
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
        <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          <button
            onClick={() => scrollToSection('home')}
            className={`font-medium transition-all px-2 xl:px-3 py-2 rounded-full text-sm border ${
              activeSection === 'home'
                ? 'bg-white/20 text-white border-white/40 shadow-lg backdrop-blur-md'
                : isOverLightBg
                ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`font-medium transition-all px-2 xl:px-3 py-2 rounded-full text-sm border ${
              activeSection === 'about'
                ? 'bg-white/20 text-white border-white/40 shadow-lg backdrop-blur-md'
                : isOverLightBg
                ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className={`font-medium transition-all px-2 xl:px-3 py-2 rounded-full text-sm border ${
              activeSection === 'services'
                ? 'bg-white/20 text-white border-white/40 shadow-lg backdrop-blur-md'
                : isOverLightBg
                ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
            }`}
          >
            Services
          </button>
        </div>

        {/* Get Your Service button - Large Desktop Only */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={() => scrollToSection('contact')}
            className={`font-medium transition-all px-3 xl:px-5 py-2 rounded-full text-sm border ${
              activeSection === 'contact'
                ? 'bg-white/20 text-white border-white/40 shadow-lg backdrop-blur-md'
                : isOverLightBg
                ? 'bg-white/10 text-black hover:bg-white/20 hover:backdrop-blur-md hover:border-black/30 border-black/20'
                : 'bg-white/10 text-white hover:bg-white/20 hover:backdrop-blur-md hover:border-white/30 border-white/20'
            }`}
          >
            Get Your Service
          </button>
        </div>
      </GlassSurface>

      {/* Mobile, Tablet, Foldable & Nest Hub Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 mt-2">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={24}
            brightness={55}
            opacity={0.9}
            blur={12}
            displace={0}
            backgroundOpacity={0.05}
            saturation={1.2}
            distortionScale={-180}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            className="overflow-hidden"
          >
            <div className="flex flex-col">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium transition-all px-6 py-3 text-left border-l-4 ${
                activeSection === 'home'
                  ? 'bg-white/20 text-white border-white/60 backdrop-blur-md'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                  : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`font-medium transition-all px-6 py-3 text-left border-l-4 ${
                activeSection === 'about'
                  ? 'bg-white/20 text-white border-white/60 backdrop-blur-md'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                  : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`font-medium transition-all px-6 py-3 text-left border-l-4 ${
                activeSection === 'services'
                  ? 'bg-white/20 text-white border-white/60 backdrop-blur-md'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                  : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-medium transition-all px-6 py-3 text-left border-l-4 ${
                activeSection === 'contact'
                  ? 'bg-white/20 text-white border-white/60 backdrop-blur-md'
                  : isOverLightBg
                  ? 'text-black hover:bg-white/10 hover:backdrop-blur-md hover:border-black/30 border-transparent'
                  : 'text-white hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 border-transparent'
              }`}
            >
              Get Your Service
            </button>
          </div>
          </GlassSurface>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
