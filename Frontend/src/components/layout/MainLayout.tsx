import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  X, 
  ChevronRight, 
  Zap, 
  Send,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'motion/react';

// Reusable Button Component for Layout
const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  onClick,
  ...props 
}: any) => {
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 hover:-translate-y-0.5",
    secondary: "bg-orange-50 text-primary hover:bg-orange-100",
    outline: "bg-transparent border border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:bg-orange-50/30",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50",
    white: "bg-white text-primary shadow-xl hover:bg-slate-50 hover:-translate-y-0.5",
    dark: "bg-black text-white hover:bg-slate-900"
  };

  const sizes = {
    sm: "px-4 py-2 text-[11px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
    xl: "px-10 py-5 text-base"
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "rounded-2xl font-semibold uppercase tracking-widest transition-all duration-300 active:scale-95 inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll to top on page change, unless it has a hash
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-primary selection:text-white">
      {/* Global Fonts & Typography Cap */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&display=swap');
        
        :root {
          --font-display: 'Syne', sans-serif;
          --font-sans: 'DM Sans', sans-serif;
        }

        body {
          font-family: var(--font-sans);
          color: #000;
        }

        .font-display {
          font-family: var(--font-display);
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-display);
        }

        * { font-weight: 400; }
        b, strong, h1, h2, h3, h4, h5, h6, .font-semibold { font-weight: 600 !important; }
        .font-bold { font-weight: 600 !important; }
      `}} />

      {/* --- Premium Sticky Navbar --- */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-5 md:px-10",
        isScrolled ? "bg-white/95 backdrop-blur-xl py-4 border-b border-slate-100 shadow-sm" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
              <Shield size={22} />
            </div>
            <span className="font-display font-semibold text-2xl tracking-tighter text-black">DukanDost <span className="text-primary">Pro</span></span>
          </button>

          <div className="flex items-center gap-6">
            <Link to="/signup">
              <Button variant="primary" size="md" className="hidden sm:inline-flex">START FREE TRIAL</Button>
            </Link>
            <button className="lg:hidden text-black p-2 hover:bg-slate-100 rounded-xl transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 lg:hidden"
          >
            <div className="flex flex-col gap-8 h-full justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-display font-black text-black">Ready to Grow?</h3>
                <p className="text-slate-500 mb-8">Join 10,000+ businesses using DukanDost Pro.</p>
                <Link to="/signup" className="block">
                  <Button variant="primary" className="w-full py-6 text-sm" size="lg">START FREE TRIAL</Button>
                </Link>
                <Link to="/login" className="block pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>

      {/* --- Footer --- */}
      <footer className="pt-32 pb-12 bg-[#0A0A0A] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-24">
            <div className="col-span-2 md:col-span-1 lg:col-span-1">
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 mb-8 group outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Shield size={22} />
                </div>
                <span className="font-display font-semibold text-2xl tracking-tighter text-white">DukanDost <span className="text-primary">Pro</span></span>
              </button>
              <p className="text-white/40 text-[15px] font-medium leading-relaxed max-w-xs mb-8">
                The all-in-one business management platform for modern Indian businesses. Replace 3 apps with 1 powerful platform.
              </p>
            </div>

            <div>
              <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.25em] mb-8">Company</h5>
              <ul className="space-y-4">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Contact', path: '/contact' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Careers', path: '/careers' }
                ].map(item => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-white/50 text-[13px] font-medium hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.25em] mb-8">Product</h5>
              <ul className="space-y-4">
                {[
                  { name: 'Features', path: '/features' },
                  { name: 'Pricing', path: '/pricing' },
                  { name: 'Security', path: '/security' },
                  { name: 'Integrations', path: '/integrations' }
                ].map(item => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-white/50 text-[13px] font-medium hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.25em] mb-8">Resources</h5>
              <ul className="space-y-4">
                {[
                  { name: 'Help Center', path: '/help-center' },
                  { name: 'Guides', path: '/guides' },
                  { name: 'Business Tips', path: '/business-tips' },
                  { name: 'API Docs', path: '/api-docs' }
                ].map(item => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-white/50 text-[13px] font-medium hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.25em] mb-8">Legal</h5>
              <ul className="space-y-4">
                {[
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Service', path: '/terms-and-conditions' },
                  { name: 'Refund Policy', path: '/refund-policy' },
                  { name: 'Compliance', path: '/compliance' }
                ].map(item => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-white/50 text-[13px] font-medium hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
             <p className="text-[12px] font-medium text-white/30">
               © 2025 DukanDost Pro. Made with <span className="text-red-500">❤️</span> for Indian businesses.
             </p>
             <div className="flex items-center gap-8">
                {[
                  { name: 'Privacy', path: '/privacy-policy' },
                  { name: 'Terms', path: '/terms-and-conditions' },
                  { name: 'Contact', path: '/contact' }
                ].map(item => (
                  <Link key={item.name} to={item.path} className="text-[12px] font-medium text-white/40 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                ))}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
