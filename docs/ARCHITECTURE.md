# PGM Academy - Arquitetura Inicial

## Etapa 1

Esta etapa cria a fundacao tecnica do produto, sem integrar credenciais privadas.

## Etapa 2

Esta etapa adiciona a base funcional do diagnostico publico, a estrutura inicial da area do aluno e a modelagem Supabase
com isolamento multi-tenant.

## Etapa 3

Esta etapa adiciona autenticacao por email e senha com Supabase Auth, protecao da area `/dashboard`, logout e persistencia
do diagnostico no banco para usuarios autenticados.

Regras de implementacao:

- `/diagnostico` permanece publico para aumentar conversao
- usuario anonimo consegue calcular, mas nao salva historico
- usuario autenticado salva diagnostico em `eligibility_assessments`
- dashboard exige sessao ativa
- todas as leituras do dashboard passam por RLS e `tenant_id`
- senha minima no cadastro: 8 caracteres
- chave `SUPABASE_SERVICE_ROLE_KEY` continua fora do client e nao e usada nesta etapa

Dependencia operacional:

- aplicar `supabase/migrations/001_initial_schema.sql` no projeto Supabase antes de usar persistencia real
- instrucoes em `docs/SUPABASE_SETUP.md`

## Stack

- Frontend: Next.js App Router, TypeScript, TailwindCSS
- Hospedagem alvo: Vercel
- Banco e auth planejados: Supabase Auth + Postgres + Row Level Security
- Billing planejado: Asaas, pagamento unico de R$ 29,90
- IA planejada: OpenAI API consumida apenas por rotas backend

## Fronteiras

- Frontend: paginas publicas, dashboard, componentes de produto e UI
- Backend: Route Handlers, Server Actions e webhooks
- Banco: Supabase Postgres com RLS obrigatorio
- Billing: eventos Asaas validados server-side
- IA: chamadas OpenAI isoladas do cliente

## Multi-tenant

Mesmo com venda inicial B2C, cada estudante deve ser associado a um tenant pessoal.
Isso permite evoluir para escolas, turmas, mentores e parceiros sem redesenhar o banco.

Regras obrigatorias:

- Toda entidade de negocio deve ter `tenant_id`
- Indices compostos devem considerar `tenant_id`
- RLS deve impedir leitura e escrita entre tenants
- Autorizacao deve ser revalidada no backend, nao apenas em proxy/middleware

## Entidades Planejadas

- tenants
- profiles
- subscriptions
- payment_events
- eligibility_assessments
- approval_steps
- questions
- simulations
- simulation_attempts
- written_answers
- ai_feedback
- mentor_threads
- premium_contents
- audit_logs

## Entidades Criadas na Migration Inicial

- tenants
- profiles
- subscriptions
- eligibility_assessments
- audit_logs

Todas as tabelas de negocio foram preparadas com `tenant_id`, indices compostos e RLS.

## Diagnostico de Elegibilidade

Fonte: Edital de Abertura nº 01/2026 do Programa Ganhe o Mundo.

Regras implementadas:

- Data de nascimento entre 01/05/2009 e 01/10/2012
- Matricula no 1º ou 2º ano do Ensino Medio em 2026
- Escola publica da rede estadual de Pernambuco
- Cadastro ativo e enturmacao no SIEPE
- Escola fora das categorias excluidas pelo edital
- Frequencia minima de 85%
- Media minima de 7,0 em Lingua Portuguesa
- Media minima de 7,0 em Matematica
- Media minima de 7,0 em Ciencias Humanas
- Sem progressao parcial em 2026
- Sem convocacao anterior para intercambio pelo Programa Ganhe o Mundo

Classificacao do produto:

- Elegivel: todos os criterios avaliados atendidos
- Parcialmente elegivel: requisitos estruturais atendidos, mas frequencia ou medias abaixo do minimo
- Nao elegivel: requisito estrutural impeditivo encontrado

Observacao: "Parcialmente elegivel" e uma classificacao do produto para orientar preparacao. A validacao oficial depende
dos sistemas e instituicoes responsaveis pelo processo seletivo.

## Billing Asaas

Fluxo implementado na Etapa 5:

1. Usuario cria conta
2. Sistema cria tenant pessoal
3. Usuario informa CPF/CNPJ do pagador
4. Usuario inicia pagamento unico
5. Backend cria cliente/cobranca no Asaas
6. Webhook confirma pagamento
7. Sistema registra evento idempotente
8. Acesso premium muda para `paid`

Rotas:

- `POST /api/billing/asaas/checkout`: rota autenticada que cria ou reutiliza cobranca Asaas
- `POST /api/webhooks/asaas`: rota publica protegida por token do webhook

Dado sensivel do pagador:

- CPF/CNPJ e enviado ao Asaas, mas nao persistido no banco local da plataforma

## Mentor IA

Fluxo implementado na Etapa 6:

1. Usuario autenticado acessa `/mentor`
2. Servidor consulta `profiles.access_status`
3. Apenas usuarios `paid` visualizam e usam o chat
4. Frontend envia mensagens para `POST /api/mentor`
5. Backend valida sessao, premium e limite simples de uso
6. Backend chama a OpenAI Responses API com o prompt do Mentor PGM
7. Resposta retorna ao cliente sem expor chave OpenAI

Decisoes de seguranca e produto:

- `OPENAI_API_KEY` fica apenas no backend
- historico nao e persistido nesta etapa
- base inicial fica versionada em `src/lib/mentor/knowledge-base.ts`
- prompt reforca independencia em relacao ao Governo de Pernambuco
- respostas oficiais sensiveis devem ser direcionadas para confirmacao nos canais oficiais

## Area Premium

Fluxo implementado na Etapa 7A:

1. Usuario autenticado acessa `/premium`
2. Servidor consulta `profiles.access_status`
3. Apenas usuarios `paid` visualizam a estrutura dos modulos premium
4. Usuarios sem acesso pago recebem bloqueio com CTA para `/planos`
5. Modulos ficam versionados em `src/lib/premium/content.ts`
6. Fotos autorizadas do Canada sao usadas como apoio visual

Decisoes editoriais:

- A Etapa 7A cria somente a infraestrutura e estrutura dos modulos
- Textos finais nao foram inventados
- Conteudo final deve ser produzido na Etapa 7B apos extracao, comparacao e aprovacao editorial dos editais
- A arquitetura fica pronta para migrar os modulos para painel administrativo ou CMS

Atualizacao da Etapa 7B:

1. O Edital de Abertura PGM 2026 e a noticia oficial da SEE sao a base principal do conteudo premium inicial
2. Cada modulo separa `Base oficial extraida`, `Orientacao reaproveitavel` e `Confirmar nos canais oficiais`
3. Regras oficiais sensiveis continuam dependentes do edital vigente e dos comunicados oficiais
4. A area `/premium` permanece liberada apenas para usuarios com `profiles.access_status = paid`
5. O conteudo fica versionado em `src/lib/premium/content.ts` ate migracao futura para painel administrativo ou CMS

Decisoes editoriais da Etapa 7B:

- Nao tratar orientacoes praticas como regra oficial
- Nao prometer aprovacao, destino, embarque, visto, host family ou cobertura financeira
- Manter linguagem de preparacao independente, sem vinculo oficial com o Governo de Pernambuco
- Confirmar sempre cronograma, documentos, custos, destino e regras operacionais no edital vigente

Entidade financeira adicional:

- `payment_events`: trilha idempotente dos eventos recebidos do Asaas

## Simulados e Aprendizagem

Fluxo implementado na Etapa 8A:

1. A rota `/simulados` fica dentro da area autenticada
2. O servidor consulta `profiles.access_status` para separar gratuito e premium
3. O historico le `simulation_attempts` com RLS por `tenant_id` e `user_id`
4. O catalogo de aprendizagem nasce com conteudo global (`tenant_id` nulo) e suporte futuro a conteudo por tenant
5. Seeds estruturais criam categorias de Ingles, Espanhol e Entrevista Psicossocial
6. Nenhuma questao real, prova oficial, material real ou IA nova foi criada nesta etapa

Tabelas adicionadas:

- question_banks
- question_categories
- questions
- question_options
- simulation_templates
- simulation_attempts
- simulation_answers
- study_materials
- flashcards
- learning_paths
- learning_path_items
- psychosocial_questions

Decisoes de seguranca:

- Usuarios autenticados podem ler apenas conteudo ativo permitido pelo status premium
- Usuarios gratuitos nao leem conteudo marcado como `is_premium = true`
- Tentativas e respostas sao legiveis apenas pelo proprio aluno do tenant
- Mutacoes de tentativas, respostas e notas nao sao concedidas ao client autenticado
- Correcao objetiva deve ser executada por backend/server action/API route com service role em etapa futura
- Admins podem gerenciar conteudo por RLS usando `profiles.role = admin`

Correcao objetiva:

- A funcao pura `calculateObjectiveScore` calcula nota, percentual, acertos e erros por categoria
- A funcao `summarizeAttemptHistory` prepara estatisticas basicas para historico do aluno
- Teste dedicado em `tests/simulation-scoring.test.ts`

Atualizacao da Etapa 8B:

1. A migration 003 foi validada no Supabase real apos aplicacao manual
2. As categorias estruturais retornaram 20 registros para usuarios autenticados
3. Usuarios comuns nao conseguem inserir `simulation_attempts` diretamente pelo client
4. Usuarios comuns nao conseguem criar `question_banks` por RLS
5. Fixtures de questoes/templates existem apenas em teste automatizado, sem poluir o banco real

Rotas backend adicionadas:

- `GET /api/simulations/templates`: lista templates, acesso premium e saude do schema
- `GET /api/simulations/attempts`: lista historico e estatisticas basicas
- `POST /api/simulations/attempts`: inicia tentativa via backend quando houver template e questoes
- `POST /api/simulations/attempts/[attemptId]/submit`: prepara correcao objetiva server-side

Decisoes da Etapa 8B:

- Mutacoes de tentativa usam service role apenas no backend
- Free continua bloqueado para template premium ou simulado completo
- Banco real permanece sem questoes reais nesta etapa
- A UI `/simulados` consome o mesmo servico server-side usado pelas rotas

Atualizacao da Etapa 8D:

1. A rota `/admin` foi criada dentro da area autenticada
2. O link Admin aparece apenas para usuarios com `profiles.role = admin`
3. Usuarios nao admin veem uma tela bloqueada, sem formularios administrativos
4. Criacao de `question_banks` e `simulation_templates` usa Server Actions e service role
5. Conteudo criado pelo admin nesta etapa usa `tenant_id = null`, mantendo catalogo global
6. A migration 004 permite `psychosocial` em `question_banks.language`
7. O setup operacional do admin esta em `docs/ADMIN_SETUP.md`

Limites da Etapa 8D:

- Nao cria questoes reais
- Nao cria materiais reais
- Nao cria IA nova
- Nao altera billing
- Nao promove usuario automaticamente se o perfil ainda nao existir

Atualizacao da Etapa 8G:

1. O lote aprovado em `docs/CONTENT_SCALE_REVIEW.md` virou fonte editorial para importacao controlada
2. A migration 005 adiciona `editorial_id` e `source_reference` para idempotencia e rastreabilidade
3. O script `npm run content:validate` valida contagens e relacionamentos antes de qualquer escrita
4. O script `npm run content:import` roda em dry-run por padrao
5. A escrita real exige `npm run content:import -- --execute`
6. O conteudo global continua com `tenant_id = null`
7. Conteudos premium permanecem bloqueados por RLS para usuarios gratuitos
8. Alternativas usam a chave `(question_id, option_label)` e trilhas recriam seus itens de forma deterministica
9. O script `npm run content:validate-imported` audita contagens, relacionamentos e RLS free/premium no Supabase real

Limites da Etapa 8G:

- A migration 005 precisa ser aplicada no Supabase antes da importacao real
- A importacao real usa `SUPABASE_SERVICE_ROLE_KEY` e deve rodar apenas em ambiente controlado
- A Etapa 8G prepara dados para simulados, mas nao altera a experiencia de resolucao de prova
- O conteudo segue independente, autoral e sem vinculo oficial com o Governo de Pernambuco

Atualizacao da Etapa 8H-A:

1. A rota `/estudos` lista materiais importados com busca, filtros, badges e bloqueio premium
2. A rota `/estudos/[slug]` mostra conteudo completo apenas para usuarios autorizados
3. A rota `/trilhas` lista trilhas importadas com contagem de itens e progresso
4. A rota `/trilhas/[slug]` mostra a sequencia pedagogica ordenada e permite marcar blocos como concluidos
5. A rota `/flashcards` permite revisar frente/verso por categoria
6. A tabela `user_learning_progress` registra progresso por usuario, tenant, item e trilha
7. O cliente autenticado tem apenas leitura direta de progresso; mutacoes passam por Server Actions com service role
8. O dashboard ganhou a secao `Meu progresso`
9. Conteudo premium e exibido como bloqueado para usuarios gratuitos, sem entregar corpo de material ou flashcards

## Segurança

- Nunca expor chave Asaas, Supabase service role ou OpenAI no cliente
- Validar assinatura/token de webhook Asaas no backend
- Usar RLS no Supabase antes de liberar dados reais
- Limitar permissao de coluna para impedir alteracao manual de `access_status`
- Registrar eventos financeiros de forma idempotente
- Separar status de usuario e status financeiro
- Manter aviso de independencia do Governo de Pernambuco em areas publicas

## Assets

As fotos autorizadas do Canada devem ser adicionadas em `public/images/canada`.
Como os anexos do chat nao foram persistidos no workspace, a Etapa 1 deixa a estrutura preparada sem criar imagens ficticias.
