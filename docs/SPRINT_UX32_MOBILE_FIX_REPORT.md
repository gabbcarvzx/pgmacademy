# Relatorio Sprint UX-3.2 - Correcao Exclusiva do Mobile

Data: 09/06/2026  
Objetivo: auditar e corrigir exclusivamente a experiencia mobile da PGM Academy, preservando o desktop aprovado.

## Escopo Executado

- Auditoria mobile documentada em `docs/MOBILE_BUG_AUDIT.md`.
- Correcao do `MobileDrawer`.
- Correcao do `MobileActionBar`.
- Polimento mobile do Dashboard.
- Polimento mobile da Academia PGM.
- Polimento mobile de Flashcards.
- Polimento mobile de Trilhas.
- Polimento mobile de Simulados, incluindo telas de entrada, tentativa, subjetivo oficial e resultado.

## Bugs Encontrados

- Drawer sem fechamento por `Escape`.
- Drawer sem bloqueio de scroll do documento enquanto aberto.
- Drawer sem foco inicial ao abrir.
- Drawer sem safe-area no footer.
- Drawer com risco de scroll duplo em telas pequenas.
- `MobileActionBar` sem safe-area inferior.
- CTAs mobile com risco de compressao entre 640px e 767px.
- Dashboard mobile com padding e gaps altos para a primeira dobra.
- Academia mobile com cards ricos ocupando area excessiva em celulares pequenos.
- Flashcards com card alto demais e controles apertados no mobile.
- Trilhas com risco de badges/textos pressionarem o layout.
- Simulados com risco de overflow em alternativas, enunciados e respostas longas.

## Correcoes Aplicadas

### MobileDrawer

- Adicionado fechamento por tecla `Escape`.
- Adicionado foco inicial no botao de fechar.
- Adicionado bloqueio/restauracao de scroll em `body` e `documentElement`.
- Elevado z-index para ficar acima de action bars e conteudo.
- Adicionado backdrop com animacao curta.
- Adicionado `100dvh`, `overscroll-contain`, scroll interno e safe-area no footer.
- Botao mobile da sidebar recebeu `aria-controls` e `aria-expanded`.

### MobileActionBar

- Adicionado `env(safe-area-inset-bottom)`.
- CTA permanece empilhado ate `<768px`.
- Conteudo fica em largura segura no mobile para evitar botoes comprimidos.

### Dashboard Mobile

- Reduzidos padding, gaps e margens apenas com classes mobile.
- CTA fixo ganhou largura total em mobile.
- Secoes principais ficaram mais compactas sem alterar ordem, queries ou calculos.

### Academia Mobile

- Cards, modulos, rail e painel de conclusao ficaram mais compactos em mobile.
- CTA fixo ganhou largura total em mobile.
- Grids receberam gaps menores em telas pequenas.

### Flashcards Mobile

- A area do deck aparece antes da lista de baralhos apenas no mobile.
- Card frente/verso recebeu altura menor em `<640px`.
- Texto do card ficou menor no mobile.
- Controles ficaram em grade 2x2 ate `<768px`.
- Cards de deck receberam padding menor em mobile.

### Trilhas Mobile

- Cards de trilha e detalhe ficaram mais compactos.
- Titulo e itens longos receberam `break-words`/`min-w-0`.
- Grupos de trilha receberam gaps e padding menores em telas pequenas.

### Simulados Mobile

- Cards de metricas, templates, historico, instrucoes e resultado ficaram mais compactos em mobile.
- Alternativas passaram a usar colunas seguras com `minmax(0, 1fr)`.
- Enunciados, alternativas e respostas longas receberam `break-words`.
- CTAs principais ficam em largura total no mobile quando necessario.
- Simulado subjetivo oficial recebeu textarea e cards mais adequados para celular.

## Arquivos Alterados

- `docs/MOBILE_BUG_AUDIT.md`
- `docs/SPRINT_UX32_MOBILE_FIX_REPORT.md`
- `src/app/globals.css`
- `src/components/app-shell/app-sidebar.tsx`
- `src/components/design-system/app-page-header.tsx`
- `src/components/design-system/content-card.tsx`
- `src/components/design-system/empty-state.tsx`
- `src/components/design-system/learning-step-row.tsx`
- `src/components/design-system/metric-card.tsx`
- `src/components/design-system/mobile-action-bar.tsx`
- `src/components/design-system/mobile-drawer.tsx`
- `src/components/design-system/premium-lock-card.tsx`
- `src/components/design-system/primary-action-panel.tsx`
- `src/components/design-system/upgrade-card.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/premium/page.tsx`
- `src/app/(app)/flashcards/page.tsx`
- `src/components/learning/flashcard-deck.tsx`
- `src/app/(app)/trilhas/page.tsx`
- `src/app/(app)/trilhas/[slug]/page.tsx`
- `src/app/(app)/simulados/page.tsx`
- `src/app/(app)/simulados/[templateId]/page.tsx`
- `src/app/(app)/simulados/tentativas/[attemptId]/page.tsx`
- `src/app/(app)/simulados/tentativas/[attemptId]/resultado/page.tsx`
- `src/app/(app)/simulados/subjetivo-oficial/page.tsx`
- `src/components/simulations/simulation-runner.tsx`
- `src/components/simulations/official-subjective-runner.tsx`

## Telas Afetadas

- Mobile Drawer / navegacao mobile.
- Dashboard / Painel de Missao mobile.
- Academia PGM / Premium mobile.
- Flashcards mobile.
- Trilhas mobile.
- Simulados mobile.

## O Que Foi Preservado

Nao foram alterados:

- Desktop aprovado.
- Banco.
- Supabase.
- RLS.
- Autenticacao.
- Pagamentos.
- Mentor IA.
- Conteudo editorial.
- Scoring.
- Gabaritos.
- Tentativas.
- Premium access.
- Migrations.
- APIs.
- Regras de negocio.

## Validacoes Executadas

- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- `npm run content:validate`: passou.
- `npm run content:validate-imported`: passou.

## Verificacao Local Sem Sessao

Servidor local iniciado temporariamente em `http://127.0.0.1:3000` e encerrado apos a checagem.

- `/`: `200`.
- `/dashboard`: `307` para `/login`.
- `/premium`: `307` para `/login`.
- `/simulados`: `307` para `/login`.
- `/estudos`: `307` para `/login`.
- `/trilhas`: `307` para `/login`.
- `/flashcards`: `307` para `/login`.
- `/sucesso`: `307` para `/login`.
- `/mentor`: `307` para `/login`.

## Limitacoes do QA

- O navegador interno foi acionado, mas retornou lista vazia de navegadores ativos.
- Nao houve screenshot mobile real nesta sessao.
- Nao foram criados usuarios ou fixtures, para nao alterar Auth ou banco.
- A validacao mobile visual final ainda deve ser feita em staging/local com fixture free, premium e admin.

## Recomendacao para Proxima Sprint

1. Criar fixtures seguras de QA visual em ambiente local ou staging.
2. Executar screenshots mobile em 390px, 430px, 640px e 768px.
3. Testar drawer aberto/fechado com usuario free, premium e admin.
4. Fazer polimento fino apenas apos screenshots reais.
5. Manter Landing e redesign profundo de Simulados para sprints separadas.

## Conclusao

A Sprint UX-3.2 corrigiu exclusivamente problemas mobile, com alteracoes restritas a breakpoints pequenos, componentes `lg:hidden` e compactacao responsiva. O desktop aprovado foi preservado, nenhuma regra sensivel foi alterada, e todas as validacoes obrigatorias passaram.
