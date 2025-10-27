import { useEffect, useState } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import ChatBot from '../components/ChatBot';
import { submitContactForm } from '../services/api';

interface HomeProps {
  onSectionChange?: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSectionChange }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            onSectionChange?.(sectionId);
            break;
          }
        }
      }

      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeHeight = homeSection.offsetHeight;
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / homeHeight, 1);

        if (scrollY > 10 && !isAnimating) {
          setIsAnimating(true);
        }

        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onSectionChange, isAnimating]);

  const smoothProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
  const imageTranslateY = smoothProgress * 150;
  const imageScale = 1 - smoothProgress * 0.4;
  const imageOpacity = 1 - smoothProgress * 0.7;
  const imageBorderRadius = smoothProgress * 50;

  // Contact form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitContactForm(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', description: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: '#fffff2' }}>
      {/* Home Section - Hero */}
      <section id="home" className="relative w-full h-screen">
        <div
          className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none"
          style={{
            display: scrollProgress >= 1 ? 'none' : 'block'
          }}
        >
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-16 sm:pt-24 md:pt-32 pointer-events-auto"
            style={{
              transform: `translateY(${imageTranslateY}px) scale(${imageScale})`,
              opacity: imageOpacity,
              willChange: 'transform, opacity',
            }}
          >
            <h1
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[130px] font-light text-white text-center animate-slide-up-bottom-to-top -mt-20 sm:-mt-40 md:-mt-60 lg:-mt-100"
              style={{
                fontFamily: "'IM Fell English', serif",
                transform: 'scaleX(1.0)',
              }}
            >
              The Rise AI
            </h1>
          </div>

          <div
            className="absolute inset-0 w-full h-full animate-zoom-out-images"
            style={{
              transform: `translateY(${imageTranslateY}px) scale(${imageScale})`,
              opacity: imageOpacity,
              borderRadius: `${imageBorderRadius}px`,
              overflow: 'hidden',
              willChange: 'transform, opacity',
            }}
          >
            <img
              src="/withbg.JPG"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="w-full">
        <LogoCarousel logos={[
          { src: '/vegalogo.png', alt: 'Vega Logo' },
          { src: '/eaglelogo.png', alt: 'Eagle Logo' },
          { src: '/CG-Logo.png', alt: 'CG Logo' },
          { src: '/Aigrow.png', alt: 'AI Grow' },
          { src: '/rise-logo.png', alt: 'Rise Logo' },
        ]} />

        {/* Rise Construction Section */}
        <div className="w-full pb-4 sm:pb-6 md:pb-8 bg-black">
          <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-b-[30px] sm:rounded-b-[40px] md:rounded-b-[50px] py-4 sm:py-6 md:py-8 lg:py-12" style={{ backgroundColor: '#A3A3A3' }}>
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8">
              <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pl-4 lg:pl-8 xl:pl-12 order-1">
                <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-left mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Rise Construction
                </h2>
                <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-xl text-white text-center md:text-left leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose px-2 sm:px-4 md:px-0 break-words">
                  Building the future with innovative construction solutions. From residential to commercial projects, we deliver excellence in every structure.
                </p>
              </div>
              <div className="flex-shrink-0 order-2 w-full md:w-auto flex justify-center md:justify-end mt-6 md:mt-0 md:-mr-8 lg:-mr-16 xl:-mr-32">
                <img
                  src="/excavator.png"
                  alt="Construction Excavator"
                  className="w-full max-w-[280px] sm:max-w-[320px] md:w-auto md:max-w-[400px] lg:max-w-[650px] xl:max-w-[1070px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rise Architecture Section */}
      <section id="architecture" className="w-full">
        <div className="w-full pb-4 sm:pb-6 md:pb-8" style={{ backgroundColor: '#fffff2' }}>
          <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-b-[30px] sm:rounded-b-[40px] md:rounded-b-[50px] py-4 sm:py-6 md:py-8 lg:py-12 bg-black">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8">
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start mt-6 md:mt-0 md:-ml-8 lg:-ml-16 xl:-ml-32 md:order-1">
                <img
                  src="/architecture-house.png"
                  alt="Architecture House"
                  className="w-full max-w-[280px] sm:max-w-[320px] md:w-auto md:max-w-[400px] lg:max-w-[650px] xl:max-w-[1070px] h-auto object-contain"
                />
              </div>
              <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-4 lg:pr-8 xl:pr-12 md:order-2">
                <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-right mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Rise Architecture
                </h2>
                <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-xl text-white text-center md:text-right leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose px-2 sm:px-4 md:px-0 break-words">
                  Innovative architectural designs that blend aesthetics with functionality. Creating spaces that inspire and endure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rise AI Section */}
      <section id="ai" className="w-full">
        <div className="w-full pb-4 sm:pb-6 md:pb-8 bg-black">
          <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-b-[30px] sm:rounded-b-[40px] md:rounded-b-[50px] py-4 sm:py-6 md:py-8 lg:py-12" style={{ backgroundColor: '#A3A3A3' }}>
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8">
              <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pl-4 lg:pl-8 xl:pl-12 order-1">
                <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-left mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Rise AI
                </h2>
                <p className="text-sm sm:text-base md:text-sm lg:text-base xl:text-xl text-white text-center md:text-left leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose px-2 sm:px-4 md:px-0 break-words">
                  Cutting-edge artificial intelligence solutions transforming industries. Smart technology for a smarter future.
                </p>
              </div>
              <div className="flex-shrink-0 order-2 w-full md:w-auto flex justify-center md:justify-end mt-6 md:mt-0 md:-mr-8 lg:-mr-16 xl:-mr-32">
                <img
                  src="/ai-hand.png"
                  alt="AI Hand"
                  className="w-full max-w-[280px] sm:max-w-[320px] md:w-auto md:max-w-[400px] lg:max-w-[650px] xl:max-w-[1070px] h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rise Aluminium Section */}
      <section id="aluminium" className="w-full">
        <div className="w-full pb-4 sm:pb-6 md:pb-8" style={{ backgroundColor: '#fffff2' }}>
          <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-b-[30px] sm:rounded-b-[40px] md:rounded-b-[50px] py-6 sm:py-8 md:py-10 lg:py-12 bg-black">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8">
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start md:-ml-8 lg:-ml-16 xl:-ml-32 md:order-1">
                <img
                  src="/aluminium-tubes.png"
                  alt="Aluminium Tubes"
                  className="w-full max-w-[260px] sm:max-w-[300px] md:w-auto md:max-w-[380px] lg:max-w-[600px] xl:max-w-[1000px] h-auto object-contain"
                />
              </div>
              <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-4 lg:pr-8 xl:pr-12 md:order-2">
                <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-right mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Rise Aluminium
                </h2>
                <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-white text-center md:text-right leading-relaxed md:leading-relaxed lg:leading-relaxed xl:leading-loose px-2 sm:px-4 md:px-0 break-words">
                  Premium aluminium fabrication and installation services. Quality materials for lasting performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full bg-black py-12 sm:py-16 md:py-20 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Let's get in touch.
          </h2>

          {/* Contact Form Container */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto mt-12">
            {/* Contact Information Card */}
            <div className="lg:w-2/5 relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.03] backdrop-blur-3xl border-0 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_0_0_1px_rgba(255,255,255,0.12),inset_0_0_20px_rgba(255,255,255,0.06),inset_0_2px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5),0_0_0_1px_rgba(255,255,255,0.18),inset_0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 overflow-hidden before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-br before:from-white/25 before:via-transparent before:to-transparent before:opacity-60 before:-z-10 after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/[0.18] after:to-transparent after:animate-shimmer">
                <h3 className="text-2xl sm:text-3xl font-light text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <span className="text-white text-base sm:text-lg">Facebook</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <span className="text-white text-base sm:text-lg">LinkedIn</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <span className="text-white text-base sm:text-lg">Twitter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-3/5 relative">
              <div className="absolute -top-8 right-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-8 left-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

              <form onSubmit={handleContactSubmit} className="relative space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-white text-sm mb-2">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-white/[0.1] via-white/[0.06] to-white/[0.02] backdrop-blur-3xl border-0 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 shadow-[inset_0_2px_12px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.35),0_2px_4px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.15)] focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.25),0_0_20px_rgba(34,211,238,0.4),inset_0_-1px_0_rgba(34,211,238,0.3)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/5 before:to-transparent before:pointer-events-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-white text-sm mb-2">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-white/[0.1] via-white/[0.06] to-white/[0.02] backdrop-blur-3xl border-0 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 shadow-[inset_0_2px_12px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.35),0_2px_4px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.15)] focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.25),0_0_20px_rgba(34,211,238,0.4),inset_0_-1px_0_rgba(34,211,238,0.3)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/5 before:to-transparent before:pointer-events-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-white/[0.1] via-white/[0.06] to-white/[0.02] backdrop-blur-3xl border-0 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 shadow-[inset_0_2px_12px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.35),0_2px_4px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.15)] focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.25),0_0_20px_rgba(34,211,238,0.4),inset_0_-1px_0_rgba(34,211,238,0.3)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/5 before:to-transparent before:pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Message</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-white/[0.1] via-white/[0.06] to-white/[0.02] backdrop-blur-3xl border-0 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 shadow-[inset_0_2px_12px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.35),0_2px_4px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.15)] focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.25),0_0_20px_rgba(34,211,238,0.4),inset_0_-1px_0_rgba(34,211,238,0.3)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/5 before:to-transparent before:pointer-events-none resize-none"
                  ></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="text-green-400 text-sm">
                    Thank you! We'll get back to you soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="text-red-400 text-sm">
                    Sorry, something went wrong. Please try again.
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-medium rounded-full hover:shadow-2xl hover:shadow-cyan-500/60 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="relative z-10">{isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <span className="text-gray-400 text-xs sm:text-sm">*Required fields</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Extended black background to bottom of screen */}
      <div className="w-full h-32 bg-black"></div>

      {/* ChatBot Icon */}
      <ChatBot />
    </div>
  );
};

export default Home;
