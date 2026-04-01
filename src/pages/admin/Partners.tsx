import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

type ReferralFilter = 'all' | 'none' | '1-9' | '10+';

type partnerRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  partner_code?: string | null;
  referrals: number;
};

type partnerForm = {
  full_name: string;
  phone: string;
  partner_code: string;
};

const COMMISSION_KEY = 'partner_commission_percent';
const DEFAULT_COMMISSION_PERCENT = 30;

export default function AdminPartners() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [referralFilter, setReferralFilter] = useState<ReferralFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [partners, setpartners] = useState<partnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commissionPercent, setCommissionPercent] = useState<number>(DEFAULT_COMMISSION_PERCENT);
  const [commissionSaving, setCommissionSaving] = useState(false);
  const [commissionNotice, setCommissionNotice] = useState<string | null>(null);
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

    const normalized = partnersData.map((a) => ({
      ...a,
      referrals: 0,
    }));

    setpartners(normalized);
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

  useEffect(() => {
    const loadCommissionPercent = async () => {
      try {
        const { data, error: settingsError } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', COMMISSION_KEY)
          .maybeSingle();
        if (!settingsError && data?.value != null) {
          const parsed = Number(data.value);
          if (Number.isFinite(parsed) && parsed > 0 && parsed <= 100) {
            setCommissionPercent(parsed);
            localStorage.setItem(COMMISSION_KEY, String(parsed));
            return;
          }
        }
      } catch {
        // Ignore and fallback to local storage.
      }

      const local = Number(localStorage.getItem(COMMISSION_KEY));
      if (Number.isFinite(local) && local > 0 && local <= 100) {
        setCommissionPercent(local);
      } else {
        setCommissionPercent(DEFAULT_COMMISSION_PERCENT);
      }
    };

    void loadCommissionPercent();
  }, []);

  const saveCommissionPercent = async () => {
    const normalized = Math.min(100, Math.max(1, Number(commissionPercent) || DEFAULT_COMMISSION_PERCENT));
    try {
      setCommissionSaving(true);
      setCommissionNotice(null);
      const { error: upsertError } = await supabase
        .from('app_settings')
        .upsert({ key: COMMISSION_KEY, value: String(normalized) }, { onConflict: 'key' });
      if (upsertError) throw upsertError;
      setCommissionPercent(normalized);
      localStorage.setItem(COMMISSION_KEY, String(normalized));
      setCommissionNotice('Commission updated and saved.');
    } catch {
      // Fallback persistence if app_settings table is unavailable.
      localStorage.setItem(COMMISSION_KEY, String(normalized));
      setCommissionPercent(normalized);
      setCommissionNotice('Saved locally in this browser. Create app_settings table for global sync.');
    } finally {
      setCommissionSaving(false);
    }
  };

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

  return (
    <DashboardLayout role="admin">
      <div className="max-w-10/12 mx-auto px-6">
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
          </select>
          <Button variant="primary" className="whitespace-nowrap" onClick={openCreateModal}>
            Add partner
          </Button>
        </div>

        <div className="glass-panel p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">partner commission</p>
            <p className="text-xs text-slate-500">Used by partner referral analytics.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(Number(e.target.value))}
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <span className="text-sm text-slate-500">%</span>
            <Button variant="primary" onClick={saveCommissionPercent} disabled={commissionSaving}>
              {commissionSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        {commissionNotice && <p className="text-xs text-slate-500 mb-4">{commissionNotice}</p>}

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
                    <th className="text-left p-4 font-semibold text-slate-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedpartners.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-4 font-medium text-slate-900">{a.name}</td>
                      <td className="p-4 text-slate-600">{a.contact}</td>
                      <td className="p-4 text-slate-600">{a.referrals}</td>
                      <td className="p-4 text-slate-600">{a.joined}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500">
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