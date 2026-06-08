# Design System PGM Academy

Data: 08/06/2026  
Sprint: UX-2 - Design System Premium PGM Academy  
Fonte principal: `docs/UX_AUDIT_REPORT.md`

## Objetivo

Criar a fundacao visual da PGM Academy antes de redesenhar telas. O sistema deve comunicar tecnologia, confianca, intercambio internacional, preparacao seria e produto premium.

Esta entrega nao aplica redesign nas paginas atuais. Ela cria tokens e componentes prontos para a Sprint UX-3.

## Principios Visuais

- Escuro premium, mas com contraste suficiente para estudo prolongado.
- Amarelo/dourado reservado para acao primaria, premium e destaque estrategico.
- Superficies em camadas para diferenciar fundo, card, painel elevado e modal.
- Headers compactos em telas operacionais.
- Cards com hierarquia clara: titulo, valor/conteudo, metadados e acao.
- Mobile com acao proxima do contexto e navegacao por drawer, nao por scroll horizontal longo.
- Componentes sem regra de negocio interna.

## Tokens de Cor

| Token | Valor | Uso |
|---|---|---|
| `background-primary` | `#080a0f` | Fundo principal da plataforma. |
| `background-secondary` | `#0b1118` | Fundo alternativo e gradientes sutis. |
| `surface` | `#10141b` | Cards e secoes base. |
| `surface-elevated` | `#171d26` | Paineis de acao, modais e elementos premium. |
| `accent-gold` | `#f6c945` | Acao primaria, premium, foco e destaques. |
| `accent-gold-soft` | `rgba(246, 201, 69, 0.14)` | Fundo premium suave. |
| `success` | `#14b86a` | Concluido, aprovado, sucesso. |
| `warning` | `#f59e0b` | Atencao, pendencia e limites. |
| `error` | `#f05252` | Erro, bloqueio critico e falha. |
| `text-primary` | `#f7f9fc` | Titulos e conteudo principal. |
| `text-secondary` | `#c6d0df` | Texto de apoio relevante. |
| `text-muted` | `#a9b4c3` | Metadados, descricoes e hints. |

Aliases legados mantidos:

- `background`
- `foreground`
- `muted`
- `pgm-yellow`
- `pgm-green`
- `pgm-red`
- `pgm-blue`

Motivo: preservar telas atuais enquanto UX-3 migra componentes com seguranca.

## Tipografia

| Token | Classe | Uso |
|---|---|---|
| Display XL | `text-display-xl` | Heroes de marketing e momentos de marca. |
| Display LG | `text-display-lg` | Secoes premium de alto impacto. |
| H1 | `text-heading-1` | Titulo principal de pagina. |
| H2 | `text-heading-2` | Titulo de secao principal. |
| H3 | `text-heading-3` | Cards, paineis e secoes densas. |
| Body Large | `text-body-large` | Lead copy e explicacoes importantes. |
| Body | `text-body` | Texto padrao. |
| Caption | `text-caption` | Labels, badges, metadados e UI auxiliar. |

Regra:

- Display nao deve ser usado dentro de cards ou ferramentas operacionais.
- Telas logadas devem priorizar H1/H2 compactos.
- Texto dentro de cards deve ser curto e escaneavel.

## Spacing

Escala oficial:

- `4`
- `8`
- `12`
- `16`
- `24`
- `32`
- `48`
- `64`
- `96`

Uso recomendado:

- `4` e `8`: relacao fina entre icones, badges e metadados.
- `12` e `16`: grupos internos pequenos.
- `24` e `32`: padding de cards e secoes operacionais.
- `48` e `64`: separacao entre secoes.
- `96`: blocos de marketing e grandes respiros.

## Radius

Escala oficial:

- `12`: badges, botoes e controles.
- `16`: cards compactos.
- `20`: empty states e cards premium.
- `24`: headers, paineis primarios e modais.

Regra:

- Evitar voltar para `rounded-md` em novos componentes de produto.
- Cards repetidos devem usar `16`.
- Paineis premium devem usar `20` ou `24`.

## Shadows

| Token | Uso |
|---|---|
| `card` | Cards comuns e blocos de lista. |
| `elevated` | Paineis acima da superficie normal. |
| `modal` | Drawers, dialogs e overlays. |
| `premium` | Blocos premium e chamadas de upgrade. |

Regra:

- Sombras devem ser sutis no tema escuro.
- Premium pode ter sombra dourada leve, mas nunca virar decoracao excessiva.

## Componentes Base

### AppPageHeader

Arquivo: `src/components/design-system/app-page-header.tsx`

Uso:

- Header de tela logada.
- Suporta `density="compact"` para reduzir headers gigantes no mobile.
- Aceita `actions` e `aside`, sem regra de negocio.

Nao usar:

- Em hero de landing com imagem full-bleed.

### SectionHeader

Arquivo: `src/components/design-system/section-header.tsx`

Uso:

- Titulos de secoes internas.
- Substitui o padrao repetido de eyebrow amarelo + H2 + descricao.

### PrimaryActionPanel

Arquivo: `src/components/design-system/primary-action-panel.tsx`

Uso:

- Proxima acao do Dashboard.
- Continue aprendendo da Academia.
- Iniciar/continuar simulado.
- CTA contextual premium.

Regra:

- Uma tela operacional deve ter no maximo um painel primario por viewport inicial.

### MetricCard

Arquivo: `src/components/design-system/metric-card.tsx`

Uso:

- Dashboard.
- Analytics.
- Academia.
- Resultado de simulado.

Regra:

- Valor deve ser curto.
- Descricao deve explicar impacto, nao repetir o titulo.

### StatusBadge

Arquivo: `src/components/design-system/status-badge.tsx`

Tons:

- `neutral`
- `premium`
- `success`
- `warning`
- `error`
- `info`

Regra:

- `premium` nao deve ser usado para qualquer destaque amarelo.
- `warning` deve substituir amarelo quando o sentido for pendencia/alerta.

### ProgressBar

Arquivo: `src/components/design-system/progress-bar.tsx`

Uso:

- Progresso de missao.
- Modulos da Academia.
- Trilhas.
- Flashcards.
- Resultado por categoria.

Caracteristicas:

- Clamp de 0 a 100.
- `role="progressbar"`.
- Label acessivel.
- Tamanhos `sm`, `md`, `lg`.

### PremiumLockCard

Arquivo: `src/components/design-system/premium-lock-card.tsx`

Uso:

- Bloqueio de conteudo premium.
- Deve explicar beneficio concreto da tela.

Regra:

- Nao usar como aviso generico.
- Sempre que possivel, listar beneficios especificos.

### UpgradeCard

Arquivo: `src/components/design-system/upgrade-card.tsx`

Uso:

- Conversao premium em Landing, Planos, Dashboard e telas free.

Regra:

- Mais comercial que `PremiumLockCard`.
- Deve ser usado em contexto de compra, nao em bloqueio fino de item.

### EmptyState

Arquivo: `src/components/design-system/empty-state.tsx`

Uso:

- Ausencia de dados.
- Primeiro uso.
- Estado sem resultados.

Regra:

- Deve explicar o que aconteceu e qual a proxima acao.

### ContentCard

Arquivo: `src/components/design-system/content-card.tsx`

Uso:

- Materiais.
- Simulados.
- Flashcards.
- Central de Sucesso.
- Cards de recursos.

Regra:

- Se o card navega, usar `href`.
- Se o card executa acao, passar `action`.

### LearningStepRow

Arquivo: `src/components/design-system/learning-step-row.tsx`

Uso:

- Trilhas.
- Academia PGM.
- Missao diaria.
- Passos de onboarding.

Estados:

- `completed`
- `current`
- `locked`
- `upcoming`

### MobileActionBar

Arquivo: `src/components/design-system/mobile-action-bar.tsx`

Uso:

- Sticky CTA em telas longas.
- Aparece apenas abaixo de `lg`.

Regra:

- Usar quando a acao principal ficaria distante no mobile.
- Nao duplicar mais de uma action bar por tela.

### MobileDrawer

Arquivo: `src/components/design-system/mobile-drawer.tsx`

Uso:

- Base para substituir navegacao horizontal longa no app logado.

Regra:

- Controlado por props `open` e `onClose`.
- Nao conhece rotas, plano, usuario ou premium.

### FeatureHighlight

Arquivo: `src/components/design-system/feature-highlight.tsx`

Uso:

- Beneficios de produto.
- Highlights de landing.
- Vantagens de plano.

## Mobile Foundation

Problemas enderecados pela fundacao:

- Navegacao horizontal excessiva: `MobileDrawer`.
- CTA distante: `MobileActionBar`.
- Excesso de scroll: `AppPageHeader` e `SectionHeader` compactos.
- Headers gigantes: `density="compact"`.

Ainda nao implementado nas telas:

- Agrupamento real da sidebar.
- Estado ativo de rota.
- Drawer conectado ao app shell.
- Sticky CTA conectado ao Dashboard, Academia e Simulados.

Isso deve ser feito na Sprint UX-3.

## Regras de Uso

- Componentes do design system nao devem consultar banco.
- Componentes do design system nao devem chamar Supabase.
- Componentes do design system nao devem conhecer premium, exceto por texto/props visuais.
- Componentes do design system nao devem alterar rotas sensiveis.
- Componentes do design system devem aceitar `children`, `action` ou `href` quando precisarem de extensibilidade.
- Migrar telas por area, nao tudo de uma vez.

## Exemplo de Uso Futuro

```tsx
import {
  AppPageHeader,
  MetricCard,
  PrimaryActionPanel,
  ProgressBar,
} from "@/components/design-system";

<AppPageHeader
  eyebrow="Painel de Missao"
  title="Seu plano de hoje"
  description="Veja a proxima acao recomendada e acompanhe sua evolucao."
  density="compact"
/>

<PrimaryActionPanel
  eyebrow="Proxima acao"
  title="Concluir o simulado oficial"
  description="Finalize a tentativa para liberar o relatorio de desempenho."
/>

<MetricCard
  title="Progresso semanal"
  value="68%"
  description="Ritmo atual dentro do plano."
/>

<ProgressBar value={68} label="Meta semanal" showValue />
```

## Proxima Sprint Recomendada

UX-3 deve aplicar a fundacao em ordem segura:

1. Dashboard / Painel de Missao.
2. Academia PGM / Premium.
3. Navegacao mobile.
4. Simulados.
5. Landing + Planos.

Cada migracao deve rodar TypeScript, ESLint, build e verificacao visual responsiva.
