# Mobile Bug Audit - PGM Academy

Data: 09/06/2026  
Sprint: UX-3.2 - Correcao exclusiva do mobile  
Breakpoints alvo: `<640px` e `<768px`

## Escopo

Auditoria concentrada apenas em mobile:

- Mobile Drawer.
- Mobile Navigation.
- MobileActionBar.
- Dashboard mobile.
- Academia mobile.
- Flashcards mobile.
- Trilhas mobile.
- Simulados mobile.

Desktop foi considerado aprovado e nao deve ser alterado.

## Metodo

Foi feita revisao estatica dos componentes e telas mobile, com foco em classes base, `sm:*`, `md:*`, `lg:*`, `max-sm:*`, grids, overflow, z-index e safe-area.

Limitacao: o navegador interno nao apresentou navegadores ativos nesta sessao. A validacao visual real deve ser feita em etapa futura com fixture autenticada segura e browser disponivel.

## Bugs e Riscos Encontrados

### Mobile Drawer

Achados:

- Nao havia fechamento por tecla `Escape`.
- Nao havia bloqueio de scroll do body enquanto o drawer estava aberto.
- O foco nao era movido para o drawer ao abrir.
- Drawer usava `100vh` implicito via `inset-y-0`, o que pode falhar em navegadores mobile com barra dinamica.
- Footer do drawer nao considerava `safe-area-inset-bottom`.
- Conteudo interno podia gerar scroll duplo em telas pequenas se o body tambem rolasse.

Risco:

- Menu parecer travado ou abrir com rolagem da pagina por tras.
- Botao de sair/perfil ficar cortado em celulares com safe-area.

### MobileActionBar

Achados:

- Barra fixa nao considerava `safe-area-inset-bottom`.
- Conteudo da barra podia ficar apertado em telas estreitas.
- Como fica fixa no rodape, precisa de mais padding inferior nas paginas que a usam.

Risco:

- CTA cobrir conteudo final ou ficar colado na area segura do sistema operacional.

### Dashboard Mobile

Achados:

- Header, painel de acao e cards usam padding confortavel no desktop, mas em mobile podiam criar scroll inicial alto.
- CTAs no painel principal podiam ficar lado a lado dependendo da largura disponivel.
- Cards de missao/preparacao tinham potencial de ficar densos demais antes do aluno chegar ao conteudo principal.

Risco:

- Aluno demorar mais para ver a acao principal.

### Academia Mobile

Achados:

- Modulos e cards ricos possuem bastante texto e padding.
- Rail de 7 modulos empilha bem, mas pode gerar scroll inicial longo.
- CTA fixo precisa respeitar safe-area.

Risco:

- Jornada parecer pesada em celulares pequenos.

### Flashcards Mobile

Achados:

- Botoes do deck ficavam em uma coluna no mobile.
- Card frente/verso tinha altura minima alta para celular.
- Texto grande no card podia ocupar muito espaco.
- Barra de progresso e header do deck podiam deixar a interacao abaixo da dobra.

Risco:

- Revisao ficar lenta no celular.

### Trilhas Mobile

Achados:

- Cards e grupos empilham corretamente, mas badges longas podem pressionar o layout.
- Detalhe de trilha usa itens com acao "Abrir" e "Concluir"; em mobile precisa manter separacao clara.

Risco:

- Badges ou botoes parecerem comprimidos em telas estreitas.

### Simulados Mobile

Achados:

- Listas de templates, historico, alternativas e resultado usam muitos cards.
- Alternativas e questoes longas podem precisar de `min-w-0`, `break-words` e padding menor no mobile.
- Paginas de resultado com respostas longas podem gerar overflow horizontal.

Risco:

- Alternativas ou enunciados sairem da tela em celulares pequenos.

## Correcoes Recomendadas

- Adicionar `Escape`, foco inicial, lock de body scroll e safe-area ao `MobileDrawer`.
- Adicionar safe-area e layout vertical responsivo ao `MobileActionBar`.
- Reduzir padding apenas em mobile nos containers principais das telas-alvo.
- Usar `max-sm:*` para compactar headers/cards sem tocar desktop.
- Garantir `min-w-0`, `break-words` e `overflow-hidden` em cards com texto longo.
- Ajustar botoes dos flashcards para grade mobile 2 colunas.
- Manter todas as alteracoes restritas a mobile ou a componentes `lg:hidden`.
