# PGM Academy - Importacao Editorial

Status: Etapa 8G
Origem editorial: `docs/CONTENT_SCALE_REVIEW.md`
Registro de autoria: `Autoral PGM Academy - Etapa 8F`

## Objetivo

Transformar o lote aprovado da Etapa 8F em importacao segura, idempotente e revisavel no Supabase.

O documento editorial continua sendo a fonte de revisao. O script le o Markdown aprovado, valida contagens e relacionamentos, e so grava no banco quando executado com `--execute`.

## Arquivos

- `supabase/migrations/005_content_import_metadata.sql`: adiciona `editorial_id`, `source_reference` e `slug` em tabelas que precisam de importacao idempotente.
- `scripts/content/approved-content.ts`: parser e validador do lote aprovado.
- `scripts/validate-approved-content.ts`: valida o lote localmente.
- `scripts/import-approved-content.ts`: importa ou atualiza o conteudo no Supabase.
- `scripts/validate-imported-content.ts`: valida contagens, relacionamentos, idempotencia e acesso free/premium no Supabase real.

## Ordem Segura

1. Aplicar a migration `005_content_import_metadata.sql` no Supabase.
2. Rodar validacao local:

```bash
npm run content:validate
```

3. Rodar dry-run da importacao:

```bash
npm run content:import
```

4. Executar importacao real:

```bash
npm run content:import -- --execute
```

5. Validar o conteudo importado e as regras de acesso:

```bash
npm run content:validate-imported
```

## Idempotencia

A importacao usa `editorial_id` como chave editorial em:

- `question_categories`
- `question_banks`
- `simulation_templates`
- `questions`
- `study_materials`
- `flashcards`
- `learning_paths`
- `psychosocial_questions`

As alternativas objetivas usam a chave existente `(question_id, option_label)`.

Os itens de trilha sao recriados por trilha a cada execucao para refletir exatamente o documento aprovado, sem duplicar itens.

Para provar idempotencia operacional, rode:

```bash
npm run content:import -- --execute
npm run content:validate-imported
```

## Free e Premium

- Bancos de questoes e simulados derivados do lote 8F sao premium.
- Materiais mantem o campo `is_premium` aprovado no documento editorial.
- Conteudo global usa `tenant_id = null`.
- Dados de aluno, tentativas e respostas continuam isolados por tenant e usuario via RLS.
- A validacao importada cria usuarios temporarios gratuito e premium, testa visibilidade via RLS e remove os usuarios ao final.

## Aviso Editorial

Todo conteudo importado deve manter:

- autoria da PGM Academy;
- independencia da plataforma, sem vinculo oficial com o Governo de Pernambuco;
- orientacao para consultar edital vigente e canais oficiais quando houver regra, prazo, chamada ou documento.
