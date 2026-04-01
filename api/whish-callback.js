// api/whish-callback.js
// Vercel Serverless Function — GET /api/whish-callback
//
// Whish calls this URL after a transaction completes (server-side notification).
// Add your DB/subscription activation logic in the success block below.

export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { status, externalId } = req.query;
  
    console.log("[whish-callback] Received:", { status, externalId });
  
    if (status === "success") {
      // Best-effort: mark payment/subscription as active in Supabase if configured
      try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
          await supabase.from("payments").upsert({
            external_id: String(externalId),
            status: "success",
            updated_at: new Date().toISOString(),
          }, { onConflict: "external_id" });
          // Optionally also flip a subscriptions table if you have one:
          // await supabase.from("subscriptions").update({ active: true, activated_at: new Date().toISOString() }).eq("external_id", externalId);

          // Try to fetch payer phone from Whish and update the correct user plan
          try {
            const BASE_URL = process.env.WHISH_BASE_URL || "https://api.sandbox.whish.money/itel-service/api";
            const originSite = process.env.SITE_URL || `https://${req.headers.host}`;
            const websiteHeader = process.env.WHISH_WEBSITE_URL || originSite;
            const resp = await fetch(`${BASE_URL}/payment/collect/status`, {
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
            const data = await resp.json();
            if (data?.status && data?.data?.payerPhoneNumber) {
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
          } catch (e) {
            console.warn("[whish-callback] Could not update user plan from status:", e?.message ?? e);
          }
        }
      } catch (e) {
        console.warn("[whish-callback] Supabase update skipped:", e?.message ?? e);
      }
      console.log(`[whish-callback] SUCCESS — externalId=${externalId}`);
      return res.status(200).json({ received: true, status: "success" });
    }
  
    if (status === "failure") {
      try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
          await supabase.from("payments").upsert({
            external_id: String(externalId),
            status: "failed",
            updated_at: new Date().toISOString(),
          }, { onConflict: "external_id" });
        }
      } catch (e) {
        console.warn("[whish-callback] Supabase update skipped:", e?.message ?? e);
      }
      console.warn(`[whish-callback] FAILURE — externalId=${externalId}`);
      return res.status(200).json({ received: true, status: "failure" });
    }
  
    console.warn("[whish-callback] Unknown status:", status);
    return res.status(200).json({ received: true, status: "unknown" });
  }
