# Asaas - Etapa 5

## Variaveis de ambiente

Configure localmente e na Vercel:

```env
NEXT_PUBLIC_APP_URL=https://programaganheomundoacademy.vercel.app
ASAAS_ENVIRONMENT=sandbox
ASAAS_API_KEY=
ASAAS_WEBHOOK_TOKEN=
ASAAS_WEBHOOK_EMAIL=
ASAAS_PAYMENT_DUE_DAYS=3
```

`ASAAS_API_BASE_URL` e opcional. Se nao for definida, o sistema usa:

- sandbox: `https://api-sandbox.asaas.com/v3`
- production: `https://api.asaas.com/v3`

Se a chave do Asaas contiver `$` em arquivo `.env`, escape o caractere como `\$`.
Na Vercel, cadastre o valor original diretamente no painel de Environment Variables.

## Webhook

URL cadastrada no Asaas:

```txt
https://programaganheomundoacademy.vercel.app/api/webhooks/asaas
```

Eventos recomendados:

- `PAYMENT_CREATED`
- `PAYMENT_UPDATED`
- `PAYMENT_CONFIRMED`
- `PAYMENT_RECEIVED`
- `PAYMENT_OVERDUE`
- `PAYMENT_REFUNDED`
- `PAYMENT_DELETED`
- `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED`

O token configurado no painel do Asaas deve ser exatamente o mesmo valor de `ASAAS_WEBHOOK_TOKEN`.
O backend valida o header `asaas-access-token` antes de processar qualquer evento.

## Banco

Antes de testar webhooks reais, aplique:

```txt
supabase/migrations/002_payment_events.sql
```

Essa migration cria `payment_events`, com idempotencia por `provider + event_id`, RLS para leitura do tenant e bloqueio
de escrita por usuarios autenticados comuns.

## Fluxo esperado

1. Usuario autenticado clica em comprar premium.
2. Usuario informa CPF ou CNPJ do pagador.
3. `/api/billing/asaas/checkout` cria ou reutiliza uma cobranca pendente no Asaas.
4. O usuario e redirecionado para a URL de pagamento do Asaas.
5. O Asaas envia evento para `/api/webhooks/asaas`.
6. O backend registra o evento em `payment_events`.
7. Em `PAYMENT_CONFIRMED` ou `PAYMENT_RECEIVED`, `subscriptions.status` vira `paid`.
8. O perfil do usuario recebe `profiles.access_status = 'paid'`.

## Observacoes

- A cobranca usa `billingType: "UNDEFINED"` para permitir escolha do metodo disponivel na conta Asaas.
- PIX, cartao e boleto dependem da habilitacao da conta Asaas.
- O usuario comum nao recebe permissao de escrita em `subscriptions`, `payment_events` ou `profiles.access_status`.
- CPF/CNPJ e enviado ao Asaas para criacao/atualizacao do cliente pagador e nao e gravado no banco da plataforma.
