// api/whish-status.js
// Vercel Serverless Function — POST /api/whish-status
// Polls Whish for the status of a transaction by externalId

const BASE_URL =
  process.env.WHISH_BASE_URL || "https://api.sandbox.whish.money/itel-service/api";

function digitsOnlyPhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizePaymentStatus(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["success", "succeeded", "completed", "paid"].includes(raw)) return "success";
  if (["failed", "failure", "declined", "cancelled", "canceled"].includes(raw)) return "failed";
  return "pending";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Guard: required environment variables
  if (!process.env.WHISH_CHANNEL || !process.env.WHISH_SECRET) {
    console.error("[whish-status] Missing WHISH_CHANNEL or WHISH_SECRET in environment");
    return res.status(500).json({
      error: "Payment processor credentials are not configured.",
    });
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
    console.log("[whish-status] Poll start", { externalId: String(externalId) });
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
    console.log("[whish-status] Whish response", {
      externalId: String(externalId),
      httpStatus: whishRes.status,
      apiStatus: data?.status,
      rawCollectStatus: data?.data?.collectStatus ?? null,
      hasPayerPhone: Boolean(data?.data?.payerPhoneNumber),
    });

    if (!data.status) {
      console.warn("[whish-status] Whish error", {
        httpStatus: whishRes.status,
        code: data.code,
        dialog: data.dialog,
      });
      return res.status(502).json({
        error: "Whish API returned failure",
        code: data.code,
        dialog: data.dialog,
      });
    }

    // collectStatus: "success" | "failed" | "pending"
    const normalizedCollectStatus = normalizePaymentStatus(data?.data?.collectStatus);
    const response = {
      collectStatus: normalizedCollectStatus,
      rawCollectStatus: data?.data?.collectStatus ?? null,
      payerPhoneNumber: data.data.payerPhoneNumber,
    };

    // Best-effort: update payment status in Supabase
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        const payerPhoneRaw = data?.data?.payerPhoneNumber ?? null;
        const payerPhone = digitsOnlyPhone(payerPhoneRaw) || null;

        let matchedUserId = null;
        if (payerPhone) {
          const phoneCandidates = [
            payerPhone,
            payerPhone.replace(/^0+/, ""),
          ].filter(Boolean);
          const uniquePhoneCandidates = [...new Set(phoneCandidates)];

          const { data: byPhoneUser } = await supabase
            .from("users")
            .select("id")
            .in("phone", uniquePhoneCandidates)
            .limit(1)
            .maybeSingle();
          matchedUserId = byPhoneUser?.id ?? null;
        }

        if (!matchedUserId) {
          const { data: existingPayment } = await supabase
            .from("payments")
            .select("user_id")
            .eq("external_id", String(externalId))
            .maybeSingle();
          matchedUserId = existingPayment?.user_id ?? null;
        }

        const { error: upsertError } = await supabase.from("payments").upsert({
          external_id: String(externalId),
          status: normalizedCollectStatus,
          payer_phone: payerPhone,
          user_id: matchedUserId,
          updated_at: new Date().toISOString(),
        }, { onConflict: "external_id" });
        if (upsertError) throw upsertError;
        console.log("[whish-status] Payments upsert ok", {
          externalId: String(externalId),
          normalizedCollectStatus,
          matchedUserId,
        });

        // If payment succeeded, update the right user's plan using user_id first, phone as fallback.
        if (normalizedCollectStatus === "success") {
          const { data: payRow } = await supabase
            .from("payments")
            .select("plan,user_id,payer_phone")
            .eq("external_id", String(externalId))
            .single();
          if (payRow?.plan) {
            if (payRow.user_id) {
              const { error: uErr } = await supabase
                .from("users")
                .update({ plan: payRow.plan })
                .eq("id", payRow.user_id);
              if (uErr) throw uErr;
            } else if (payRow.payer_phone) {
              const payPhone = digitsOnlyPhone(payRow.payer_phone);
              const payPhoneCandidates = [
                payPhone,
                payPhone.replace(/^0+/, ""),
              ].filter(Boolean);
              const { error: uErr } = await supabase
                .from("users")
                .update({ plan: payRow.plan })
                .in("phone", [...new Set(payPhoneCandidates)]);
              if (uErr) throw uErr;
            }
            console.log("[whish-status] User plan update attempted", {
              externalId: String(externalId),
              plan: payRow.plan,
              hasUserId: Boolean(payRow.user_id),
            });
          }
        }
      }
    } catch (e) {
      console.warn("[whish-status] Supabase update failed", {
        externalId: String(externalId),
        error: e?.message ?? e,
      });
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("[whish-status] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
