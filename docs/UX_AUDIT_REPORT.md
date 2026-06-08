# UX Audit Report - PGM Academy

Data: 08/06/2026  
Papel: Product Designer Senior, UX Lead e Front-end Architect  
Objetivo: auditar a UX/UI atual da PGM Academy antes de qualquer alteracao visual.

## Restricoes Respeitadas

Esta auditoria nao alterou:

- Codigo de produto.
- Banco de dados.
- Supabase.
- RLS.
- Autenticacao.
- Pagamentos.
- Mentor IA.
- Conteudo editorial.

Unica entrega criada: este documento em `docs/UX_AUDIT_REPORT.md`.

## Metodo de Auditoria

A auditoria foi feita por leitura estrutural das telas, componentes e padroes de layout existentes. As principais fontes analisadas foram:

- `src/app/page.tsx`
- `src/app/planos/page.tsx`
- `src/app/(app)/layout.tsx`
- `src/components/app-shell/app-sidebar.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/premium/page.tsx`
- `src/app/(app)/simulados/page.tsx`
- `src/app/(app)/estudos/page.tsx`
- `src/app/(app)/flashcards/page.tsx`
- `src/app/(app)/trilhas/page.tsx`
- `src/app/(app)/trilhas/[slug]/page.tsx`
- `src/app/(app)/sucesso/page.tsx`
- `src/app/(app)/mentor/page.tsx`
- `src/components/mentor/mentor-chat.tsx`
- `src/components/learning/*`
- `src/components/marketing/*`
- `src/app/globals.css`

Limitacao: o navegador interno nao estava disponivel nesta sessao para auditoria renderizada com screenshots. Portanto, as conclusoes de responsividade sao inferidas por estrutura de grid, breakpoints, hierarquia, overflow e padroes de composicao no codigo.

## Sumario Executivo

A PGM Academy ja tem uma identidade visual consistente: tema escuro, amarelo como cor de acao, cards com raio baixo, uso recorrente de icones, layouts responsivos e linguagem institucional cuidadosa. A experiencia passa uma sensacao de produto funcional e premium em construcao.

O principal problema nao e falta de tela, mas excesso de equivalencia visual. Muitas paginas usam a mesma estrutura: hero textual, card lateral, grid de metricas e listas em cards. Isso cria consistencia, mas tambem reduz hierarquia, dificulta priorizacao e faz areas diferentes parecerem igualmente importantes.

O segundo problema e a navegacao. A sidebar contem muitas entradas de mesmo peso, sem agrupamento, sem estado ativo e com scroll horizontal no mobile. Para um aluno, isso aumenta carga cognitiva: ele ve muitas possibilidades, mas nem sempre entende o proximo passo ideal.

O terceiro problema e conversao. A proposta premium aparece em varias telas, mas ainda poderia ser mais contextual: o aluno precisa entender rapidamente o que esta bloqueado, por que importa, qual ganho imediato tera e qual acao deve fazer agora.

## Diagnostico Geral de UX/UI

### Pontos Fortes

- Identidade visual escura consistente.
- A cor amarela funciona bem como marca de acao e destaque.
- Componentes possuem raio discreto e visual profissional.
- Premium/free esta presente em varias telas, reduzindo ambiguidade de acesso.
- RLS e controle premium parecem preservados visualmente, com bloqueios claros.
- Muitos fluxos ja possuem estados vazios, progresso e CTA.
- A linguagem institucional evita prometer vaga ou resultado oficial.

### Problemas Visuais Sistêmicos

1. Muitos cards competem pela atencao.
   - Quase todas as telas usam cards parecidos para hero, metricas, listas, alertas e links.
   - O aluno pode nao perceber o que e comando principal, contexto, aviso ou item secundario.

2. Hierarquia visual repetitiva.
   - Eyebrow amarelo + titulo branco + texto muted aparece em quase toda secao.
   - O padrao e consistente, mas pouco expressivo para diferenciar estudo, suporte, simulado, academia e IA.

3. Excesso de texto explicativo em cards.
   - Varias telas usam descricoes longas dentro de cards pequenos.
   - Em mobile, isso tende a alongar muito a pagina e empurrar a acao principal para baixo.

4. Uso de amarelo em muitos papeis.
   - Amarelo aparece como premium, destaque, progresso, CTA, contador, status e aviso.
   - Isso reduz a capacidade de identificar rapidamente "acao primaria" versus "informacao".

5. Falta de componentes formalizados.
   - Existem padroes repetidos de `MetricCard`, `ProgressBar`, badges, header de pagina, empty state e upgrade card.
   - Alguns sao locais por pagina, o que aumenta risco de divergencia futura.

## Problemas de Navegacao

### Sidebar Logada

Problemas:

- Muitas entradas no mesmo nivel: Missao, Analytics, Onboarding, Estudos, Trilhas, Flashcards, Subjetivas, Entrevista, Diagnostico, Simulados, Central de Sucesso, Planos, Academia PGM.
- Nao ha agrupamento por jornada: "Hoje", "Estudar", "Praticar", "Acompanhar", "Suporte", "Conta".
- Nao ha indicacao visual de rota ativa.
- No mobile, a sidebar vira uma barra horizontal com muitos itens. Isso preserva acesso, mas nao orienta.
- "Academia PGM" aparece no fim, embora seja a experiencia premium central.
- "Planos" aparece no mesmo nivel de ferramentas de estudo, o que mistura compra com uso diario.

Impacto:

- Aluno novo pode se perder.
- Aluno premium pode nao entender que deve seguir Missao/Academia como eixo principal.
- Conversao pode cair porque "Planos" nao fica contextualizado no momento de bloqueio.

Recomendacao futura:

- Reorganizar navegacao em grupos:
  - Hoje: Missao, Academia PGM.
  - Estudo: Estudos, Trilhas, Flashcards.
  - Pratica: Simulados, Subjetivas, Entrevista.
  - Evolucao: Analytics, Diagnostico.
  - Ajuda: Central de Sucesso, Mentor IA.
  - Conta: Planos.
- Adicionar estado ativo.
- Em mobile, substituir scroll horizontal por top bar + drawer ou tabs contextuais.

## Auditoria por Tela

## Landing Page

### Problemas Visuais

- Hero forte, com imagem real e bom posicionamento emocional.
- O H1 comunica valor, mas usa promessa aspiracional alta: "conquistar sua vaga". Embora comum em marketing, pode ser refinado para nao parecer promessa de resultado.
- O primeiro viewport carrega muitos elementos: selo, H1, texto, quatro highlights, dois CTAs e aviso de edital.
- Secoes posteriores usam muitos cards similares, criando previsibilidade mas pouca memorabilidade.

### Problemas de Navegacao

- Header publico em desktop e claro.
- Em mobile, a navegacao principal some e restam basicamente login/planos. Isso simplifica, mas pode esconder plataforma, modulos e FAQ.
- Nao ha menu mobile para explorar conteudo da landing.

### Oportunidades de Conversao

- Melhorar o CTA principal por etapa:
  - Visitante frio: "Fazer diagnostico gratuito".
  - Visitante pronto para pagar: "Ver Premium".
  - Aluno logado: "Ir para Missao".
- Inserir bloco curto de prova social futura sem depoimento inventado: "Produto preparado para acompanhar desempenho real".
- Reduzir ruido dos highlights no hero em mobile.

### Riscos de Redesign

- Alterar demais a landing pode afetar conversao.
- Remover aviso institucional pode aumentar risco juridico/reputacional.
- Promessas fortes demais podem prejudicar credibilidade.

Prioridade de redesign: Alta para conversao, media para visual.

## Dashboard / Painel de Missao

### Problemas Visuais

- A tela tem muitos blocos: proxima acao, ritmo, upgrade, metricas, missao, preparacao, plano semanal, perfil, pagamento, recomendacoes e metricas finais.
- A proposta de "missao de hoje" compete com metricas e plano de aprovacao.
- Cards de metricas aparecem duas vezes em regioes diferentes, diluindo o foco.
- Em telas pequenas, o aluno precisa rolar bastante antes de concluir se "o que devo fazer agora?" esta resolvido.

### Problemas de Navegacao

- A proxima acao existe, mas poderia ficar visualmente mais dominante e persistente.
- O dashboard aponta para muitas areas, mas nao deixa claro se Academia PGM ou Missao e o centro do produto.

### Oportunidades de Conversao

- Para aluno free, o dashboard e a melhor tela para upsell contextual.
- O upgrade deveria explicar exatamente o que o aluno ganha no proximo passo, nao apenas "liberar premium".
- O bloco de pagamento unico pode ser mais orientado a tarefa: "Libere seu plano automatico".

### Riscos de Redesign

- Mexer no dashboard pode afetar onboarding, premium e percepcao de progresso.
- Reordenar blocos sem medir pode piorar a compreensao.
- Qualquer alteracao deve preservar os redirecionamentos e regras premium.

Prioridade de redesign: Muito alta.

## Academia PGM / Premium

### Problemas Visuais

- A Academia e uma das telas mais importantes, mas visualmente ainda parece uma pagina de dashboard com modulos.
- O rail de 7 modulos em `xl:grid-cols-7` e bom em desktop largo, mas pode ficar comprimido em larguras intermediarias.
- Os modulos usam estrutura longa: razao, resultado esperado, progresso e lista de conteudos. Isso e rico, mas pode gerar muito scroll.
- Para aluno free, a preview dos modulos comunica valor, mas o bloqueio poderia ter melhor narrativa de transformacao.

### Problemas de Navegacao

- A tela tem CTAs para proxima atividade, dashboard, simulados e sucesso. Isso e util, mas pode fragmentar o foco.
- Falta uma indicacao clara de "voce esta no modulo X" ou "continue daqui".

### Oportunidades de Conversao

- A Academia deve ser a vitrine premium principal.
- Para free, o preview poderia mostrar resultado esperado por modulo + CTA unico.
- Para premium, poderia ter um "continue aprendendo" fixo no topo.

### Riscos de Redesign

- Alto risco de quebrar a percepcao premium se a tela ficar muito simples.
- Alto risco de mexer em progresso se redesign vier junto com alteracao funcional.
- Deve ser redesenhada primeiro em UX/wireframe, depois implementada.

Prioridade de redesign: Muito alta.

## Simulados

### Problemas Visuais

- A tela esta mais forte apos o bloco de banco importado, mas ficou mais longa antes do aluno chegar aos templates.
- A area "Banco importado" e valiosa para transparencia, mas pode ser secundaria para o aluno que quer apenas iniciar o simulado.
- O simulado subjetivo oficial aparece antes dos templates objetivos. Isso pode confundir se o objetivo principal for a prova objetiva.
- Historico fica no fim e pode ser pouco percebido.

### Problemas de Navegacao

- O fluxo tem muitos pontos: banco importado, subjetivo, templates, historico.
- Falta um modo "acao principal": iniciar ou continuar simulado oficial.
- Templates bloqueados, insuficientes e premium aparecem no mesmo card, mas poderiam ter estados visuais mais distintos.

### Oportunidades de Conversao

- Tela ideal para upsell premium porque o valor e concreto: "prova simulada, resultado e relatorio".
- O bloqueio premium pode mostrar exatamente: 30 questoes, cronometro, relatorio, recomendacoes.
- Se aluno ja tem premium, a tela pode priorizar continuidade e resultado anterior.

### Riscos de Redesign

- Risco alto se mexer no runner, gabarito, tentativa ou finalizacao.
- Risco medio se alterar apenas ordem visual.
- Nunca expor resposta correta antes do resultado.

Prioridade de redesign: Alta.

## Estudos / Materiais

### Problemas Visuais

- Filtros sao funcionais e claros.
- Cards de materiais estao mais estaveis, mas ainda dependem muito de texto.
- Falta uma camada editorial de destaque: material recomendado, material novo, material essencial ou material vinculado a lacuna do aluno.
- O grid e limpo, mas pode parecer catalogo generico.

### Problemas de Navegacao

- Busca e filtros ajudam, mas nao respondem: "qual material devo ler agora?"
- O aluno depende de categoria/dificuldade para decidir, em vez de uma recomendacao guiada.
- Paginacao simples funciona, mas pode ser pouco elegante quando houver mais volume.

### Oportunidades de Conversao

- Materiais bloqueados podem mostrar preview editorial mais rico sem expor conteudo premium.
- Cada material poderia indicar competencia e relacao com simulado.
- Free poderia ter rota de "leia este primeiro" para reduzir atrito.

### Riscos de Redesign

- Baixo risco se alterar apenas layout.
- Medio risco se mexer em filtros, slugs ou acesso premium.
- Alto risco se expor `content_md` para free por engano.

Prioridade de redesign: Media.

## Flashcards

### Problemas Visuais

- A experiencia de card e clara e direta.
- A lista de decks em coluna lateral funciona em desktop.
- Em mobile, os decks aparecem antes do card; com muitos decks, o aluno pode rolar muito antes de revisar.
- O card tem boa area de toque, mas poderia ter uma sensacao mais "estudo ativo" com estados de frente/verso mais diferenciados.

### Problemas de Navegacao

- Nao ha atalho para decks recomendados.
- Nao ha agrupamento por dificuldade ou competencia.
- Falta modo de revisao sequencial entre categorias.

### Oportunidades de Conversao

- Flashcards sao bom beneficio premium de baixo atrito.
- Poderiam ser usados como "amostra gratuita" com upgrade para baralhos completos.
- Mostrar progresso de revisao por categoria ajuda conversao por valor percebido.

### Riscos de Redesign

- Baixo risco visual.
- Medio risco se alterar tracking de revisao.
- Nao mexer em `reviewFlashcardAction` durante redesign visual.

Prioridade de redesign: Media.

## Trilhas

### Problemas Visuais

- Cards de trilha comunicam idioma, itens, progresso e premium de forma clara.
- A tela de detalhe e funcional, mas os grupos de trilha parecem uma lista operacional, nao uma experiencia de aprendizagem premium.
- A area "Sequencia pedagogica" e pequena e pouco impactante.

### Problemas de Navegacao

- Nao ha uma ordem recomendada global entre trilhas.
- A relacao entre Trilhas e Academia PGM pode ficar confusa: ambas parecem jornada.
- Botao "Concluir" em grupos agregados pode ser interpretado como concluir conteudo sem abrir o item.

### Oportunidades de Conversao

- Trilhas podem ser a melhor narrativa premium se forem apresentadas como "plano guiado".
- Mostrar outcomes por trilha pode aumentar valor percebido.
- Para free, preview da sequencia bloqueada pode converter melhor que card generico.

### Riscos de Redesign

- Medio risco por envolver progresso.
- Alto risco se alterar a semantica de concluir grupo.
- Precisa manter integridade de `path_id`, `item_type` e `item_id`.

Prioridade de redesign: Alta.

## Central de Sucesso

### Problemas Visuais

- Conteudo muito completo, mas denso.
- Muitas secoes competem: busca, recomendacoes, primeiros passos, categorias, FAQ, guias, contato, recursos e arquitetura futura.
- A busca e um bom elemento, mas poderia ser o centro da tela.
- "Arquitetura preparada" aparece para o aluno, mas tem cara de informacao interna de produto.

### Problemas de Navegacao

- A tela e longa e exige muito scroll.
- Categorias e FAQs coexistem sem uma hierarquia clara.
- Links de suporte e recursos aparecem tarde.

### Oportunidades de Conversao

- Reduzir suporte manual melhora margem operacional.
- Para premium, pode virar "Central do Aluno" com status de conta e proximos passos.
- Para free, pode responder duvidas de pagamento e desbloqueio.

### Riscos de Redesign

- Baixo risco tecnico se for apenas layout.
- Medio risco de remover informacoes importantes de suporte.
- Nao implementar tickets junto com redesign visual sem sprint propria.

Prioridade de redesign: Media/Alta.

## Mentor IA

### Problemas Visuais

- Chat e claro, com estrutura classica e prompts rapidos.
- A area do chat usa altura maxima de 58vh; em mobile, pode ficar apertada com header, mensagens e textarea.
- Mensagens longas podem gerar blocos grandes e cansativos.
- A experiencia visual do Mentor nao se conecta fortemente com Missao, Academia ou Simulados.

### Problemas de Navegacao

- O Mentor e uma area isolada.
- Nao ha sugestoes baseadas no contexto do aluno dentro da tela.
- Prompts rapidos sao bons, mas genericos.

### Oportunidades de Conversao

- Mentor IA pode ser um diferencial premium, desde que fique conectado a objetivos reais: diagnostico, simulado, subjetiva, entrevista.
- Para free, a tela bloqueada poderia explicar exemplos concretos de uso.

### Riscos de Redesign

- Alto risco se mexer em prompt, API ou regras do Mentor.
- Baixo risco se redesenhar apenas container, prompts e estados visuais.
- Nao alterar `POST /api/mentor` nesta fase.

Prioridade de redesign: Media.

## Mobile Responsiveness

### Problemas Mobile Principais

1. Navegacao logada horizontal longa.
   - A barra com muitas opcoes exige scroll lateral.
   - Usuario pode nao descobrir itens fora da primeira tela.

2. Header publico sem menu mobile.
   - Links principais somem em telas menores.
   - O usuario mobile fica limitado aos CTAs visiveis.

3. Landing e planos com hero alto.
   - `min-h-[82vh]`, H1 grande e varios highlights podem ocupar quase todo o primeiro scroll em mobile.

4. Tabelas e comparativos com overflow horizontal.
   - Funciona tecnicamente, mas pode parecer menos premium.

5. Listas antes da tarefa principal.
   - Flashcards mostram lista de decks antes do card.
   - Simulados mostram metricas e banco antes de templates.
   - Dashboard mostra muitas secoes antes da rotina completa.

6. CTAs nem sempre ficam proximos ao contexto.
   - Em telas longas, a acao principal pode sumir depois do primeiro scroll.

### Recomendacoes Mobile

- Criar navegacao mobile por drawer ou tabs agrupadas.
- Definir um componente `PageActionBar` para CTA principal em telas longas.
- Reduzir conteudo hero em mobile.
- Transformar comparativos em cards empilhados no mobile.
- Usar headers compactos em telas operacionais, reservando hero grande para marketing.

## Inconsistencias de Componentes

### Componentes Repetidos sem Padrao Unico

- `MetricCard` aparece definido localmente em mais de uma tela.
- `ProgressBar` aparece em Dashboard, Academia, Trilhas e Flashcards com variacoes.
- Badges/pills sao recriados em varias paginas.
- Hero de pagina logada tem variantes, mas sem um componente unico.
- Empty states existem, mas com linguagem e estrutura variada.
- Upgrade card existe, mas nem todos os bloqueios premium usam o mesmo nivel de informacao.

### Riscos

- Crescimento futuro vai gerar inconsistencia visual.
- Ajustar cor, spacing ou estado em varias telas pode virar manutencao cara.
- Sem design tokens semanticos, o amarelo continua acumulando muitos significados.

### Recomendacao

Criar uma biblioteca interna de componentes SaaS:

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

## Oportunidades de Conversao

1. Diagnostico gratuito como porta de entrada.
   - Melhor CTA para landing e visitante frio.

2. Upsell contextual por bloqueio.
   - Em vez de apenas "Premium bloqueado", mostrar beneficio especifico da tela.

3. Academia PGM como produto principal.
   - Hoje ela compete com outras areas; deve virar a narrativa central do premium.

4. Simulado oficial como maior prova de valor.
   - Mostrar mais claramente que o premium entrega experiencia de avaliacao realista.

5. Dashboard como cockpit diario.
   - Para aluno premium, deveria ser quase impossivel nao saber o que fazer agora.

6. Central de Sucesso como reducao de churn.
   - Resolver pagamento, acesso e uso reduz frustracao e melhora retencao.

7. Mentor IA como diferencial premium contextual.
   - Vincular prompts ao que o aluno acabou de fazer: resultado do simulado, material lido, subjetiva enviada.

## Telas Prioritarias para Redesign

| Prioridade | Tela | Motivo |
|---:|---|---|
| 1 | Dashboard / Painel de Missao | E a principal tela diaria e hoje tem excesso de blocos competindo. |
| 2 | Academia PGM / Premium | Deve ser a experiencia premium central e ainda parece dashboard modular. |
| 3 | Landing + Planos | Impacto direto em conversao e clareza comercial. |
| 4 | Simulados | Maior valor funcional do produto; precisa priorizar iniciar/continuar tentativa. |
| 5 | Navegacao mobile / Sidebar | Afeta todas as telas logadas e a descoberta de recursos. |
| 6 | Trilhas | Pode virar plano guiado premium, mas hoje parece lista operacional. |
| 7 | Central de Sucesso | Boa base, mas precisa reduzir densidade e destacar busca/suporte. |
| 8 | Estudos / Materiais | Funcional, mas pode ganhar recomendacao pedagogica. |
| 9 | Flashcards | Bom fluxo, precisa melhorar descoberta e mobile. |
| 10 | Mentor IA | Redesign visual deve esperar estrategia de integracao contextual. |

## Riscos de Mexer em Cada Area

| Area | Risco UX | Risco Tecnico | Cuidados |
|---|---:|---:|---|
| Landing page | Medio | Baixo | Nao exagerar promessa, preservar aviso institucional. |
| Planos | Alto | Medio | Nao quebrar checkout, estados pago/free/bloqueado ou copy financeira. |
| Dashboard | Alto | Medio/Alto | Preservar onboarding, premium, progresso e recomendacoes. |
| Academia PGM | Alto | Medio | Nao misturar redesign com mudanca de progresso. |
| Simulados | Alto | Alto | Nao tocar em gabarito, tentativa, finalizacao ou scoring sem sprint propria. |
| Estudos | Medio | Medio | Nao expor `content_md` premium para free. |
| Flashcards | Medio | Medio | Preservar tracking de revisao. |
| Trilhas | Medio/Alto | Alto | Cuidado com concluir grupo e integridade de progresso. |
| Central de Sucesso | Medio | Baixo | Nao remover informacoes criticas de suporte. |
| Mentor IA | Alto | Alto | Nao alterar prompt, API, base oficial ou politica de resposta nesta fase. |
| Navegacao mobile | Alto | Medio | Testar descoberta, estado ativo, acessibilidade e rotas protegidas. |

## Recomendacao de Estrategia de Redesign

### Fase 1 - Arquitetura de Navegacao

- Agrupar menu.
- Adicionar estado ativo.
- Definir mobile drawer.
- Reposicionar Academia PGM e Missao como eixo principal.

### Fase 2 - Dashboard e Academia

- Transformar Dashboard em cockpit diario.
- Transformar Academia em jornada premium.
- Reduzir cards redundantes.
- Criar acao primaria clara por tela.

### Fase 3 - Conversao

- Refinar Landing e Planos.
- Criar upsell contextual por modulo.
- Melhorar bloqueios premium com beneficio concreto.

### Fase 4 - Ferramentas de Estudo

- Reorganizar Simulados por iniciar/continuar/resultado.
- Melhorar Trilhas como plano guiado.
- Ajustar Estudos e Flashcards com recomendacoes.

### Fase 5 - Suporte e IA

- Simplificar Central de Sucesso.
- Integrar Mentor IA com contexto do aluno, somente em sprint propria.

## Criterios para um Redesign Seguro

- Nenhuma alteracao de banco durante sprint visual.
- Nenhuma alteracao de RLS.
- Nenhuma mudanca em `hasPremiumAccess` ou `canAccessPremiumContent`.
- Nenhuma alteracao de checkout.
- Nenhuma alteracao no Mentor IA.
- Nenhuma mudanca em scoring ou gabarito.
- Criar primeiro componentes compartilhados, depois aplicar por tela.
- Validar desktop e mobile.
- Testar rotas protegidas sem sessao.
- Testar aluno free, premium e admin quando houver mudanca de navegacao.

## Conclusao

A PGM Academy esta em bom ponto para evoluir visualmente. O produto ja tem conteudo, fluxo premium, simulados, trilhas, suporte e IA. O proximo salto nao deve ser "deixar mais bonito" de forma isolada, mas reduzir carga cognitiva, melhorar prioridade de acao e transformar a Academia/Missao no centro da experiencia.

O redesign mais seguro deve comecar por navegacao, hierarquia e componentes compartilhados. Depois, Dashboard e Academia PGM devem ser redesenhados como telas centrais do produto premium. Simulados, Trilhas e Planos devem entrar em seguida por impacto direto em valor percebido e conversao.
