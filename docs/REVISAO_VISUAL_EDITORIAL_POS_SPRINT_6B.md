# Revisao Visual Editorial Pos Sprint 6B

Data: 08/06/2026  
Objetivo: revisar a organizacao visual e editorial da PGM Academy apos os ultimos imports de conteudo, fazendo apenas ajustes seguros de apresentacao, sem alterar banco, RLS, autenticacao, pagamentos, Mentor IA ou regras premium.

## Escopo Verificado

- Central de Estudos (`/estudos` e `/estudos/[slug]`).
- Flashcards (`/flashcards`).
- Simulados (`/simulados`, runner e relatorio de resultado).
- Trilhas (`/trilhas` e `/trilhas/[slug]`).
- Academia PGM (`/premium`).
- Contratos de importacao e validacao de conteudo.
- Visibilidade do conteudo importado por contagem local e snapshot no Supabase.

## Resultado Executivo

A plataforma esta consistente e o banco importado esta aparecendo corretamente nas areas de conteudo. A validacao importada confirmou:

- 20 categorias.
- 5 bancos.
- 5 templates.
- 12 materiais.
- 60 flashcards.
- 120 questoes.
- 100 objetivas.
- 20 subjetivas.
- 500 alternativas.
- 30 perguntas psicossociais.
- 6 trilhas.
- 246 itens de trilha.

O ponto editorial mais importante encontrado e que as 100 questoes objetivas do source atual estao organizadas por categoria e dificuldade legada, mas ainda nao possuem `primary_competency_id` vinculado. Isso nao quebra simulados nem seguranca; apenas limita a leitura por competencia ate que o acervo seja enriquecido por import editorial com vinculo de competencia.

## Organizacao das Questoes

Situacao atual:

- Categoria: organizada e funcional.
- Dificuldade: organizada pela classificacao legada (`beginner`, `intermediate`, `advanced`).
- Competencia: estrutura existe no banco, mas o lote `Autoral PGM Academy - Etapa 8F` ainda esta sem competencia primaria vinculada nas questoes objetivas.

Distribuicao objetiva do source atual por categoria:

| Categoria | Questoes |
|---|---:|
| Conhecimentos do Programa | 20 |
| Gramatica Espanhola - Uso Basico | 13 |
| Comprension Lectora - Vida Escolar | 12 |
| Estrategia de Resposta Escrita | 10 |
| Grammar - Functional Accuracy | 10 |
| Reading Comprehension - PGM Context | 10 |
| Vocabulary - School and Travel | 10 |
| Everyday English | 5 |
| Entrevista - Adaptacao Cultural | 4 |
| Entrevista - Autoconhecimento | 3 |
| Entrevista - Responsabilidade e Equipe | 3 |

Distribuicao por dificuldade:

| Dificuldade | Questoes |
|---|---:|
| Iniciante | 47 |
| Intermediario | 45 |
| Avancado | 8 |

Distribuicao por competencia:

| Competencia | Questoes |
|---|---:|
| Competencia nao vinculada | 100 |

## Ajustes Realizados

### Simulados

Arquivo editado:

- `src/lib/simulations/service.ts`
- `src/app/(app)/simulados/page.tsx`
- `src/components/simulations/simulation-runner.tsx`

Ajustes:

- A pagina de Simulados passou a exibir um bloco "Banco importado" com composicao por categoria, competencia e dificuldade.
- A composicao usa apenas questoes objetivas visiveis para o acesso atual.
- Quando a competencia ainda nao estiver vinculada, a interface mostra "Competencia nao vinculada" de forma clara.
- O runner do simulado passou a exibir idioma e dificuldade com labels em portugues, evitando valores tecnicos como `english` e `intermediate`.

Impacto:

- Melhora a transparencia editorial para o aluno premium.
- Ajuda a perceber se o banco esta equilibrado antes de iniciar uma tentativa.
- Nao altera scoring, templates, tentativas, respostas, gabarito ou controle premium.

### Materiais

Arquivo editado:

- `src/app/(app)/estudos/page.tsx`

Ajustes:

- Cards de materiais receberam altura minima, layout em coluna e CTA alinhado na base.
- Titulos e categorias agora usam quebra segura de texto.

Impacto:

- Reduz cards desalinhados quando titulos importados ficam maiores.
- Evita overflow visual em mobile e desktop.
- Nao altera conteudo, slug, filtro, permissao ou progresso.

### Flashcards

Arquivo editado:

- `src/components/learning/flashcard-deck.tsx`

Ajustes:

- Barra de progresso recebeu largura real e limite responsivo.
- Frente/verso do card ganhou quebra segura e preservacao de linhas.
- CTA passou de texto repetido para "Marcar revisado" antes da conclusao e "Revisado" depois.

Impacto:

- Fluxo fica mais claro para o aluno.
- Textos longos importados ficam menos propensos a quebrar o layout.
- Nao altera persistencia de progresso.

## Itens Verificados Sem Alteracao

- Trilhas continuam coerentes: listam progresso, itens, bloqueio premium e sequencia pedagogica.
- Academia PGM continua clara para premium/free e nao teve regra alterada.
- Materiais, flashcards e trilhas continuam respeitando `hasPremiumAccess` e `canAccessPremiumContent`.
- Simulados continuam protegendo gabarito antes da finalizacao.
- Rotas protegidas retornaram `307` sem sessao para `/simulados` e `/estudos`, como esperado.
- Home publica respondeu `200` no dev server local.

## Nao Alterado

- Nenhuma migration criada.
- Nenhuma tabela alterada.
- Nenhuma policy de RLS alterada.
- Nenhuma regra premium alterada.
- Nenhum fluxo de autenticacao alterado.
- Nenhum fluxo de pagamento alterado.
- Nenhum prompt, base ou rota do Mentor IA alterado.
- Nenhuma API REST alterada.

## Limitacoes da Revisao Visual

O navegador interno da sessao nao estava disponivel para automacao visual. Por isso, a checagem visual foi feita por:

- revisao estatica dos componentes;
- execucao local do dev server;
- verificacao HTTP de rotas publicas e protegidas;
- TypeScript, ESLint e build de producao;
- validacao local e importada do conteudo.

Nao foi criado usuario manual para navegacao visual, para respeitar a restricao de nao alterar autenticacao fora dos scripts de validacao solicitados.

## Riscos Identificados

| Risco | Impacto | Recomendacao |
|---|---:|---|
| Questoes objetivas sem competencia primaria vinculada | Medio | Em proxima sprint editorial, vincular `primary_competency_id` no import ou em rotina de reclassificacao. |
| Dificuldade ainda aparece como legado no lote atual | Baixo/Medio | Migrar o lote para `editorial_difficulty_level` quando a Sprint permitir atualizacao editorial. |
| Materiais ainda podem estar rasos | Alto para valor premium | Executar Sprint 6C de expansao dos 12 materiais. |
| Revisao visual autenticada sem browser conectado | Baixo | Fazer QA manual logado ou Playwright autenticado em sprint de polimento. |

## Testes Executados

- `npx tsc --noEmit` - passou.
- `npm run lint` - passou.
- `npm run build` - passou.
- `npm run content:validate` - passou.
- `npm run content:validate-imported` - passou.

Verificacao local:

- Dev server iniciado em `http://localhost:3000`.
- `/` respondeu `200`.
- `/simulados` respondeu `307` sem sessao.
- `/estudos` respondeu `307` sem sessao.

## Proximos Passos Recomendados

1. Executar a Sprint 6C expandindo os 12 materiais sem alterar banco, auth, pagamentos, Mentor IA ou rotas sensiveis.
2. Enriquecer o lote de questoes com vinculo de competencia primaria usando a infraestrutura editorial ja existente.
3. Criar uma QA visual autenticada com usuario premium controlado em ambiente de staging.
4. Padronizar nomes editoriais com acentuacao e linguagem final para categorias antigas como `Gramatica` e `Comprension Lectora`.
5. Avaliar uma pagina futura de "Banco de Questoes" apenas se fizer sentido de produto, sem expor gabarito antes do simulado.
