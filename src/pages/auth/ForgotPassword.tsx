import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to request password reset
    console.log('Reset password for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4 patternbg">
        <div className="glass-panel w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Link to="/auth/signin">
            <Button variant="primary">Return to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4 patternbg">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Forgot password?</h1>
          <p className="text-slate-600 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="hello@example.com"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full">
            Send reset link
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          <Link to="/auth/signin" className="text-brand-600 font-semibold hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}