# Relatorio Sprint 6F - Pipeline de Importacao dos Materiais Profundos

Data: 14/06/2026  
Objetivo: incluir os 19 materiais profundos da Sprint 6F no pipeline editorial consumido por `npm run content:import`, sem executar gravacao no Supabase.

## Resumo Executivo

O problema estava no catalogo central, nao no importador do Supabase. Os 19 materiais eram carregados e validados por scripts especificos das Sprints 6F.1 a 6F.5, mas `loadApprovedContent()` continuava retornando somente os 12 materiais da Etapa 8F.

O catalogo aprovado agora agrega os dois lotes:

- 12 materiais da Etapa 8F.
- 19 materiais profundos da Sprint 6F.
- 31 materiais no dry-run completo.

Nenhum `--execute` foi utilizado. O Supabase permanece com os 12 materiais antigos e 0 dos 19 materiais profundos.

## Localizacao dos 19 Materiais

Manifestos editoriais:

- `scripts/content/deep-materials-sprint-6f1.ts`: 4 materiais de ingles.
- `scripts/content/deep-materials-sprint-6f2.ts`: 3 materiais de ingles.
- `scripts/content/deep-materials-sprint-6f3.ts`: 3 materiais de ingles.
- `scripts/content/deep-materials-sprint-6f4.ts`: 2 materiais de ingles.
- `scripts/content/deep-materials-sprint-6f5.ts`: 7 materiais de espanhol.

Conteudo Markdown:

- `content/study-materials/pgm-2026-v2/*.md`

Identificadores:

- Ingles: `MAT-DEEP-EN-001` a `MAT-DEEP-EN-012`.
- Espanhol: `MAT-DEEP-ES-001` a `MAT-DEEP-ES-007`.

## Implementacao

### Catalogo unificado

Foi criado `scripts/content/deep-materials.ts`, que converte os contratos das cinco sprints para `MaterialSeed`, o formato ja utilizado pelo importador existente.

`scripts/content/approved-content.ts` passou a retornar:

- `materials: 12 + 19`.
- A categoria editorial espanhola `vocabulario`, necessaria para vincular corretamente o material de falsos cognatos.

O executor de importacao nao precisou ser alterado. Ele continua usando o mesmo fluxo de upsert, resolucao de categorias e integridade editorial existente.

### Source reference

Foi centralizada a constante:

`Autoral PGM Academy - Sprint 6F Deep Materials`

Todos os 19 materiais usam exatamente esse `source_reference`. Os 12 materiais antigos preservam:

`Autoral PGM Academy - Etapa 8F`

### Validacao de integridade

O catalogo local agora exige:

- 31 materiais totais.
- 12 materiais da Etapa 8F.
- 19 materiais da Sprint 6F.
- IDs e slugs unicos.
- Categoria valida para cada material.
- Fonte editorial correta por lote.
- Os 19 materiais profundos mantidos como Premium.

`content:validate-imported` foi ajustado para distinguir catalogo preparado de importacao realizada:

- `0/19`: estado valido antes do `--execute`.
- `19/19`: estado valido depois de uma futura importacao completa.
- Qualquer quantidade entre 1 e 18: lote parcial e validacao rejeitada.

## Arquivos Criados

- `scripts/content/deep-materials-constants.ts`
- `scripts/content/deep-materials.ts`
- `docs/SPRINT_6F_IMPORT_MATERIALS_REPORT.md`

## Arquivos Alterados

- `scripts/content/approved-content.ts`
- `scripts/content/deep-materials-sprint-6f1.ts`
- `scripts/content/deep-materials-sprint-6f2.ts`
- `scripts/content/deep-materials-sprint-6f3.ts`
- `scripts/content/deep-materials-sprint-6f4.ts`
- `scripts/content/deep-materials-sprint-6f5.ts`
- `scripts/validate-imported-content.ts`

## Resultado do Dry-run

`npm run content:import` apresentou:

```text
Categorias totais: 21
Materiais: 31 (12 Etapa 8F + 19 Sprint 6F)
Source reference Sprint 6F: Autoral PGM Academy - Sprint 6F Deep Materials
Dry-run concluido.
```

A contagem 31 e intencional: o pipeline importa o catalogo consolidado e inclui os 12 materiais antigos para upsert idempotente, somados aos 19 novos.

## Estado do Supabase

`npm run content:validate-imported` confirmou:

```text
Materiais: 12
Materiais profundos Sprint 6F no banco: 0/19
```

Esse e o estado esperado, pois a execucao real foi explicitamente adiada. A validacao de RLS existente continuou passando e os usuarios temporarios usados pelo validador foram removidos ao final.

## Validacoes Executadas

- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run content:validate`: passou.
- `npm run content:import`: passou em dry-run; nenhuma gravacao realizada.
- `npm run content:validate-imported`: passou; banco confirmado em 0/19 para a Sprint 6F.

## Restricoes Preservadas

- Nenhuma migration criada.
- Nenhuma alteracao de schema ou dado persistente.
- Nenhuma alteracao em autenticacao ou RLS.
- Nenhuma alteracao em pagamentos.
- Nenhuma alteracao no Mentor IA.
- Nenhuma alteracao em simulados.
- Nenhuma alteracao em regras de negocio da plataforma.

## Proximo Passo

Quando houver autorizacao explicita para gravar, executar `npm run content:import -- --execute` em ambiente controlado e repetir `npm run content:validate-imported`. O segundo comando devera informar `19/19`; qualquer lote parcial sera tratado como falha.
