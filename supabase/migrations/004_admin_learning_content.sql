alter table public.question_banks
drop constraint if exists question_banks_language_check;

alter table public.question_banks
add constraint question_banks_language_check
check (language in ('english', 'spanish', 'portuguese', 'mixed', 'psychosocial'));
