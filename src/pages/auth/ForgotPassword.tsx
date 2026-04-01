import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { MailCheck, ShieldCheck, Timer } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to request password reset
    console.log("Reset password for:", email);
    setSubmitted(true);
  };

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
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-600 mb-8">
                We've sent a password reset link to{" "}
                <strong className="text-slate-900">{email}</strong>
              </p>
              <Link to="/auth/signin">
                <Button variant="primary" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 lg:pb-5">
            Account Recovery
          </h2>
          <p className="text-slate-600 text-lg pb-10">
            Regain access to your AI betting insights and continue your winning
            journey with Al Madmoon.
          </p>

          {/* Features Grid */}
          <div className="space-y-4">
            {/* Feature 1 - Email Verification */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <MailCheck className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  Email Verification
                </h3>
                <p className="text-sm text-slate-600">
                  Quick and secure email confirmation
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 2 - Secure Link */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <ShieldCheck className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  Secure Link
                </h3>
                <p className="text-sm text-slate-600">
                  Time-limited secure reset links
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>

            {/* Feature 3 - Fast Recovery */}
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-sky-200/50 hover:border-sky-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors shrink-0">
                <Timer className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-slate-900 font-semibold mb-1">
                  Fast Recovery
                </h3>
                <p className="text-sm text-slate-600">
                  Reset your password in minutes
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 pt-8 border-t-2 border-sky-200">
            <p className="text-sm text-slate-600 mb-4">
              Your account is safe with Al Madmoon
            </p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-sky-400 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* White Card Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 patternbg">
            {/* Brand Header */}
            <div className="mb-10 mt-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-slate-600 text-base">
                No worries, we'll send you reset instructions
              </p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              {/* Email Field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-300"
                    placeholder="you@example.com"
                    required
                  />
                  {/* Email Icon SVG */}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Help Text */}
              <p className="text-xs text-slate-500">
                Enter the email address associated with your account, and we'll
                send you a link to reset your password.
              </p>

              {/* Send Reset Link Button */}
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="btn-icon btn-shadow w-full mt-10"
                style={{ display: "inline-flex" }}
              >
                Send Reset Link
              </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center pb-6 border-b border-slate-200">
              <Link
                to="/auth/signin"
                className="text-sky-500 font-semibold hover:text-sky-600 transition-colors text-sm"
              >
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
