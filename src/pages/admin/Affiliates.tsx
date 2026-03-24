import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

type ReferralFilter = 'all' | 'none' | '1-9' | '10+';

type AffiliateRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  affiliate_code?: string | null;
  referrals: number;
};

type AffiliateForm = {
  full_name: string;
  phone: string;
  affiliate_code: string;
};

export default function AdminAffiliates() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [referralFilter, setReferralFilter] = useState<ReferralFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<AffiliateForm>({
    full_name: '',
    phone: '',
    affiliate_code: '',
  });

  const loadAffiliates = async () => {
    setError(null);
    setLoading(true);

    const query = await supabase
      .from('users')
      .select('id, full_name, phone, created_at')
      .eq('role', 'affiliate')
      .order('created_at', { ascending: false });
    if (query.error) throw query.error;
    const affiliatesData = (query.data ?? []) as Array<{
      id: string;
      full_name: string | null;
      phone: string | null;
      created_at: string;
    }>;

    const normalized = affiliatesData.map((a) => ({
      ...a,
      referrals: 0,
    }));

    setAffiliates(normalized);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadAffiliates();
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load affiliates');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setForm({ full_name: '', phone: '', affiliate_code: '' });
    setIsModalOpen(true);
  };

  const handleCreateAffiliate = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        role: 'affiliate',
        affiliate_code: form.affiliate_code.trim().toUpperCase() || null,
      };
      const withCodeInsert = await supabase.from('users').insert(payload);
      if (withCodeInsert.error) {
        // Fallback if affiliate_code column doesn't exist yet.
        const fallbackInsert = await supabase.from('users').insert({
          full_name: form.full_name.trim() || null,
          phone: form.phone.trim() || null,
          role: 'affiliate',
        });
        if (fallbackInsert.error) throw fallbackInsert.error;
      }
      setIsModalOpen(false);
      await loadAffiliates();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create affiliate');
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(
    () =>
      affiliates.map((a) => ({
        id: a.id,
        name: a.full_name?.trim() || `Affiliate ${a.id.slice(0, 8)}`,
        contact: a.phone || '-',
        referrals: a.referrals,
        joined: new Date(a.created_at).toISOString().split('T')[0],
      })),
    [affiliates]
  );

  // Keep search behavior unchanged: filter by affiliate name only.
  const filtered = rows
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => {
      if (referralFilter === 'none') return a.referrals === 0;
      if (referralFilter === '1-9') return a.referrals >= 1 && a.referrals <= 9;
      if (referralFilter === '10+') return a.referrals >= 10;
      return true;
    });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedAffiliates = useMemo(
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
            Affiliates
            <span className="text-sm font-semibold text-slate-500">
              {loading ? 'Loading...' : `(${filtered.length})`}
            </span>
          </h1>
          <div className="relative w-full sm:w-64 h-full">
            <input
              type="text"
              placeholder="Search affiliates..."
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
            Add Affiliate
          </Button>
        </div>

        <div className="glass-panel overflow-visible">
          {loading && (
            <div className="p-6 text-sm text-slate-500 animate-pulse">Loading affiliates...</div>
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
                  {paginatedAffiliates.map((a) => (
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
                        No affiliates found.
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
              Create Affiliate
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
                <label className="text-xs text-slate-500">Affiliate Code (optional)</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.affiliate_code}
                  onChange={(e) => setForm((f) => ({ ...f, affiliate_code: e.target.value }))}
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
                onClick={handleCreateAffiliate}
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