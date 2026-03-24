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
  const requestedLimit = Number(req.query.limit ?? 180);
  const safeLimit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 180)
    : 180;
  const granularity = String(req.query.granularity ?? 'day');
  const openAiBase = process.env.OPENAI_ADMIN_BASE_URL || 'https://api.openai.com/v1';
  const orgId = process.env.OPENAI_ORG_ID;

  const qs = new URLSearchParams();
  qs.set('start_time', String(startTime));
  qs.set('end_time', String(endTime));
  qs.set('limit', String(safeLimit));
  // OpenAI costs endpoint expects bucket_width (1m|1h|1d); map friendly values.
  const bucketWidthMap = { minute: '1m', hour: '1h', day: '1d' };
  const normalizedBucketWidth = bucketWidthMap[granularity] ?? String(req.query.bucket_width ?? '1d');
  qs.set('bucket_width', normalizedBucketWidth);

  // /organization/usage provides token-level usage buckets.
  // We estimate spend from token totals using configurable per-1M-token rates.
  const inputPricePer1M = Number(process.env.OPENAI_INPUT_PRICE_PER_1M ?? 0);
  const outputPricePer1M = Number(process.env.OPENAI_OUTPUT_PRICE_PER_1M ?? 0);
  // The token usage endpoint is namespaced by product.
  // "completions" returns input/output token buckets we can price.
  const url = `${openAiBase}/organization/usage/completions${qs.toString() ? `?${qs.toString()}` : ''}`;

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

    const data = Array.isArray(raw?.data) ? raw.data : [];

    // Normalize to the dashboard format expected in src/lib/adminAnalytics.ts
    const rows = [];
    for (const item of data) {
      const nested = Array.isArray(item?.results) ? item.results : [];
      const bucketStart = Number(item?.start_time ?? item?.start ?? 0);
      const createdAt = bucketStart > 0 ? new Date(bucketStart * 1000).toISOString() : null;
      if (nested.length) {
        for (const n of nested) {
          const inputTokens = Number(
            n?.input_tokens ??
            n?.prompt_tokens ??
            n?.n_input_tokens_total ??
            n?.input_token_count ??
            0
          ) || 0;
          const outputTokens = Number(
            n?.output_tokens ??
            n?.completion_tokens ??
            n?.n_output_tokens_total ??
            n?.output_token_count ??
            0
          ) || 0;
          const requestCost = Number(n?.request_cost ?? 0) || 0;
          const fallbackInputCost = (inputTokens / 1_000_000) * inputPricePer1M;
          const fallbackOutputCost = (outputTokens / 1_000_000) * outputPricePer1M;
          const inputCost = Number(n?.input_cost ?? fallbackInputCost) || 0;
          const outputCost = Number(n?.output_cost ?? fallbackOutputCost) || 0;
          const amountValue = Number(n?.amount?.value ?? n?.total_cost ?? n?.cost ?? (inputCost + outputCost + requestCost)) || 0;
          rows.push({
            created_at: createdAt,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            input_cost: inputCost,
            output_cost: outputCost,
            request_cost: requestCost,
            total_cost: amountValue,
            raw: n,
          });
        }
      } else {
        const inputTokens = Number(
          item?.input_tokens ??
          item?.prompt_tokens ??
          item?.n_input_tokens_total ??
          item?.input_token_count ??
          0
        ) || 0;
        const outputTokens = Number(
          item?.output_tokens ??
          item?.completion_tokens ??
          item?.n_output_tokens_total ??
          item?.output_token_count ??
          0
        ) || 0;
        const requestCost = Number(item?.request_cost ?? 0) || 0;
        const fallbackInputCost = (inputTokens / 1_000_000) * inputPricePer1M;
        const fallbackOutputCost = (outputTokens / 1_000_000) * outputPricePer1M;
        const inputCost = Number(item?.input_cost ?? fallbackInputCost) || 0;
        const outputCost = Number(item?.output_cost ?? fallbackOutputCost) || 0;
        const amountValue = Number(item?.amount?.value ?? item?.total_cost ?? item?.cost ?? item?.amount ?? (inputCost + outputCost + requestCost)) || 0;
        rows.push({
          created_at: createdAt,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          input_cost: inputCost,
          output_cost: outputCost,
          request_cost: requestCost,
          total_cost: amountValue,
          raw: item,
        });
      }
    }

    return res.status(200).json({ rows, raw });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch OpenAI costs',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

