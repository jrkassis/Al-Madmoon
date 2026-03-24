import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { fetchAdminAnalytics, type AdminAnalytics } from '../../lib/adminAnalytics';

// If you don't have a Card component, just use a div with glass-panel class
export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const result = await fetchAdminAnalytics();
        if (isMounted) {
          setData(result);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message ?? 'Failed to load analytics');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Total Users', value: Intl.NumberFormat().format(data.totalUsers), change: '', icon: '' },
      { label: 'Users This Month', value: Intl.NumberFormat().format(data.usersThisMonth), change: '', icon: '' },
      { label: 'Total API Cost', value: `$${data.totalApiCost.toFixed(4)}`, change: '', icon: '' },
      { label: 'Avg Cost / User', value: `$${data.averageCostPerUser.toFixed(4)}`, change: '', icon: '' },
    ];
  }, [data]);

  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Analytics</h1>
      {loading && (
        <div className="glass-panel p-6 mb-6 text-slate-500">Loading analytics…</div>
      )}
      {error && (
        <div className="glass-panel p-6 mb-6 text-red-600">Error: {error}</div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-sm text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Input vs Output Cost</h3>
          <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            {data ? `Input: $${data.inputCost.toFixed(4)} • Output: $${data.outputCost.toFixed(4)}` : 'Chart placeholder (Costs)'}
          </div>
          {data && (
            <div className="mt-4 text-sm text-slate-600">
              <div>Perplexity — Input: ${data.perplexity.input.toFixed(4)}, Output: ${data.perplexity.output.toFixed(4)}, Total: ${data.perplexity.total.toFixed(4)}</div>
              <div>OpenAI — Input: ${data.openai.input.toFixed(4)}, Output: ${data.openai.output.toFixed(4)}, Total: ${data.openai.total.toFixed(4)}</div>
            </div>
          )}
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Paid vs Free Users</h3>
          <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            {data ? `Paid: ${data.paidUsers} • Free: ${data.freeUsers} • Affiliates: ${data.affiliates}` : 'Chart placeholder (Users)'}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recent activity</h3>
        <div className="space-y-4">
          {(data?.recentSignups ?? []).map((u) => (
            <div key={u.id} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  New user: {u.full_name ?? u.phone ?? u.id.slice(0, 6)}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(u.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {!loading && !error && data && data.recentSignups.length === 0 && (
            <div className="text-sm text-slate-500">No recent signups.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}