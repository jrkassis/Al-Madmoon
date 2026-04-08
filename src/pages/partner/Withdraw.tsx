import { DashboardLayout } from '../dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PartnerWithdraw() {
  type WithdrawalRow = {
    id: string;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
  };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [maxWithdrawable, setMaxWithdrawable] = useState(0);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const PARTNER_OVERRIDE_KEY_PREFIX = 'partner_commission_override:';
  const PLAN_PRICE: Record<string, number> = {
    t1: 19.99,
    t2: 34.99,
    pro: 19.99,
    ultimate: 34.99,
  };

  const getTierByReferrals = (totalReferrals: number): number => {
    if (totalReferrals >= 100) return 15;
    if (totalReferrals >= 50) return 12.5;
    if (totalReferrals >= 10) return 10;
    return 0;
  };

  const isWithdrawDay = useMemo(() => {
    const day = new Date().getDate();
    return day === 14 || day === 28;
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('You must be signed in.');

      // Compute max withdrawable using the same logic as partner referrals page.
      const referredQuery = await supabase
        .from('users')
        .select('id, plan, is_referred');
      if (referredQuery.error) throw referredQuery.error;

      const referredUsers = (referredQuery.data ?? []).filter(
        (u: any) => String(u.is_referred ?? '').trim() === user.id
      );
      const paidReferrals = referredUsers.filter((row: any) => Boolean(row.plan && row.plan !== 'free'));
      const tierPercent = getTierByReferrals(paidReferrals.length);

      let overridePercent: number | null = null;
      try {
        const { data: overrideData } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', `${PARTNER_OVERRIDE_KEY_PREFIX}${user.id}`)
          .maybeSingle();
        if (overrideData?.value != null) {
          const parsed = Number(overrideData.value);
          if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
            overridePercent = parsed;
          }
        }
      } catch {
        // Ignore and fallback to tier percent.
      }

      const appliedPercent = overridePercent ?? tierPercent;
      const totalCommission = referredUsers.reduce((sum: number, row: any) => {
        const planPrice = PLAN_PRICE[String(row.plan ?? '')] ?? 0;
        const isConverted = Boolean(row.plan && row.plan !== 'free');
        if (!isConverted) return sum;
        return sum + (planPrice * appliedPercent) / 100;
      }, 0);

      const requestsQuery = await supabase
        .from('withdraw_requests')
        .select('id, amount, payment_method, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsQuery.error) {
        throw new Error(
          'Withdraw requests table is not ready yet. Please create "withdraw_requests" in Supabase.'
        );
      }
      const rows = (requestsQuery.data ?? []) as WithdrawalRow[];
      setWithdrawals(rows);

      // Source of truth: wallet ledger/rpc if available.
      let availableFromWallet: number | null = null;
      try {
        const balRpc = await supabase.rpc('partner_wallet_balance', { p_user_id: user.id });
        if (!balRpc.error && balRpc.data != null) {
          const parsed = Number(balRpc.data);
          if (Number.isFinite(parsed)) {
            availableFromWallet = parsed;
          }
        } else {
          const ledgerRows = await supabase
            .from('partner_wallet_ledger')
            .select('entry_type, amount')
            .eq('user_id', user.id);
          if (!ledgerRows.error) {
            availableFromWallet = (ledgerRows.data ?? []).reduce((sum: number, r: any) => {
              const amount = Number(r.amount || 0);
              return String(r.entry_type) === 'debit' ? sum - amount : sum + amount;
            }, 0);
          }
        }
      } catch {
        // Will fallback below.
      }

      if (availableFromWallet != null) {
        setMaxWithdrawable(Math.max(0, availableFromWallet));
      } else {
        // Fallback only if wallet ledger is not available yet.
        const deducted = rows
          .filter((r) => String(r.status).toLowerCase() === 'done')
          .reduce((sum, r) => sum + Number(r.amount || 0), 0);
        setMaxWithdrawable(Math.max(0, totalCommission - deducted));
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load withdraw data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const requestWithdraw = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setNotice(null);

      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid withdrawal amount.');
      }
      if (numericAmount > maxWithdrawable) {
        throw new Error('Amount exceeds your maximum withdrawable commission.');
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('You must be signed in.');

      const insertRes = await supabase.from('withdraw_requests').insert({
        user_id: user.id,
        amount: Number(numericAmount.toFixed(2)),
        payment_method: paymentMethod,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (insertRes.error) throw insertRes.error;

      setAmount('');
      setNotice('Withdraw request submitted successfully.');
      await loadData();
    } catch (e: any) {
      setError(e?.message ?? 'Could not submit withdraw request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="w-10/12 mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Withdraw Funds</h1>
      {error && <div className="glass-panel p-4 mb-4 text-sm text-red-600">{error}</div>}
      {notice && <div className="glass-panel p-4 mb-4 text-sm text-emerald-700">{notice}</div>}
      {!isWithdrawDay && (
        <div className="glass-panel p-4 mb-4 text-sm text-amber-700">
          You can request a withdrawal anytime. Requests are processed on the 14th and 28th of each month.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Withdrawal form */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="font-medium text-slate-600">Available balance</span>
              <span className="text-2xl font-bold text-brand-600">
                ${loading ? '...' : maxWithdrawable.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount to withdraw
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={maxWithdrawable}
                className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="paypal">PayPal</option>
                <option value="bank">Bank transfer</option>
                <option value="wise">Wise</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={requestWithdraw}
              disabled={submitting || loading}
            >
              {submitting ? 'Submitting...' : 'Request Withdrawal'}
            </Button>
          </div>
        </div>

        {/* Withdrawal history */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent withdrawals</h3>
          <div className="space-y-4">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-slate-900">${Number(w.amount).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(w.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                  {w.status}
                </span>
              </div>
            ))}
            {!loading && withdrawals.length === 0 && (
              <p className="text-xs text-slate-500">No withdrawal requests yet.</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}