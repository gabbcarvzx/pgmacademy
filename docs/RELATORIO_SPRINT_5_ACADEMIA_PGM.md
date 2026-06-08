# Relatório Sprint 5 - Academia PGM

Data: 04/06/2026  
Objetivo: reformular a antiga Área Premium em uma Academia PGM premium, guiada por módulos, progresso real e próximo passo claro, sem alterar Sprint 1, Sprint 2, Sprint 3 ou Sprint 4.

## Entregas Concluídas

- Rota `/premium` transformada em Academia PGM.
- Jornada visual com 7 módulos e 37 atividades: Rota de Aprovação PGM, Inglês, Espanhol, Escrita Internacional, Treino Psicossocial, Vida Internacional e Embarque e Documentação.
- Progresso geral da Academia com módulos concluídos, atividades concluídas e percentual.
- Progresso individual por módulo com status: não iniciado, em andamento e concluído.
- Próxima atividade calculada a partir de premium, onboarding, simulados e pendências dos módulos.
- Experiência premium completa com atividades, links para áreas existentes e origem do progresso quando disponível.
- Experiência gratuita com preview do valor da Academia, sem expor a lista completa de execução premium.
- Card de conclusão exibido quando todos os módulos forem concluídos.
- Navegação lateral renomeada de Área Premium para Academia PGM.
- Teste automatizado para contrato dos módulos e cálculo de progresso.

## Arquivos Alterados

- `src/lib/academy/content.ts`: novo conteúdo estruturado da Academia, com módulos, atividades, links e normalização textual.
- `src/lib/academy/rules.ts`: regras puras de progresso por módulo e progresso geral.
- `src/lib/academy/service.ts`: agregação server-side do progresso do aluno usando tabelas existentes e controle premium.
- `src/app/(app)/premium/page.tsx`: nova experiência visual da Academia PGM.
- `src/components/app-shell/app-sidebar.tsx`: item de navegação atualizado para Academia PGM.
- `tests/academy-rules.test.ts`: testes da estrutura dos 7 módulos, 37 atividades e regras de progresso.
- `package.json`: script `test:academy`.
- `docs/RELATORIO_SPRINT_5_ACADEMIA_PGM.md`: relatório técnico da sprint.

## Componentes e Rotas

- Rota alterada: `/premium`.
- Componentes internos da rota: barra de progresso, card de métrica, jornada visual, próxima atividade, preview gratuito e card de módulo.
- Navegação alterada: `AppSidebar`.

## Tabelas Alteradas

Nenhuma migration foi criada nesta sprint.

Tabelas reaproveitadas em leitura:

- `profiles`
- `student_onboarding`
- `user_learning_progress`
- `learning_paths`
- `learning_path_items`
- `study_materials`
- `flashcards`
- `simulation_attempts`
- `subjective_attempts`
- `psychosocial_attempts`

## APIs Alteradas

Nenhuma API REST foi criada ou alterada.

## Segurança

- `/premium` continua protegida por autenticação e redireciona usuários sem sessão para `/login`.
- A liberação completa da Academia usa `hasPremiumAccess`.
- Usuários gratuitos veem apenas preview dos módulos, sem lista completa de execução premium.
- A agregação server-side filtra dados por `user_id` e `tenant_id`.
- Conteúdos globais com `tenant_id = null` continuam visíveis sem misturar dados privados entre tenants.
- Nenhuma política RLS foi reduzida.
- Nenhum fluxo de pagamento, webhook, Mentor IA, base oficial, simulados oficiais, onboarding, missão ou Central de Sucesso foi alterado.

## Riscos

- O progresso por conteúdo usa correspondência por palavras-chave contra trilhas, materiais e flashcards existentes; isso é suficiente para MVP, mas deve evoluir para blueprint versionado.
- Como a agregação usa service role no servidor, novas consultas futuras precisam manter obrigatoriamente filtros por `tenant_id` e `user_id`.
- Os módulos Vida Internacional e Embarque ainda usam âncoras dentro da própria Academia; no futuro, podem virar aulas dedicadas com páginas próprias.
- Se títulos editoriais mudarem muito, alguns itens podem deixar de ser reconhecidos como concluídos até a criação de vínculo persistido.

## Testes Executados

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run test:academy`
- `npm run test:mission`
- `npm run test:success-center`
- `npm run test:official-simulations`
- `npm run test:simulations`
- `npm run test:mentor`
- `npm run test:eligibility`
- `npm run test:analytics`
- `npm run content:validate`

## Verificação Local

- `http://localhost:3000/premium` sem sessão retornou `307` com `Location=/login`.
- O build de produção confirmou `/premium` como rota dinâmica server-rendered.

## Melhorias Futuras

- Criar páginas próprias para cada aula da Academia.
- Criar blueprint versionado da Academia para vincular atividades a conteúdos por ID, não por palavras-chave.
- Persistir eventos de conclusão específicos da Academia quando o produto exigir auditoria mais granular.
- Adicionar editor administrativo para módulos, aulas e ordem da jornada.
- Criar relatório consolidado entre Academia, Painel de Missão, Simulados Oficiais e Analytics.
