import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to sign in after a short delay
    const timer = setTimeout(() => {
      navigate('/auth/signin', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-300/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-200/15 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 patternbg">
          {/* Header */}
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
              See You Soon!
            </h1>
            <p className="text-slate-600 text-base">
              You've been successfully logged out
            </p>
          </div>

          {/* Loading Animation */}
          <div className="flex flex-col items-center justify-center py-12">
            {/* Animated Circle */}
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Loading Text */}
            <p className="text-slate-600 font-medium mb-2">
              Logging out...
            </p>
            <p className="text-xs text-slate-500 text-center">
              Redirecting to sign in page
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-sky-50 border-2 border-sky-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Session Ended
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Your session has been securely terminated. Log back in to access your AI betting insights.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Thank you for using Al Madmoon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}