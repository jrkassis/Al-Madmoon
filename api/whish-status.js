// api/whish-status.js
// Vercel Serverless Function — POST /api/whish-status
// Polls Whish for the status of a transaction by externalId

const BASE_URL =
  process.env.WHISH_BASE_URL || "https://api.whish.money/itel-service/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { externalId } = req.body;

  if (!externalId) {
    return res.status(400).json({ error: "externalId is required." });
  }

  const origin =
    process.env.VITE_SITE_URL ||
    `https://${req.headers.host}`;

  try {
    const whishRes = await fetch(`${BASE_URL}/payment/collect/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        channel: process.env.WHISH_CHANNEL,
        secret: process.env.WHISH_SECRET,
        websiteUrl: origin,
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
    return res.status(200).json({
      collectStatus: data.data.collectStatus,
      payerPhoneNumber: data.data.payerPhoneNumber,
    });
  } catch (err) {
    console.error("[whish-status] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}