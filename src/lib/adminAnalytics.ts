import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DailySeries = { date: string; value: number };

export type AdminAnalytics = {
  // ── Users ──────────────────────────────────────────────────────────────
  totalUsers: number;
  usersThisMonth: number;
  usersLastMonth: number;
  userGrowthPct: number;          // MoM % change
  paidUsers: number;
  freeUsers: number;
  affiliates: number;
  t1Users: number;
  t2Users: number;
  conversionRate: number;         // paidUsers / totalUsers * 100
  userGrowthSeries: DailySeries[]; // cumulative signups per day (last 30d)

  // ── Engagement ─────────────────────────────────────────────────────────
  totalQueries: number;           // sum of total_messages across all users
  queriesThisMonth: number;
  avgQueriesPerUser: number;
  avgQueriesPerPaidUser: number;
  dailyActiveUsers: number;       // users with last_message_date = today
  powerUsers: number;             // users with total_messages >= 20

  // ── Revenue (estimated from plan pricing) ──────────────────────────────
  estimatedMRR: number;           // monthly recurring revenue
  estimatedARR: number;
  revenueGrowthSeries: DailySeries[]; // estimated MRR per day (last 30d)
  arpu: number;                   // avg revenue per paid user

  // ── API Costs ──────────────────────────────────────────────────────────
  totalApiCost: number;
  inputCost: number;
  outputCost: number;
  costThisMonth: number;
  costLastMonth: number;
  costGrowthPct: number;
  grossMarginPct: number;         // (MRR - monthly cost) / MRR * 100
  perplexity: { total: number; input: number; output: number };
  openai: { total: number; input: number; output: number };
  averageCostPerUser: number;
  costPerQuery: number;
  dailyCostSeries: DailySeries[]; // total cost per day (last 30d)

  // ── Plan breakdown ─────────────────────────────────────────────────────
  planBreakdown: Array<{ plan: string; count: number; pct: number }>;

  // ── Recent activity ────────────────────────────────────────────────────
  recentSignups: Array<{
    id: string;
    full_name: string | null;
    phone: string | null;
    plan: string | null;
    created_at: string;
    total_messages: number;
  }>;
};

// ---------------------------------------------------------------------------
// Pricing map — update if your prices change
// ---------------------------------------------------------------------------
const PLAN_PRICE: Record<string, number> = {
  t1: 19.99,
  t2: 34.99,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseCurrency(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function last30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(isoDate(d));
  }
  return days;
}

async function sumCostsFromTables(
  tableCandidates: string[]
): Promise<{
  input: number;
  output: number;
  total: number;
  rows: Array<{ created_at: string; total_cost: number }>;
}> {
  for (const table of tableCandidates) {
    const result = await supabase
      .from(table)
      .select('input_cost, output_cost, request_cost, total_cost, created_at');
    if (!result.error) {
      const data = (result.data as Array<Record<string, unknown>>) ?? [];
      let input = 0, output = 0, total = 0;
      const rows: Array<{ created_at: string; total_cost: number }> = [];
      for (const r of data) {
        const i = parseCurrency((r as any).input_cost);
        const o = parseCurrency((r as any).output_cost);
        const t = parseCurrency((r as any).total_cost ?? (r as any).request_cost);
        input += i;
        output += o;
        total += t;
        rows.push({ created_at: (r as any).created_at ?? '', total_cost: t });
      }
      return { input, output, total, rows };
    }
    const isMissing =
      result.error.code === '42P01' ||
      result.error.message.toLowerCase().includes('could not find the table');
    if (!isMissing) throw result.error;
  }
  return { input: 0, output: 0, total: 0, rows: [] };
}

async function fetchOpenAICosts(): Promise<{
  input: number;
  output: number;
  total: number;
  rows: Array<{ created_at: string; total_cost: number }>;
}> {
  // Reads token usage + derived costs from OpenAI Admin API via backend proxy.
  // Set VITE_OPENAI_COSTS_URL to a backend endpoint that calls:
  //   GET https://api.openai.com/v1/organization/usage
  // and returns { rows: [{ created_at, input_cost, output_cost, total_cost }] }
  const url = (import.meta as any)?.env?.VITE_OPENAI_COSTS_URL as string | undefined;
  if (!url) return { input: 0, output: 0, total: 0, rows: [] };
  try {
    const resp = await fetch(url);
    if (!resp.ok) return { input: 0, output: 0, total: 0, rows: [] };
    const body = await resp.json();
    const rows: Array<Record<string, unknown>> = Array.isArray(body)
      ? body
      : body?.rows ?? [body];
    const sums = rows.reduce<{ input: number; output: number; total: number }>(
      (acc, r) => {
        acc.input += parseCurrency(r.input_cost);
        acc.output += parseCurrency(r.output_cost);
        acc.total += parseCurrency(r.total_cost ?? r.request_cost);
        return acc;
      },
      { input: 0, output: 0, total: 0 }
    );
    const normalizedRows = rows.map((r) => ({
      created_at: String(r.created_at ?? ''),
      total_cost: parseCurrency(r.total_cost ?? r.request_cost),
    }));
    return { ...sums, rows: normalizedRows };
  } catch {
    return { input: 0, output: 0, total: 0, rows: [] };
  }
}

// ---------------------------------------------------------------------------
// Main fetch
// ---------------------------------------------------------------------------

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const now = new Date();
  const days = last30Days();

  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const endOfLastMonth = new Date(startOfMonth.getTime() - 1);
  const todayStr = isoDate(now);
  const thirtyDaysAgo = days[0];

  // ── 1. Users ─────────────────────────────────────────────────────────────
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, plan, role, created_at, full_name, phone, total_messages, daily_messages, last_message_date')
    .order('created_at', { ascending: false });
  if (usersError) throw usersError;

  const totalUsers = users?.length ?? 0;
  const usersThisMonth = users?.filter((u) => new Date(u.created_at) >= startOfMonth).length ?? 0;
  const usersLastMonth = users?.filter((u) => {
    const d = new Date(u.created_at);
    return d >= startOfLastMonth && d <= endOfLastMonth;
  }).length ?? 0;
  const userGrowthPct = usersLastMonth > 0
    ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100
    : usersThisMonth > 0 ? 100 : 0;

  const paidUsers = users?.filter((u) => u.plan && u.plan !== 'free').length ?? 0;
  const freeUsers = users?.filter((u) => u.plan === 'free' || !u.plan).length ?? 0;
  const affiliates = users?.filter((u) => u.role === 'affiliate').length ?? 0;
  const t1Users = users?.filter((u) => u.plan === 't1').length ?? 0;
  const t2Users = users?.filter((u) => u.plan === 't2').length ?? 0;
  const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

  // Plan breakdown
  const planCounts: Record<string, number> = {};
  for (const u of users ?? []) {
    const p = u.plan ?? 'free';
    planCounts[p] = (planCounts[p] ?? 0) + 1;
  }
  const planBreakdown = Object.entries(planCounts).map(([plan, count]) => ({
    plan,
    count,
    pct: totalUsers > 0 ? (count / totalUsers) * 100 : 0,
  }));

  // User growth series — cumulative signups per day (last 30d)
  const signupsByDay: Record<string, number> = {};
  for (const u of users ?? []) {
    const d = isoDate(new Date(u.created_at));
    if (d >= thirtyDaysAgo) signupsByDay[d] = (signupsByDay[d] ?? 0) + 1;
  }
  let cumulative = (users ?? []).filter((u) => isoDate(new Date(u.created_at)) < thirtyDaysAgo).length;
  const userGrowthSeries: DailySeries[] = days.map((d) => {
    cumulative += signupsByDay[d] ?? 0;
    return { date: d, value: cumulative };
  });

  // ── 2. Engagement ─────────────────────────────────────────────────────────
  const totalQueries = users?.reduce((s, u) => s + (u.total_messages ?? 0), 0) ?? 0;
  const queriesThisMonth = users?.reduce((s, u) => {
    const lastDate = u.last_message_date;
    if (!lastDate) return s;
    return new Date(lastDate) >= startOfMonth ? s + (u.daily_messages ?? 0) : s;
  }, 0) ?? 0;
  const avgQueriesPerUser = totalUsers > 0 ? totalQueries / totalUsers : 0;
  const paidUsersList = users?.filter((u) => u.plan && u.plan !== 'free') ?? [];
  const avgQueriesPerPaidUser = paidUsers > 0
    ? paidUsersList.reduce((s, u) => s + (u.total_messages ?? 0), 0) / paidUsers
    : 0;
  const dailyActiveUsers = users?.filter((u) => u.last_message_date === todayStr).length ?? 0;
  const powerUsers = users?.filter((u) => (u.total_messages ?? 0) >= 20).length ?? 0;

  // ── 3. Revenue ─────────────────────────────────────────────────────────────
  const estimatedMRR = (users ?? []).reduce((s, u) => s + (PLAN_PRICE[u.plan] ?? 0), 0);
  const estimatedARR = estimatedMRR * 12;
  const arpu = paidUsers > 0 ? estimatedMRR / paidUsers : 0;

  // Revenue growth series — approximate by counting paid users per day
  const revenueGrowthSeries: DailySeries[] = userGrowthSeries.map((pt) => {
    // rough: paid ratio * MRR proportional to cumulative users
    const ratio = totalUsers > 0 ? paidUsers / totalUsers : 0;
    return { date: pt.date, value: parseFloat((pt.value * ratio * arpu).toFixed(2)) };
  });

  // ── 4. API Costs ───────────────────────────────────────────────────────────
  const perplexityResult = await sumCostsFromTables(['api_costs', 'api_cost', 'api_cost_config']);
  const openaiSums = await fetchOpenAICosts();

  const perplexitySums = {
    input: perplexityResult.input,
    output: perplexityResult.output,
    total: perplexityResult.total,
  };

  const combined = {
    input: perplexitySums.input + openaiSums.input,
    output: perplexitySums.output + openaiSums.output,
    total: perplexitySums.total + openaiSums.total,
  };

  // Monthly cost splits include both Perplexity + OpenAI rows.
  const allCostRows = [...perplexityResult.rows, ...openaiSums.rows];
  const costThisMonth = allCostRows
    .filter((r) => r.created_at && new Date(r.created_at) >= startOfMonth)
    .reduce((s, r) => s + r.total_cost, 0);
  const costLastMonth = allCostRows
    .filter((r) => {
      if (!r.created_at) return false;
      const d = new Date(r.created_at);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    })
    .reduce((s, r) => s + r.total_cost, 0);
  const costGrowthPct = costLastMonth > 0
    ? ((costThisMonth - costLastMonth) / costLastMonth) * 100
    : costThisMonth > 0 ? 100 : 0;

  const grossMarginPct = estimatedMRR > 0
    ? ((estimatedMRR - costThisMonth) / estimatedMRR) * 100
    : 0;

  // Daily cost series (last 30d)
  const costByDay: Record<string, number> = {};
  for (const r of allCostRows) {
    if (!r.created_at) continue;
    const d = isoDate(new Date(r.created_at));
    if (d >= thirtyDaysAgo) costByDay[d] = (costByDay[d] ?? 0) + r.total_cost;
  }
  const dailyCostSeries: DailySeries[] = days.map((d) => ({
    date: d,
    value: parseFloat((costByDay[d] ?? 0).toFixed(5)),
  }));

  const averageCostPerUser = totalUsers > 0 ? combined.total / totalUsers : 0;
  const costPerQuery = totalQueries > 0 ? combined.total / totalQueries : 0;

  // ── 5. Recent signups ──────────────────────────────────────────────────────
  const recentSignups = (users ?? []).slice(0, 8).map((u) => ({
    id: u.id as string,
    full_name: u.full_name ?? null,
    phone: u.phone ?? null,
    plan: u.plan ?? 'free',
    created_at: u.created_at as string,
    total_messages: u.total_messages ?? 0,
  }));

  return {
    totalUsers,
    usersThisMonth,
    usersLastMonth,
    userGrowthPct,
    paidUsers,
    freeUsers,
    affiliates,
    t1Users,
    t2Users,
    conversionRate,
    userGrowthSeries,
    totalQueries,
    queriesThisMonth,
    avgQueriesPerUser,
    avgQueriesPerPaidUser,
    dailyActiveUsers,
    powerUsers,
    estimatedMRR,
    estimatedARR,
    revenueGrowthSeries,
    arpu,
    totalApiCost: combined.total,
    inputCost: combined.input,
    outputCost: combined.output,
    costThisMonth,
    costLastMonth,
    costGrowthPct,
    grossMarginPct,
    perplexity: perplexitySums,
    openai: openaiSums,
    averageCostPerUser,
    costPerQuery,
    dailyCostSeries,
    planBreakdown,
    recentSignups,
  };
}