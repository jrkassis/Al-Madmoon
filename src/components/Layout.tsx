import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { MessageCircle, Menu, X, LogIn, User, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Fixed import
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

const navLinks = [
  { name: "How It Works", path: "/how-it-works" },
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
  { name: "Become a Partner", path: "/become-a-partner" },
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
        <div className="header-container relative flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="brand-link flex items-center gap-2 lg:justify-self-start">
            <img src="/Icon-3.svg" alt="Logo" width="32" height="32" />
            <span className="brand-text hidden sm:block">Al Madmoon</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-6 z-40 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""
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

                <Link to="/auth/signup">
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
          <>
            {/* BACKDROP */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* SLIDING MOBILE SIDEBAR */}
            <motion.div
              key="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white z-50 shadow-lg lg:hidden flex flex-col"
            >
              {/* CLOSE BUTTON */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* LINKS */}
              <nav className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-link ${location.pathname === link.path ? "active" : ""
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

                    <Link to="/auth/signup">
                      <Button variant="primary" className="w-full icon-gap">
                        <LogIn size={18} />
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* FOOTER */}
      {location.pathname !== "/links" && (
        <footer className="footer z-40">
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