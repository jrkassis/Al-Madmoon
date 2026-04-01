-- Payments table for Whish integration
create table if not exists public.payments (
  external_id text primary key,
  status text not null,
  amount numeric,
  currency text,
  invoice text,
  plan text,
  billing text,
  payer_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_payer_phone_idx on public.payments (payer_phone);

-- Row Level Security left to project defaults; tighten as needed.
-- Recommended: service role writes only; anonymous read none.

