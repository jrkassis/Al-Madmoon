import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DashboardLayout } from '../../pages/dashboards/DashboardLayout';
import { fetchAdminAnalytics, type AdminAnalytics } from '../../lib/adminAnalytics';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  emerald: '#10b981',
  emeraldLight: '#d1fae5',
  blue: '#3b82f6',
  blueLight: '#dbeafe',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  rose: '#f43f5e',
  roseLight: '#ffe4e6',
  violet: '#8b5cf6',
  violetLight: '#ede9fe',
  slate: '#64748b',
  slateLight: '#f1f5f9',
};

const PLAN_COLORS: Record<string, string> = {
  free: C.slate,
  t1: C.blue,
  t2: C.emerald,
  partner: C.amber,
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmt$(n: number, digits = 4) {
  return `$${n.toFixed(digits)}`;
}
function fmtPct(n: number) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}
function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
interface KpiProps {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  trend?: number | null;
}

function KpiCard({ label, value, sub, accent, trend }: KpiProps) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        {trend != null && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend >= 0 ? C.emeraldLight : C.roseLight,
              color: trend >= 0 ? C.emerald : C.rose,
            }}
          >
            {fmtPct(trend)}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: '#0f172a' }}>{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

// ─── Section Title ───────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4 mt-10 pb-2 border-b border-slate-100">
      {children}
    </h2>
  );
}

// ─── Chart Card ──────────────────────────────────────────────────────────────
import React from "react";

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-panel p-6 ${className}`}>
      <p className="text-sm font-semibold text-slate-700 mb-5">{title}</p>
      {children}
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="text-slate-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toFixed(4) : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await fetchAdminAnalytics();
        if (mounted) setData(result);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm animate-pulse">
          Loading analytics…
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout role="admin">
        <div className="glass-panel p-6 text-red-600 text-sm">
          {error ?? 'No data returned.'}
        </div>
      </DashboardLayout>
    );
  }

  const d = data;

  const planPie = d.planBreakdown.map((p) => ({
    name: p.plan.toUpperCase(),
    value: p.count,
    color: PLAN_COLORS[p.plan] ?? C.slate,
  }));

  const costBar = [
    { name: 'Perplexity', Input: d.perplexity.input, Output: d.perplexity.output },
    { name: 'OpenAI', Input: d.openai.input, Output: d.openai.output },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="sm:max-w-10/12 max-w-max mx-auto px-0 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <span className="text-xs text-slate-400">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>

        {/* ── Revenue ── */}
        <SectionTitle>Revenue</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          <KpiCard label="Est. MRR" value={`$${d.estimatedMRR.toFixed(2)}`} sub="Monthly recurring" accent={C.emerald} />
          <KpiCard label="Est. ARR" value={`$${d.estimatedARR.toFixed(2)}`} sub="Annualised" accent={C.blue} />
          <KpiCard label="ARPU" value={`$${d.arpu.toFixed(2)}`} sub="Avg revenue / paid user" accent={C.violet} />
          <KpiCard label="Gross Margin" value={`${d.grossMarginPct.toFixed(1)}%`} sub="MRR − cost this month" accent={d.grossMarginPct > 50 ? C.emerald : C.rose} />
        </div>

        {/* ── Growth ── */}
        <SectionTitle>Growth</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          <KpiCard label="Total Users" value={fmtK(d.totalUsers)} accent={C.blue} trend={d.userGrowthPct} />
          <KpiCard label="New This Month" value={String(d.usersThisMonth)} sub={`vs ${d.usersLastMonth} last month`} accent={C.emerald} trend={d.userGrowthPct} />
          <KpiCard label="Paid Users" value={String(d.paidUsers)} sub={`T1: ${d.t1Users} · T2: ${d.t2Users}`} accent={C.violet} />
          <KpiCard label="Conversion Rate" value={`${d.conversionRate.toFixed(1)}%`} sub="Free → paid" accent={C.amber} />
          <KpiCard label="Daily Active Users" value={String(d.dailyActiveUsers)} sub={`Power users: ${d.powerUsers}`} accent={C.rose} />
        </div>

        {/* ── API Costs ── */}
        <SectionTitle>API Costs</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          <KpiCard label="Total Cost" value={fmt$(d.totalApiCost, 4)} sub="All time" accent={C.rose} />
          <KpiCard label="Cost This Month" value={fmt$(d.costThisMonth, 4)} sub={`Last month: ${fmt$(d.costLastMonth, 4)}`} accent={C.amber} trend={d.costGrowthPct} />
          <KpiCard label="Perplexity Cost" value={fmt$(d.perplexity.total, 4)} sub={`In: ${fmt$(d.perplexity.input, 4)} · Out: ${fmt$(d.perplexity.output, 4)}`} accent={C.blue} />
          <KpiCard label="OpenAI Cost" value={fmt$(d.openai.total, 4)} sub={`In: ${fmt$(d.openai.input, 4)} · Out: ${fmt$(d.openai.output, 4)}`} accent={C.violet} />
          <KpiCard label="Cost Per Query" value={fmt$(d.costPerQuery, 5)} sub="Avg cost per API call" accent={C.slate} />
        </div>

        {/* ── Engagement ── */}
        <SectionTitle>Engagement</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          <KpiCard label="Total Queries" value={fmtK(d.totalQueries)} sub="All time" accent={C.blue} />
          <KpiCard label="Queries This Month" value={fmtK(d.queriesThisMonth)} accent={C.emerald} />
          <KpiCard label="Avg Queries / User" value={d.avgQueriesPerUser.toFixed(1)} sub={`Paid avg: ${d.avgQueriesPerPaidUser.toFixed(1)}`} accent={C.amber} />
          <KpiCard label="Avg Cost / User" value={fmt$(d.averageCostPerUser, 4)} accent={C.slate} />
        </div>

        {/* ── Trends charts ── */}
        <SectionTitle>Trends</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ChartCard title="User Growth (last 30 days)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={d.userGrowthSeries.map((p) => ({ ...p, date: shortDate(p.date) }))}>
                <defs>
                  <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.blue} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.slate }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.slate }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="Users" stroke={C.blue} strokeWidth={2} fill="url(#ugGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Estimated Revenue (last 30 days)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={d.revenueGrowthSeries.map((p) => ({ ...p, date: shortDate(p.date) }))}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.emerald} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.slate }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.slate }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area type="monotone" dataKey="value" name="Est. Revenue" stroke={C.emerald} strokeWidth={2} fill="url(#revGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <ChartCard title="Daily API Cost (last 30 days)" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={d.dailyCostSeries.map((p) => ({ ...p, date: shortDate(p.date) }))}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.rose} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.rose} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.slate }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.slate }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area type="monotone" dataKey="value" name="Cost" stroke={C.rose} strokeWidth={2} fill="url(#costGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Plan Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planPie}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planPie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} users`, n]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Cost Breakdown by Provider (Input vs Output)" className="mb-10">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costBar} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: C.slate }} tickLine={false} tickFormatter={(v) => `$${v.toFixed(4)}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C.slate }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Input" fill={C.blue} radius={[0, 4, 4, 0]} />
              <Bar dataKey="Output" fill={C.violet} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Recent Signups ── */}
        <SectionTitle>Recent Signups</SectionTitle>
        <div className="glass-panel p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="text-left pb-3 font-semibold uppercase tracking-wide">User</th>
                  <th className="text-left pb-3 font-semibold uppercase tracking-wide">Plan</th>
                  <th className="text-right pb-3 font-semibold uppercase tracking-wide">Queries</th>
                  <th className="text-right pb-3 font-semibold uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody>
                {d.recentSignups.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: PLAN_COLORS[u.plan ?? 'free'] }}
                        >
                          {(u.full_name ?? u.phone ?? u.id).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700 font-medium truncate max-w-[140px]">
                          {u.full_name ?? u.phone ?? u.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-white text-[10px] font-semibold uppercase"
                        style={{ background: PLAN_COLORS[u.plan ?? 'free'] }}
                      >
                        {u.plan ?? 'free'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-600">{u.total_messages}</td>
                    <td className="py-3 text-right text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {d.recentSignups.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">No signups yet.</td>
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