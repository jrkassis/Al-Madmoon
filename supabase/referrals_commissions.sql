-- Referral and Commission System Schema
-- Run in Supabase SQL editor or via migration tool.

-- 1) Referrals
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.users(id) on delete cascade,
  referred_user_id uuid unique references public.users(id) on delete cascade,
  referral_code text, -- code used at attribution time (denormalized)
  attribution_model text not null default 'last_click',
  attributed_at timestamptz not null default now(),
  activated_at timestamptz, -- when first successful payment happens
  status text not null default 'pending' check (status in ('pending','active','invalid')),
  invalid_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_referrals_referrer on public.referrals (referrer_user_id);
create index if not exists idx_referrals_referred on public.referrals (referred_user_id);
create index if not exists idx_referrals_status on public.referrals (status);

create or replace function public.set_referrals_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_referrals_updated_at on public.referrals;
create trigger trg_referrals_updated_at
before update on public.referrals
for each row
execute function public.set_referrals_updated_at();

-- 2) Commissions
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.users(id) on delete cascade,
  referred_user_id uuid not null references public.users(id) on delete cascade,
  referral_id uuid references public.referrals(id) on delete set null,
  payment_external_id text not null, -- from provider per billing cycle
  payment_amount numeric not null,
  commission_amount numeric not null,
  commission_percent numeric not null, -- 10, 12.5, 15
  month_utc text not null, -- YYYY-MM used to lock monthly rate
  status text not null default 'pending' check (status in ('pending','approved','paid','refunded')),
  hold_until timestamptz not null, -- 14-day hold
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (payment_external_id) -- idempotency for payouts per cycle
);

create index if not exists idx_commissions_referrer on public.commissions (referrer_user_id);
create index if not exists idx_commissions_status on public.commissions (status);
create index if not exists idx_commissions_month on public.commissions (month_utc);

create or replace function public.set_commissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_commissions_updated_at on public.commissions;
create trigger trg_commissions_updated_at
before update on public.commissions
for each row
execute function public.set_commissions_updated_at();

-- 3) Partner tiers (snapshot monthly)
create table if not exists public.partner_tiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  month_utc text not null, -- YYYY-MM
  referrals_count int4 not null default 0,
  tier text not null check (tier in ('bronze','silver','gold')),
  percent numeric not null, -- 10, 12.5, 15
  created_at timestamptz not null default now(),
  unique (user_id, month_utc)
);

create index if not exists idx_partner_tiers_user_month on public.partner_tiers (user_id, month_utc);

-- 4) Payouts (manual batching)
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  period_month text not null, -- YYYY-MM paid in this batch
  amount numeric not null,
  status text not null default 'initiated' check (status in ('initiated','paid','failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_payouts_user on public.payouts (user_id);
create index if not exists idx_payouts_period on public.payouts (period_month);

-- 5) Helpers
create or replace view public.partner_earnings as
select
  referrer_user_id as user_id,
  sum(case when status = 'pending' then commission_amount else 0 end) as pending_amount,
  sum(case when status = 'approved' then commission_amount else 0 end) as approved_amount,
  sum(case when status = 'paid' then commission_amount else 0 end) as paid_amount
from public.commissions
group by referrer_user_id;

-- 6) Secure recommended RLS (adjust to your policy model)
-- Enable RLS and allow only service role for writes by default.
alter table public.referrals enable row level security;
alter table public.commissions enable row level security;
alter table public.partner_tiers enable row level security;
alter table public.payouts enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='referrals' and policyname='referrals_select_own') then
    create policy referrals_select_own on public.referrals
      for select using (auth.uid() = referrer_user_id or auth.uid() = referred_user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='commissions' and policyname='commissions_select_own') then
    create policy commissions_select_own on public.commissions
      for select using (auth.uid() = referrer_user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='partner_tiers' and policyname='partner_tiers_select_own') then
    create policy partner_tiers_select_own on public.partner_tiers
      for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='payouts' and policyname='payouts_select_own') then
    create policy payouts_select_own on public.payouts
      for select using (auth.uid() = user_id);
  end if;
end $$;

-- Admin/service role should perform inserts/updates.

-- 7) Attach referral utility to be called at signup
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

  -- Source of truth for partner referral code is affiliate_code.
  -- Keep ref_code fallback for legacy data.
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
    -- prevent self-referral
    return;
  end if;

  -- prevent duplicate referrals
  select id into v_existing from public.referrals where referred_user_id = p_referred_user limit 1;
  if v_existing is not null then
    return;
  end if;

  insert into public.referrals (referrer_user_id, referred_user_id, referral_code, status)
  values (v_referrer, p_referred_user, v_code, 'pending');

  -- also write helper pointer into users table for legacy UI
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

