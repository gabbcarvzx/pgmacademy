# Mentor PGM - Etapa 6

## Objetivo

O Mentor PGM e um chatbot premium da PGM Academy para orientar estudantes sobre preparacao para o Programa Ganhe o Mundo.

## Variaveis

Configure localmente e na Vercel:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_MODEL` e opcional. Se nao for definido, o backend usa `gpt-4.1-mini`.

## Rotas

- `GET /mentor`: pagina autenticada da area do aluno
- `POST /api/mentor`: rota backend que valida sessao, valida premium e chama a OpenAI

## Regras

- O Mentor PGM e restrito a usuarios com `profiles.access_status = 'paid'`.
- A chave OpenAI nunca e enviada ao frontend.
- O historico da conversa nao e persistido nesta etapa.
- A base oficial do Mentor usa `src/lib/official/pgm-2026.ts`, com edital 01/2026, notícia da SEE e página do IGEDUC.
- O prompt reforca que a PGM Academy e independente e nao possui vinculo oficial com o Governo de Pernambuco.
- A rota aplica limite simples em memoria: 8 mensagens por minuto por usuario.

## Base oficial 2026

Fontes usadas:

```txt
https://portal.educacao.pe.gov.br/wp-content/uploads/2026/05/0d68cd50-48a7-492c-88f7-0c7b9af530c0.pdf
https://portal.educacao.pe.gov.br/governo-de-pernambuco-oferta-duas-mil-vagas-para-o-programa-ganhe-o-mundo/
https://igeduc.selecao.net.br/informacoes/156/
```

Para regras, datas, resultados, convocacoes e documentos oficiais, o Mentor deve orientar o aluno a confirmar nos canais oficiais.

Validacao automatizada:

```bash
npm run test:mentor
```
