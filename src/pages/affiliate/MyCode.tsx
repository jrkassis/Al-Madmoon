import { useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { IoMdRefreshCircle } from "react-icons/io";

export default function AffiliateMyCode() {
  const [code, setCode] = useState('ABCD');
  const [error, setError] = useState('');

  const validateCode = (value) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (cleaned.length < 4) {
      setError('Code must be at least 4 characters');
    } else if (cleaned.length > 6) {
      setError('Code must be at most 6 characters');
    } else {
      setError('');
    }

    return cleaned.slice(0, 6); // limit max length
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const valid = validateCode(value);
    setCode(valid);
  };

  const generateNewCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(random);
    setError('');
  };

  const copyToClipboard = () => {
    if (error || code.length < 4) return;
    navigator.clipboard.writeText(code);
  };

  return (
    <DashboardLayout role="affiliate">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Your Affiliate Code
      </h1>

      <div className="glass-panel p-8 text-center max-w-md mx-auto">
        <div className="space-y-6">

          {/* INPUT */}
          <div>
            <p className="text-sm text-slate-500 mb-2">
              Create your custom referral code
            </p>

            <input
              value={code}
              onChange={handleChange}
              placeholder="Enter code"
              className="w-full text-center text-2xl font-mono font-bold p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />

            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            <p className="text-xs text-slate-400 mt-1">
              4–6 characters (letters & numbers only)
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Button
              variant="primary"
              onClick={copyToClipboard}
              disabled={!!error || code.length < 4}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Code
            </Button>

            <Button onClick={generateNewCode} variant="secondary">
              <IoMdRefreshCircle size={18}/>
            </Button>
          </div>

          {/* LINK */}
          <p className="text-xs text-slate-400">
            Your referral link: <br />
            <span className="font-mono break-all">
              almadmoon.co/?ref={code}
            </span>
          </p>

        </div>
      </div>
    </DashboardLayout>
  );
}