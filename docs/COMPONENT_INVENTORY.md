# Component Inventory - PGM Academy

Data: 08/06/2026  
Fonte principal: `docs/UX_AUDIT_REPORT.md`  
Objetivo: mapear componentes visuais existentes antes de aplicar qualquer redesign.

## Escopo e Restricoes

Esta fase apenas inventariou componentes e criou uma fundacao visual paralela. Nenhuma tela foi redesenhada e nenhuma regra de negocio foi alterada.

Nao foram alterados:

- Banco de dados.
- Supabase.
- RLS.
- Autenticacao.
- Pagamentos.
- Mentor IA.
- Conteudo editorial.
- Simulados.
- Trilhas.
- Progress tracking.
- Imports.

## Componentes Existentes Mapeados

### App Shell

Arquivos principais:

- `src/app/(app)/layout.tsx`
- `src/components/app-shell/app-sidebar.tsx`

Padroes encontrados:

- Sidebar fixa no desktop.
- Navegacao horizontal com overflow no mobile.
- Card de perfil do usuario dentro da sidebar.
- Itens de navegacao com `rounded-md`, `border-border-soft`, `bg-background/72` e hover local.

Problemas:

- Muitos itens de navegacao no mesmo nivel.
- Sem estado ativo visual.
- Navegacao mobile depende de scroll horizontal.
- "Academia PGM" e "Missao" ainda nao aparecem como eixo principal.

Componente alvo criado para UX-3:

- `MobileDrawer`
- `MobileActionBar`
- `AppPageHeader` com `density="compact"`

## Duplicacoes Identificadas

### MetricCard

Duplicacoes locais:

- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/analytics/page.tsx`
- `src/app/(app)/premium/page.tsx`

Padrao atual:

- `article`
- `rounded-md`
- `border-border-soft`
- `bg-surface`
- icone amarelo
- titulo muted
- valor branco grande
- descricao muted

Risco:

- Ajustes futuros de metricas exigem manutencao em varias telas.
- Dashboard, Analytics e Academia podem divergir visualmente com facilidade.

Componente base criado:

- `src/components/design-system/metric-card.tsx`

### ProgressBar

Duplicacoes locais:

- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/analytics/page.tsx`
- `src/app/(app)/premium/page.tsx`
- `src/app/(app)/trilhas/page.tsx`
- `src/app/(app)/trilhas/[slug]/page.tsx`
- `src/app/(app)/flashcards/page.tsx`
- `src/components/learning/flashcard-deck.tsx`
- `src/components/onboarding/premium-onboarding-form.tsx`
- `src/components/simulations/simulation-runner.tsx`
- `src/app/(app)/simulados/tentativas/[attemptId]/resultado/page.tsx`

Padrao atual:

- track escuro.
- fill amarelo.
- altura `h-2`.
- clamp nem sempre centralizado.

Risco:

- Inconsistencia de acessibilidade.
- Variação de cor, tamanho e aria entre paginas.

Componente base criado:

- `src/components/design-system/progress-bar.tsx`

### Hero Sections e Page Headers

Duplicacoes visuais:

- `src/app/page.tsx`
- `src/app/planos/page.tsx`
- `src/app/avaliacoes/page.tsx`
- `src/app/diagnostico/page.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/premium/page.tsx`
- `src/app/(app)/simulados/page.tsx`
- `src/app/(app)/estudos/page.tsx`
- `src/app/(app)/flashcards/page.tsx`
- `src/app/(app)/trilhas/page.tsx`
- `src/app/(app)/sucesso/page.tsx`
- `src/app/(app)/mentor/page.tsx`

Padrao atual:

- eyebrow amarelo.
- titulo branco.
- texto muted.
- cards laterais opcionais.
- headers grandes tambem em telas operacionais.

Risco:

- Hierarquia repetitiva.
- Mobile com headers longos e alto scroll inicial.

Componentes base criados:

- `AppPageHeader`
- `SectionHeader`

### Empty States

Duplicacoes existentes:

- `src/components/admin/admin-ui.tsx`
- paginas admin que importam `EmptyState`
- empty states locais em Estudos, Simulados, Flashcards, Subjetivas e Central de Sucesso.

Padrao atual:

- card simples com texto muted.
- variacao de titulo/descricao/acao conforme pagina.

Risco:

- Estados vazios podem parecer erro, ausencia de dado ou bloqueio premium sem diferenca clara.

Componente base criado:

- `EmptyState`

### Premium Cards e Lock States

Componentes e blocos existentes:

- `src/components/learning/premium-upgrade-card.tsx`
- `LockedPremiumSection` local em `src/app/(app)/analytics/page.tsx`
- cards premium locais em `src/app/page.tsx`
- cards premium locais em `src/app/planos/page.tsx`
- bloqueios em Simulados, Estudos, Trilhas, Flashcards, Subjetivas e Entrevista.

Padrao atual:

- borda amarela.
- fundo amarelo translúcido.
- icone de cadeado ou premium.
- CTA para `/planos`.

Risco:

- Mensagem premium pode ficar generica.
- Upsell contextual perde forca.
- Alguns bloqueios comunicam acesso, outros comunicam valor.

Componentes base criados:

- `PremiumLockCard`
- `UpgradeCard`

### Badges e Pills

Duplicacoes existentes:

- `src/components/manual-review/status-badge.tsx`
- `AdminBadge` em `src/components/admin/admin-ui.tsx`
- `StatusPill` local em `src/app/(app)/premium/page.tsx`
- pills de categoria, dificuldade, premium, status e tempo em varias paginas.

Padrao atual:

- `rounded-md border px-2 py-1 text-xs font-semibold`
- tons amarelo, verde, vermelho e muted.

Risco:

- Amarelo acumula muitos significados: premium, acao, destaque, status e alerta.
- Sem nomenclatura semantica, cada pagina decide seu proprio tom.

Componente base criado:

- `StatusBadge`

### CTA Sections

Duplicacoes visuais:

- Hero da landing.
- Hero de planos.
- `PremiumUpgradeCard`.
- Dashboard / proxima acao.
- Academia / continue aprendendo.
- Simulados / iniciar tentativa.
- Central de Sucesso / falar com suporte.

Problemas:

- CTAs nem sempre estao perto da decisao do aluno.
- Em mobile, a acao principal pode ficar distante apos muito scroll.

Componentes base criados:

- `PrimaryActionPanel`
- `MobileActionBar`

### Content Cards

Ocorrencias:

- Materiais.
- Flashcards.
- Trilhas.
- Simulados.
- Central de Sucesso.
- Admin cards.
- Marketing module cards.

Problemas:

- Cards usam estrutura semelhante, mas sem contrato comum.
- Algumas listas sao links, outras cards estaticos, outras formularios.
- Metadados aparecem em lugares diferentes.

Componentes base criados:

- `ContentCard`
- `LearningStepRow`
- `FeatureHighlight`

## Tokens Existentes Antes da Sprint

Tokens ja existentes:

- `--background`
- `--foreground`
- `--muted`
- `--surface`
- `--surface-elevated`
- `--border-soft`
- `--pgm-blue`
- `--pgm-green`
- `--pgm-yellow`
- `--pgm-red`

Problema:

- Tokens eram funcionais, mas pouco semanticos para um produto premium.
- Nao havia escala formal de tipografia, spacing, radius e shadows.

## Nova Fundacao Criada

Arquivos criados:

- `src/lib/design-system/tokens.ts`
- `src/lib/design-system/utils.ts`
- `src/components/design-system/*`

Componentes criados:

- `AppPageHeader`
- `PrimaryActionPanel`
- `MetricCard`
- `StatusBadge`
- `ProgressBar`
- `PremiumLockCard`
- `EmptyState`
- `ContentCard`
- `LearningStepRow`
- `MobileActionBar`
- `MobileDrawer`
- `SectionHeader`
- `FeatureHighlight`
- `UpgradeCard`

## Ordem Recomendada de Migracao em UX-3

1. Migrar `ProgressBar`, por ser baixo risco e muito duplicada.
2. Migrar `MetricCard` em Dashboard, Premium e Analytics.
3. Migrar badges/pills simples para `StatusBadge`.
4. Migrar bloqueios premium para `PremiumLockCard`.
5. Migrar headers operacionais para `AppPageHeader` compacto.
6. Migrar cards de listas para `ContentCard` e `LearningStepRow`.
7. Somente depois redesenhar navegacao mobile com `MobileDrawer`.

## Risco Arquitetural

O maior risco nao e tecnico, mas de produto: aplicar componentes novos sem uma ordem de migracao pode trocar consistencia visual por uma nova fragmentacao. A fundacao deve ser adotada de forma progressiva, com validacao por area: Dashboard, Academia, Simulados, Trilhas e Landing.
