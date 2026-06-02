create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'asaas'
    check (provider in ('asaas')),
  event_id text not null,
  event_type text not null,
  provider_payment_id text,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processed', 'ignored', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

create index if not exists payment_events_tenant_created_idx
on public.payment_events (tenant_id, created_at desc);

create index if not exists payment_events_subscription_created_idx
on public.payment_events (subscription_id, created_at desc);

create index if not exists payment_events_provider_payment_idx
on public.payment_events (provider, provider_payment_id);

alter table public.payment_events enable row level security;

drop policy if exists "tenant members can read payment events" on public.payment_events;
create policy "tenant members can read payment events"
on public.payment_events for select
to authenticated
using (tenant_id = public.current_tenant_id());

revoke all on public.payment_events from anon;
revoke insert, update, delete on public.payment_events from authenticated;
grant select on public.payment_events to authenticated;

revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

revoke insert, update, delete on public.subscriptions from authenticated;
