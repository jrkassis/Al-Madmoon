// api/whish-status.js
// Vercel Serverless Function — POST /api/whish-status
// Polls Whish for the status of a transaction by externalId

const BASE_URL =
  process.env.WHISH_BASE_URL || "https://api.sandbox.whish.money/itel-service/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { externalId } = req.body;

  if (!externalId) {
    return res.status(400).json({ error: "externalId is required." });
  }

  const originSite =
    process.env.SITE_URL ||
    `https://${req.headers.host}`;
  const websiteHeader =
    process.env.WHISH_WEBSITE_URL || originSite;

  try {
    const whishRes = await fetch(`${BASE_URL}/payment/collect/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        channel: process.env.WHISH_CHANNEL,
        secret: process.env.WHISH_SECRET,
        websiteUrl: websiteHeader,
        "User-Agent": "Whish/1.0 (https://whish.money; support@whish.money)",
      },
      body: JSON.stringify({ externalId, currency: "USD" }),
    });

    const data = await whishRes.json();

    if (!data.status) {
      return res.status(502).json({
        error: "Whish API returned failure",
        code: data.code,
        dialog: data.dialog,
      });
    }

    // collectStatus: "success" | "failed" | "pending"
    const response = {
      collectStatus: data.data.collectStatus,
      payerPhoneNumber: data.data.payerPhoneNumber,
    };

    // Best-effort: update payment status in Supabase
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        const upsertRes = await supabase.from("payments").upsert({
          external_id: String(externalId),
          status: data.data.collectStatus,
          payer_phone: data.data.payerPhoneNumber ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "external_id" });

        // If payment succeeded and we know the payer phone, update user's plan from the stored payment row
        if (data.data.collectStatus === "success" && data.data.payerPhoneNumber) {
          const { data: payRow } = await supabase
            .from("payments")
            .select("plan")
            .eq("external_id", String(externalId))
            .single();
          if (payRow?.plan) {
            await supabase
              .from("users")
              .update({ plan: payRow.plan })
              .eq("phone", data.data.payerPhoneNumber);
          }
        }
      }
    } catch (e) {
      console.warn("[whish-status] Supabase logging skipped:", e?.message ?? e);
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("[whish-status] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
