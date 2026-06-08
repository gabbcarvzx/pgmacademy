create table if not exists public.student_onboarding (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  idioma text not null check (idioma in ('english', 'spanish')),
  ano_escolar text not null check (ano_escolar in ('first', 'second', 'third')),
  tempo_disponivel text not null check (tempo_disponivel in ('15m', '30m', '1h', '2h_plus')),
  ja_participou_pgm boolean not null default false,
  objetivo_principal text not null
    check (
      objetivo_principal in (
        'improve_english',
        'improve_spanish',
        'pass_exam',
        'improve_writing',
        'improve_interview'
      )
    ),
  onboarding_completed boolean not null default true,
  plan_version text not null default 'pgm-2026-v1',
  plan jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
  
create index if not exists student_onboarding_tenant_user_idx
  on public.student_onboarding (tenant_id, user_id, onboarding_completed, updated_at desc);

drop trigger if exists student_onboarding_set_updated_at on public.student_onboarding;
create trigger student_onboarding_set_updated_at
before update on public.student_onboarding
for each row execute function public.set_updated_at();

alter table public.student_onboarding enable row level security;

drop policy if exists "users can read own student onboarding" on public.student_onboarding;
create policy "users can read own student onboarding"
on public.student_onboarding for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (tenant_id = public.current_tenant_id() and user_id = auth.uid())
);

drop policy if exists "paid users can create own student onboarding" on public.student_onboarding;
create policy "paid users can create own student onboarding"
on public.student_onboarding for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
  and exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.tenant_id = student_onboarding.tenant_id
      and profile.access_status = 'paid'
  )
);

drop policy if exists "paid users can update own student onboarding" on public.student_onboarding;
create policy "paid users can update own student onboarding"
on public.student_onboarding for update
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
)
with check (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
  and exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.tenant_id = student_onboarding.tenant_id
      and profile.access_status = 'paid'
  )
);

drop policy if exists "admins can manage student onboarding" on public.student_onboarding;
create policy "admins can manage student onboarding"
on public.student_onboarding for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

revoke all on public.student_onboarding from anon;
revoke all on public.student_onboarding from authenticated;
grant select, insert, update on public.student_onboarding to authenticated;
