# Auditoria Pos-Fix dos Simulados PGM

Data: 11/06/2026  
Objetivo: verificar as areas impactadas apos a correcao da distribuicao do gabarito e da separacao visual por idioma.

## Areas Verificadas

- `/simulados`
- Runner do simulado objetivo
- Resultado do simulado
- Simulado subjetivo oficial
- Cards premium/free de simulados
- Catalogo de templates
- Pipeline editorial aprovado
- Teste automatico de simulados oficiais

## Resultado da Correcao do Gabarito

Distribuicao nova do banco objetivo:

| Recorte | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| Banco objetivo total | 20 | 20 | 20 | 20 | 20 |
| English | 7 | 7 | 7 | 7 | 7 |
| Spanish | 5 | 5 | 5 | 5 | 5 |
| Portuguese | 4 | 4 | 4 | 4 | 4 |
| Mixed | 2 | 2 | 2 | 2 | 2 |
| Psychosocial | 2 | 2 | 2 | 2 | 2 |

Observacao: o banco ativo possui outros lotes legados. Os templates oficiais do lote 8F agora filtram questoes pela mesma `source_reference` do template, impedindo mistura de acervos antigos na selecao da tentativa.

Distribuicao nova por template:

| Template | A | B | C | D | E |
|---|---:|---:|---:|---:|---:|
| `TEMPLATE-SCALE-FULL-MIXED` | 6 | 6 | 6 | 6 | 6 |
| `TEMPLATE-SCALE-QUICK-EN` | 2 | 2 | 2 | 2 | 2 |
| `TEMPLATE-SCALE-QUICK-ES` | 2 | 2 | 2 | 2 | 2 |
| `TEMPLATE-SCALE-QUICK-PT` | 2 | 2 | 2 | 2 | 2 |
| `TEMPLATE-SCALE-QUICK-PSY` | 2 | 2 | 2 | 2 | 2 |

## Interface de `/simulados`

Verificacoes:

- Objetivos agora aparecem em secao propria.
- Objetivos oficiais por idioma exibem Ingles e Espanhol separadamente.
- Subjetivos agora exibem links separados para Ingles e Espanhol.
- Treinos gerais ficam em secao de apoio, sem competir com simulados por idioma.
- Cada card mantem idioma, tipo, quantidade de questoes, tempo sugerido, banco disponivel e status premium.
- Links preservam rotas existentes.

Observacao: os templates existentes foram reaproveitados para nao quebrar IDs, historico ou tentativas ja registradas.

## Runner Objetivo

Verificacoes:

- O runner continua buscando questoes da tentativa existente.
- A tentativa continua isolada por `user_id` e `tenant_id` via servicos existentes.
- Novas tentativas de templates 8F selecionam apenas questoes 8F.
- O cliente recebe apenas `id`, `label` e `text` das alternativas.
- `is_correct` nao e enviado para o cliente antes da finalizacao.
- A normalizacao de labels ocorre no servidor.

Resultado: gabarito protegido antes da finalizacao.

## Resultado Pos-Finalizacao

Verificacoes:

- O resultado continua usando `getSimulationResult(user.id, attemptId)`.
- O score continua baseado em IDs de alternativas, nao em letras.
- A exibicao final mostra labels balanceadas.
- Explicacoes continuam associadas a questao.
- Recomendacoes de trilhas continuam usando o calculo existente.

Resultado: scoring e historico preservados.

## Simulado Subjetivo

Verificacoes:

- A rota `/simulados/subjetivo-oficial` agora aceita `?idioma=english` e `?idioma=spanish`.
- Sem parametro, o comportamento padrao permanece Ingles, preservando compatibilidade.
- O envio inclui `language` em campo oculto.
- A validacao de 5 questoes e 90 a 150 palavras permanece no servidor.
- O acesso premium permanece com `hasPremiumAccess` e `canAccessPremiumContent`.

Resultado: separacao por idioma sem criar nova API e sem alterar banco.

## Premium e Segurança

Preservado:

- Supabase RLS.
- Autenticacao.
- Pagamentos.
- Webhooks.
- Mentor IA.
- Service role.
- Regras premium.
- Checkout.
- Dados reais de usuario.
- Historico de tentativas.
- Scoring e gabarito.

Nenhuma migration foi criada.

## Riscos Remanescentes

- Se producao ja tiver dados importados com labels antigas, o pipeline corrigido so persiste no banco apos nova importacao controlada.
- A camada runtime corrige a apresentacao e o resultado sem apagar historico, mas recomenda-se reimportar o lote editorial quando operacionalmente seguro.
- Lotes legados continuam ativos para outras funcionalidades; os simulados oficiais ficam protegidos pela fronteira de `source_reference`.
- Espanhol ainda tem 25 questoes objetivas; um template oficial de 30 questoes por idioma exige expansao editorial.
- QA visual autenticado real ainda depende de fixtures seguras de aluno free, premium e admin.

## Conclusao

O bug critico de concentracao do gabarito foi corrigido na fonte editorial e protegido na camada runtime. A experiencia de simulados agora separa objetivo/subjetivo e Ingles/Espanhol com mais clareza, sem alterar banco, RLS, Auth, pagamentos, Mentor IA, regras premium ou historico de tentativas.
