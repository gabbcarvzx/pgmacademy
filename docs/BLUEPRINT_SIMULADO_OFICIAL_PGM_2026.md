# Blueprint Editorial - Simulado Oficial PGM 2026

Data: 04/06/2026  
Versão editorial: `pgm-2026-v1`

## Objetivo

Definir a composição editorial futura do Simulado Objetivo Oficial PGM sem importar novas questões nesta sprint.

## Contrato Geral

- Tipo: objetivo
- Total: 30 questões
- Duração de referência: 240 minutos
- Pontuação: 2 pontos por questão
- Idioma: Inglês ou Espanhol, conforme escolha do aluno

## Distribuição por Categoria

| Bloco | Subcategoria | Quantidade |
|---|---|---:|
| Idioma escolhido | Interpretação | 8 |
| Idioma escolhido | Gramática | 5 |
| Idioma escolhido | Vocabulário | 5 |
| Idioma escolhido | Comunicação | 2 |
| Processo Seletivo PGM | Edital | 2 |
| Processo Seletivo PGM | Elegibilidade | 2 |
| Vida Internacional | Cultura | 3 |
| Vida Internacional | Adaptação Cultural | 3 |

Total: 30 questões.

## Distribuição por Dificuldade

| Nível | Nome | Quantidade |
|---:|---|---:|
| 1 | Fundamentos | 8 |
| 2 | Intermediário | 12 |
| 3 | Avançado | 7 |
| 4 | Competitivo PGM | 3 |

Total: 30 questões.

## Competências Mínimas

- Identificar ideia principal.
- Inferir informação implícita.
- Reconhecer vocabulário contextual.
- Aplicar regra gramatical.
- Interpretar textos em espanhol.
- Aplicar gramática em espanhol.
- Reconhecer falsos cognatos.
- Interpretar regras do edital.
- Avaliar elegibilidade.
- Compreender diferenças culturais.

## Regra de Geração Futura

O gerador de simulados deverá:

- selecionar apenas questões ativas;
- respeitar premium access já existente;
- filtrar por `tenant_id` quando houver conteúdo específico;
- priorizar `editorial_version_id = pgm-2026-v1`;
- garantir uma alternativa correta única;
- registrar tentativa em `simulation_attempts`;
- manter gabarito fora do cliente antes da finalização.

## Riscos Controlados

- Questões insuficientes por categoria devem bloquear geração oficial.
- Questões sem competência não devem entrar no simulado oficial.
- Conteúdo de edital futuro deve usar nova versão editorial, não sobrescrever a versão 2026.
