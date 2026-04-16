// api/signup-user.js
// Vercel Serverless Function — POST /api/signup-user
// Creates a normal client auth/profile user and optionally locks referral attribution.

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

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phone).trim();

    // 1) Pre-check existing public.users rows
    const { data: existingEmail, error: emailCheckErr } = await supabase
      .from("users")
      .select("id, phone")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (emailCheckErr) {
      return res.status(500).json({ error: emailCheckErr.message || "Could not validate email" });
    }
    if (existingEmail?.id) {
      return res.status(409).json({ error: "This email is already in use." });
    }

    const { data: existingPhone, error: phoneCheckErr } = await supabase
      .from("users")
      .select("id, email, plan, total_messages, daily_messages, last_message_date, is_blocked")
      .eq("phone", normalizedPhone)
      .maybeSingle();
    if (phoneCheckErr) {
      return res.status(500).json({ error: phoneCheckErr.message || "Could not validate phone number" });
    }
    if (existingPhone?.email) {
      return res.status(409).json({ error: "This phone number is already linked to an account." });
    }

    // 2) Create auth user
    const { data: signUp, error: signUpErr } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || null, phone: normalizedPhone },
    });
    if (signUpErr) {
      return res.status(400).json({ error: signUpErr.message || "Could not create auth user" });
    }
    const userId = signUp.user?.id;
    if (!userId) return res.status(500).json({ error: "No user id returned" });

    // 3) Link/create profile row
    // If phone exists with no email, attach this new auth user to that existing row.
    if (existingPhone?.id && !existingPhone?.email) {
      const { error: linkErr } = await supabase
        .from("users")
        .update({
          id: userId,
          email: normalizedEmail,
          full_name: full_name || null,
          phone: normalizedPhone,
          role: "client",
          plan: existingPhone.plan || "free",
        })
        .eq("id", existingPhone.id)
        .is("email", null);
      if (linkErr) {
        return res.status(500).json({
          error:
            linkErr.message ||
            "Could not link this signup to the existing phone record.",
        });
      }
    } else {
      const { error: upErr } = await supabase.from("users").upsert(
        {
          id: userId,
          email: normalizedEmail,
          phone: normalizedPhone,
          full_name: full_name || null,
          role: "client",
          plan: "free",
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (upErr) {
        return res.status(500).json({ error: upErr.message || "Could not create profile" });
      }
    }

    // 4) Lock referral if provided and valid (prevents self + duplicate)
    const safeRef = typeof ref_code === "string" ? ref_code.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6) : null;
    if (safeRef) {
      try {
        // Compatibility with both function signatures in existing environments.
        let rpcError = null;
        const v2 = await supabase.rpc("attach_referral", {
          p_affiliate_code: safeRef,
          p_referred_user: userId,
        });
        rpcError = v2.error;

        if (rpcError) {
          const v1 = await supabase.rpc("attach_referral", {
            p_ref_code: safeRef,
            p_referred_user: userId,
          });
          rpcError = v1.error;
        }

        // Final safety net: do manual attribution if RPC is unavailable/mismatched.
        if (rpcError) {
          const { data: partnerRow, error: partnerErr } = await supabase
            .from("users")
            .select("id")
            .eq("role", "partner")
            .eq("affiliate_code", safeRef)
            .maybeSingle();
          if (partnerErr) throw partnerErr;
          if (partnerRow?.id && partnerRow.id !== userId) {
            const { error: setErr } = await supabase
              .from("users")
              .update({ ref_code: safeRef, is_referred: partnerRow.id })
              .eq("id", userId)
              .is("is_referred", null);
            if (setErr) throw setErr;
          }
        }
      } catch (e) {
        // Keep signup successful but log referral attribution failure.
        console.warn("[signup-user] attach_referral/manual fallback failed:", e?.message ?? e);
      }
    }

    return res.status(200).json({ ok: true, user_id: userId, role: existingPhone?.role || "client" });
  } catch (e) {
    console.error("[signup-user] Error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

