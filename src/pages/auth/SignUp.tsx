import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useState, ChangeEvent } from 'react';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200/15 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Main Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative w-24 h-24 backdrop-blur-xl rounded-3xl flex items-center justify-center border-2 border-sky-200 shadow-xl">
                <img 
                  src="/Icon-2.svg" 
                  alt="Al Madmoon" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Start Your Winning Journey
          </h2>
          <p className="text-slate-600 text-lg mb-10">
            Get instant access to AI-powered betting insights, real-time analysis, and personalized recommendations—all on WhatsApp.
          </p>

          {/* Features Grid */}
          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">No Credit Card</h3>
                <p className="text-sm text-slate-600">Free account setup in seconds</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 2 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">100% Secure</h3>
                <p className="text-sm text-slate-600">Military-grade encryption protecting your data</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 3 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors flex-shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">Instant Access</h3>
                <p className="text-sm text-slate-600">WhatsApp alerts 24/7 with AI insights</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 pt-8 border-t-2 border-sky-200">
            <p className="text-sm text-slate-600 mb-4">
              Join thousands of successful bettors
            </p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-sky-400 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* White Card Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 patternbg">
            {/* Brand Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/Icon-3.svg" 
                    alt="Al Madmoon" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-2xl font-bold">
                  Al Madmoon
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Create Account
              </h1>
              <p className="text-slate-600 text-base">
                Join thousands of successful bettors using AI insights
              </p>
            </div>

            {/* Sign Up Form */}
            <form className="space-y-5 mb-8">
              {/* Full Name Field */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                    placeholder="John Doe"
                  />
                  {/* User Icon SVG */}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                    placeholder="you@example.com"
                  />
                  {/* Email Icon SVG */}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.98 8.223A10.477 10.477 0 001.934 12c2.71 5.555 8.063 9 13.066 9 .75 0 1.49-.035 2.221-.1a4.5 4.5 0 00-7.707-7.707l-.5.5zm15.848-1.299a4.5 4.5 0 00-7.707 7.707l.5-.5A10.477 10.477 0 0122.066 12c-2.71-5.555-8.063-9-13.066-9-.75 0-1.49.035-2.221.1a4.5 4.5 0 007.707 7.707l.5-.5zM6.5 12a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.98 8.223A10.477 10.477 0 001.934 12c2.71 5.555 8.063 9 13.066 9 .75 0 1.49-.035 2.221-.1a4.5 4.5 0 00-7.707-7.707l-.5.5zm15.848-1.299a4.5 4.5 0 00-7.707 7.707l.5-.5A10.477 10.477 0 0122.066 12c-2.71-5.555-8.063-9-13.066-9-.75 0-1.49.035-2.221.1a4.5 4.5 0 007.707 7.707l.5-.5zM6.5 12a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-slate-300 bg-white cursor-pointer accent-sky-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                  I agree to the{' '}
                  <Link to="/" className="text-sky-500 font-semibold hover:text-sky-600">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/" className="text-sky-500 font-semibold hover:text-sky-600">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <Button variant="primary" size="lg" className="btn-icon btn-shadow w-full mt-8" style={{ display: 'inline-flex' }}>
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pb-6 border-b border-slate-200">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/auth/signin"
                  className="text-sky-500 font-semibold hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Footer Links */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-700 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-slate-700 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="/" className="hover:text-slate-700 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="lg:hidden p-6 bg-gradient-to-r from-sky-300 to-blue-500 text-white text-center relative z-10 rounded-t-3xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src="/Icon-2.svg" 
            alt="Al Madmoon" 
            className="w-6 h-6 object-contain"
          />
          <span className="font-bold text-lg">Al Madmoon AI</span>
        </div>
        <p className="text-sm text-sky-50">
          Your personal AI betting analyst on WhatsApp
        </p>
      </div>
    </div>
  );
}