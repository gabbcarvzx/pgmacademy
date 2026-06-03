create table if not exists public.subjective_attempts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_text text not null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'returned')),
  score numeric(5,2),
  max_score numeric(5,2) not null default 10,
  feedback text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(answer_text) between 20 and 12000),
  check (max_score > 0),
  check (score is null or (score >= 0 and score <= max_score)),
  check (
    (status = 'pending' and score is null and feedback is null and reviewed_by is null and reviewed_at is null)
    or (status in ('reviewed', 'returned') and reviewed_by is not null and reviewed_at is not null)
  )
);

create table if not exists public.psychosocial_attempts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  psychosocial_question_id uuid not null references public.psychosocial_questions(id) on delete cascade,
  answer_text text not null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'returned')),
  score numeric(5,2),
  max_score numeric(5,2) not null default 10,
  feedback text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(answer_text) between 20 and 12000),
  check (max_score > 0),
  check (score is null or (score >= 0 and score <= max_score)),
  check (
    (status = 'pending' and score is null and feedback is null and reviewed_by is null and reviewed_at is null)
    or (status in ('reviewed', 'returned') and reviewed_by is not null and reviewed_at is not null)
  )
);

create index if not exists subjective_attempts_user_status_idx
  on public.subjective_attempts (tenant_id, user_id, status, created_at desc);

create index if not exists subjective_attempts_review_queue_idx
  on public.subjective_attempts (tenant_id, status, created_at desc);

create index if not exists subjective_attempts_question_idx
  on public.subjective_attempts (question_id, created_at desc);

create index if not exists psychosocial_attempts_user_status_idx
  on public.psychosocial_attempts (tenant_id, user_id, status, created_at desc);

create index if not exists psychosocial_attempts_review_queue_idx
  on public.psychosocial_attempts (tenant_id, status, created_at desc);

create index if not exists psychosocial_attempts_question_idx
  on public.psychosocial_attempts (psychosocial_question_id, created_at desc);

drop trigger if exists subjective_attempts_set_updated_at on public.subjective_attempts;
create trigger subjective_attempts_set_updated_at
before update on public.subjective_attempts
for each row execute function public.set_updated_at();

drop trigger if exists psychosocial_attempts_set_updated_at on public.psychosocial_attempts;
create trigger psychosocial_attempts_set_updated_at
before update on public.psychosocial_attempts
for each row execute function public.set_updated_at();

alter table public.subjective_attempts enable row level security;
alter table public.psychosocial_attempts enable row level security;

drop policy if exists "users can read own subjective attempts" on public.subjective_attempts;
create policy "users can read own subjective attempts"
on public.subjective_attempts for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (tenant_id = public.current_tenant_id() and user_id = auth.uid())
);

drop policy if exists "paid users can create own subjective attempts" on public.subjective_attempts;
create policy "paid users can create own subjective attempts"
on public.subjective_attempts for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
  and public.has_paid_access()
  and status = 'pending'
  and score is null
  and feedback is null
  and reviewed_by is null
  and reviewed_at is null
  and exists (
    select 1
    from public.questions question
    join public.question_banks bank on bank.id = question.bank_id
    where question.id = subjective_attempts.question_id
      and question.type = 'subjective'
      and question.is_active = true
      and (question.tenant_id is null or question.tenant_id = public.current_tenant_id())
      and bank.is_active = true
      and (bank.tenant_id is null or bank.tenant_id = public.current_tenant_id())
      and (bank.is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can review subjective attempts" on public.subjective_attempts;
create policy "admins can review subjective attempts"
on public.subjective_attempts for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "admins can manage subjective attempts" on public.subjective_attempts;
create policy "admins can manage subjective attempts"
on public.subjective_attempts for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "users can read own psychosocial attempts" on public.psychosocial_attempts;
create policy "users can read own psychosocial attempts"
on public.psychosocial_attempts for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (tenant_id = public.current_tenant_id() and user_id = auth.uid())
);

drop policy if exists "paid users can create own psychosocial attempts" on public.psychosocial_attempts;
create policy "paid users can create own psychosocial attempts"
on public.psychosocial_attempts for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and user_id = auth.uid()
  and public.has_paid_access()
  and status = 'pending'
  and score is null
  and feedback is null
  and reviewed_by is null
  and reviewed_at is null
  and exists (
    select 1
    from public.psychosocial_questions question
    where question.id = psychosocial_attempts.psychosocial_question_id
      and question.is_active = true
      and (question.tenant_id is null or question.tenant_id = public.current_tenant_id())
      and (question.is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can review psychosocial attempts" on public.psychosocial_attempts;
create policy "admins can review psychosocial attempts"
on public.psychosocial_attempts for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "admins can manage psychosocial attempts" on public.psychosocial_attempts;
create policy "admins can manage psychosocial attempts"
on public.psychosocial_attempts for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

revoke all on public.subjective_attempts from anon;
revoke all on public.psychosocial_attempts from anon;
revoke all on public.subjective_attempts from authenticated;
revoke all on public.psychosocial_attempts from authenticated;

grant select, insert, update on public.subjective_attempts to authenticated;
grant select, insert, update on public.psychosocial_attempts to authenticated;
