export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = process.env.OPENAI_ADMIN_KEY;
  if (!adminKey) {
    return res.status(500).json({ error: 'Missing OPENAI_ADMIN_KEY on server' });
  }

  const startTime = req.query.start_time;
  const endTime = req.query.end_time;
  const limit = req.query.limit ?? '100';
  const openAiBase = process.env.OPENAI_ADMIN_BASE_URL || 'https://api.openai.com/v1';

  const qs = new URLSearchParams();
  if (startTime) qs.set('start_time', String(startTime));
  if (endTime) qs.set('end_time', String(endTime));
  if (limit) qs.set('limit', String(limit));

  // OpenAI Administration API reference:
  // GET /organization/costs
  const url = `${openAiBase}/organization/costs${qs.toString() ? `?${qs.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminKey}`,
        'Content-Type': 'application/json',
      },
    });

    const raw = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'OpenAI administration API request failed',
        details: raw,
      });
    }

    const data = Array.isArray(raw?.data) ? raw.data : [];

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

