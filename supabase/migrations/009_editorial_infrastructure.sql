create table if not exists public.editorial_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  edital_year integer not null check (edital_year >= 2026),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'deprecated')),
  source_reference text not null,
  official_source_url text,
  summary text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_competencies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null default '',
  category_slug text not null,
  subcategory_slug text not null,
  language text not null
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.simulation_blueprints (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  editorial_version_id uuid not null references public.editorial_versions(id) on delete restrict,
  title text not null,
  simulation_type text not null
    check (simulation_type in ('objective', 'subjective', 'psychosocial')),
  language text not null default 'mixed'
    check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial')),
  total_items integer not null check (total_items > 0),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  distribution jsonb not null default '{}'::jsonb,
  minimum_competency_codes text[] not null default array[]::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_blueprints (
  id uuid primary key default gen_random_uuid(),
  editorial_version_id uuid not null references public.editorial_versions(id) on delete restrict,
  module_id text not null,
  module_order integer not null check (module_order > 0),
  title text not null,
  objectives jsonb not null default '[]'::jsonb,
  competency_codes text[] not null default array[]::text[],
  contents jsonb not null default '[]'::jsonb,
  activities jsonb not null default '[]'::jsonb,
  related_simulation_codes text[] not null default array[]::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (editorial_version_id, module_id)
);

alter table public.question_banks
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists tags text[] not null default array[]::text[];

alter table public.question_categories
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists tags text[] not null default array[]::text[];

alter table public.simulation_templates
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists blueprint_id uuid references public.simulation_blueprints(id) on delete set null,
add column if not exists tags text[] not null default array[]::text[];

alter table public.questions
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists primary_competency_id uuid references public.editorial_competencies(id) on delete set null,
add column if not exists editorial_difficulty_level smallint
  check (editorial_difficulty_level is null or editorial_difficulty_level between 1 and 4),
add column if not exists tags text[] not null default array[]::text[];

alter table public.study_materials
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists primary_competency_id uuid references public.editorial_competencies(id) on delete set null,
add column if not exists editorial_difficulty_level smallint
  check (editorial_difficulty_level is null or editorial_difficulty_level between 1 and 4),
add column if not exists tags text[] not null default array[]::text[],
add column if not exists material_structure jsonb not null default '{}'::jsonb;

alter table public.flashcards
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists primary_competency_id uuid references public.editorial_competencies(id) on delete set null,
add column if not exists editorial_difficulty_level smallint
  check (editorial_difficulty_level is null or editorial_difficulty_level between 1 and 4),
add column if not exists tags text[] not null default array[]::text[];

alter table public.learning_paths
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists academy_blueprint_id uuid references public.academy_blueprints(id) on delete set null,
add column if not exists tags text[] not null default array[]::text[];

alter table public.psychosocial_questions
add column if not exists editorial_version_id uuid references public.editorial_versions(id) on delete set null,
add column if not exists primary_competency_id uuid references public.editorial_competencies(id) on delete set null,
add column if not exists editorial_difficulty_level smallint
  check (editorial_difficulty_level is null or editorial_difficulty_level between 1 and 4),
add column if not exists tags text[] not null default array[]::text[];

create index if not exists editorial_versions_status_idx
  on public.editorial_versions (status, edital_year desc);

create index if not exists editorial_competencies_category_idx
  on public.editorial_competencies (category_slug, subcategory_slug, language, is_active);

create index if not exists simulation_blueprints_version_active_idx
  on public.simulation_blueprints (editorial_version_id, is_active, simulation_type);

create index if not exists academy_blueprints_version_order_idx
  on public.academy_blueprints (editorial_version_id, module_order);

create index if not exists question_banks_editorial_version_idx
  on public.question_banks (editorial_version_id, tenant_id, is_active);

create index if not exists question_categories_editorial_version_idx
  on public.question_categories (editorial_version_id, tenant_id, language);

create index if not exists simulation_templates_blueprint_idx
  on public.simulation_templates (blueprint_id, tenant_id, is_active);

create index if not exists questions_editorial_metadata_idx
  on public.questions (
    editorial_version_id,
    primary_competency_id,
    editorial_difficulty_level,
    tenant_id,
    is_active
  );

create index if not exists study_materials_editorial_metadata_idx
  on public.study_materials (
    editorial_version_id,
    primary_competency_id,
    editorial_difficulty_level,
    tenant_id,
    is_active
  );

create index if not exists flashcards_editorial_metadata_idx
  on public.flashcards (
    editorial_version_id,
    primary_competency_id,
    editorial_difficulty_level,
    tenant_id,
    is_active
  );

create index if not exists learning_paths_academy_blueprint_idx
  on public.learning_paths (academy_blueprint_id, tenant_id, is_active);

create index if not exists psychosocial_questions_editorial_metadata_idx
  on public.psychosocial_questions (
    editorial_version_id,
    primary_competency_id,
    editorial_difficulty_level,
    tenant_id,
    is_active
  );

drop trigger if exists editorial_versions_set_updated_at on public.editorial_versions;
create trigger editorial_versions_set_updated_at
before update on public.editorial_versions
for each row execute function public.set_updated_at();

drop trigger if exists editorial_competencies_set_updated_at on public.editorial_competencies;
create trigger editorial_competencies_set_updated_at
before update on public.editorial_competencies
for each row execute function public.set_updated_at();

drop trigger if exists simulation_blueprints_set_updated_at on public.simulation_blueprints;
create trigger simulation_blueprints_set_updated_at
before update on public.simulation_blueprints
for each row execute function public.set_updated_at();

drop trigger if exists academy_blueprints_set_updated_at on public.academy_blueprints;
create trigger academy_blueprints_set_updated_at
before update on public.academy_blueprints
for each row execute function public.set_updated_at();

alter table public.editorial_versions enable row level security;
alter table public.editorial_competencies enable row level security;
alter table public.simulation_blueprints enable row level security;
alter table public.academy_blueprints enable row level security;

drop policy if exists "authenticated can read active editorial versions" on public.editorial_versions;
create policy "authenticated can read active editorial versions"
on public.editorial_versions for select
to authenticated
using (public.current_user_role() = 'admin' or status = 'active');

drop policy if exists "admins can manage editorial versions" on public.editorial_versions;
create policy "admins can manage editorial versions"
on public.editorial_versions for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "authenticated can read active editorial competencies" on public.editorial_competencies;
create policy "authenticated can read active editorial competencies"
on public.editorial_competencies for select
to authenticated
using (public.current_user_role() = 'admin' or is_active = true);

drop policy if exists "admins can manage editorial competencies" on public.editorial_competencies;
create policy "admins can manage editorial competencies"
on public.editorial_competencies for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "authenticated can read active simulation blueprints" on public.simulation_blueprints;
create policy "authenticated can read active simulation blueprints"
on public.simulation_blueprints for select
to authenticated
using (public.current_user_role() = 'admin' or is_active = true);

drop policy if exists "admins can manage simulation blueprints" on public.simulation_blueprints;
create policy "admins can manage simulation blueprints"
on public.simulation_blueprints for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "authenticated can read active academy blueprints" on public.academy_blueprints;
create policy "authenticated can read active academy blueprints"
on public.academy_blueprints for select
to authenticated
using (public.current_user_role() = 'admin' or is_active = true);

drop policy if exists "admins can manage academy blueprints" on public.academy_blueprints;
create policy "admins can manage academy blueprints"
on public.academy_blueprints for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

revoke all on public.editorial_versions from anon;
revoke all on public.editorial_competencies from anon;
revoke all on public.simulation_blueprints from anon;
revoke all on public.academy_blueprints from anon;

revoke all on public.editorial_versions from authenticated;
revoke all on public.editorial_competencies from authenticated;
revoke all on public.simulation_blueprints from authenticated;
revoke all on public.academy_blueprints from authenticated;

grant select, insert, update, delete on public.editorial_versions to authenticated;
grant select, insert, update, delete on public.editorial_competencies to authenticated;
grant select, insert, update, delete on public.simulation_blueprints to authenticated;
grant select, insert, update, delete on public.academy_blueprints to authenticated;

insert into public.editorial_versions (
  code,
  title,
  edital_year,
  status,
  source_reference,
  summary,
  published_at
)
values (
  'pgm-2026-v1',
  'PGM Academy 2026 - Matriz Editorial Oficial',
  2026,
  'active',
  'Edital PGM 2026 e base oficial centralizada da Sprint 1',
  'Versão editorial base para categorias, competências, simulados, Academia PGM e importações das Sprints 6B, 6C e 6D.',
  now()
)
on conflict (code) do update set
  title = excluded.title,
  edital_year = excluded.edital_year,
  status = excluded.status,
  source_reference = excluded.source_reference,
  summary = excluded.summary,
  updated_at = now();
