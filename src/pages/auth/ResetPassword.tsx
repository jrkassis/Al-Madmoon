import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

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
      <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4 patternbg">
        <div className="glass-panel w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid reset link</h2>
          <p className="text-slate-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/auth/forgot-password">
            <Button variant="primary">Request new link</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Password reset!</h2>
          <p className="text-slate-600 mb-6">
            Your password has been successfully reset. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Set new password</h1>
          <p className="text-slate-600 mt-2">
            Must be at least 6 characters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button type="submit" variant="primary" size="md" className="w-full">
            Reset password
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