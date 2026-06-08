alter table public.questions
add column if not exists title text;

create index if not exists questions_title_search_idx
  on public.questions (tenant_id, title)
  where title is not null;
