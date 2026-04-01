import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    // API call to reset password with token
    console.log('Reset password with token:', token, 'new password:', password);
    setSubmitted(true);
    setTimeout(() => navigate('/auth/signin'), 3000);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-sky-200 via-blue-100 to-cyan-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 patternbg">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
              <p className="text-slate-600 mb-8">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/auth/forgot-password">
                <Button variant="primary" className="w-full">
                  Request New Link
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-sky-200 via-blue-100 to-cyan-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 patternbg">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
              <p className="text-slate-600 mb-8">
                Your password has been successfully reset. Redirecting to sign in...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-sky-200 via-blue-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200/15 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-cyan-50 to-sky-50 opacity-40"></div>

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
            Secure Your Account
          </h2>
          <p className="text-slate-600 text-lg mb-10">
            Create a strong password to protect your AI betting insights and personal data.
          </p>

          {/* Features Grid */}
          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">Strong Encryption</h3>
                <p className="text-sm text-slate-600">Military-grade security protection</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 2 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">Quick Recovery</h3>
                <p className="text-sm text-slate-600">Easy password reset anytime</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 3 */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">Access Anytime</h3>
                <p className="text-sm text-slate-600">24/7 support available for help</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 pt-8 border-t-2 border-sky-200">
            <p className="text-sm text-slate-600 mb-4">
              Your account is protected by Al Madmoon
            </p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-sky-400 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
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
                Set New Password
              </h1>
              <p className="text-slate-600 text-base">
                Create a strong password to secure your account
              </p>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              {/* New Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 pr-10"
                    placeholder="••••••••"
                    required
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 pr-10"
                    placeholder="••••••••"
                    required
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

              {/* Password Requirements */}
              <p className="text-xs text-slate-500 mt-2">
                Must be at least 6 characters long
              </p>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Reset Password Button */}
              <Button variant="primary" size="lg" type="submit" className="btn-icon btn-shadow w-full mt-8" style={{ display: 'inline-flex' }}>
                Reset Password
              </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center pb-6 border-b border-slate-200">
              <Link to="/auth/signin" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors text-sm">
                ← Back to Sign In
              </Link>
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
      <div className="lg:hidden p-6 bg-linear-to-r from-sky-300 to-blue-500 text-white text-center relative z-10 rounded-t-3xl">
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