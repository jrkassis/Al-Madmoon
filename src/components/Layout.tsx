import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dice } from './ui/Dice';
import './Layout.css';

const navLinks = [
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Features', path: '/features' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout-wrapper">
      {/* Navbar */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="brand-link">
            <img src="/Icon-3.svg" alt="Logo" width="32" height="32" />
            <span className="brand-text">Al Madmoon</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="icon-gap">
                <MessageCircle size={16} />
                Start on WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            <nav className="mobile-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-footer">
              <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="secondary" size="lg" className="w-full icon-gap">
                  <MessageCircle size={20} />
                  Start on WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="brand-link">
                <img src="/Icon-3.svg" alt="Logo" width="32" height="32" />
                <span className="brand-text" style={{ color: 'var(--color-text-primary)' }}>Al Madmoon</span>
              </Link>
              <p className="footer-desc">
                AI-powered betting assistant providing personalized insights and recommendations for football, basketball, Formula 1, and more.
              </p>
            </div>
            <div>
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
                <li><Link to="/features" className="footer-link">Features</Link></li>
                <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                <li><a href="#" className="footer-link">FAQ</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Al Madmoon. All rights reserved.</p>
            <div className="footer-support">
              <a href="https://wa.me/79027611?text=How%20can%20I%20get%20started%20with%20Al%20Madmoon%3F" className="support-link">
                <MessageCircle size={16} />
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

