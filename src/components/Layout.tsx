import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { MessageCircle, Menu, X, LogIn, User, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

const navLinks = [
  { name: "How It Works", path: "/how-it-works" },
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, dashboardPath } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout-wrapper">

      {/* HEADER */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="brand-link flex items-center gap-2">
            <img src="/Icon-3.svg" alt="Logo" width="32" height="32" />
            <span className="brand-text hidden sm:block">Al Madmoon</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={dashboardPath}>
                <Button variant="ghost" className="icon-gap rounded-full">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/signin">
                  <Button variant="ghost" className="icon-gap">
                    <User size={16} />
                    Sign In
                  </Button>
                </Link>

                <Link to="/onboarding">
                  <Button variant="primary" className="icon-gap rounded-full">
                    <LogIn size={16} />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[64px] left-0 w-full bg-white z-50 shadow-lg lg:hidden"
          >
            <div className="p-4 flex flex-col gap-4">

              {/* LINKS */}
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`mobile-nav-link ${
                      location.pathname === link.path ? "active" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* ACTIONS */}
              <div className="flex flex-col gap-2 pt-3 border-t">
                {isAuthenticated ? (
                  <Link to={dashboardPath}>
                    <Button variant="ghost" className="w-full icon-gap">
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/signin">
                      <Button variant="ghost" className="w-full icon-gap">
                        <User size={18} />
                        Sign In
                      </Button>
                    </Link>

                    <Link to="/onboarding">
                      <Button variant="primary" className="w-full icon-gap">
                        <LogIn size={18} />
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <main className="layout-main ">
        <Outlet />
      </main>

      {/* FOOTER */}
      {location.pathname !== "/links" && (
        <footer className="footer">
          <div className="footer-container">

            <div className="footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* BRAND */}
              <div className="footer-brand">
                <Link to="/" className="brand-link flex items-center gap-2">
                  <img src="/Icon-3.svg" alt="Logo" width="32" height="32" />
                  <span className="brand-text">Al Madmoon</span>
                </Link>

                <p className="footer-desc mt-3">
                  AI-powered betting assistant providing personalized insights
                  and recommendations.
                </p>
              </div>

              {/* COMPANY */}
              <div>
                <h4 className="footer-heading">Company</h4>
                <ul className="footer-links space-y-2">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/how-it-works">How It Works</Link></li>
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                </ul>
              </div>

              {/* SUPPORT */}
              <div>
                <h4 className="footer-heading">Support</h4>
                <ul className="footer-links space-y-2">
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Terms</a></li>
                  <li><a href="#">Privacy</a></li>
                </ul>
              </div>

            </div>

            <div className="footer-bottom flex flex-col md:flex-row justify-between items-center gap-3 mt-8">
              <p className="text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Al Madmoon. All rights reserved.
              </p>

              <a
                href="https://wa.me/79027611"
                className="support-link flex items-center gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp Support
              </a>
            </div>

          </div>
        </footer>
      )}
    </div>
  );
}