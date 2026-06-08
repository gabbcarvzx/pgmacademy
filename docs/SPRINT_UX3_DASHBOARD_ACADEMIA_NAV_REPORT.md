# Relatorio Sprint UX-3 - Dashboard, Academia e Navegacao

Data: 08/06/2026  
Objetivo: aplicar incrementalmente o Design System Premium nas telas centrais da PGM Academy, sem alterar regras de negocio.

## Escopo Executado

- Dashboard / Painel de Missao redesenhado como cockpit diario.
- Academia PGM / Premium redesenhada como jornada premium guiada.
- Sidebar reorganizada em grupos visuais com estado ativo.
- Navegacao mobile migrada de scroll horizontal para drawer.
- Componentes duplicados de baixo risco migrados para `src/components/design-system`.

## Arquivos Alterados

- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/premium/page.tsx`
- `src/components/app-shell/app-sidebar.tsx`
- `docs/SPRINT_UX3_DASHBOARD_ACADEMIA_NAV_REPORT.md`

Arquivos de fundacao usados, sem alterar regra de negocio:

- `src/components/design-system/*`
- `src/lib/design-system/*`
- `src/app/globals.css`

## Componentes Migrados

### Dashboard

- `ProgressBar` local removido e substituido por `design-system/ProgressBar`.
- `MetricCard` local removido e substituido por `design-system/MetricCard`.
- Header operacional substituido por `AppPageHeader` compacto.
- Proxima acao transformada em `PrimaryActionPanel`.
- Missao diaria migrada para `LearningStepRow`.
- Cards de apoio migrados para `ContentCard`.
- Estado vazio de recomendacoes migrado para `EmptyState`.
- Bloqueio/upsell free migrado para `PremiumLockCard`.
- CTA mobile adicionado com `MobileActionBar`.
- Estados visuais migrados para `StatusBadge`.

### Academia PGM

- `ProgressBar` local removido e substituido por `design-system/ProgressBar`.
- `MetricCard` local removido e substituido por `design-system/MetricCard`.
- `StatusPill` local removido e substituido por `StatusBadge`.
- Header operacional substituido por `AppPageHeader`.
- "Continue daqui" migrado para `PrimaryActionPanel`.
- Modulos e previews migrados para `ContentCard`.
- Atividades dos modulos migradas para `LearningStepRow`.
- Preview free migrado para `UpgradeCard`.
- CTA mobile adicionado com `MobileActionBar`.

### Sidebar

- Navegacao plana substituida por grupos visuais.
- Estado ativo de rota adicionado com `usePathname`.
- Mobile agora usa `MobileDrawer`.
- Scroll horizontal mobile removido da navegacao principal.
- Badge de acesso migrado para `StatusBadge`.

## Melhorias Visuais Aplicadas

### Dashboard / Painel de Missao

- A primeira leitura da tela agora responde "o que fazer agora" por meio do `PrimaryActionPanel`.
- O header ficou mais compacto para reduzir scroll inicial.
- Acoes primarias e secundarias foram separadas visualmente.
- Metricas principais ficaram padronizadas.
- Missao diaria ganhou linhas de aprendizado com estado `completed`, `current` e `upcoming`.
- Progresso passou a ter label acessivel e clamp centralizado.
- Experiencia free ganhou bloqueio premium mais contextual.
- Mobile ganhou CTA fixo para a proxima acao.

### Academia PGM / Premium

- A pagina passou a comunicar jornada premium em vez de dashboard modular.
- "Continue daqui" ficou como eixo principal da tela.
- Os 7 modulos ganharam rail mais padronizado, com status e progresso.
- Cada modulo agora separa descricao, razao, resultado esperado e atividades.
- Atividades ficaram em `LearningStepRow`, facilitando leitura sequencial.
- Aluno free recebe um `UpgradeCard` com CTA unico e preview dos modulos.
- Aluno premium recebe foco no proximo passo e progresso real.
- Mobile ganhou CTA fixo para continuar ou assinar.

### App Sidebar / Mobile Navigation

- Navegacao agrupada:
  - Hoje: Missao, Academia PGM e Onboarding.
  - Estudar: Estudos, Trilhas e Flashcards.
  - Praticar: Simulados, Subjetivas e Entrevista.
  - Evolucao: Analytics e Diagnostico.
  - Ajuda: Central de Sucesso e Mentor IA.
  - Conta: Planos.
- Onboarding foi preservado porque ja existia como link importante.
- Mentor IA foi adicionado ao grupo Ajuda conforme solicitado.
- Admin continua aparecendo apenas para usuarios admin.
- Estado ativo usa `aria-current="page"`.
- Mobile passou a usar botao Menu + drawer.

## O Que Foi Preservado

Nao foram alterados:

- Banco.
- Migrations.
- Supabase.
- RLS.
- Autenticacao.
- Pagamentos.
- Webhooks.
- Backend do Mentor IA.
- Prompts do Mentor IA.
- Imports editoriais.
- Conteudo editorial.
- Scoring de simulados.
- Gabaritos.
- Tentativas de simulado.
- Regras premium.
- Service role.

Tambem foram preservados:

- `getMissionDashboard(user.id)`.
- `getAcademyDashboard(user.id)`.
- Redirect sem sessao para `/login`.
- Redirect de onboarding pendente para `/onboarding`.
- `PaymentButton`.
- `signOutAction`.
- Links existentes de rotas protegidas.
- Calculos de progresso, streak, missao, academia e stats.

Nenhuma migration foi criada. Nenhuma API nova foi criada.

## Riscos Encontrados

1. Sidebar virou client component.
   - Necessario para estado ativo e drawer mobile.
   - O logout continua usando `signOutAction` sem alterar autenticacao.

2. Onboarding nao estava no agrupamento solicitado.
   - Foi mantido no grupo "Hoje" para preservar link existente e evitar perda de descoberta.

3. QA visual com browser interno ficou limitado.
   - O navegador interno nao estava disponivel nesta sessao.
   - Foi feita verificacao HTTP local e build de producao.

4. Dashboard e Academia agora dependem mais do Design System.
   - Isso reduz duplicacao, mas aumenta a importancia de manter `src/components/design-system` estavel.

5. CTAs mobile fixos podem exigir ajuste fino visual com sessao autenticada.
   - Sem uma sessao premium/free renderizada no browser, a validacao visual autenticada fica como proximo passo.

## Validacoes Executadas

- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- `npm run content:validate`: passou.
- `npm run content:validate-imported`: passou.

## QA Local

Dev server iniciado em:

- `http://127.0.0.1:3000`

Rotas verificadas sem sessao:

- `/`: `200`.
- `/dashboard`: `307` para `/login`.
- `/premium`: `307` para `/login`.
- `/simulados`: `307` para `/login`.
- `/estudos`: `307` para `/login`.

Resultado:

- Rotas protegidas continuam redirecionando sem sessao.
- Landing continua acessivel publicamente.
- Nao houve erro runtime registrado no log do dev server durante essas verificacoes.

## Proximos Passos Recomendados

1. Fazer QA visual autenticado com usuario free e premium.
2. Ajustar detalhes finos de spacing em Dashboard e Academia apos screenshots reais.
3. Migrar `ProgressBar` e `MetricCard` restantes em Analytics, Trilhas, Flashcards e Resultado de Simulado.
4. Migrar bloqueios premium restantes para `PremiumLockCard`.
5. Redesenhar Simulados em sprint propria, preservando scoring, gabarito e tentativas.
6. Criar estado ativo tambem para navegacao publica da Landing/Planos, sem alterar conversao ainda.
7. Revisar copy visual com acentos em arquivos que ainda apresentam texto historicamente mojibakeado.

## Conclusao

A Sprint UX-3 aplicou o Design System Premium nas areas de maior impacto sem alterar regras sensiveis. Dashboard e Academia agora tem hierarquia mais clara, CTA principal mais evidente, padronizacao de componentes e melhor base mobile. A navegacao deixou de depender de scroll horizontal no mobile e passou a ter grupos, estado ativo e drawer.

O produto esta pronto para uma proxima sprint de refinamento visual autenticado e migracao gradual dos componentes restantes.
