export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = process.env.OPENAI_ADMIN_KEY;
  if (!adminKey) {
    return res.status(500).json({ error: 'Missing OPENAI_ADMIN_KEY on server' });
  }

  // Defaults: last 30 days, daily granularity
  const nowSec = Math.floor(Date.now() / 1000);
  const defaultStart = nowSec - 30 * 24 * 60 * 60;
  const startTime = req.query.start_time ? Number(req.query.start_time) : defaultStart;
  const endTime = req.query.end_time ? Number(req.query.end_time) : nowSec;
  const limit = req.query.limit ?? '1000';
  const granularity = req.query.granularity ?? 'day';
  const openAiBase = process.env.OPENAI_ADMIN_BASE_URL || 'https://api.openai.com/v1';
  const orgId = process.env.OPENAI_ORG_ID;

  const qs = new URLSearchParams();
  qs.set('start_time', String(startTime));
  qs.set('end_time', String(endTime));
  if (limit) qs.set('limit', String(limit));
  if (granularity) qs.set('granularity', String(granularity));

  // OpenAI Administration API reference:
  // GET /organization/costs
  const url = `${openAiBase}/organization/costs${qs.toString() ? `?${qs.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminKey}`,
        'Content-Type': 'application/json',
        // Some Administration endpoints require this beta header
        'OpenAI-Beta': 'organization-usage=opt-in',
        ...(orgId ? { 'OpenAI-Organization': orgId } : {}),
      },
    });

    const raw = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'OpenAI administration API request failed',
        details: raw || null,
        hint:
          'Ensure OPENAI_ADMIN_KEY (and optionally OPENAI_ORG_ID) are set. Also verify required query params and the beta header.',
      });
    }

    const data = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw?.costs) ? raw.costs : []);

    // Normalize to the dashboard format expected in src/lib/adminAnalytics.ts
    const rows = data.map((item) => {
      const amountValue =
        Number(item?.amount?.value ?? item?.total_cost ?? item?.cost ?? item?.amount ?? 0) || 0;
      return {
        input_cost: Number(item?.input_cost ?? 0) || 0,
        output_cost: Number(item?.output_cost ?? 0) || 0,
        request_cost: Number(item?.request_cost ?? 0) || 0,
        total_cost: amountValue,
        raw: item,
      };
    });

    return res.status(200).json({ rows, raw });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch OpenAI costs',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

