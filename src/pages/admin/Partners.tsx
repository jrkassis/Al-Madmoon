import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

type ReferralFilter = 'all' | 'none' | '1-9' | '10+' | '50+' | '100+';

type partnerRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  partner_code?: string | null;
  referrals: number;
  tier: 'none' | 'bronze' | 'silver' | 'gold';
  tierRate: number;
  overridePercent: number | null;
  effectivePercent: number;
};

type partnerForm = {
  full_name: string;
  phone: string;
  partner_code: string;
};

type WithdrawRequestRow = {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
  partner_name?: string | null;
  partner_phone?: string | null;
};

const PARTNER_OVERRIDE_KEY_PREFIX = 'partner_commission_override:';

function getTierByReferrals(totalReferrals: number): {
  tier: 'none' | 'bronze' | 'silver' | 'gold';
  percent: number;
} {
  if (totalReferrals >= 100) return { tier: 'gold', percent: 15 };
  if (totalReferrals >= 50) return { tier: 'silver', percent: 12.5 };
  if (totalReferrals >= 10) return { tier: 'bronze', percent: 10 };
  return { tier: 'none', percent: 0 };
}

function getTierLabel(tier: 'none' | 'bronze' | 'silver' | 'gold') {
  if (tier === 'gold') return 'Gold';
  if (tier === 'silver') return 'Silver';
  if (tier === 'bronze') return 'Bronze';
  return 'None';
}

export default function AdminPartners() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [referralFilter, setReferralFilter] = useState<ReferralFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [partners, setpartners] = useState<partnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [overrideSavingById, setOverrideSavingById] = useState<Record<string, boolean>>({});
  const [overrideDraftById, setOverrideDraftById] = useState<Record<string, string>>({});
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequestRow[]>([]);
  const [withdrawStatusSavingById, setWithdrawStatusSavingById] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<partnerForm>({
    full_name: '',
    phone: '',
    partner_code: '',
  });

  const loadpartners = async () => {
    setError(null);
    setLoading(true);

    const query = await supabase
      .from('users')
      .select('id, full_name, phone, created_at')
      .eq('role', 'partner')
      .order('created_at', { ascending: false });
    if (query.error) throw query.error;
    const partnersData = (query.data ?? []) as Array<{
      id: string;
      full_name: string | null;
      phone: string | null;
      created_at: string;
    }>;

    const referredUsersQuery = await supabase
      .from('users')
      .select('is_referred, plan')
      .not('is_referred', 'is', null);
    if (referredUsersQuery.error) throw referredUsersQuery.error;

    const referralCounts = new Map<string, number>();
    const referredRows = (referredUsersQuery.data ?? []) as Array<{ is_referred?: string | null; plan?: string | null }>;
    for (const row of referredRows) {
      const isPaidReferral = Boolean(row.plan && row.plan !== 'free');
      if (!isPaidReferral) continue;
      const partnerId = String(row.is_referred ?? '').trim();
      if (!partnerId) continue;
      referralCounts.set(partnerId, (referralCounts.get(partnerId) ?? 0) + 1);
    }

    const overrideSettingsQuery = await supabase
      .from('app_settings')
      .select('key, value')
      .like('key', `${PARTNER_OVERRIDE_KEY_PREFIX}%`);
    if (overrideSettingsQuery.error) throw overrideSettingsQuery.error;

    const overridesByPartner = new Map<string, number>();
    const overrideRows = (overrideSettingsQuery.data ?? []) as Array<{ key: string; value: string | null }>;
    for (const row of overrideRows) {
      const partnerId = String(row.key ?? '').replace(PARTNER_OVERRIDE_KEY_PREFIX, '');
      const parsed = Number(row.value);
      if (partnerId && Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
        overridesByPartner.set(partnerId, parsed);
      }
    }

    const normalized = partnersData.map((a) => {
      const referrals = referralCounts.get(a.id) ?? 0;
      const tierInfo = getTierByReferrals(referrals);
      const overridePercent = overridesByPartner.get(a.id) ?? null;
      const effectivePercent = overridePercent ?? tierInfo.percent;
      return {
        ...a,
        referrals,
        tier: tierInfo.tier,
        tierRate: tierInfo.percent,
        overridePercent,
        effectivePercent,
      };
    });

    setpartners(normalized);
    setOverrideDraftById(
      Object.fromEntries(
        normalized.map((p) => [p.id, p.overridePercent == null ? '' : String(p.overridePercent)])
      )
    );

    const withdrawQuery = await supabase
      .from('withdraw_requests')
      .select('id, user_id, amount, payment_method, status, created_at, updated_at')
      .order('created_at', { ascending: false });
    if (withdrawQuery.error) {
      throw new Error(
        'Withdraw requests table is not ready yet. Please create "withdraw_requests" in Supabase.'
      );
    }
    const partnerById = new Map(
      partnersData.map((p) => [
        p.id,
        {
          full_name: p.full_name,
          phone: p.phone,
        },
      ])
    );

    const mappedWithdraws = ((withdrawQuery.data ?? []) as WithdrawRequestRow[]).map((w) => {
      const partner = partnerById.get(w.user_id);
      return {
        ...w,
        partner_name: partner?.full_name ?? null,
        partner_phone: partner?.phone ?? null,
      };
    });
    setWithdrawRequests(mappedWithdraws);

    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadpartners();
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load partners');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setForm({ full_name: '', phone: '', partner_code: '' });
    setIsModalOpen(true);
  };

  const handleCreatepartner = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        role: 'partner',
        partner_code: form.partner_code.trim().toUpperCase() || null,
      };
      const withCodeInsert = await supabase.from('users').insert(payload);
      if (withCodeInsert.error) {
        // Fallback if partner_code column doesn't exist yet.
        const fallbackInsert = await supabase.from('users').insert({
          full_name: form.full_name.trim() || null,
          phone: form.phone.trim() || null,
          role: 'partner',
        });
        if (fallbackInsert.error) throw fallbackInsert.error;
      }
      setIsModalOpen(false);
      await loadpartners();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create partner');
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(
    () =>
      partners.map((a) => ({
        id: a.id,
        name: a.full_name?.trim() || `partner ${a.id.slice(0, 8)}`,
        contact: a.phone || '-',
        referrals: a.referrals,
        tier: a.tier,
        tierLabel: getTierLabel(a.tier),
        tierRate: a.tierRate,
        effectivePercent: a.effectivePercent,
        overridePercent: a.overridePercent,
        joined: new Date(a.created_at).toISOString().split('T')[0],
      })),
    [partners]
  );

  // Keep search behavior unchanged: filter by partner name only.
  const filtered = rows
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => {
      if (referralFilter === 'none') return a.referrals === 0;
      if (referralFilter === '1-9') return a.referrals >= 1 && a.referrals <= 9;
      if (referralFilter === '10+') return a.referrals >= 10;
      if (referralFilter === '50+') return a.referrals >= 50;
      if (referralFilter === '100+') return a.referrals >= 100;
      return true;
    });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedpartners = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, referralFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const savePartnerOverride = async (partnerId: string) => {
    const raw = (overrideDraftById[partnerId] ?? '').trim();
    const key = `${PARTNER_OVERRIDE_KEY_PREFIX}${partnerId}`;
    try {
      setOverrideSavingById((prev) => ({ ...prev, [partnerId]: true }));
      setError(null);
      if (raw === '') {
        const { error: delError } = await supabase
          .from('app_settings')
          .delete()
          .eq('key', key);
        if (delError) throw delError;
      } else {
        const parsed = Number(raw);
        if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
          throw new Error('Override must be a number between 0 and 100.');
        }
        const { error: upsertError } = await supabase
          .from('app_settings')
          .upsert({ key, value: String(parsed) }, { onConflict: 'key' });
        if (upsertError) throw upsertError;
      }
      await loadpartners();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save partner override.');
    } finally {
      setOverrideSavingById((prev) => ({ ...prev, [partnerId]: false }));
    }
  };

  const updateWithdrawStatus = async (
    requestId: string,
    nextStatus: 'pending' | 'in_process' | 'done' | 'rejected'
  ) => {
    try {
      setWithdrawStatusSavingById((prev) => ({ ...prev, [requestId]: true }));
      const { error: upErr } = await supabase
        .from('withdraw_requests')
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);
      if (upErr) throw upErr;
      await loadpartners();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update withdrawal status.');
    } finally {
      setWithdrawStatusSavingById((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="sm:max-w-10/12 max-w-max mx-auto px-0 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            partners
            <span className="text-sm font-semibold text-slate-500">
              {loading ? 'Loading...' : `(${filtered.length})`}
            </span>
          </h1>
          <div className="relative w-full sm:w-64 h-full">
            <input
              type="text"
              placeholder="Search partners..."
              className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <select
            className="px-3 py-2 rounded-full border border-slate-200 text-sm bg-white"
            value={referralFilter}
            onChange={(e) => setReferralFilter(e.target.value as ReferralFilter)}
          >
            <option value="all">All referrals</option>
            <option value="none">0 referrals</option>
            <option value="1-9">1-9 referrals</option>
            <option value="10+">10+ referrals</option>
            <option value="50+">50+ referrals</option>
            <option value="100+">100+ referrals</option>
          </select>
          <Button variant="primary" className="whitespace-nowrap" onClick={openCreateModal}>
            Add partner
          </Button>
        </div>

        <div className="glass-panel overflow-visible">
          {loading && (
            <div className="p-6 text-sm text-slate-500 animate-pulse">Loading partners...</div>
          )}
          {error && (
            <div className="p-6 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">Name</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Contact</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Referrals</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Tier</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Commission</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Override %</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedpartners.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-4 font-medium text-slate-900">{a.name}</td>
                      <td className="p-4 text-slate-600">{a.contact}</td>
                      <td className="p-4 text-slate-600">{a.referrals}</td>
                      <td className="p-4 text-slate-600">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {a.tierLabel}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="font-semibold text-slate-900">{a.effectivePercent}%</span>
                        <span className="text-xs text-slate-500 ml-2">(tier: {a.tierRate}%)</span>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={overrideDraftById[a.id] ?? ''}
                            onChange={(e) =>
                              setOverrideDraftById((prev) => ({ ...prev, [a.id]: e.target.value }))
                            }
                            placeholder="Auto"
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => savePartnerOverride(a.id)}
                            disabled={Boolean(overrideSavingById[a.id])}
                          >
                            {overrideSavingById[a.id] ? '...' : 'Save'}
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{a.joined}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500">
                        No partners found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel overflow-visible mt-6">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Withdraw requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-600">Partner</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Amount</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Method</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawRequests.map((w) => (
                  <tr key={w.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 text-slate-700">
                      {w.partner_name?.trim() || w.partner_phone || w.user_id.slice(0, 8)}
                    </td>
                    <td className="p-4 text-slate-700">${Number(w.amount).toFixed(2)}</td>
                    <td className="p-4 text-slate-600">{w.payment_method || '-'}</td>
                    <td className="p-4 text-slate-600">
                      {new Date(w.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {w.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={w.status}
                        onChange={(e) =>
                          updateWithdrawStatus(
                            w.id,
                            e.target.value as 'pending' | 'in_process' | 'done' | 'rejected'
                          )
                        }
                        disabled={Boolean(withdrawStatusSavingById[w.id])}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                      >
                        <option value="pending">pending</option>
                        <option value="in_process">in_process</option>
                        <option value="done">done</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {!loading && withdrawRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No withdraw requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Create partner
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500">Full Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Phone</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">partner Code (optional)</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.partner_code}
                  onChange={(e) => setForm((f) => ({ ...f, partner_code: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreatepartner}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}