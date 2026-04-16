import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

type UserRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  plan: string | null;
  role: 'admin' | 'client' | 'partner' | null;
  created_at: string;
};

type ClientView = {
  id: string;
  name: string;
  contact: string;
  plan: string;
  rawPlan: string | null;
  role: 'admin' | 'client' | 'partner';
  joined: string;
};

type UserForm = {
  full_name: string;
  phone: string;
  plan: string;
  role: 'admin' | 'client' | 'partner';
};

function normalizePlanKey(plan: string | null): 'free' | 'pro' | 'ultimate' {
  if (!plan || plan === 'free') return 'free';
  if (plan === 't1') return 'pro';
  if (plan === 't2') return 'ultimate';
  if (plan === 'pro' || plan === 'ultimate') return plan;
  return 'free';
}

function formatPlan(plan: string | null): string {
  const key = normalizePlanKey(plan);
  if (key === 'free') return 'free';
  if (key === 'pro') return 'Pro';
  return 'Ultimate';
}

function normalizeRole(role: UserRow['role']): 'admin' | 'client' | 'partner' {
  if (role === 'admin' || role === 'partner') return role;
  return 'client';
}

export default function AdminClients() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'client' | 'partner'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro' | 'ultimate'>('all');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>({
    full_name: '',
    phone: '',
    plan: 'free',
    role: 'client',
  });

  const loadUsers = async () => {
    setError(null);
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('id, full_name, phone, plan, role, created_at')
      .order('created_at', { ascending: false });
    if (fetchError) throw fetchError;
    setUsers((data as UserRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadUsers();
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load clients');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const close = () => {
      setMenuOpenFor(null);
      setMenuPos(null);
    };
    if (menuOpenFor) {
      window.addEventListener('scroll', close, true);
      window.addEventListener('resize', close);
      // Use bubbling phase so clicks inside the menu can stop propagation
      document.addEventListener('click', close, false);
    }
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      document.removeEventListener('click', close, false);
    };
  }, [menuOpenFor]);

  const openCreateModal = () => {
    setEditingUserId(null);
    setForm({ full_name: '', phone: '', plan: 'free', role: 'client' });
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setEditingUserId(id);
    setForm({
      full_name: user.full_name ?? '',
      phone: user.phone ?? '',
      plan: normalizePlanKey(user.plan),
      role: normalizeRole(user.role),
    });
    setIsModalOpen(true);
    setMenuOpenFor(null);
  };

  const handleSaveUser = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        plan: form.plan,
        role: form.role,
      };
      if (editingUserId) {
        const { error: updateError } = await supabase
          .from('users')
          .update(payload)
          .eq('id', editingUserId);
        if (updateError) throw updateError;
      } else {
        const { error: createError } = await supabase.from('users').insert(payload);
        if (createError) throw createError;
      }
      setIsModalOpen(false);
      await loadUsers();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const ok = window.confirm('Delete this user? This action cannot be undone.');
    if (!ok) return;
    try {
      setSaving(true);
      setError(null);
      // Remove dependent payments first to satisfy FK constraints.
      const { error: paymentsDeleteError } = await supabase
        .from('payments')
        .delete()
        .eq('user_id', id);
      if (paymentsDeleteError) throw paymentsDeleteError;

      const { error: deleteError } = await supabase.from('users').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setMenuOpenFor(null);
      await loadUsers();
    } catch (e: any) {
      if (e?.code === '23503') {
        setError('Cannot delete this user because linked records still exist.');
      } else {
        setError(e?.message ?? 'Failed to delete user');
      }
    } finally {
      setSaving(false);
    }
  };

  const clients = useMemo<ClientView[]>(
    () =>
      users.map((u) => ({
        id: u.id,
        name: u.full_name?.trim() || `User ${u.id.slice(0, 8)}`,
        contact: u.phone || '-',
        plan: formatPlan(u.plan),
        rawPlan: normalizePlanKey(u.plan),
        role: normalizeRole(u.role),
        joined: new Date(u.created_at).toISOString().split('T')[0],
      })),
    [users]
  );

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q);
    })
    .filter((c) => (roleFilter === 'all' ? true : c.role === roleFilter))
    .filter((c) => (planFilter === 'all' ? true : c.rawPlan === planFilter));
  const totalClients = clients.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedClients = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, planFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <DashboardLayout role="admin">
      <div className="sm:max-w-10/12 max-w-max mx-auto px-0 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Clients
              <span className="text-sm font-semibold text-slate-500">
                {loading ? 'Loading...' : `(${filtered.length})`}
              </span>
            </h1>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 rounded-full border border-slate-200 text-sm bg-white"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as 'all' | 'admin' | 'client' | 'partner')
              }
            >
              <option value="all">All roles</option>
              <option value="client">client</option>
              <option value="partner">partner</option>
              <option value="admin">admin</option>
            </select>
            <select
              className="px-3 py-2 rounded-full border border-slate-200 text-sm bg-white"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as 'all' | 'free' | 'pro' | 'ultimate')}
            >
              <option value="all">All plans</option>
              <option value="free">free</option>
              <option value="pro">pro</option>
              <option value="ultimate">ultimate</option>
            </select>
          </div>
          <Button variant="primary" className="whitespace-nowrap" onClick={openCreateModal}>
            Add Client
          </Button>
        </div>

        <div className="glass-panel overflow-visible">
          {loading && (
            <div className="p-6 text-sm text-slate-500 animate-pulse">Loading clients...</div>
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
                  <th className="text-left p-4 font-semibold text-slate-600">Plan</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Role</th>
                  <th className="text-left p-4 font-semibold text-slate-600">Joined</th>
                  <th className="text-left p-4 font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 font-medium text-slate-900">{client.name}</td>
                    <td className="p-4 text-slate-600">{client.contact}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
                        {client.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          client.role === 'admin'
                            ? 'bg-violet-50 text-violet-700'
                            : client.role === 'partner'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {client.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{client.joined}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setMenuPos({
                            top: rect.bottom + window.scrollY + 4,
                            left: rect.right + window.scrollX - 128, // align to 128px menu width
                          });
                          setMenuOpenFor((prev) => (prev === client.id ? null : client.id));
                        }}
                      >
                        ...
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No clients found.
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
      {menuOpenFor && menuPos && (
        <div
          className="fixed w-32 rounded-lg border border-slate-200 bg-white shadow-md z-1000"
          style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => openEditModal(menuOpenFor)}
          >
            Edit
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => handleDeleteUser(menuOpenFor)}
          >
            Delete
          </button>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {editingUserId ? 'Edit User' : 'Create User'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">Plan</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    value={form.plan}
                    onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                  >
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="ultimate">ultimate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Role</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        role: e.target.value as 'admin' | 'client' | 'partner',
                      }))
                    }
                  >
                    <option value="client">client</option>
                    <option value="partner">partner</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
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
                onClick={handleSaveUser}
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