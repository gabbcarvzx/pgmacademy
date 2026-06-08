# Relatorio Sprint 2 - Simulados Oficiais PGM 2026

Data: 04/06/2026  
Objetivo: transformar simulados objetivos e subjetivos em experiencia premium de preparacao oficial, sem alterar a Sprint 1, a base oficial centralizada ou o Mentor IA.

## Entregas Concluidas

- Simulado Objetivo Oficial PGM 2026 com 30 questoes, duracao de referencia de 4 horas, 2 pontos por questao, cronometro, barra de progresso, navegacao entre questoes e confirmacao antes de finalizar com itens sem resposta.
- Tela de resultado premium com nota geral, acertos, erros, tempo gasto, desempenho por categoria, competencias fortes, competencias fracas, proximos passos e trilhas recomendadas.
- Simulado Subjetivo Oficial PGM 2026 com 5 questoes, campos individuais, contador de palavras em tempo real e validacao de 90 a 150 palavras no cliente e no servidor.
- Rubrica oficial estruturada para correcao futura: correcao gramatical, precisao vocabular, estrutura sintatica, coesao e clareza.
- Arquitetura de envio subjetivo reaproveitando `subjective_attempts` e fila de correcao manual existente.

## Arquivos Alterados

- `src/lib/simulations/official-pgm.ts`: contratos oficiais de simulados objetivo/subjetivo, rubrica, duracao, pontuacao e validacao de palavras.
- `src/lib/simulations/service.ts`: normalizacao do modelo oficial, pontuacao por 2 pontos no template completo, tempo gasto e recomendacoes por trilhas existentes.
- `src/components/simulations/simulation-runner.tsx`: cronometro, progresso, navegacao e finalizacao segura.
- `src/components/simulations/official-subjective-runner.tsx`: novo runner subjetivo com 5 respostas e contador de palavras.
- `src/app/(app)/simulados/page.tsx`: entrada do simulado subjetivo oficial e exibicao da duracao oficial.
- `src/app/(app)/simulados/[templateId]/page.tsx`: instrucoes atualizadas para modelo oficial.
- `src/app/(app)/simulados/tentativas/[attemptId]/page.tsx`: passagem de inicio/duracao ao runner.
- `src/app/(app)/simulados/tentativas/[attemptId]/resultado/page.tsx`: relatorio premium de desempenho e trilhas recomendadas.
- `src/app/(app)/simulados/subjetivo-oficial/page.tsx`: nova rota do simulado subjetivo oficial.
- `src/app/(app)/simulados/actions.ts`: server action para envio do simulado subjetivo oficial.
- `src/lib/manual-review/service.ts`: leitura/envio do simulado subjetivo oficial com validacao premium e integridade de tentativas.
- `scripts/content/approved-content.ts`: template completo ajustado para o Simulado Objetivo Oficial PGM 2026.
- `tests/official-simulations.test.ts`: contratos oficiais testados.
- `package.json`: script `test:official-simulations`.

## Tabelas Alteradas

Nenhuma migration foi criada nesta sprint.

Tabelas reaproveitadas:

- `simulation_templates`
- `simulation_attempts`
- `simulation_answers`
- `questions`
- `question_options`
- `question_categories`
- `subjective_attempts`
- `learning_paths`

## APIs e Server Actions

APIs REST existentes preservadas:

- `POST /api/simulations/attempts`
- `POST /api/simulations/attempts/[attemptId]/answers`
- `POST /api/simulations/attempts/[attemptId]/finish`

Server actions alteradas/criadas:

- `finishSimulationAttemptAction`
- `saveSimulationAnswerAction`
- `submitOfficialSubjectiveSimulationAction`

## Seguranca

- Acesso premium mantido por `hasPremiumAccess` e `canAccessPremiumContent`.
- Tentativas objetivas continuam isoladas por `tenant_id` e `user_id`.
- Gabarito objetivo continua indisponivel no cliente antes da finalizacao.
- Subjetivo oficial impede envio sem premium, sem 5 questoes validas ou com resposta pendente.
- Validacao de 90 a 150 palavras ocorre tambem no servidor.
- RLS existente foi preservada; nenhuma politica foi reduzida.

## Riscos

- Se o banco tiver menos de 30 questoes objetivas visiveis para o plano, o simulado oficial sera bloqueado como banco insuficiente.
- O subjetivo oficial seleciona as 5 primeiras questoes subjetivas ativas do acervo atual; no futuro, pode ser melhor criar um blueprint versionado.
- O relatorio recomenda apenas trilhas existentes com `slug`; trilhas sem slug sao ignoradas para evitar links quebrados.

## Testes Executados

- `npx tsc --noEmit`
- `npm run test:official-simulations`
- `npm run test:simulations`
- `npm run content:validate`
- `npm run lint`
- `npm run build`
- `npm run test:mentor`
- `npm run test:eligibility`
- `npm run test:analytics`

Verificacao local:

- `http://localhost:3000/simulados` retornou `307` sem sessao, redirecionando como rota protegida.
- `http://localhost:3000/simulados/subjetivo-oficial` retornou `307` sem sessao, redirecionando como rota protegida.

## Proximos Passos

- Criar blueprint versionado para simulados oficiais, permitindo fixar composicao por idioma/categoria.
- Persistir metadados de rubrica por tentativa subjetiva quando a correcao por criterio for implementada.
- Criar relatorio consolidado objetivo + subjetivo apos revisao manual.
- Adicionar eventos auditaveis de XP/missao quando o Painel de Missao entrar na sprint seguinte.
