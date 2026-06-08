# Relatório Sprint 6B.1 - Pipeline de Importação Editorial

Data: 04/06/2026  
Objetivo: criar um pipeline administrativo/local para receber, validar, simular e importar arquivos editoriais de questões objetivas, sem gerar ou importar as 400 questões nesta sprint.

## Entregas Concluídas

- Formato oficial de importação definido para JSON, CSV e Markdown estruturado.
- Parser editorial criado para os três formatos.
- Validador editorial criado com erros, avisos e erros críticos.
- Dry-run criado, sem alteração de banco.
- Importador real criado com bloqueio global quando o arquivo possui itens inválidos.
- Reexecução segura: questões existentes são ignoradas sem `--update`.
- Modo update criado para atualizar questão existente quando explicitamente solicitado.
- Relatórios de importação gerados em `docs/import-reports/`.
- Testes automatizados do pipeline criados.
- Guia operacional de importação criado.
- Preparação documentada para o Lote 1 da Sprint 6B.2: Inglês Reading Comprehension.

## Arquivos Criados

- `src/lib/editorial/import/types.ts`
- `src/lib/editorial/import/parsers.ts`
- `src/lib/editorial/import/validation.ts`
- `src/lib/editorial/import/runner.ts`
- `src/lib/editorial/import/memory-repository.ts`
- `src/lib/editorial/import/supabase-repository.ts`
- `scripts/editorial-import.ts`
- `tests/editorial-import.test.ts`
- `docs/GUIA_IMPORTACAO_EDITORIAL.md`
- `docs/import-reports/.gitkeep`
- `docs/RELATORIO_SPRINT_6B_1_PIPELINE_IMPORTACAO_EDITORIAL.md`
- `supabase/migrations/010_question_import_title.sql`

## Arquivos Alterados

- `package.json`: scripts `editorial:import` e `test:editorial-import`.
- `src/types/database.ts`: campo `title` adicionado ao contrato de `questions`.

## Scripts Adicionados

- `npm run editorial:import`
- `npm run test:editorial-import`

## Migration Criada

- `supabase/migrations/010_question_import_title.sql`

Justificativa: o formato oficial exige `title` por questão e a tabela `questions` não possuía campo equivalente. A migration adiciona coluna nullable, sem alterar comportamento existente.

## Formato Final de Importação

Cada questão deve possuir:

- `id`
- `title`
- `statement`
- `language`
- `category`
- `subcategory`
- `competence`
- `difficulty_level`
- `options`
- `correct_answer`
- `explanation`
- `tags`
- `editorial_version`
- `source_reference`
- `is_premium`
- `status`

## Validações Implementadas

- ID único.
- 4 ou 5 alternativas.
- Apenas uma alternativa correta.
- Gabarito obrigatório.
- Alternativa correta existente.
- Explicação obrigatória.
- Categoria válida.
- Subcategoria válida.
- Competência válida.
- Dificuldade válida.
- Idioma válido.
- Tags obrigatórias.
- Enunciado muito curto.
- Explicação rasa.
- Versão editorial válida.
- Bloqueio de importação real quando o arquivo contém itens inválidos.

## Banco de Dados

Tabelas reutilizadas:

- `questions`
- `question_options`
- `question_banks`
- `question_categories`
- `editorial_versions`
- `editorial_competencies`

Nenhuma tabela operacional de aluno foi alterada.

## Segurança

- Pipeline executado apenas como ferramenta administrativa/local.
- Nenhuma rota pública criada.
- Nenhuma API criada.
- Dry-run não altera banco.
- Importação real exige `SUPABASE_SERVICE_ROLE_KEY`.
- Premium access, RLS, `tenant_id`, `user_id`, pagamentos e tentativas existentes foram preservados.

## Riscos Encontrados

- O modo `--update` substitui alternativas da questão para evitar opções duplicadas; deve ser usado com cautela em conteúdo que já teve tentativas reais.
- Dry-run offline não consulta duplicidade no Supabase; para simulação com criados/atualizados reais, usar dry-run com variáveis Supabase configuradas.
- Importação real bloqueia o arquivo inteiro se houver qualquer questão inválida, priorizando integridade editorial.

## Instruções para Importar o Lote 1

Sprint 6B.2:

- 50 questões.
- Categoria: `english`.
- Subcategoria: `reading-comprehension`.
- Competências sugeridas:
  - `eng-identify-main-idea`
  - `eng-infer-implicit-information`
  - `eng-contextual-vocabulary`
- Dificuldade: níveis 1 a 4.
- Versão editorial: `pgm-2026-v1`.
- Tags mínimas: `sprint-6b-2`, `reading`, habilidade específica.

Dry-run:

```bash
npm run editorial:import -- --file caminho/do/lote-1.json
```

Importação real:

```bash
npm run editorial:import -- --file caminho/do/lote-1.json --execute
```

Atualização explícita:

```bash
npm run editorial:import -- --file caminho/do/lote-1.json --execute --update
```

## Testes Executados

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run test:editorial`
- `npm run test:editorial-import`
- `npm run test:academy`
- `npm run test:mission`
- `npm run test:success-center`
- `npm run test:official-simulations`
- `npm run test:simulations`
- `npm run test:mentor`
- `npm run test:eligibility`
- `npm run test:analytics`
- `npm run content:validate`

## Validação Local

- O pipeline foi validado por testes automatizados com repositório em memória.
- O dry-run foi testado sem mutação de estado.
- A importação real foi simulada sem acessar Supabase.
- A reexecução foi testada sem duplicidade.
- O build de produção confirmou que nenhuma rota existente foi quebrada.
