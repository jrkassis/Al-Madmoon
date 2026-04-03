// api/partner-monthly.js
// Vercel Serverless Function — POST /api/partner-monthly
// - Computes monthly tiers for all partners based on active referrals within month (UTC)
// - Approves commissions past 14-day hold
// Requires SUPABASE_SERVICE_KEY (service role)

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

    const { month } = req.body || {};
    const now = new Date();
    const monthUtc = typeof month === "string" && /^\d{4}-\d{2}$/.test(month)
      ? month
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 7);

    const monthStart = new Date(`${monthUtc}-01T00:00:00.000Z`);
    const monthEnd = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1));

    // 1) Build active referral counts per referrer in this month
    const { data: actives, error: activesErr } = await supabase
      .from("referrals")
      .select("referrer_user_id, activated_at")
      .eq("status", "active")
      .gte("activated_at", monthStart.toISOString())
      .lt("activated_at", monthEnd.toISOString());
    if (activesErr) throw activesErr;

    const counts = new Map();
    for (const r of actives || []) {
      const k = r.referrer_user_id;
      counts.set(k, (counts.get(k) || 0) + 1);
    }

    const upserts = [];
    for (const [userId, cnt] of counts.entries()) {
      let tier = "bronze";
      let percent = 10;
      if (cnt >= 100) { tier = "gold"; percent = 15; }
      else if (cnt >= 50) { tier = "silver"; percent = 12.5; }
      else if (cnt >= 10) { tier = "bronze"; percent = 10; }
      else { tier = "bronze"; percent = 0; } // below threshold => effectively 0%
      upserts.push({ user_id: userId, month_utc: monthUtc, referrals_count: cnt, tier, percent });
    }

    if (upserts.length > 0) {
      const { error: upErr } = await supabase.from("partner_tiers").upsert(upserts, { onConflict: "user_id,month_utc" });
      if (upErr) throw upErr;
    }

    // 2) Approve commissions past 14-day hold (still pending)
    const { error: appErr } = await supabase
      .from("commissions")
      .update({ status: "approved" })
      .lte("hold_until", new Date().toISOString())
      .eq("status", "pending");
    if (appErr) throw appErr;

    return res.status(200).json({
      ok: true,
      month_utc: monthUtc,
      partners_evaluated: counts.size,
      commissions_approved: "ok",
    });
  } catch (e) {
    console.error("[partner-monthly] Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

