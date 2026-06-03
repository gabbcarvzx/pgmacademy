alter table public.question_categories
add column if not exists editorial_id text,
add column if not exists source_reference text;

alter table public.question_banks
add column if not exists editorial_id text,
add column if not exists source_reference text;

alter table public.simulation_templates
add column if not exists editorial_id text,
add column if not exists source_reference text;

alter table public.questions
add column if not exists editorial_id text;

alter table public.study_materials
add column if not exists editorial_id text,
add column if not exists source_reference text;

alter table public.flashcards
add column if not exists editorial_id text,
add column if not exists source_reference text;

alter table public.learning_paths
add column if not exists editorial_id text,
add column if not exists slug text,
add column if not exists source_reference text;

alter table public.psychosocial_questions
add column if not exists editorial_id text,
add column if not exists source_reference text;

create unique index if not exists question_categories_editorial_id_uidx
  on public.question_categories (editorial_id)
  where editorial_id is not null;

create unique index if not exists question_banks_editorial_id_uidx
  on public.question_banks (editorial_id)
  where editorial_id is not null;

create unique index if not exists simulation_templates_editorial_id_uidx
  on public.simulation_templates (editorial_id)
  where editorial_id is not null;

create unique index if not exists questions_editorial_id_uidx
  on public.questions (editorial_id)
  where editorial_id is not null;

create unique index if not exists study_materials_editorial_id_uidx
  on public.study_materials (editorial_id)
  where editorial_id is not null;

create unique index if not exists flashcards_editorial_id_uidx
  on public.flashcards (editorial_id)
  where editorial_id is not null;

create unique index if not exists learning_paths_editorial_id_uidx
  on public.learning_paths (editorial_id)
  where editorial_id is not null;

create unique index if not exists learning_paths_slug_uidx
  on public.learning_paths (
    coalesce(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid),
    slug
  )
  where slug is not null;

create unique index if not exists psychosocial_questions_editorial_id_uidx
  on public.psychosocial_questions (editorial_id)
  where editorial_id is not null;
