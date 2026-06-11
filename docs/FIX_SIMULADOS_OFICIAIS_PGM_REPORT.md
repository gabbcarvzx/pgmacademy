# Fix Simulados Oficiais PGM

Data: 11/06/2026  
Objetivo: restaurar a confianca editorial dos simulados corrigindo gabaritos concentrados em `A` e separando a experiencia por idioma.

## Causa do Problema

O pipeline editorial importava as alternativas mantendo a resposta correta quase sempre na primeira alternativa. Como o banco objetivo usa cinco alternativas, isso criou um padrao previsivel:

- Banco total: 92 respostas corretas em `A`, 8 em `B`, 0 em `C/D/E`.
- Simulado misto de 30 questoes: 25 respostas em `A` e 5 em `B`.
- Templates de Espanhol, Portugues e Psicossocial: 100% das respostas corretas em `A`.

Esse problema era editorial e de apresentacao, nao de scoring. O score usa ID da alternativa correta, mas a letra exibida ficava previsivel e prejudicava a experiencia do aluno.

Durante a auditoria read-only do banco ativo, tambem foi identificado que existem 450 questoes objetivas ativas de lotes diferentes. Os templates oficiais atuais usam `source_reference = Autoral PGM Academy - Etapa 8F`, entao a selecao da tentativa passou a respeitar a mesma fonte editorial do template.

## Simulados Afetados

- `TEMPLATE-SCALE-FULL-MIXED`
- `TEMPLATE-SCALE-QUICK-EN`
- `TEMPLATE-SCALE-QUICK-ES`
- `TEMPLATE-SCALE-QUICK-PT`
- `TEMPLATE-SCALE-QUICK-PSY`

## Distribuicao Antiga

| Template | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Banco objetivo total | 92 | 8 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-FULL-MIXED` | 25 | 5 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-EN` | 2 | 8 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-ES` | 10 | 0 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-PT` | 10 | 0 | 0 | 0 | 0 |
| `TEMPLATE-SCALE-QUICK-PSY` | 10 | 0 | 0 | 0 | 0 |

## Distribuicao Nova

| Template | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Banco objetivo total | 20 | 20 | 20 | 20 | 20 |
| `TEMPLATE-SCALE-FULL-MIXED` | 6 | 6 | 6 | 6 | 6 |
| `TEMPLATE-SCALE-QUICK-EN` | 2 | 2 | 2 | 2 | 2 |
| `TEMPLATE-SCALE-QUICK-ES` | 2 | 2 | 2 | 2 | 2 |
| `TEMPLATE-SCALE-QUICK-PT` | 2 | 2 | 2 | 2 | 2 |
| `TEMPLATE-SCALE-QUICK-PSY` | 2 | 2 | 2 | 2 | 2 |

## Arquivos Alterados

- `scripts/content/approved-content.ts`
- `src/lib/simulations/answer-key.ts`
- `src/lib/simulations/catalog.ts`
- `src/lib/simulations/service.ts`
- `src/lib/manual-review/service.ts`
- `src/app/(app)/simulados/page.tsx`
- `src/app/(app)/simulados/actions.ts`
- `src/app/(app)/simulados/subjetivo-oficial/page.tsx`
- `src/components/simulations/official-subjective-runner.tsx`
- `tests/official-simulations.test.ts`
- `tests/simulation-scoring.test.ts`
- `docs/AUDITORIA_SIMULADOS_OFICIAIS_PGM.md`
- `docs/AUDITORIA_POS_FIX_SIMULADOS.md`
- `docs/FIX_SIMULADOS_OFICIAIS_PGM_REPORT.md`

## Alteracao em Templates

Nao houve criacao de novos IDs nem migration.

Os templates existentes foram preservados e normalizados editorialmente:

- `TEMPLATE-SCALE-QUICK-EN` virou `Simulado Objetivo - Ingles`.
- `TEMPLATE-SCALE-QUICK-ES` virou `Simulado Objetivo - Espanhol`.
- `TEMPLATE-SCALE-FULL-MIXED` passou a ser tratado como treino geral de apoio.

Motivo: preservar historico, tentativas existentes, referencias de trilhas e integridade de dados.

## Alteracao em Questoes

Houve alteracao no pipeline de conteudo para balancear alternativas futuras.

Como funciona:

- A resposta semanticamente correta permanece a mesma.
- O texto da alternativa correta e movido para uma letra alvo balanceada.
- O distrator que estava na letra alvo troca de lugar com a alternativa correta antiga.
- A explicacao da questao continua coerente porque o conteudo correto nao muda, apenas o rotulo.

Para bancos ja importados, a camada runtime normaliza a exibicao dos labels no servidor, sem alterar IDs nem tentativas historicas.

## Fronteira Editorial por Source Reference

Foi adicionada uma protecao de selecao:

- Se o template possui `source_reference`, apenas questoes com a mesma `source_reference` entram na tentativa.
- Se um template legado nao tiver `source_reference`, o comportamento antigo fica preservado.
- Isso impede que templates 8F puxem questoes legadas das Sprints 6B.2/6B.3.

Impacto de negocio: o aluno passa a receber uma prova editorialmente coesa, sem mistura acidental de bancos antigos.

## Separacao por Idioma

Objetivos:

- Ingles: `/simulados` mostra `Simulado Objetivo - Ingles`.
- Espanhol: `/simulados` mostra `Simulado Objetivo - Espanhol`.

Subjetivos:

- Ingles: `/simulados/subjetivo-oficial?idioma=english`.
- Espanhol: `/simulados/subjetivo-oficial?idioma=spanish`.

Sem parametro, a rota subjetiva continua abrindo Ingles por compatibilidade.

## Protecao do Gabarito

Antes da finalizacao:

- O runner busca `is_correct` apenas no servidor para normalizar labels.
- O cliente recebe somente `id`, `label` e `text`.
- O gabarito nao e enviado ao browser.

Apos a finalizacao:

- O resultado pode exibir alternativa correta.
- O score continua baseado em ID de alternativa.
- A normalizacao de labels mantem consistencia visual.

## O Que Foi Preservado

Nao foram alterados:

- Banco.
- Migrations.
- Supabase RLS.
- Autenticacao.
- Pagamentos.
- Webhooks.
- Mentor IA.
- Service role.
- Regras premium.
- Checkout.
- Dados de usuarios reais.
- Historico de tentativas.
- Scoring.
- Gabaritos expostos antes da finalizacao.

Nenhuma migration foi criada. Nenhuma API nova foi criada.

## Validacoes Executadas

- Auditoria local de distribuicao do pipeline: passou.
- Auditoria read-only do banco ativo e do lote 8F: passou.
- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- `npm run content:validate`: passou.
- `npm run content:validate-imported`: passou.
- `npm run test:official-simulations`: passou.
- `npm run test:simulations`: passou.

## Riscos Remanescentes

1. Persistencia em producao.
   - Se o banco ja tiver import antigo, a nova distribuicao so sera persistida apos nova importacao segura.
   - A camada runtime reduz o risco imediato sem apagar historico.

2. Lotes legados ativos.
   - Existem questoes objetivas antigas ainda ativas.
   - Os simulados oficiais foram protegidos por `source_reference`, mas vale auditar futuramente se esses lotes devem continuar ativos.

3. Espanhol com 25 questoes.
   - Ainda falta volume para um objetivo completo de 30 questoes apenas em Espanhol.

4. QA visual autenticado.
   - A separacao visual foi feita no codigo, mas QA com aluno free/premium/admin depende de fixtures seguras.

5. Blueprint oficial por idioma.
   - O produto deve evoluir para blueprint versionado de simulado oficial, com composicao fixa por idioma, categoria e competencia.

## Recomendacoes Futuras

1. Criar Sprint editorial para expandir Espanhol para pelo menos 30 questoes objetivas.
2. Criar blueprint versionado para simulados oficiais por idioma.
3. Reimportar conteudo corrigido em staging antes de producao.
4. Adicionar auditoria de distribuicao A/B/C/D/E no pipeline de importacao.
5. Executar QA autenticado com fixtures free, premium e admin.

## Conclusao

O bug de gabarito concentrado em `A` foi corrigido sem tocar em regras sensiveis. A PGM Academy agora tem distribuicao equilibrada no pipeline editorial, protecao runtime para bancos legados e uma experiencia de simulados mais clara por tipo e idioma.
