create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tenant_type text not null default 'personal'
    check (tenant_type in ('personal', 'school', 'partner')),
  status text not null default 'active'
    check (status in ('active', 'blocked')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  full_name text,
  email text,
  role text not null default 'student'
    check (role in ('student', 'mentor', 'admin')),
  access_status text not null default 'free'
    check (access_status in ('free', 'paid', 'blocked', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'asaas'
    check (provider in ('asaas')),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'overdue', 'blocked', 'refunded')),
  access_model text not null default 'one_time'
    check (access_model in ('one_time')),
  price_cents integer not null default 2990,
  currency text not null default 'BRL'
    check (currency in ('BRL')),
  provider_customer_id text,
  provider_payment_id text,
  paid_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create table if not exists public.eligibility_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('eligible', 'partial', 'ineligible')),
  readiness_score integer not null check (readiness_score between 0 and 100),
  birth_date date not null,
  school_year text not null check (school_year in ('first', 'second', 'other')),
  has_state_school_enrollment boolean not null,
  has_active_siepe_enrollment boolean not null,
  is_excluded_school boolean not null,
  attendance_percent numeric(5, 2) not null check (attendance_percent between 0 and 100),
  portuguese_average numeric(4, 2) not null check (portuguese_average between 0 and 10),
  math_average numeric(4, 2) not null check (math_average between 0 and 10),
  humanities_average numeric(4, 2) not null check (humanities_average between 0 and 10),
  has_partial_progression boolean not null,
  was_previously_selected boolean not null,
  result_details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists tenants_created_by_idx on public.tenants (created_by);
create index if not exists profiles_tenant_id_id_idx on public.profiles (tenant_id, id);
create index if not exists subscriptions_tenant_user_idx on public.subscriptions (tenant_id, user_id);
create index if not exists subscriptions_provider_payment_idx on public.subscriptions (provider, provider_payment_id);
create index if not exists eligibility_tenant_user_created_idx on public.eligibility_assessments (tenant_id, user_id, created_at desc);
create index if not exists audit_logs_tenant_created_idx on public.audit_logs (tenant_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tenants_set_updated_at on public.tenants;
create trigger tenants_set_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.current_tenant_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  profile_name text;
begin
  profile_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'Aluno PGM');

  insert into public.tenants (name, tenant_type, created_by)
  values (profile_name, 'personal', new.id)
  returning id into new_tenant_id;

  insert into public.profiles (id, tenant_id, full_name, email, role, access_status)
  values (
    new.id,
    new_tenant_id,
    profile_name,
    new.email,
    'student',
    'free'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.eligibility_assessments enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "tenant members can read own tenant" on public.tenants;
create policy "tenant members can read own tenant"
on public.tenants for select
to authenticated
using (id = public.current_tenant_id());

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "users can update own profile basics" on public.profiles;
create policy "users can update own profile basics"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and tenant_id = public.current_tenant_id()
  and role = public.current_user_role()
);

drop policy if exists "tenant members can read subscriptions" on public.subscriptions;
create policy "tenant members can read subscriptions"
on public.subscriptions for select
to authenticated
using (tenant_id = public.current_tenant_id() and user_id = auth.uid());

drop policy if exists "tenant members can read eligibility assessments" on public.eligibility_assessments;
create policy "tenant members can read eligibility assessments"
on public.eligibility_assessments for select
to authenticated
using (tenant_id = public.current_tenant_id() and user_id = auth.uid());

drop policy if exists "tenant members can insert eligibility assessments" on public.eligibility_assessments;
create policy "tenant members can insert eligibility assessments"
on public.eligibility_assessments for insert
to authenticated
with check (tenant_id = public.current_tenant_id() and user_id = auth.uid());

drop policy if exists "tenant members can read audit logs" on public.audit_logs;
create policy "tenant members can read audit logs"
on public.audit_logs for select
to authenticated
using (tenant_id = public.current_tenant_id());

revoke all on public.audit_logs from anon;
revoke all on public.subscriptions from anon;
revoke all on public.eligibility_assessments from anon;

revoke insert, update, delete on public.tenants from anon, authenticated;
revoke insert, update, delete on public.profiles from anon, authenticated;
revoke insert, update, delete on public.subscriptions from anon, authenticated;
revoke update, delete on public.eligibility_assessments from anon, authenticated;
revoke insert, update, delete on public.audit_logs from anon, authenticated;

grant select on public.tenants to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant select on public.subscriptions to authenticated;
grant select, insert on public.eligibility_assessments to authenticated;
grant select on public.audit_logs to authenticated;
