# Revisao Final PGM Design

## Objetivo

Adicionar uma central premium de reta final para alunos autenticados, integrada ao dashboard, aos estudos e aos simulados existentes, sem quebrar o fluxo atual de autenticacao, billing e navegacao.

## Decisoes

- A feature fica em rota protegida e premium: `/premium/revisao-final`.
- O discovery acontece em tres pontos reais do produto:
  - `Dashboard`
  - `Central de Estudos`
  - `Menu lateral`
- Usuarios autenticados sem premium podem descobrir a feature, mas veem apenas uma camada de teaser com CTA para `/planos`.
- Os links de simulados usam apenas rotas reais ja existentes:
  - templates objetivos via `/simulados/[templateId]`
  - subjetivo oficial via `/simulados/subjetivo-oficial?idioma=...`
  - fallback e exploracao geral via `/simulados`

## Arquitetura

- Criar uma camada propria em `src/lib/review-final` para concentrar:
  - dados editoriais da Revisao Final
  - resolucao dos simulados recomendados
  - controle premium reaproveitando `profiles.access_status` e `role`
- Reaproveitar o `App Router` protegido em `src/app/(app)`.
- Reaproveitar o `design-system` existente para manter consistencia visual, responsividade e baixo risco.

## UX

- Banner principal no dashboard com CTA claro.
- Aviso leve e nao intrusivo na Central de Estudos.
- Pagina premium com estrutura por secoes curtas, cards, badges e CTAs.
- Conteudo com linguagem de conversao sem promessas falsas.

## Seguranca

- Autenticacao continua centralizada no layout server-side de `(app)`.
- Controle premium continua baseado em `profiles.access_status === "paid"` ou `role === "admin"`.
- Nenhum conteudo premium sera exposto em rota publica.

## Auditoria resumida

- Stack: Next.js App Router, React 19, TypeScript, Tailwind 4, Supabase SSR/Admin.
- Auth: Supabase com validacao server-side em `src/app/(app)/layout.tsx`.
- Multi-tenant: entidades de negocio usam `tenant_id`; services filtram visibilidade por tenant.
- Billing: Asaas + `profiles.access_status` + `subscriptions`.
- Estudos: `src/app/(app)/estudos` + `src/lib/learning/service.ts`.
- Simulados: `src/app/(app)/simulados` + `src/lib/simulations/service.ts`.
- Navegacao protegida: `src/components/app-shell/app-sidebar.tsx`.
