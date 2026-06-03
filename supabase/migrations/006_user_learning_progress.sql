create table if not exists public.user_learning_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id uuid references public.learning_paths(id) on delete cascade,
  item_type text not null
    check (item_type in ('study_material', 'flashcard', 'question', 'psychosocial_question', 'simulation_template')),
  item_id uuid not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (completed = false and completed_at is null)
    or (completed = true and completed_at is not null)
  )
);

create unique index if not exists user_learning_progress_user_path_item_uidx
  on public.user_learning_progress (
    user_id,
    coalesce(path_id, '00000000-0000-0000-0000-000000000000'::uuid),
    item_type,
    item_id
  );

create index if not exists user_learning_progress_tenant_user_idx
  on public.user_learning_progress (tenant_id, user_id, completed, updated_at desc);

create index if not exists user_learning_progress_path_idx
  on public.user_learning_progress (path_id, item_type, item_id);

drop trigger if exists user_learning_progress_set_updated_at on public.user_learning_progress;
create trigger user_learning_progress_set_updated_at
before update on public.user_learning_progress
for each row execute function public.set_updated_at();

alter table public.user_learning_progress enable row level security;

drop policy if exists "users can read own learning progress" on public.user_learning_progress;
create policy "users can read own learning progress"
on public.user_learning_progress for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (tenant_id = public.current_tenant_id() and user_id = auth.uid())
);

drop policy if exists "users can insert own learning progress" on public.user_learning_progress;
create policy "users can insert own learning progress"
on public.user_learning_progress for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
);

drop policy if exists "users can update own learning progress" on public.user_learning_progress;
create policy "users can update own learning progress"
on public.user_learning_progress for update
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
)
with check (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
);

drop policy if exists "admins can manage learning progress" on public.user_learning_progress;
create policy "admins can manage learning progress"
on public.user_learning_progress for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

revoke all on public.user_learning_progress from anon;
revoke all on public.user_learning_progress from authenticated;
grant select on public.user_learning_progress to authenticated;
