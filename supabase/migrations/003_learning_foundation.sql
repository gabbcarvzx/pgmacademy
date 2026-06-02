create table if not exists public.question_banks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed')),
  is_premium boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  parent_id uuid references public.question_categories(id) on delete set null,
  name text not null,
  slug text not null,
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  bank_id uuid not null references public.question_banks(id) on delete cascade,
  category_id uuid references public.question_categories(id) on delete set null,
  type text not null
    check (type in ('objective', 'subjective', 'psychosocial')),
  difficulty text not null default 'intermediate'
    check (difficulty in ('beginner', 'intermediate', 'advanced', 'mixed')),
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  statement text not null,
  explanation text,
  source_reference text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  option_label text not null,
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (question_id, option_label)
);

create table if not exists public.simulation_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  type text not null default 'quick'
    check (type in ('quick', 'full')),
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  total_questions integer not null check (total_questions >= 0),
  is_premium boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.simulation_templates(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric(8, 2) check (score is null or score >= 0),
  percentage numeric(5, 2) check (percentage is null or percentage between 0 and 100),
  status text not null default 'started'
    check (status in ('started', 'completed', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.simulation_answers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  attempt_id uuid not null references public.simulation_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  selected_option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean,
  points numeric(8, 2) not null default 0 check (points >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table if not exists public.study_materials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  category_id uuid references public.question_categories(id) on delete set null,
  title text not null,
  slug text not null,
  content_md text not null default '',
  difficulty text not null default 'intermediate'
    check (difficulty in ('beginner', 'intermediate', 'advanced', 'mixed')),
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  estimated_time integer not null default 0 check (estimated_time >= 0),
  is_premium boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  category_id uuid references public.question_categories(id) on delete set null,
  front_content text not null,
  back_content text not null,
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  difficulty text not null default 'intermediate'
    check (difficulty in ('beginner', 'intermediate', 'advanced', 'mixed')),
  is_premium boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  is_premium boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_path_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  path_id uuid not null references public.learning_paths(id) on delete cascade,
  item_type text not null
    check (item_type in ('question', 'study_material', 'flashcard', 'simulation_template', 'psychosocial_question')),
  item_id uuid not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (path_id, item_type, item_id)
);

create table if not exists public.psychosocial_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  category text not null,
  question text not null,
  ideal_answer_guidelines text,
  common_mistakes text,
  is_premium boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists question_banks_tenant_active_idx
  on public.question_banks (tenant_id, is_active, language);
create unique index if not exists question_categories_tenant_language_slug_uidx
  on public.question_categories (
    coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid),
    language,
    slug
  );
create index if not exists question_categories_parent_idx
  on public.question_categories (parent_id);
create index if not exists questions_tenant_bank_category_idx
  on public.questions (tenant_id, bank_id, category_id, is_active);
create index if not exists question_options_tenant_question_idx
  on public.question_options (tenant_id, question_id);
create index if not exists simulation_templates_tenant_active_idx
  on public.simulation_templates (tenant_id, is_active, type, language);
create index if not exists simulation_attempts_tenant_user_started_idx
  on public.simulation_attempts (tenant_id, user_id, started_at desc);
create index if not exists simulation_attempts_template_idx
  on public.simulation_attempts (template_id);
create index if not exists simulation_answers_tenant_attempt_idx
  on public.simulation_answers (tenant_id, attempt_id);
create index if not exists simulation_answers_question_idx
  on public.simulation_answers (question_id);
create unique index if not exists study_materials_tenant_slug_uidx
  on public.study_materials (
    coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid),
    slug
  );
create index if not exists study_materials_tenant_category_idx
  on public.study_materials (tenant_id, category_id, is_active);
create index if not exists flashcards_tenant_category_idx
  on public.flashcards (tenant_id, category_id, is_active);
create index if not exists learning_paths_tenant_active_idx
  on public.learning_paths (tenant_id, is_active, language);
create index if not exists learning_path_items_tenant_path_idx
  on public.learning_path_items (tenant_id, path_id, sort_order);
create index if not exists psychosocial_questions_tenant_category_idx
  on public.psychosocial_questions (tenant_id, category, is_active);

drop trigger if exists question_banks_set_updated_at on public.question_banks;
create trigger question_banks_set_updated_at
before update on public.question_banks
for each row execute function public.set_updated_at();

drop trigger if exists question_categories_set_updated_at on public.question_categories;
create trigger question_categories_set_updated_at
before update on public.question_categories
for each row execute function public.set_updated_at();

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

drop trigger if exists question_options_set_updated_at on public.question_options;
create trigger question_options_set_updated_at
before update on public.question_options
for each row execute function public.set_updated_at();

drop trigger if exists simulation_templates_set_updated_at on public.simulation_templates;
create trigger simulation_templates_set_updated_at
before update on public.simulation_templates
for each row execute function public.set_updated_at();

drop trigger if exists simulation_attempts_set_updated_at on public.simulation_attempts;
create trigger simulation_attempts_set_updated_at
before update on public.simulation_attempts
for each row execute function public.set_updated_at();

drop trigger if exists simulation_answers_set_updated_at on public.simulation_answers;
create trigger simulation_answers_set_updated_at
before update on public.simulation_answers
for each row execute function public.set_updated_at();

drop trigger if exists study_materials_set_updated_at on public.study_materials;
create trigger study_materials_set_updated_at
before update on public.study_materials
for each row execute function public.set_updated_at();

drop trigger if exists flashcards_set_updated_at on public.flashcards;
create trigger flashcards_set_updated_at
before update on public.flashcards
for each row execute function public.set_updated_at();

drop trigger if exists learning_paths_set_updated_at on public.learning_paths;
create trigger learning_paths_set_updated_at
before update on public.learning_paths
for each row execute function public.set_updated_at();

drop trigger if exists learning_path_items_set_updated_at on public.learning_path_items;
create trigger learning_path_items_set_updated_at
before update on public.learning_path_items
for each row execute function public.set_updated_at();

drop trigger if exists psychosocial_questions_set_updated_at on public.psychosocial_questions;
create trigger psychosocial_questions_set_updated_at
before update on public.psychosocial_questions
for each row execute function public.set_updated_at();

create or replace function public.has_paid_access()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and access_status = 'paid'
  )
$$;

alter table public.question_banks enable row level security;
alter table public.question_categories enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.simulation_templates enable row level security;
alter table public.simulation_attempts enable row level security;
alter table public.simulation_answers enable row level security;
alter table public.study_materials enable row level security;
alter table public.flashcards enable row level security;
alter table public.learning_paths enable row level security;
alter table public.learning_path_items enable row level security;
alter table public.psychosocial_questions enable row level security;

drop policy if exists "students can read available question banks" on public.question_banks;
create policy "students can read available question banks"
on public.question_banks for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and (is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage question banks" on public.question_banks;
create policy "admins can manage question banks"
on public.question_banks for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read question categories" on public.question_categories;
create policy "students can read question categories"
on public.question_categories for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or tenant_id is null
  or tenant_id = public.current_tenant_id()
);

drop policy if exists "admins can manage question categories" on public.question_categories;
create policy "admins can manage question categories"
on public.question_categories for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available questions" on public.questions;
create policy "students can read available questions"
on public.questions for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and exists (
      select 1
      from public.question_banks bank
      where bank.id = questions.bank_id
        and bank.is_active = true
        and (bank.tenant_id is null or bank.tenant_id = public.current_tenant_id())
        and (bank.is_premium = false or public.has_paid_access())
    )
  )
);

drop policy if exists "admins can manage questions" on public.questions;
create policy "admins can manage questions"
on public.questions for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available question options" on public.question_options;
create policy "students can read available question options"
on public.question_options for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    (tenant_id is null or tenant_id = public.current_tenant_id())
    and exists (
    select 1
    from public.questions question
    join public.question_banks bank on bank.id = question.bank_id
    where question.id = question_options.question_id
      and question.is_active = true
      and (question.tenant_id is null or question.tenant_id = public.current_tenant_id())
      and bank.is_active = true
      and (bank.tenant_id is null or bank.tenant_id = public.current_tenant_id())
      and (bank.is_premium = false or public.has_paid_access())
    )
  )
);

drop policy if exists "admins can manage question options" on public.question_options;
create policy "admins can manage question options"
on public.question_options for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available simulation templates" on public.simulation_templates;
create policy "students can read available simulation templates"
on public.simulation_templates for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and (is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage simulation templates" on public.simulation_templates;
create policy "admins can manage simulation templates"
on public.simulation_templates for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read own simulation attempts" on public.simulation_attempts;
create policy "students can read own simulation attempts"
on public.simulation_attempts for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (tenant_id = public.current_tenant_id() and user_id = auth.uid())
);

drop policy if exists "students can read own simulation answers" on public.simulation_answers;
create policy "students can read own simulation answers"
on public.simulation_answers for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.simulation_attempts attempt
    where attempt.id = simulation_answers.attempt_id
      and attempt.tenant_id = public.current_tenant_id()
      and attempt.user_id = auth.uid()
  )
);

drop policy if exists "students can read available study materials" on public.study_materials;
create policy "students can read available study materials"
on public.study_materials for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and (is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage study materials" on public.study_materials;
create policy "admins can manage study materials"
on public.study_materials for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available flashcards" on public.flashcards;
create policy "students can read available flashcards"
on public.flashcards for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and (is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage flashcards" on public.flashcards;
create policy "admins can manage flashcards"
on public.flashcards for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available learning paths" on public.learning_paths;
create policy "students can read available learning paths"
on public.learning_paths for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and (is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage learning paths" on public.learning_paths;
create policy "admins can manage learning paths"
on public.learning_paths for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available learning path items" on public.learning_path_items;
create policy "students can read available learning path items"
on public.learning_path_items for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or exists (
    select 1
    from public.learning_paths path
    where path.id = learning_path_items.path_id
      and path.is_active = true
      and (path.tenant_id is null or path.tenant_id = public.current_tenant_id())
      and (path.is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage learning path items" on public.learning_path_items;
create policy "admins can manage learning path items"
on public.learning_path_items for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "students can read available psychosocial questions" on public.psychosocial_questions;
create policy "students can read available psychosocial questions"
on public.psychosocial_questions for select
to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    is_active = true
    and (tenant_id is null or tenant_id = public.current_tenant_id())
    and (is_premium = false or public.has_paid_access())
  )
);

drop policy if exists "admins can manage psychosocial questions" on public.psychosocial_questions;
create policy "admins can manage psychosocial questions"
on public.psychosocial_questions for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

revoke all on public.question_banks from anon;
revoke all on public.question_categories from anon;
revoke all on public.questions from anon;
revoke all on public.question_options from anon;
revoke all on public.simulation_templates from anon;
revoke all on public.simulation_attempts from anon;
revoke all on public.simulation_answers from anon;
revoke all on public.study_materials from anon;
revoke all on public.flashcards from anon;
revoke all on public.learning_paths from anon;
revoke all on public.learning_path_items from anon;
revoke all on public.psychosocial_questions from anon;

revoke all on public.question_banks from authenticated;
revoke all on public.question_categories from authenticated;
revoke all on public.questions from authenticated;
revoke all on public.question_options from authenticated;
revoke all on public.simulation_templates from authenticated;
revoke all on public.simulation_attempts from authenticated;
revoke all on public.simulation_answers from authenticated;
revoke all on public.study_materials from authenticated;
revoke all on public.flashcards from authenticated;
revoke all on public.learning_paths from authenticated;
revoke all on public.learning_path_items from authenticated;
revoke all on public.psychosocial_questions from authenticated;

grant select, insert, update, delete on public.question_banks to authenticated;
grant select, insert, update, delete on public.question_categories to authenticated;
grant select, insert, update, delete on public.questions to authenticated;
grant select, insert, update, delete on public.question_options to authenticated;
grant select, insert, update, delete on public.simulation_templates to authenticated;
grant select on public.simulation_attempts to authenticated;
grant select on public.simulation_answers to authenticated;
grant select, insert, update, delete on public.study_materials to authenticated;
grant select, insert, update, delete on public.flashcards to authenticated;
grant select, insert, update, delete on public.learning_paths to authenticated;
grant select, insert, update, delete on public.learning_path_items to authenticated;
grant select, insert, update, delete on public.psychosocial_questions to authenticated;

insert into public.question_categories (tenant_id, parent_id, name, slug, language)
values
  (null, null, 'Reading Comprehension', 'reading-comprehension', 'english'),
  (null, null, 'Vocabulary', 'vocabulary', 'english'),
  (null, null, 'Grammar', 'grammar', 'english'),
  (null, null, 'Verb Tenses', 'verb-tenses', 'english'),
  (null, null, 'Modal Verbs', 'modal-verbs', 'english'),
  (null, null, 'Conditionals', 'conditionals', 'english'),
  (null, null, 'Phrasal Verbs', 'phrasal-verbs', 'english'),
  (null, null, 'Everyday English', 'everyday-english', 'english'),
  (null, null, 'Comprension Lectora', 'comprension-lectora', 'spanish'),
  (null, null, 'Vocabulario', 'vocabulario', 'spanish'),
  (null, null, 'Gramatica', 'gramatica', 'spanish'),
  (null, null, 'Verbos', 'verbos', 'spanish'),
  (null, null, 'Interpretacion', 'interpretacion', 'spanish'),
  (null, null, 'Autoconhecimento', 'autoconhecimento', 'psychosocial'),
  (null, null, 'Lideranca', 'lideranca', 'psychosocial'),
  (null, null, 'Trabalho em Equipe', 'trabalho-em-equipe', 'psychosocial'),
  (null, null, 'Adaptabilidade', 'adaptabilidade', 'psychosocial'),
  (null, null, 'Inteligencia Emocional', 'inteligencia-emocional', 'psychosocial'),
  (null, null, 'Diversidade Cultural', 'diversidade-cultural', 'psychosocial'),
  (null, null, 'Responsabilidade', 'responsabilidade', 'psychosocial')
on conflict do nothing;
