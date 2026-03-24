import { supabase } from './supabase';

export type AdminAnalytics = {
  totalUsers: number;
  usersThisMonth: number;
  paidUsers: number;
  freeUsers: number;
  affiliates: number;
  // Combined across providers
  totalApiCost: number;
  inputCost: number;
  outputCost: number;
  // Per provider breakdowns
  perplexity: {
    total: number;
    input: number;
    output: number;
  };
  openai: {
    total: number;
    input: number;
    output: number;
  };
  averageCostPerUser: number;
  recentSignups: Array<{ id: string; full_name: string | null; phone: string | null; created_at: string }>;
};

function parseCurrency(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

async function sumCostsFromTables(
  tableCandidates: string[]
): Promise<{ input: number; output: number; total: number }> {
  for (const table of tableCandidates) {
    const result = await supabase
      .from(table)
      .select('input_cost, output_cost, request_cost, total_cost');
    if (!result.error) {
      const sums = ((result.data as Array<Record<string, unknown>>) ?? []).reduce(
        (acc, r) => {
          acc.input += parseCurrency((r as any).input_cost);
          acc.output += parseCurrency((r as any).output_cost);
          acc.total += parseCurrency(
            (r as any).total_cost ?? parseCurrency((r as any).request_cost)
          );
          return acc;
        },
        { input: 0, output: 0, total: 0 }
      );
      return sums;
    }
    const isMissingTable =
      result.error.code === '42P01' ||
      result.error.message.toLowerCase().includes('could not find the table');
    if (!isMissingTable) {
      throw result.error;
    }
  }
  return { input: 0, output: 0, total: 0 };
}

async function sumCostsFromExternalUrl(
  envVarName: string,
  fallbackUrl?: string
): Promise<{ input: number; output: number; total: number }> {
  const url =
    ((import.meta as any)?.env?.[envVarName] as string | undefined) ??
    fallbackUrl;
  if (!url) return { input: 0, output: 0, total: 0 };
  try {
    const resp = await fetch(url);
    if (!resp.ok) return { input: 0, output: 0, total: 0 };
    const body = await resp.json();
    const rows: Array<Record<string, unknown>> = Array.isArray(body) ? body : body?.rows ?? [];
    return rows.reduce(
      (acc, r) => {
        acc.input += parseCurrency((r as any).input_cost);
        acc.output += parseCurrency((r as any).output_cost);
        acc.total += parseCurrency(
          (r as any).total_cost ?? parseCurrency((r as any).request_cost)
        );
        return acc;
      },
      { input: 0, output: 0, total: 0 }
    );
  } catch {
    return { input: 0, output: 0, total: 0 };
  }
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  // Users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, plan, role, created_at, full_name, phone')
    .order('created_at', { ascending: false });
  if (usersError) {
    throw usersError;
  }

  const totalUsers = users?.length ?? 0;
  const usersThisMonth =
    users?.filter((u) => new Date(u.created_at) >= startOfMonth).length ?? 0;
  const paidUsers = users?.filter((u) => (u as any).plan && (u as any).plan !== 'free').length ?? 0;
  const freeUsers = users?.filter((u) => (u as any).plan === 'free').length ?? 0;
  const affiliates = users?.filter((u) => (u as any).role === 'affiliate').length ?? 0;

  const recentSignups =
    users?.slice(0, 5).map((u) => ({
      id: (u as any).id as string,
      full_name: (u as any).full_name ?? null,
      phone: (u as any).phone ?? null,
      created_at: (u as any).created_at as string,
    })) ?? [];

  // Perplexity API costs (existing)
  const perplexitySums = await sumCostsFromTables([
    'api_cost',
    'api_costs',
    'api_cost_config',
    'api_cost_configuration',
  ]);

  // OpenAI API costs: prefer external endpoint first (avoid Supabase 404s),
  // then fall back to potential tables if the endpoint yields no data.
  let openaiSums = await sumCostsFromExternalUrl('VITE_OPENAI_COSTS_URL', '/api/openai-costs');
  if (openaiSums.total === 0 && openaiSums.input === 0 && openaiSums.output === 0) {
    openaiSums = await sumCostsFromTables([
      'openai_cost',
      'openai_costs',
      'openai_api_cost',
      'openai_api_costs',
    ]);
  }

  const combined = {
    input: perplexitySums.input + openaiSums.input,
    output: perplexitySums.output + openaiSums.output,
    total: perplexitySums.total + openaiSums.total,
  };

  const averageCostPerUser = totalUsers > 0 ? combined.total / totalUsers : 0;

  return {
    totalUsers,
    usersThisMonth,
    paidUsers,
    freeUsers,
    affiliates,
    totalApiCost: combined.total,
    inputCost: combined.input,
    outputCost: combined.output,
    perplexity: {
      total: perplexitySums.total,
      input: perplexitySums.input,
      output: perplexitySums.output,
    },
    openai: {
      total: openaiSums.total,
      input: openaiSums.input,
      output: openaiSums.output,
    },
    averageCostPerUser,
    recentSignups,
  };
}

