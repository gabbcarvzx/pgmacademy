# Relatorio - Correcao Urgente do Mobile Drawer

Data: 09/06/2026  
Objetivo: corrigir exclusivamente o bug do drawer mobile abrindo como faixa parcial e deixando o conteudo da pagina visivel/clicavel por baixo.

## Causa do Bug

O `MobileDrawer` era renderizado dentro de `AppSidebar`, que usa `position: sticky` e `z-index`. Mesmo com `position: fixed` no drawer, o componente continuava dentro do stacking context da sidebar. Em mobile, isso podia fazer o overlay ficar limitado visualmente ao topo, com o conteudo da pagina e o botao "Menu" ainda aparecendo por cima/ao lado.

Na pratica, o drawer nao estava escapando de forma confiavel da camada da sidebar.

## Arquivos Alterados

- `src/components/design-system/mobile-drawer.tsx`
- `src/components/app-shell/app-sidebar.tsx`
- `docs/MOBILE_DRAWER_FIX_REPORT.md`

## Como Foi Corrigido

### `MobileDrawer`

- Passou a renderizar via `createPortal(..., document.body)`.
- O overlay agora sai da arvore da sidebar e fica diretamente no `body`.
- A raiz do drawer usa `fixed inset-0 z-[999]`.
- O backdrop cobre toda a tela com `absolute inset-0`.
- O painel lateral usa `absolute inset-y-0 left-0 z-10`.
- O painel usa `h-[100dvh]`, evitando problemas de barra dinamica em navegadores mobile.
- O painel respeita `safe-area-inset-top`.
- O footer continua respeitando `safe-area-inset-bottom`.
- O scroll do `body` e do `documentElement` continua bloqueado enquanto o drawer esta aberto.
- O botao `X` continua fechando o menu.
- A tecla `Escape` continua fechando o menu.

### `AppSidebar`

- O botao "Menu" deixa de ser renderizado enquanto o drawer esta aberto.
- Isso evita que ele apareca atras/ao lado do painel.
- Links do menu continuam fechando o drawer via `onNavigate`.
- Desktop permanece com a mesma sidebar e a mesma navegacao.

## Como o Desktop Foi Preservado

- Nenhuma classe desktop da sidebar foi alterada.
- A sidebar desktop continua dentro de `lg:block`.
- O drawer continua restrito a mobile com `lg:hidden`.
- Nenhum layout desktop de Dashboard, Academia, Landing, Simulados ou outras telas foi alterado.

## O Que Nao Foi Alterado

Nao foram alterados:

- Banco.
- Supabase.
- RLS.
- Autenticacao.
- Pagamentos.
- Premium access.
- Mentor IA.
- Conteudo editorial.
- Rotas.
- Regras de negocio.
- APIs.
- Migrations.

## Validacoes Executadas

- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- `npm run content:validate`: passou.
- `npm run content:validate-imported`: passou.

## Limitacao

Nao foi executado screenshot autenticado do drawer nesta sessao. A correcao foi validada por leitura estrutural, TypeScript, ESLint, build de producao e preservacao das regras existentes.

## Conclusao

O bug foi corrigido movendo o drawer para fora do stacking context da sidebar. Agora o drawer mobile deve abrir como overlay real acima de todo o conteudo, com backdrop cobrindo a tela inteira, painel lateral correto, scroll de fundo bloqueado e botao "Menu" oculto enquanto o menu estiver aberto.
