-- Row-Level Security policies for core app tables.
-- This script is idempotent and safe to re-run.

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role
  from public.users u
  where
    u.id = auth.uid()
    or (
      (auth.jwt() ->> 'email') is not null
      and u.email = (auth.jwt() ->> 'email')
    )
  order by case when u.id = auth.uid() then 0 else 1 end
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'admin', false);
$$;

create or replace function public.current_user_phone()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.phone
  from public.users u
  where
    u.id = auth.uid()
    or (
      (auth.jwt() ->> 'email') is not null
      and u.email = (auth.jwt() ->> 'email')
    )
  order by case when u.id = auth.uid() then 0 else 1 end
  limit 1;
$$;

grant execute on function public.current_app_role() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.current_user_phone() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

alter table if exists public.users enable row level security;
alter table if exists public.payments enable row level security;
alter table if exists public.api_costs enable row level security;
alter table if exists public.app_settings enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.partner_wallet_ledger enable row level security;
alter table if exists public.withdraw_requests enable row level security;
alter table if exists public.wallet_trigger_logs enable row level security;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------

drop policy if exists users_admin_all on public.users;
create policy users_admin_all
on public.users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists users_self_select on public.users;
create policy users_self_select
on public.users
for select
to authenticated
using (id = auth.uid());

drop policy if exists users_self_select_by_email on public.users;
create policy users_self_select_by_email
on public.users
for select
to authenticated
using (email = (auth.jwt() ->> 'email'));

drop policy if exists users_partner_read_referred_users on public.users;
create policy users_partner_read_referred_users
on public.users
for select
to authenticated
using (
  public.current_app_role() = 'partner'
  and (
    id = auth.uid()
    or is_referred::text = auth.uid()::text
    or (role = 'partner' and affiliate_code is not null)
  )
);

drop policy if exists users_insert_own_profile on public.users;
create policy users_insert_own_profile
on public.users
for insert
to authenticated
with check (
  id = auth.uid()
);

drop policy if exists users_self_update on public.users;
create policy users_self_update
on public.users
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = public.current_app_role()
);

drop policy if exists users_self_delete on public.users;
create policy users_self_delete
on public.users
for delete
to authenticated
using (id = auth.uid());

-- Required by current app flow:
-- - signup screens check duplicates by email/phone
-- - sign-in by phone resolves phone -> email
-- - partner onboarding checks affiliate_code availability
drop policy if exists users_anon_select_for_auth_flows on public.users;
create policy users_anon_select_for_auth_flows
on public.users
for select
to anon
using (true);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------

drop policy if exists payments_admin_all on public.payments;
create policy payments_admin_all
on public.payments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists payments_owner_read on public.payments;
create policy payments_owner_read
on public.payments
for select
to authenticated
using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- api_costs
-- ---------------------------------------------------------------------------

drop policy if exists api_costs_admin_read on public.api_costs;
create policy api_costs_admin_read
on public.api_costs
for select
to authenticated
using (public.is_admin());

drop policy if exists api_costs_owner_read_by_phone on public.api_costs;
create policy api_costs_owner_read_by_phone
on public.api_costs
for select
to authenticated
using (
  user_phone is not null
  and user_phone = public.current_user_phone()
);

-- ---------------------------------------------------------------------------
-- app_settings
-- ---------------------------------------------------------------------------

drop policy if exists app_settings_admin_all on public.app_settings;
create policy app_settings_admin_all
on public.app_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists app_settings_partner_read_own_keys on public.app_settings;
create policy app_settings_partner_read_own_keys
on public.app_settings
for select
to authenticated
using (
  key = 'partner_commission_percent'
  or key = ('partner_commission_override:' || auth.uid()::text)
  or key = ('partner_paypal_email:' || auth.uid()::text)
);

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------

drop policy if exists contact_messages_public_insert on public.contact_messages;
create policy contact_messages_public_insert
on public.contact_messages
for insert
to anon, authenticated
with check (true);

grant insert on table public.contact_messages to anon, authenticated, service_role;
grant select, update, delete on table public.contact_messages to authenticated, service_role;

drop policy if exists contact_messages_admin_select on public.contact_messages;
create policy contact_messages_admin_select
on public.contact_messages
for select
to authenticated
using (public.is_admin());

drop policy if exists contact_messages_admin_update on public.contact_messages;
create policy contact_messages_admin_update
on public.contact_messages
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists contact_messages_admin_delete on public.contact_messages;
create policy contact_messages_admin_delete
on public.contact_messages
for delete
to authenticated
using (public.is_admin());

-- ---------------------------------------------------------------------------
-- partner_wallet_ledger
-- ---------------------------------------------------------------------------

drop policy if exists partner_wallet_ledger_admin_all on public.partner_wallet_ledger;
create policy partner_wallet_ledger_admin_all
on public.partner_wallet_ledger
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists partner_wallet_ledger_partner_read_own on public.partner_wallet_ledger;
create policy partner_wallet_ledger_partner_read_own
on public.partner_wallet_ledger
for select
to authenticated
using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- withdraw_requests
-- ---------------------------------------------------------------------------

drop policy if exists withdraw_requests_admin_all on public.withdraw_requests;
create policy withdraw_requests_admin_all
on public.withdraw_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists withdraw_requests_partner_read_own on public.withdraw_requests;
create policy withdraw_requests_partner_read_own
on public.withdraw_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists withdraw_requests_partner_insert_own on public.withdraw_requests;
create policy withdraw_requests_partner_insert_own
on public.withdraw_requests
for insert
to authenticated
with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- wallet_trigger_logs
-- ---------------------------------------------------------------------------

drop policy if exists wallet_trigger_logs_admin_read on public.wallet_trigger_logs;
create policy wallet_trigger_logs_admin_read
on public.wallet_trigger_logs
for select
to authenticated
using (public.is_admin());
