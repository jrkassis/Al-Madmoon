import http from 'http';

const PORT = process.env.DEV_API_PORT ? Number(process.env.DEV_API_PORT) : 8787;
const BASE_URL =
  process.env.WHISH_BASE_URL || 'https://api.sandbox.whish.money/itel-service/api';

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if ((req.headers['content-type'] || '').includes('application/json') && data) {
        try {
          resolve(JSON.parse(data));
          return;
        } catch {}
      }
      resolve({});
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  const method = req.method || 'GET';
  const pathname = url.split('?')[0];

  // Helper to get a Supabase client if server creds are present
  const getSupabase = async () => {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    }
    return null;
  };

  // Basic CORS for Postman/browser testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (pathname === '/api/ping' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, message: 'dev-api alive' }));
    return;
  }

  if (pathname === '/api/whish-payment') {
    if (method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    const body = await readJsonBody(req);
    const PLANS = {
      pro: { label: 'Pro', monthly: 19.99, annual: 189.99 },
      ultimate: { label: 'Ultimate', monthly: 34.99, annual: 334.99 },
    };
    const { plan, billing = 'monthly', externalId } = body || {};
    if (!plan || !PLANS[plan]) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: "Invalid plan. Must be 'pro' or 'ultimate'." }));
      return;
    }
    if (!externalId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'externalId is required.' }));
      return;
    }
    const selectedPlan = PLANS[plan];
    const amount = billing === 'annual' ? selectedPlan.annual : selectedPlan.monthly;
    const invoice = `${selectedPlan.label} ${billing === 'annual' ? 'Annual' : 'Monthly'} Subscription`;
    const originSite = process.env.SITE_URL || `http://localhost:3000`;
    const websiteHeader = process.env.WHISH_WEBSITE_URL || originSite;
    try {
      // Log pending payment into Supabase (dev server)
      try {
        const supabase = await getSupabase();
        if (supabase) {
          await supabase.from('payments').upsert({
            external_id: String(externalId),
            status: 'pending',
            amount,
            currency: 'USD',
            invoice,
            plan,
            billing,
            created_at: new Date().toISOString(),
          }, { onConflict: 'external_id' });
        }
      } catch (e) {
        console.warn('[dev-api][whish-payment] Supabase logging skipped:', e?.message ?? e);
      }

      const resp = await fetch(`${BASE_URL}/payment/whish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          channel: process.env.WHISH_CHANNEL || '',
          secret: process.env.WHISH_SECRET || '',
        websiteUrl: websiteHeader,
          'User-Agent': 'Whish/1.0 (https://whish.money; support@whish.money)',
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          invoice,
          externalId,
        successCallbackUrl: `${originSite}/api/whish-callback?status=success&externalId=${externalId}`,
        failureCallbackUrl: `${originSite}/api/whish-callback?status=failure&externalId=${externalId}`,
        successRedirectUrl: `${originSite}/paywall?payment=success`,
        failureRedirectUrl: `${originSite}/paywall?payment=failure`,
        }),
      });
      const data = await resp.json();
      if (!data.status) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Whish API returned failure', code: data.code, dialog: data.dialog }));
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ collectUrl: data.data.collectUrl }));
    } catch (err) {
      console.error('[dev-api][whish-payment] Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  if (pathname === '/api/whish-status') {
    if (method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    const body = await readJsonBody(req);
    const { externalId } = body || {};
    if (!externalId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'externalId is required.' }));
      return;
    }
    const originSite = process.env.SITE_URL || `http://localhost:3000`;
    const websiteHeader = process.env.WHISH_WEBSITE_URL || originSite;
    try {
      const resp = await fetch(`${BASE_URL}/payment/collect/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          channel: process.env.WHISH_CHANNEL || '',
          secret: process.env.WHISH_SECRET || '',
          websiteUrl: websiteHeader,
          'User-Agent': 'Whish/1.0 (https://whish.money; support@whish.money)',
        },
        body: JSON.stringify({ externalId, currency: 'USD' }),
      });
      const data = await resp.json();
      if (!data.status) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Whish API returned failure', code: data.code, dialog: data.dialog }));
        return;
      }
      const payload = {
        collectStatus: data.data.collectStatus,
        payerPhoneNumber: data.data.payerPhoneNumber,
      };

      // Update Supabase with status and, on success, set user's plan
      try {
        const supabase = await getSupabase();
        if (supabase) {
          await supabase.from('payments').upsert({
            external_id: String(externalId),
            status: payload.collectStatus,
            payer_phone: payload.payerPhoneNumber ?? null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'external_id' });

          if (payload.collectStatus === 'success' && payload.payerPhoneNumber) {
            const { data: payRow } = await supabase
              .from('payments')
              .select('plan')
              .eq('external_id', String(externalId))
              .single();
            if (payRow?.plan) {
              await supabase
                .from('users')
                .update({ plan: payRow.plan })
                .eq('phone', payload.payerPhoneNumber);
            }
          }
        }
      } catch (e) {
        console.warn('[dev-api][whish-status] Supabase logging skipped:', e?.message ?? e);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
    } catch (err) {
      console.error('[dev-api][whish-status] Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  if (pathname === '/api/whish-callback' && method === 'GET') {
    const u = new URL(url, 'http://localhost:8787');
    const status = u.searchParams.get('status') || '';
    const externalId = u.searchParams.get('externalId') || '';
    console.log('[dev-api][whish-callback] Received:', { status, externalId });
    // Mirror status to Supabase in dev
    try {
      const supabase = await getSupabase();
      if (supabase && externalId) {
        await supabase.from('payments').upsert({
          external_id: String(externalId),
          status: status === 'success' ? 'success' : status === 'failure' ? 'failed' : 'unknown',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'external_id' });
      }
    } catch (e) {
      console.warn('[dev-api][whish-callback] Supabase update skipped:', e?.message ?? e);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (status === 'success') {
      res.end(JSON.stringify({ received: true, status: 'success' }));
      return;
    }
    if (status === 'failure') {
      res.end(JSON.stringify({ received: true, status: 'failure' }));
      return;
    }
    res.end(JSON.stringify({ received: true, status: 'unknown' }));
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`);
});

