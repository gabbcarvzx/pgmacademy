# Auditoria dos Simulados Oficiais PGM

Data: 11/06/2026  
Objetivo: auditar templates, questoes, alternativas, gabaritos, idiomas, categorias, dificuldade, premium/free, finalizacao, resultado e protecao de gabarito dos simulados PGM.

## Escopo Auditado

- Pipeline editorial em `scripts/content/approved-content.ts`.
- Contratos oficiais em `src/lib/simulations/official-pgm.ts`.
- Catalogo e travas em `src/lib/simulations/catalog.ts`.
- Servico de simulados em `src/lib/simulations/service.ts`.
- UI de `/simulados`.
- Runner objetivo.
- Resultado pos-finalizacao.
- Simulado subjetivo oficial.
- Controle premium existente.

Nao foram auditados por login real nesta etapa: contas free, premium e admin autenticadas em browser, pois a correcao foi feita sem criar fixtures, sem alterar Auth e sem tocar em banco.

## Simulados Encontrados

| Template | Tipo | Idioma | Questoes | Premium | Papel atual |
|---|---|---:|---:|---|---|
| `TEMPLATE-SCALE-FULL-MIXED` | full | mixed | 30 | Sim | Treino geral de apoio com banco misto. |
| `TEMPLATE-SCALE-QUICK-EN` | quick | english | 10 | Sim | Simulado objetivo por idioma - Ingles. |
| `TEMPLATE-SCALE-QUICK-ES` | quick | spanish | 10 | Sim | Simulado objetivo por idioma - Espanhol. |
| `TEMPLATE-SCALE-QUICK-PT` | quick | portuguese | 10 | Sim | Apoio de edital/preparacao segura. |
| `TEMPLATE-SCALE-QUICK-PSY` | quick | psychosocial | 10 | Sim | Apoio psicossocial. |

Banco objetivo aprovado:

| Idioma | Total |
|---|---:|
| english | 35 |
| spanish | 25 |
| portuguese | 20 |
| mixed | 10 |
| psychosocial | 10 |
| Total | 100 |

## Auditoria Read-Only do Banco Ativo

Uma consulta somente leitura mostrou que existem 450 questoes objetivas ativas no banco, incluindo lotes legados das Sprints 6B.2 e 6B.3. A distribuicao bruta global do banco ativo estava assim:

| Recorte | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Banco ativo total | 422 | 27 | 1 | 0 | 0 |

Os templates oficiais ativos pertencem ao lote `Autoral PGM Academy - Etapa 8F`. Por isso, a correcao passou a isolar a selecao por `source_reference`, evitando que simulados oficiais puxem acervo legado.

Distribuicao do lote 8F no banco persistido:

| Recorte 8F | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Bruta persistida | 92 | 8 | 0 | 0 | 0 |
| Normalizada pelo runtime | 20 | 20 | 20 | 20 | 20 |

## Distribuicao Antiga Encontrada

Antes da correcao, a distribuicao do banco objetivo estava fortemente concentrada em `A`.

| Recorte | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Banco objetivo total | 92 | 8 | 0 | 0 | 0 |
| English | 27 | 8 | 0 | 0 | 0 |
| Spanish | 25 | 0 | 0 | 0 | 0 |
| Portuguese | 20 | 0 | 0 | 0 | 0 |
| Mixed | 10 | 0 | 0 | 0 | 0 |
| Psychosocial | 10 | 0 | 0 | 0 | 0 |

Distribuicao antiga por template:

| Template | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| `TEMPLATE-SCALE-FULL-MIXED` | 25 | 5 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-EN` | 2 | 8 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-ES` | 10 | 0 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-PT` | 10 | 0 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-PSY` | 10 | 0 | 0 | 0 | 0 |

## Problemas Encontrados

1. Concentracao editorial critica no gabarito.
   - A letra `A` concentrava 92% das respostas corretas.
   - Isso fragiliza confianca, previsibilidade e valor percebido do simulado.

2. Simulados por idioma pouco claros na UI.
   - Ingles e Espanhol existiam como templates, mas a pagina nao separava claramente objetivo/subjetivo por idioma.
   - O simulado subjetivo abria uma rota unica sem escolha visual de idioma.

3. Risco de banco persistido legado.
   - O banco ativo possui lotes anteriores ao 8F com forte concentracao em `A`.
   - A correcao precisava proteger a exibicao runtime e tambem impedir mistura de fontes editoriais.

4. Banco espanhol ainda insuficiente para um objetivo oficial de 30 questoes por idioma.
   - Existem 25 questoes objetivas em espanhol no lote atual.
   - Por seguranca, a sprint reutilizou templates existentes e nao criou um template espanhol de 30 questoes que ficaria bloqueado por banco insuficiente.

## Riscos Editoriais

- Explicacoes precisam continuar coerentes apos realocar a resposta correta para outro rotulo.
- O simulado misto nao deve ser confundido com a prova por idioma escolhida pelo candidato.
- Se o banco em producao nao for reimportado, a fonte persistida ainda pode conter alternativas com labels antigas, embora a camada runtime ja normalize a apresentacao.
- Criar novos templates oficiais de 30 questoes por idioma sem banco suficiente geraria bloqueio e frustracao.

## Recomendacoes

1. Manter teste automatico de distribuicao A/B/C/D/E.
2. Reimportar conteudo editorial em ambiente controlado para persistir as alternativas corrigidas.
3. Manter selecao de simulado oficial isolada por `source_reference`.
4. Expandir Espanhol para pelo menos 30 questoes objetivas antes de promover um template espanhol de 30 questoes.
5. Criar blueprint versionado de simulado oficial por idioma em sprint editorial propria.
6. Manter o gabarito protegido no runner, expondo `is_correct` somente no servidor e no resultado final.
