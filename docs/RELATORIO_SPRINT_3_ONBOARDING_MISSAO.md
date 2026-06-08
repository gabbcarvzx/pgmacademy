# Relatorio Sprint 3 - Onboarding Premium e Painel de Missao

Data: 04/06/2026  
Objetivo: transformar a experiencia inicial do aluno premium em um fluxo guiado, com onboarding, plano automatico e painel orientado a acao.

## Entregas Concluidas

- Onboarding premium em 5 passos: idioma, ano escolar, tempo disponivel, participacao anterior no PGM e objetivo principal.
- Persistencia segura em `student_onboarding`, com `tenant_id`, `user_id`, RLS, indice por tenant/usuario e plano gerado.
- Plano de Aprovacao PGM gerado por regras deterministicamente, usando rotas e trilhas existentes.
- Dashboard transformado em Painel de Missao, com proxima acao recomendada, missao de hoje, progresso diario e preparacao geral.
- Indicador "Preparacao PGM" calculado com dados reais: trilhas, simulados, subjetivas e progresso de itens.
- Recomendacoes personalizadas usando analytics existentes e regras deterministicas, sem IA nova.
- Redirecionamento de premium sem onboarding para `/onboarding`.

## Arquivos Alterados

- `supabase/migrations/008_student_onboarding.sql`: tabela de onboarding premium com RLS.
- `src/types/database.ts`: tipos da tabela `student_onboarding`.
- `src/lib/mission/rules.ts`: regras puras de plano, missao, preparacao e proxima acao.
- `src/lib/mission/service.ts`: orquestracao server-side de onboarding, analytics, progresso e dashboard.
- `src/app/(app)/onboarding/page.tsx`: nova rota de onboarding premium.
- `src/app/(app)/onboarding/actions.ts`: server action para salvar onboarding.
- `src/components/onboarding/premium-onboarding-form.tsx`: formulario em etapas.
- `src/app/(app)/dashboard/page.tsx`: novo Painel de Missao.
- `src/components/app-shell/app-sidebar.tsx`: navegacao atualizada para Missao e Onboarding.
- `tests/mission-rules.test.ts`: testes das regras da Sprint 3.
- `package.json`: script `test:mission`.

## Componentes Alterados

- `AppSidebar`
- `PremiumOnboardingForm`
- `DashboardPage`

## Tabelas Alteradas

Tabela criada:

- `student_onboarding`

Campos principais:

- `tenant_id`
- `user_id`
- `idioma`
- `ano_escolar`
- `tempo_disponivel`
- `ja_participou_pgm`
- `objetivo_principal`
- `onboarding_completed`
- `plan_version`
- `plan`
- `created_at`
- `updated_at`

Tabelas reaproveitadas:

- `profiles`
- `user_learning_progress`
- `learning_paths`
- `learning_path_items`
- `simulation_templates`
- `simulation_attempts`
- `simulation_answers`
- `subjective_attempts`
- `eligibility_assessments`
- `subscriptions`

## APIs e Server Actions

APIs REST novas:

- Nenhuma.

Server actions criadas:

- `completePremiumOnboardingAction`

Servicos criados:

- `getOnboardingStatus`
- `saveStudentOnboarding`
- `getMissionDashboard`
- `normalizeOnboardingInput`

## Seguranca

- `student_onboarding` tem `tenant_id` e `user_id`.
- RLS permite leitura apenas do proprio usuario ou admin.
- Insert/update do onboarding exige `profiles.access_status = 'paid'`.
- Dashboard nao reduz premium access de nenhuma area existente.
- Base oficial, Mentor IA e simulados oficiais nao foram alterados nesta sprint.
- O plano automatico nao usa IA nem conteudo externo.

## Calculo de Preparacao

O indicador "Preparacao PGM" usa apenas dados reais:

- trilhas concluidas / trilhas ativas visiveis
- templates de simulado concluidos / templates ativos visiveis
- subjetivas enviadas / 5 respostas do simulado subjetivo oficial
- itens de progresso concluidos / itens de trilha existentes

## Riscos

- Se a migration `008_student_onboarding.sql` nao for aplicada no Supabase antes do deploy, `/dashboard` e `/onboarding` podem falhar ao consultar `student_onboarding`.
- O plano automatico usa regras simples e trilhas existentes; para escala maior, a proxima evolucao deve versionar blueprints por edital e perfil.
- A preparacao geral depende de conteudo ativo e progresso registrado; se trilhas nao tiverem itens, o componente de progresso geral pode ficar em 0%.

## Testes Executados

- `npx tsc --noEmit`
- `npm run test:mission`
- `npm run test:official-simulations`
- `npm run test:simulations`
- `npm run test:mentor`
- `npm run test:eligibility`
- `npm run test:analytics`
- `npm run content:validate`
- `npm run lint`
- `npm run build`

Verificacao local:

- `http://localhost:3000/dashboard` retornou `307` sem sessao, redirecionando como rota protegida.
- `http://localhost:3000/onboarding` retornou `307` sem sessao, redirecionando como rota protegida.

## Melhorias Futuras

- Criar blueprints versionados por edital, idioma e fase do aluno.
- Persistir missoes diarias em tabela propria para auditoria historica.
- Criar eventos de XP em `student_xp_events`.
- Permitir reconfiguracao assistida do onboarding sem repetir o primeiro acesso.
- Criar relatorio consolidado com objetivo, subjetivo, entrevista e plano semanal.
