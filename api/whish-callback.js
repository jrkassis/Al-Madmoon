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
      // ─────────────────────────────────────────────────────────────────────
      // TODO: Add your subscription activation logic here, for example:
      //
      //   const { createClient } = await import("@supabase/supabase-js");
      //   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      //
      //   await supabase
      //     .from("subscriptions")
      //     .update({ active: true, activated_at: new Date().toISOString() })
      //     .eq("external_id", externalId);
      //
      // ─────────────────────────────────────────────────────────────────────
      console.log(`[whish-callback] SUCCESS — externalId=${externalId}`);
      return res.status(200).json({ received: true, status: "success" });
    }
  
    if (status === "failure") {
      console.warn(`[whish-callback] FAILURE — externalId=${externalId}`);
      return res.status(200).json({ received: true, status: "failure" });
    }
  
    console.warn("[whish-callback] Unknown status:", status);
    return res.status(200).json({ received: true, status: "unknown" });
  }