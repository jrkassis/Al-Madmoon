// api/whish-payment.js
// Vercel Serverless Function — POST /api/whish-payment
// Creates a Whish Pay session and returns the collectUrl
const BASE_URL =
  process.env.WHISH_BASE_URL || "https://api.sandbox.whish.money/itel-service/api";

const PLANS = {
  pro: {
    label: "Pro",
    monthly: 19.99,
    annual: 189.99,
  },
  ultimate: {
    label: "Ultimate",
    monthly: 34.99,
    annual: 334.99,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan, billing = "monthly", externalId } = req.body;

  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: "Invalid plan. Must be 'pro' or 'ultimate'." });
  }

  if (!externalId) {
    return res.status(400).json({ error: "externalId is required." });
  }

  const selectedPlan = PLANS[plan];
  const amount = billing === "annual" ? selectedPlan.annual : selectedPlan.monthly;
  const invoice = `${selectedPlan.label} ${billing === "annual" ? "Annual" : "Monthly"} Subscription`;

  const originSite =
    process.env.SITE_URL ||
    `https://${req.headers.host}`;
  const websiteHeader =
    process.env.WHISH_WEBSITE_URL || originSite;

  const body = {
    amount,
    currency: "USD",
    invoice,
    externalId,
    successCallbackUrl: `${originSite}/api/whish-callback?status=success&externalId=${externalId}`,
    failureCallbackUrl: `${originSite}/api/whish-callback?status=failure&externalId=${externalId}`,
    // Redirect the user to their dashboard after successful payment
    successRedirectUrl: `${originSite}/dashboard`,
    failureRedirectUrl: `${originSite}/paywall?payment=failure`,
  };

  try {
    // Best-effort: record pending payment in Supabase if server creds exist
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        await supabase.from("payments").upsert({
          external_id: String(externalId),
          status: "pending",
          amount,
          currency: "USD",
          invoice,
          plan,
          billing,
          created_at: new Date().toISOString(),
        }, { onConflict: "external_id" });
      }
    } catch (e) {
      console.warn("[whish-payment] Supabase logging skipped:", e?.message ?? e);
    }

    const whishRes = await fetch(`${BASE_URL}/payment/whish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        channel: process.env.WHISH_CHANNEL,
        secret: process.env.WHISH_SECRET,
        websiteUrl: websiteHeader,
        "User-Agent": "Whish/1.0 (https://whish.money; support@whish.money)",
      },
      body: JSON.stringify(body),
    });

    const data = await whishRes.json();

    if (!data.status) {
      return res.status(502).json({
        error: "Whish API returned failure",
        code: data.code,
        dialog: data.dialog,
      });
    }

    return res.status(200).json({ collectUrl: data.data.collectUrl });
  } catch (err) {
    console.error("[whish-payment] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
