import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../dashboards/DashboardLayout';
import { supabase } from '../../lib/supabase';

type ReferredUserRow = {
  id: string;
  full_name: string | null;
  created_at: string;
  plan: string | null;
  is_referred?: string | null;
};

type ReferralRow = {
  id: string;
  name: string;
  date: string;
  status: 'Paid' | 'Free';
  commission: number;
};

const COMMISSION_KEY = 'partner_commission_percent';
const DEFAULT_COMMISSION_PERCENT = 30;
const PLAN_PRICE: Record<string, number> = {
  t1: 19.99,
  t2: 34.99,
};

export default function partnerReferrals() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [commissionPercent, setCommissionPercent] = useState<number>(DEFAULT_COMMISSION_PERCENT);
  const [partnerCode, setpartnerCode] = useState<string>('');
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const referralUrl = partnerCode
    ? `${window.location.origin}/auth/signup?ref=${encodeURIComponent(partnerCode)}`
    : '';

  const handleCopyReferralUrl = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopyNotice('Referral URL copied.');
      window.setTimeout(() => setCopyNotice(null), 2000);
    } catch {
      setCopyNotice('Could not copy URL.');
      window.setTimeout(() => setCopyNotice(null), 2000);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let effectiveCommissionPercent = DEFAULT_COMMISSION_PERCENT;
        try {
          const { data, error: settingsError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', COMMISSION_KEY)
            .maybeSingle();
          if (!settingsError && data?.value != null) {
            const parsed = Number(data.value);
            if (Number.isFinite(parsed) && parsed > 0 && parsed <= 100) {
              effectiveCommissionPercent = parsed;
            }
          } else {
            const local = Number(localStorage.getItem(COMMISSION_KEY));
            if (Number.isFinite(local) && local > 0 && local <= 100) {
              effectiveCommissionPercent = local;
            }
          }
        } catch {
          const local = Number(localStorage.getItem(COMMISSION_KEY));
          if (Number.isFinite(local) && local > 0 && local <= 100) {
            effectiveCommissionPercent = local;
          }
        }
        setCommissionPercent(effectiveCommissionPercent);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('You must be signed in to view referrals.');

        // Resolve partner code from profile if available.
        let ownCode: string | null = null;
        const ownProfile = await supabase
          .from('users')
          .select('partner_code')
          .eq('id', user.id)
          .maybeSingle();
        if (!ownProfile.error) {
          const profile = ownProfile.data as { partner_code?: string | null } | null;
          ownCode = String(profile?.partner_code ?? '')
            .trim()
            .toUpperCase();
          if (!ownCode) ownCode = null;
        }
        setpartnerCode(ownCode ?? '');

        // Pull potential referred users and match in-memory.
        const referredQuery = await supabase
          .from('users')
          .select('id, full_name, created_at, plan, is_referred')
          .order('created_at', { ascending: false });
        if (referredQuery.error) throw referredQuery.error;
        const allUsers = (referredQuery.data ?? []) as ReferredUserRow[];

        const matchespartner = (u: ReferredUserRow) => {
          const referredBy = String(u.is_referred ?? '').trim();
          if (referredBy && referredBy === user.id) return true;
          return false;
        };

        const referredUsers = allUsers.filter((u) => u.id !== user.id).filter(matchespartner);

        const mapped: ReferralRow[] = referredUsers.map((u) => {
          const isConverted = Boolean(u.plan && u.plan !== 'free');
          const planPrice = PLAN_PRICE[String(u.plan ?? '')] ?? 0;
          const commission = isConverted ? (planPrice * effectiveCommissionPercent) / 100 : 0;
          return {
            id: u.id,
            name: u.full_name?.trim() || `User ${u.id.slice(0, 8)}`,
            date: new Date(u.created_at).toISOString().split('T')[0],
            status: isConverted ? 'Paid' : 'Free',
            commission,
          };
        });

        setRows(mapped);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load referrals.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(() => {
    const signups = rows.length;
    const conversions = rows.filter((r) => r.status === 'Paid').length;
    const totalCommission = rows.reduce((sum, r) => sum + r.commission, 0);
    return {
      // No click tracking table yet; use signup count as dynamic proxy.
      clicks: signups,
      signups,
      conversions,
      totalCommission,
    };
  }, [rows]);

  return (
    <DashboardLayout role="partner">
      <div className="max-w-10/12 mx-auto px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Referral Analytics</h1>

        {error && (
          <div className="glass-panel p-4 mb-4 text-sm text-red-600">{error}</div>
        )}

        <div className="glass-panel p-4 mb-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">Your referral code</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={partnerCode || (loading ? 'Loading...' : 'No code found')}
              disabled
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-700"
            />
            <button
              type="button"
              onClick={handleCopyReferralUrl}
              disabled={!partnerCode}
              className="px-4 py-2 rounded-lg bg-brand-600 text-slate-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy URL
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 break-all">
            {partnerCode ? referralUrl : 'Add your referral code in your profile to enable URL copy.'}
          </p>
          {copyNotice && <p className="text-xs text-slate-500 mt-1">{copyNotice}</p>}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-panel p-4">
            <p className="text-sm text-slate-500">Clicks</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.clicks}
            </p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-sm text-slate-500">Sign-ups</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.signups}
            </p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-sm text-slate-500">Conversions</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.conversions}
            </p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-sm text-slate-500">Commission</p>
            <p className="text-2xl font-bold text-brand-600">
              {loading ? '...' : `$${stats.totalCommission.toFixed(2)}`}
            </p>
            <p className="text-xs text-slate-400 mt-1">{commissionPercent}% rate</p>
          </div>
        </div>

        {/* Referrals table */}
        <div className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent referrals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">Name</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Commission</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  rows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-4 font-medium text-slate-900">{r.name}</td>
                      <td className="p-4 text-slate-600">{r.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            r.status === 'Paid'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-brand-600">
                        ${r.commission.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                {loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500 animate-pulse">
                      Loading referrals...
                    </td>
                  </tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No referrals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}