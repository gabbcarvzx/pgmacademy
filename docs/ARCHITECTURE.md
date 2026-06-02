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

Entidade financeira adicional:

- `payment_events`: trilha idempotente dos eventos recebidos do Asaas

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
