# Supabase Setup

## Objetivo

Aplicar a migration inicial para habilitar autenticacao, tenants, perfis, assinatura e historico de diagnosticos.

## Migration

Arquivo:

`supabase/migrations/001_initial_schema.sql`

## Opcao 1: SQL Editor

1. Abra o projeto no Supabase.
2. Acesse SQL Editor.
3. Cole o conteudo de `supabase/migrations/001_initial_schema.sql`.
4. Execute o SQL.
5. Confirme se as tabelas `tenants`, `profiles`, `subscriptions`, `eligibility_assessments` e `audit_logs` foram criadas.

## Opcao 2: Supabase CLI

Preencha no `.env` ou no ambiente local:

- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

Depois execute:

```bash
supabase link --project-ref <SUPABASE_PROJECT_REF>
supabase db push
```

## Autenticacao

No painel do Supabase:

1. Acesse Authentication.
2. Habilite Email provider.
3. Defina se email confirmation ficara ligado ou desligado.
4. Configure Site URL para a URL do app.
5. Em Redirect URLs, inclua a URL do app local e de producao.

## Seguranca

- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no client.
- Nao coloque valores reais em `.env.example`.
- A migration usa RLS e limita permissao de coluna para proteger `access_status`.
- O diagnostico publico nao salva dados sem usuario autenticado.
