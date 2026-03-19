import { useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';

export default function AffiliateMyCode() {
  const [code, setCode] = useState('ABCD1234');

  const generateNewCode = () => {
    // In real app, call API
    setCode(Math.random().toString(36).substring(2, 10).toUpperCase());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    // Optional: show toast
  };

  return (
    <DashboardLayout role="affiliate">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 ">Your Affiliate Code</h1>

      <div className="glass-panel p-8 text-center max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-slate-500 mb-2">Share this code with your audience</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-3xl font-mono font-bold text-slate-900">{code}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={copyToClipboard}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Code
            </Button>
            <Button variant="outline" onClick={generateNewCode}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate New
            </Button>
          </div>

          <p className="text-xs text-slate-400">
            Your referral link: <span className="font-mono">almadmoon.co/?ref={code}</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}