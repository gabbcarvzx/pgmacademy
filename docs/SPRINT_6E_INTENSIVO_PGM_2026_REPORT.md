# Relatorio Sprint 6E - Simulados Intensivos PGM 2026

Data: 13/06/2026  
Objetivo: entregar dois simulados objetivos premium de reta final, separados por idioma, com 30 questoes autorais, duracao de 3 horas e diagnostico de recuperacao.

## Entregas Concluidas

- Simulado Intensivo Final PGM 2026 - Ingles.
- Simulado Intensivo Final PGM 2026 - Espanhol.
- 60 questoes objetivas autorais importadas no pipeline editorial.
- 30 questoes por idioma.
- 22 questoes de gramatica/uso da lingua e 8 de interpretacao por idioma.
- Gabarito balanceado em cada idioma: A=6, B=6, C=6, D=6 e E=6.
- Duracao de 180 minutos para os dois novos templates.
- Nova secao premium `Reta Final PGM 2026` em `/simulados`.
- Resultado intensivo com classificacao de preparacao e plano de recuperacao.
- Validador dedicado para confirmar o conteudo importado no Supabase.

## Base Usada da Prova PGM 2024

O PDF fornecido foi auditado como referencia editorial. Ele apresenta:

- 30 questoes objetivas de Ingles.
- Duracao de 3 horas.
- Forte presenca de gramatica basica e uso funcional da lingua.
- Textos curtos de interpretacao ao final.

O novo acervo nao copia questoes da prova. A referencia foi usada para formato, duracao e cobertura de fundamentos. A dificuldade foi ampliada com contextos de intercambio, distratores mais proximos, vocabulario contextual e leitura inferencial.

## Templates Criados

| Editorial ID | Idioma | Questoes | Duracao | Premium |
|---|---|---:|---:|---|
| `TEMPLATE-PGM-INTENSIVO-EN-2026` | Ingles | 30 | 180 min | Sim |
| `TEMPLATE-PGM-INTENSIVO-ES-2026` | Espanhol | 30 | 180 min | Sim |

Fonte editorial exclusiva:

- `Autoral PGM Academy - Sprint 6E Intensivo`

## Composicao Editorial

### Ingles

- 22 itens de comunicacao, gramatica e uso da lingua.
- 8 itens de interpretacao, incluindo vocabulario em contexto.
- Dificuldade: 6 nivel 1, 14 nivel 2, 8 nivel 3 e 2 nivel 4.
- Dez itens de dificuldade alta ou muito alta.

Assuntos: greetings, pronomes, possessivos, verb to be, present continuous, demonstrativos, numeros, artigos, countable/uncountable, indefinite pronouns, question words, simple present, frequencia, preposicoes, passado, direcoes, have, can, futuro, comparativos, superlativos, present perfect, ideia principal, evidencia, inferencia e vocabulario contextual.

### Espanhol

- 22 itens de comunicacao, gramatica e uso da lingua.
- 8 itens de compreensao leitora.
- Dificuldade: 6 nivel 1, 13 nivel 2, 9 nivel 3 e 2 nivel 4.
- Onze itens de dificuldade alta ou muito alta.

Assuntos: saludos, pronomes, possessivos, ser, estar, tener, presente, artigos, genero e numero, adjetivos, preposicoes, interrogativos, demonstrativos, frequencia, verbos regulares e irregulares, perifrases, passado, futuro proximo, comparativos, superlativos, falso cognato, ideia principal, evidencia, inferencia e vocabulario contextual.

## Gabaritos

Distribuicao validada no codigo e no banco:

| Idioma | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Ingles | 6 | 6 | 6 | 6 | 6 |
| Espanhol | 6 | 6 | 6 | 6 | 6 |

O score continua baseado no ID da alternativa. A letra visual nao e usada como fonte de verdade.

## Diagnostico de Reta Final

O resultado dos templates intensivos agora exibe:

- Nota geral, acertos, erros, percentual e tempo gasto ja existentes.
- Desempenho por assunto, pontos fortes e pontos fracos ja existentes.
- `Preparacao forte` para 80% ou mais.
- `Boa base, mas precisa reforcar pontos especificos` entre 60% e 79%.
- `Atencao: revise conteudos essenciais antes da prova` abaixo de 60%.
- Plano de recuperacao para gramatica, interpretacao e vocabulario.

As recomendacoes apontam apenas para areas existentes: Estudos, Trilhas, Flashcards e Dashboard. Nenhum resultado usa os termos aprovado ou reprovado.

## Arquivos Criados

- `docs/AUDITORIA_SPRINT_6E_INTENSIVO_PGM.md`
- `docs/SPRINT_6E_INTENSIVO_PGM_2026_REPORT.md`
- `scripts/content/intensive-simulations.ts`
- `scripts/import-intensive-simulations.ts`
- `scripts/validate-intensive-simulations-imported.ts`
- `src/lib/simulations/intensive-pgm.ts`
- `tests/intensive-simulations.test.ts`
- `docs/import-reports/2026-06-13T20-13-49-082Z-dry-run-sprint-6e-intensive-pgm-2026.json.md`
- `docs/import-reports/2026-06-13T20-15-30-357Z-execute-sprint-6e-intensive-pgm-2026.json.md`

## Arquivos Alterados

- `package.json`
- `src/app/(app)/simulados/page.tsx`
- `src/app/(app)/simulados/tentativas/[attemptId]/resultado/page.tsx`
- `src/lib/simulations/official-pgm.ts`
- `src/lib/simulations/service.ts`

## Banco e Importacao

Nenhuma migration foi criada.

Conteudo importado:

- 2 templates.
- 60 questoes.
- 300 alternativas.
- 0 itens invalidos.
- 0 avisos.
- 0 erros.

Tabelas reutilizadas:

- `simulation_templates`
- `question_banks`
- `questions`
- `question_options`
- `simulation_attempts`
- `simulation_answers`
- `question_categories`
- `competencies`
- `learning_paths`

## Seguranca Preservada

- Premium continua validado no servidor.
- Tentativas continuam isoladas por `tenant_id` e `user_id`.
- Questao salva precisa pertencer a tentativa.
- Alternativa salva precisa pertencer a questao.
- O runner nao recebe `is_correct`, resposta correta ou explicacao.
- O resultado com gabarito exige tentativa finalizada.
- Ingles e Espanhol sao separados por idioma e `source_reference`.
- Templates e tentativas antigas foram preservados.
- RLS, autenticacao, pagamentos, webhooks, Mentor IA e service role do produto nao foram alterados.

## Validacoes Executadas

- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- `npm run content:validate`: passou.
- `npm run content:validate-imported`: passou.
- `npm run content:validate-intensive-imported`: passou.
- `npm run test:official-simulations`: passou.
- `npm run test:simulations`: passou.
- `npm run test:intensive-simulations`: passou.
- `git diff --check`: passou.

Importacao:

- `npm run intensive:import`: dry-run passou com 60 itens validos.
- `npm run intensive:import -- --execute --update`: criou 60 questoes e atualizou/criou 2 templates.

QA local:

- Build de producao gerou todas as rotas sem erro.
- `/` carregou com conteudo e sem overlay de erro.
- `/simulados` sem sessao redirecionou para `/login`.
- Viewport mobile 390x844 nao apresentou overflow horizontal na tela de login.
- Screenshots locais foram gerados para desktop publico e login mobile.

## Limitacoes do QA

Nao havia fixture autenticada segura para abrir `/simulados` como aluno free e premium sem criar ou alterar usuarios. Por isso, a nova secao foi validada por TypeScript, lint, build, leitura estatica, importacao real, consulta de volta ao banco e protecao da rota sem sessao. A captura autenticada da secao e do resultado permanece recomendada em staging.

## Riscos Remanescentes

1. Revisao pedagogica humana.
   - A validacao automatica confirma estrutura e coerencia de metadados, mas uma revisao final por professor de Ingles e Espanhol aumenta a confianca editorial.

2. QA visual autenticado.
   - Deve ser feito com fixture free e premium em staging, especialmente nos cards intensivos e no diagnostico pos-prova.

3. Calibracao baseada em desempenho real.
   - A dificuldade inicial e editorial. Depois das primeiras tentativas, vale acompanhar taxa de acerto por item para identificar questoes faceis demais, ambiguas ou excessivamente dificeis.

## Proximos Passos

1. Executar QA autenticado em desktop e mobile com contas free e premium.
2. Fazer revisao linguistica final por especialistas dos dois idiomas.
3. Monitorar taxa de acerto, abandono e tempo medio por questao.
4. Criar uma segunda versao intensiva somente depois de obter dados reais de desempenho.
5. Usar o resultado intensivo como entrada para campanhas de retencao e recomendacoes de estudo, sem prometer aprovacao.
