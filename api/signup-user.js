// api/signup-user.js
// Vercel Serverless Function — POST /api/signup-user
// Creates a Supabase auth user + profile row and locks referral via public.attach_referral

function generateAffiliateCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { email, password, full_name, phone, ref_code } = req.body || {};
    if (!email || !password || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: "Supabase credentials missing" });
    }
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // 1) Create auth user
    const { data: signUp, error: signUpErr } = await supabase.auth.admin.createUser({
      email: String(email).toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || null, phone },
    });
    if (signUpErr) {
      return res.status(400).json({ error: signUpErr.message || "Could not create auth user" });
    }
    const userId = signUp.user?.id;
    if (!userId) return res.status(500).json({ error: "No user id returned" });

    // 2) Ensure unique affiliate code
    let affiliate_code = generateAffiliateCode();
    for (let i = 0; i < 5; i++) {
      const { data: exists } = await supabase
        .from("users")
        .select("id")
        .eq("affiliate_code", affiliate_code)
        .maybeSingle();
      if (!exists) break;
      affiliate_code = generateAffiliateCode();
    }

    // 3) Upsert profile row
    const { error: upErr } = await supabase.from("users").upsert({
      id: userId,
      email: String(email).toLowerCase(),
      phone: String(phone),
      full_name: full_name || null,
      role: "partner",
      plan: "free",
      affiliate_code,
      ref_code: affiliate_code, // keep same as affiliate code for sharing
      created_at: new Date().toISOString(),
    }, { onConflict: "id" });
    if (upErr) {
      return res.status(500).json({ error: upErr.message || "Could not create profile" });
    }

    // 4) Lock referral if provided and valid (prevents self + duplicate)
    const safeRef = typeof ref_code === "string" ? ref_code.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6) : null;
    if (safeRef) {
      try {
        await supabase.rpc("attach_referral", { p_ref_code: safeRef, p_referred_user: userId });
      } catch (e) {
        // soft-fail; logging only
        console.warn("[signup-user] attach_referral failed:", e?.message ?? e);
      }
    }

    return res.status(200).json({ ok: true, user_id: userId, role: "partner" });
  } catch (e) {
    console.error("[signup-user] Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

