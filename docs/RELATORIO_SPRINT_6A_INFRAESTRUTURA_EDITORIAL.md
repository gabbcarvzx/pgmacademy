# Relatório Sprint 6A - Infraestrutura Editorial PGM Academy

Data: 04/06/2026  
Objetivo: criar a infraestrutura editorial definitiva para suportar importação futura de 400 questões objetivas, materiais premium, 50 subjetivas e 80 psicossociais, sem gerar esse conteúdo nesta sprint.

## Entregas Concluídas

- Matriz editorial oficial criada em código.
- 6 categorias principais estruturadas com subcategorias oficiais.
- Catálogo inicial de competências editoriais criado.
- Padrão oficial de dificuldade com 4 níveis: Fundamentos, Intermediário, Avançado e Competitivo PGM.
- Blueprint editorial do Simulado Objetivo Oficial PGM 2026 criado.
- Blueprint editorial da Academia PGM criado e validado contra os 7 módulos da Sprint 5.
- Contratos técnicos para importação futura das Sprints 6B, 6C e 6D criados.
- Migration incremental para versionamento editorial, competências, blueprints e metadados.
- Tipos locais do Supabase atualizados para as novas tabelas e colunas.
- Teste automatizado da infraestrutura editorial criado.

## Arquivos Alterados

- `src/lib/editorial/taxonomy.ts`: categorias, subcategorias, competências, níveis e versão editorial.
- `src/lib/editorial/blueprints.ts`: blueprint do simulado objetivo, blueprint da Academia e blueprints de revisão manual.
- `src/lib/editorial/import-specs.ts`: contratos de importação para 6B, 6C e 6D.
- `src/lib/editorial/validation.ts`: validação da matriz, competências, blueprints e Academia.
- `tests/editorial-infrastructure.test.ts`: teste automatizado da infraestrutura editorial.
- `package.json`: script `test:editorial`.
- `supabase/migrations/009_editorial_infrastructure.sql`: migration incremental da infraestrutura editorial.
- `src/types/database.ts`: tipos das novas tabelas e colunas.
- `docs/INFRAESTRUTURA_EDITORIAL_PGM_ACADEMY.md`: documentação técnica principal.
- `docs/BLUEPRINT_SIMULADO_OFICIAL_PGM_2026.md`: blueprint editorial do simulado objetivo.
- `docs/BLUEPRINT_ACADEMIA_PGM.md`: blueprint editorial da Academia PGM.
- `docs/ESPECIFICACAO_IMPORTACAO_EDITORIAL_PGM.md`: especificação de importação futura.
- `docs/RELATORIO_SPRINT_6A_INFRAESTRUTURA_EDITORIAL.md`: relatório desta sprint.

## Componentes Alterados

Nenhum componente visual foi alterado.

## Rotas Alteradas

Nenhuma rota foi criada ou alterada.

## Tabelas Alteradas

Novas tabelas:

- `editorial_versions`
- `editorial_competencies`
- `simulation_blueprints`
- `academy_blueprints`

Tabelas existentes com metadados adicionados:

- `question_banks`
- `question_categories`
- `simulation_templates`
- `questions`
- `study_materials`
- `flashcards`
- `learning_paths`
- `psychosocial_questions`

## APIs Alteradas

Nenhuma API REST foi criada ou alterada.

## Migrations Criadas

- `supabase/migrations/009_editorial_infrastructure.sql`

## Blueprint Editorial Criado

- Simulado Objetivo PGM 2026: 30 questões, 240 minutos, distribuição por categoria e por dificuldade.
- Academia PGM: 7 módulos, objetivos, competências, atividades e simulados relacionados.
- Sprint 6B: contrato para 400 questões objetivas.
- Sprint 6C: contrato para materiais premium estruturados.
- Sprint 6D: contrato para 50 subjetivas e 80 psicossociais.

## Segurança

- Nenhuma política existente foi reduzida.
- RLS foi habilitada nas novas tabelas.
- Leitura de metadados ativos liberada apenas para usuários autenticados.
- Gestão editorial restrita a usuários admin via `current_user_role()`.
- Conteúdos futuros continuam com suporte a `tenant_id`, premium access e isolamento por usuário nas tabelas operacionais.
- Nenhuma tentativa, progresso de aluno, pagamento, assinatura ou webhook foi alterado.

## Riscos Encontrados

- O schema legado usa `difficulty` textual; foi criado `editorial_difficulty_level` para evitar breaking change.
- `question_categories` já representa categorias/subcategorias por hierarquia, então não foi criada uma tabela redundante de categorias.
- Competências foram criadas como tabela própria porque o schema anterior não tinha uma entidade editorial auditável para elas.
- A migration cria infraestrutura, mas os importadores das próximas sprints ainda precisarão validar transações, duplicidade e relatórios de falha.

## Testes Executados

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run test:editorial`
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

- Nenhuma rota visual foi criada ou alterada.
- O build de produção manteve as rotas existentes compilando normalmente.
- A infraestrutura foi validada por teste automatizado e por build Next.js.

## Próximos Passos

- Sprint 6B: criar importador e lote de 400 questões objetivas.
- Sprint 6C: criar importador e materiais premium estruturados.
- Sprint 6D: criar importador de subjetivas e psicossociais com rubrica e competências.
- Criar painel administrativo editorial quando houver necessidade operacional de revisão humana em lote.
