-- Run this once in Supabase SQL editor to fix referral attribution.
-- It recreates attach_referral() and keeps the existing argument name
-- p_affiliate_code for RPC compatibility.
-- It updates attach_referral() to:
-- 1) match partner codes using users.affiliate_code (with legacy ref_code fallback),
-- 2) correctly set users.is_referred when null,
-- 3) set users.ref_code when empty.

drop function if exists public.attach_referral(text, uuid);

create function public.attach_referral(p_affiliate_code text, p_referred_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referrer uuid;
  v_existing uuid;
  v_code text;
begin
  v_code := upper(trim(coalesce(p_affiliate_code, '')));
  if v_code = '' then
    return;
  end if;

  select id
  into v_referrer
  from public.users
  where role = 'partner'
    and (
      upper(trim(coalesce(affiliate_code, ''))) = v_code
      or upper(trim(coalesce(ref_code, ''))) = v_code
    )
  limit 1;
  if v_referrer is null then
    return;
  end if;

  if v_referrer = p_referred_user then
    return;
  end if;

  select id
  into v_existing
  from public.referrals
  where referred_user_id = p_referred_user
  limit 1;
  if v_existing is not null then
    return;
  end if;

  insert into public.referrals (referrer_user_id, referred_user_id, referral_code, status)
  values (v_referrer, p_referred_user, v_code, 'pending');

  update public.users
  set
    is_referred = v_referrer,
    ref_code = case
      when coalesce(trim(ref_code), '') = '' then v_code
      else ref_code
    end
  where id = p_referred_user
    and is_referred is null;
end;
$$;
