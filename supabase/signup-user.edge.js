import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normalizePhone = (value) => String(value ?? "").replace(/\D/g, "");
const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let authUserId = null;

  try {
    const { email, password, full_name, phone, ref_code } = await req.json();
    if (!email || !password || !phone) {
      return json({ error: "Missing required fields" }, 400);
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    const normalizedCode =
      typeof ref_code === "string" ? ref_code.trim().toUpperCase() : "";
    const hasValidFormat = Boolean(
      normalizedCode && /^[A-Z0-9]{4,6}$/.test(normalizedCode)
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // 1) Validate existing rows (same behavior as /api/signup-user)
    const { data: existingEmail, error: emailCheckErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (emailCheckErr) throw emailCheckErr;
    if (existingEmail?.id) {
      return json({ error: "This email is already in use." }, 409);
    }

    const { data: existingPhone, error: phoneCheckErr } = await supabase
      .from("users")
      .select("id, email, plan, role")
      .eq("phone", normalizedPhone)
      .maybeSingle();
    if (phoneCheckErr) throw phoneCheckErr;
    if (existingPhone?.email) {
      return json(
        { error: "This phone number is already linked to an account." },
        409
      );
    }

    // 2) Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: full_name || null,
          phone: normalizedPhone,
          referral_code_used: hasValidFormat ? normalizedCode : null,
        },
      });
    if (authError || !authData?.user?.id) {
      throw authError || new Error("Failed to create auth user");
    }
    authUserId = authData.user.id;

    // 3) Link/create profile row
    if (existingPhone?.id && !existingPhone?.email) {
      // Safe linking: move placeholder row to auth user id only if email is still null.
      const { error: linkErr } = await supabase
        .from("users")
        .update({
          id: authUserId,
          email: normalizedEmail,
          full_name: full_name || null,
          phone: normalizedPhone,
          role: existingPhone.role || "client",
          plan: existingPhone.plan || "free",
        })
        .eq("id", existingPhone.id)
        .is("email", null);
      if (linkErr) throw linkErr;
    } else {
      const { error: insertErr } = await supabase.from("users").insert({
        id: authUserId,
        phone: normalizedPhone,
        email: normalizedEmail,
        full_name: full_name || null,
        role: "client",
        plan: "free",
      });
      if (insertErr) throw insertErr;
    }

    // 4) Attach referral (optional, non-blocking)
    if (hasValidFormat) {
      try {
        // Compatibility with both function signatures in existing environments.
        let rpcErr = null;
        const v2 = await supabase.rpc("attach_referral", {
          p_affiliate_code: normalizedCode,
          p_referred_user: authUserId,
        });
        rpcErr = v2.error;

        if (rpcErr) {
          const v1 = await supabase.rpc("attach_referral", {
            p_ref_code: normalizedCode,
            p_referred_user: authUserId,
          });
          rpcErr = v1.error;
        }

        // Final safety net: do manual attribution if RPC is unavailable/mismatched.
        if (rpcErr) {
          const { data: partnerRow, error: partnerErr } = await supabase
            .from("users")
            .select("id")
            .eq("role", "partner")
            .eq("affiliate_code", normalizedCode)
            .maybeSingle();
          if (partnerErr) throw partnerErr;
          if (partnerRow?.id && partnerRow.id !== authUserId) {
            const { error: setErr } = await supabase
              .from("users")
              .update({ ref_code: normalizedCode, is_referred: partnerRow.id })
              .eq("id", authUserId)
              .is("is_referred", null);
            if (setErr) throw setErr;
          }
        }

        if (rpcErr) {
          console.warn("[edge:signup-user] attach_referral failed:", rpcErr.message);
        }
      } catch (e) {
        console.warn("[edge:signup-user] attach_referral/manual fallback exception:", e);
      }
    }

    return json({ ok: true, role: existingPhone?.role ?? "client" }, 200);
  } catch (e) {
    // Roll back auth user if profile write/linking failed after auth creation.
    if (authUserId) {
      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL"),
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
        );
        await supabase.auth.admin.deleteUser(authUserId);
      } catch (cleanupErr) {
        console.warn("[edge:signup-user] rollback deleteUser failed:", cleanupErr);
      }
    }

    return json(
      { error: e instanceof Error ? e.message : "Unexpected error" },
      400
    );
  }
});
