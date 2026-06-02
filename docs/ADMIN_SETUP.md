# Admin Setup

Etapa 8D adiciona um painel administrativo minimo para a fundacao dos simulados.

## Admin aprovado

Email aprovado pelo fundador:

```txt
gabrielcarvalhourspessoal@gmail.com
```

## Pre-requisito

O usuario precisa existir em `auth.users` e ter um registro correspondente em `public.profiles`.
Se o comando abaixo nao retornar linha, crie a conta pelo fluxo normal de cadastro e rode o SQL novamente.

## Promover para admin

Execute no SQL Editor do Supabase:

```sql
update public.profiles
set role = 'admin'
where email = 'gabrielcarvalhourspessoal@gmail.com'
returning id, email, role, access_status;
```

Resultado esperado:

- `role = admin`
- `access_status` permanece inalterado
- apenas o usuario aprovado recebe acesso a `/admin`

## Migration obrigatoria

Antes de usar banco de questoes psicossocial, aplique:

```txt
supabase/migrations/004_admin_learning_content.sql
```

Ela permite `psychosocial` em `question_banks.language`, alinhando bancos de entrevista psicossocial com as demais tabelas da fundacao de aprendizagem.

## Regras de seguranca

- Usuarios comuns nao veem o link Admin no menu.
- `/admin` bloqueia qualquer usuario cujo `profiles.role` nao seja `admin`.
- Formularios administrativos usam backend/server action e service role.
- Nenhum segredo e exposto no frontend.
- A Etapa 8D nao cria questoes reais, materiais reais ou IA.
