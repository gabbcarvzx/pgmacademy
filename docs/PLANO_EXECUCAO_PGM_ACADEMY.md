# Plano de Execucao PGM Academy

Data: 04/06/2026  
Papel: CTO e Head of Product  
Objetivo: transformar a PGM Academy de MVP funcional em EdTech premium especializada no Programa Ganhe o Mundo, preservando arquitetura, seguranca e estabilidade.

## Principios de Execucao

- Reutilizar estruturas existentes antes de criar novas tabelas, rotas ou componentes.
- Tratar informacao oficial como fonte versionada e centralizada.
- Manter independencia institucional em todos os textos.
- Nao reduzir RLS, autenticacao, autorizacao ou controle premium.
- Entregar cada sprint com lint, testes e build.
- Cada tela deve responder: "o que o aluno deve fazer agora?".

## Etapa 1 - Mapeamento de Impacto

### Atualizar base oficial PGM 2026

Arquivos afetados:

- `src/lib/official/pgm-2026.ts` novo arquivo de fonte oficial central.
- `src/lib/site-config.ts`.
- `src/lib/eligibility/rules.ts`.
- `src/lib/mentor/knowledge-base.ts`.
- `src/lib/mentor/system-prompt.ts`.
- `src/app/page.tsx`.
- `src/app/planos/page.tsx`.
- `src/app/diagnostico/page.tsx`.
- `src/lib/simulations/content.ts`.
- `docs/MENTOR_SETUP.md`.
- `docs/PREMIUM_EDITORIAL_NOTES.md`.

Componentes afetados:

- `SiteHeader` indiretamente por navegacao.
- `MentorChat` indiretamente por prompt e base.
- `EligibilityForm` por `pgm2026Rules`.
- Cards de marketing por `platformModules`.

Rotas afetadas:

- `/`
- `/planos`
- `/diagnostico`
- `/mentor`
- `/api/mentor`

Tabelas afetadas:

- Nenhuma nesta sprint. A fonte oficial sera centralizada em codigo para eliminar divergencia imediata.
- Futuro: `official_source_versions`, `content_versions`.

APIs afetadas:

- `POST /api/mentor`

Servicos afetados:

- `buildMentorSystemPrompt`
- `evaluateEligibility`

Risco: medio. O risco esta em alterar a base de resposta do Mentor IA e textos de conversao; mitigacao com teste automatizado da base oficial e build.

### Criar Academia PGM

Arquivos afetados:

- `src/app/(app)/premium/page.tsx`.
- `src/lib/premium/content.ts`.
- `src/components/premium/premium-content-list.tsx`.
- `src/components/app-shell/app-sidebar.tsx`.
- Futuro: `src/lib/academy/*`.

Componentes afetados:

- Sidebar.
- Lista premium.
- Cards de modulo premium.

Rotas afetadas:

- `/premium`, futuramente `/academia`.

Tabelas afetadas:

- Inicialmente `user_learning_progress`.
- Futuro: `academy_modules`, `academy_lessons` se a granularidade atual nao bastar.

APIs afetadas:

- Nenhuma inicialmente.

Servicos afetados:

- `getLearningDashboardStats`.
- Futuro: servico dedicado de academia.

Risco: medio. Pode ser implementado reaproveitando progresso existente.

### Criar simulados alinhados ao edital

Arquivos afetados:

- `scripts/content/approved-content.ts`.
- `src/lib/simulations/service.ts`.
- `src/lib/simulations/catalog.ts`.
- `src/lib/simulations/scoring.ts`.
- `src/components/simulations/simulation-runner.tsx`.
- `src/app/(app)/simulados/*`.
- Futuro: `src/components/manual-review/*`.

Componentes afetados:

- Lista de simulados.
- Runner objetivo.
- Resultado.
- Formularios de subjetiva.

Rotas afetadas:

- `/simulados`
- `/simulados/[templateId]`
- `/simulados/tentativas/[attemptId]`
- `/simulados/tentativas/[attemptId]/resultado`
- `/subjetivas`
- `/subjetivas/[questionId]`

Tabelas afetadas:

- `simulation_templates`
- `simulation_attempts`
- `simulation_answers`
- `questions`
- `question_options`
- `manual_review_attempts`

APIs afetadas:

- `POST /api/simulations/attempts`
- `POST /api/simulations/attempts/[attemptId]/answers`
- `POST /api/simulations/attempts/[attemptId]/finish`

Servicos afetados:

- `startSimulationAttempt`
- `getSimulationRunner`
- `submitSimulationAttempt`
- `getSimulationResult`
- `getManualReviewStats`

Risco: alto. Envolve fluxo de prova, scoring, progresso, banco de questoes e UX em tela de tentativa.

### Criar Central de Sucesso do Aluno

Arquivos afetados:

- `src/app/(app)/sucesso/page.tsx` ou `src/app/sucesso/page.tsx`.
- `src/lib/success-center/content.ts`.
- `src/components/app-shell/app-sidebar.tsx`.
- Futuro: `src/app/api/support/tickets/route.ts`.

Componentes afetados:

- Sidebar.
- Cards de FAQ.
- Blocos de contato.

Rotas afetadas:

- `/sucesso`
- Futuro: `/api/support/tickets`

Tabelas afetadas:

- Nenhuma para MVP estatico.
- Futuro: `support_tickets`, `support_ticket_messages`.

APIs afetadas:

- Nenhuma para MVP estatico.

Servicos afetados:

- Nenhum inicialmente.

Risco: baixo para MVP estatico; medio se incluir ticket.

### Criar Painel de Missao

Arquivos afetados:

- `src/app/(app)/dashboard/page.tsx`.
- `src/lib/analytics/service.ts`.
- `src/lib/analytics/rules.ts`.
- Futuro: `src/lib/mission/*`.

Componentes afetados:

- Cards do dashboard.
- Metas semanais.
- Conquistas.

Rotas afetadas:

- `/dashboard`
- `/analytics`

Tabelas afetadas:

- Inicialmente `user_learning_progress`, `simulation_attempts`, `manual_review_attempts`.
- Futuro: `student_xp_events`, `student_missions`, `student_badges`.

APIs afetadas:

- Nenhuma inicialmente.

Servicos afetados:

- `getLearningDashboardStats`.
- `getAnalyticsDashboard`.

Risco: medio. Pode alterar a percepcao de progresso e precisa evitar metricas falsas.

### Melhorar landing page

Arquivos afetados:

- `src/app/page.tsx`.
- `src/app/planos/page.tsx`.
- `src/lib/site-config.ts`.
- `src/components/marketing/*`.

Componentes afetados:

- Hero.
- Secoes de modulos.
- CTAs.
- FAQ.

Rotas afetadas:

- `/`
- `/planos`

Tabelas afetadas:

- Nenhuma.

APIs afetadas:

- Nenhuma.

Servicos afetados:

- Nenhum.

Risco: baixo/medio. Principal risco e copy exagerar promessa; mitigacao mantendo aviso institucional.

## Etapa 2 - Ordem Ideal de Implementacao

### Sprint 1 - Credibilidade

Objetivo: eliminar risco de informacao oficial incorreta.

Entregas:

- Fonte oficial central PGM 2026 em codigo.
- Mentor IA atualizado para 2.000 vagas, idiomas, destinos, etapas, pontuacao, subjetiva e entrevista.
- Site config e diagnostico apontando para a mesma fonte.
- Landing e planos com copy atualizada ao edital 2026.
- Teste automatizado garantindo que a base do Mentor nao retorna dados antigos.

Esforco: 1 a 2 dias.

Risco: medio.

Validacao:

- `npm run test:mentor`
- `npm run test:eligibility`
- `npm run lint`
- `npm run build`

### Sprint 2 - Experiencia Premium

Objetivo: transformar "Area Premium" em "Academia PGM".

Entregas:

- Modulos: Rota de Aprovacao, Ingles, Espanhol, Escrita Internacional, Treino Psicossocial, Vida Internacional, Embarque.
- Progresso por modulo usando `user_learning_progress` quando possivel.
- Conclusao e tracking visual.
- Sidebar renomeada para "Academia PGM".

Esforco: 3 a 5 dias.

Risco: medio.

Validacao:

- Lint, build e fluxo premium/free.

### Sprint 3 - Simulados Oficiais

Objetivo: alinhar simulados ao edital.

Entregas:

- Simulado objetivo com 30 questoes.
- Cronometro e duracao oficial de 4 horas como referencia.
- Relatorio por categoria.
- Simulado subjetivo com 5 questoes.
- Contador de palavras por resposta.
- Validacao 90-150 palavras.
- Rubrica: gramatica, vocabulario, estrutura sintatica, coesao e clareza.

Esforco: 5 a 8 dias.

Risco: alto.

Validacao:

- Testes de scoring, runner, submissao e bloqueio premium.

### Sprint 4 - Central de Sucesso

Objetivo: reduzir atrito operacional e aumentar confianca.

Entregas:

- FAQ.
- Base de conhecimento.
- Area de pagamento e premium.
- Orientacoes do Mentor IA.
- Contato e caminho para suporte.
- Estrutura futura de tickets.

Esforco: 2 a 4 dias.

Risco: baixo/medio.

### Sprint 5 - Painel de Missao

Objetivo: substituir dashboard passivo por comando diario.

Entregas:

- Missao de hoje.
- Proximo passo.
- Streak.
- XP calculado.
- Meta semanal.
- Tarefas priorizadas por fase do aluno.

Esforco: 4 a 6 dias.

Risco: medio.

## Etapa 3 - Banco de Dados

Sprint 1 nao exige migration porque a correcao critica e eliminar divergencia oficial no codigo e no Mentor IA. Criar tabela agora geraria complexidade sem uso imediato.

Migrations futuras recomendadas:

1. `official_source_versions`: versionamento de edital, fonte, data, resumo e status ativo.
2. `content_versions`: vinculo de conteudo a edital/fonte.
3. `student_onboarding`: estado do onboarding premium.
4. `student_xp_events`: eventos de XP auditaveis.
5. `student_missions`: missoes diarias/semanais.
6. `student_badges`: medalhas persistidas.
7. `support_tickets`: suporte formal.

## Etapa 4 - Riscos Principais

| Risco | Impacto | Mitigacao |
|---|---:|---|
| Mentor IA informar dados antigos | Alto | Fonte oficial central + teste automatizado. |
| Copy prometer aprovacao | Alto | Aviso institucional e linguagem de preparacao. |
| Simulado desalinhado ao edital | Alto | Sprint especifica com teste de blueprint. |
| Criar tabelas redundantes | Medio | Reaproveitar `user_learning_progress` antes de migrar. |
| Reduzir seguranca premium | Alto | Manter `hasPremiumAccess` e RLS existentes. |
| Aumentar escopo sem terminar sprint | Medio | Entregar por fatias: credibilidade, experiencia, simulados. |

## Etapa 5 - Criterios de Pronto

Uma sprint so deve ser considerada pronta quando:

- Codigo compila.
- Lint passa.
- Testes passam.
- Build passa.
- Fluxo free/premium continua correto.
- Nao ha regressao de RLS ou autorizacao.
- Copy institucional nao promete aprovacao, destino ou decisao oficial.

