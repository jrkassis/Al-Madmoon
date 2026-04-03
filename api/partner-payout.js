// api/partner-payout.js
// Vercel Serverless Function — POST /api/partner-payout
// Marks approved commissions as paid for a user and creates a payout row.
// Body: { userId: string, month?: 'YYYY-MM' }
// Enforces $31 minimum payout threshold.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: "Supabase credentials missing" });
    }
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { userId, month } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const now = new Date();
    const monthUtc = typeof month === "string" && /^\d{4}-\d{2}$/.test(month)
      ? month
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 7);

    // Sum approved commissions for the user/month
    const { data: rows, error: sErr } = await supabase
      .from("commissions")
      .select("id, commission_amount")
      .eq("referrer_user_id", userId)
      .eq("status", "approved")
      .eq("month_utc", monthUtc);
    if (sErr) throw sErr;

    const amount = (rows || []).reduce((s, r) => s + Number(r.commission_amount || 0), 0);
    if (amount < 31) {
      return res.status(400).json({ error: "Below minimum threshold", amount });
    }

    // Mark as paid
    const { error: uErr } = await supabase
      .from("commissions")
      .update({ status: "paid" })
      .eq("referrer_user_id", userId)
      .eq("status", "approved")
      .eq("month_utc", monthUtc);
    if (uErr) throw uErr;

    // Insert payout row
    const { data: payout, error: pErr } = await supabase
      .from("payouts")
      .insert({
        user_id: userId,
        period_month: monthUtc,
        amount,
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (pErr) throw pErr;

    return res.status(200).json({ ok: true, payout });
  } catch (e) {
    console.error("[partner-payout] Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

