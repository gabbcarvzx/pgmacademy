# Relatorio Sprint 6F.3 - Materiais Profundos Reta Final PGM

Data: 13/06/2026\
Objetivo: ampliar os mini-cursos de Ingles com Prepositions, Adverbs of Frequency e Comparatives and Superlatives, priorizando conteudos recorrentes em questoes de gramatica e interpretacao contextual.

## Entregas Concluidas

- Mini-curso de Prepositions.
- Mini-curso de Adverbs of Frequency.
- Mini-curso de Comparatives and Superlatives.
- Manifesto editorial tipado para a Sprint 6F.3.
- Validacao automatica de tamanho, estrutura, taxonomia e relacionamentos.
- Verificacao cruzada de IDs e slugs entre as Sprints 6F.1, 6F.2 e 6F.3.
- Integracao ao comando `npm run content:validate`.

## Metadados Editoriais

- `category`: `english`
- `subcategory`: `grammar`
- `competence`: `eng-apply-grammar-rule`
- `language`: `english`
- `editorial_version`: `pgm-2026-v2`
- `source_reference`: `Sprint 6F.3 Deep Materials`
- `is_premium`: `true`

## Materiais Criados

| Editorial ID | Material | Palavras | Tempo estimado |
|---|---|---:|---:|
| `MAT-DEEP-EN-008` | Prepositions: Tempo, Lugar e Movimento no Contexto PGM | 2.503 | 70 min |
| `MAT-DEEP-EN-009` | Adverbs of Frequency: Posicao, Sentido e Rotina | 2.408 | 65 min |
| `MAT-DEEP-EN-010` | Comparatives and Superlatives: Comparar Com Precisao | 2.374 | 75 min |

Todos os materiais superam o minimo obrigatorio de 1.500 palavras e permanecem abaixo do limite editorial de 3.000 palavras. Prepositions atingiu a meta de 2.500 palavras; os outros dois materiais ficaram proximos da meta, preservando densidade e evitando repeticao artificial.

## Estrutura Aplicada

Cada mini-curso contem:

1. Introducao.
2. Importancia para o PGM.
3. Explicacao teorica completa.
4. Tabelas.
5. Regras.
6. Exemplos comentados.
7. Erros comuns.
8. Questoes estilo PGM.
9. Resolucao comentada.
10. Resumo final.
11. Dicas de prova.
12. Relacao com flashcards.
13. Relacao com simulados intensivos.

## Cobertura Pedagogica

### Prepositions

- Tempo com `at`, `on`, `in`, `by`, `until`, `for`, `since` e `during`.
- Lugar como ponto, interior, superficie e posicao relativa.
- Movimento com `to`, `into`, `through`, `across`, `past`, `onto` e `off`.
- Combinacoes fixas de verbos e adjetivos.
- Leitura de mapas, avisos, formularios, prazos e instrucoes.
- Casos em que o Ingles nao usa preposicao.
- Oito questoes autorais com resolucao comentada.

### Adverbs of Frequency

- Escala de `always` a `never` e diferencas de intensidade.
- Posicao com verbos comuns, verb to be, auxiliares e modais.
- Uso de `sometimes`, `occasionally`, `rarely` e `hardly ever`.
- Dupla negacao e concordancia na terceira pessoa.
- Expressoes definidas como `every day` e `twice a week`.
- Perguntas com `how often` e coerencia das respostas.
- Contraste entre rotina habitual e acao em andamento.
- Escopo semantico e exageros frequentes em alternativas.
- Oito questoes autorais com resolucao comentada.

### Comparatives and Superlatives

- Formacao de comparativos e superlativos curtos e longos.
- Mudancas ortograficas e formas irregulares.
- Comparacao, igualdade, inferioridade e modificadores de grau.
- Comparacao de substantivos contaveis e incontaveis.
- Uso de `more`, `fewer`, `less`, `most`, `fewest` e `least`.
- Leitura de dados, unidades e limites de inferencia.
- Paralelismo entre os elementos comparados.
- Estruturas graduais e `one of the most`.
- Oito questoes autorais com resolucao comentada.

## Relacoes Com o Acervo

### Flashcards

- `FLA-SCALE-001`
- `FLA-SCALE-002`
- `FLA-SCALE-003`
- `FLA-SCALE-004`
- `FLA-SCALE-006`
- `FLA-SCALE-008`
- `FLA-SCALE-009`
- `FLA-SCALE-013`

### Questoes e Simulados

- `OBJ-SCALE-001`
- `OBJ-SCALE-004`
- `OBJ-SCALE-007`
- `OBJ-SCALE-009`
- `PGM-INT-EN-012`
- `PGM-INT-EN-013`
- `PGM-INT-EN-014`
- `PGM-INT-EN-017`
- `PGM-INT-EN-018`
- `PGM-INT-EN-019`
- `PGM-INT-EN-022`
- `PGM-INT-EN-024`
- `PGM-INT-EN-029`

Todos os relacionamentos foram conferidos automaticamente contra o acervo-fonte existente.

## Arquivos Criados

- `content/study-materials/pgm-2026-v2/prepositions.md`
- `content/study-materials/pgm-2026-v2/adverbs-of-frequency.md`
- `content/study-materials/pgm-2026-v2/comparatives-superlatives.md`
- `scripts/content/deep-materials-sprint-6f3.ts`
- `docs/SPRINT_6F3_DEEP_MATERIALS_REPORT.md`

## Arquivos Alterados

- `scripts/validate-approved-content.ts`

O validador central passou a carregar a Sprint 6F.3, conferir suas referencias e verificar duplicidade de `editorial_id` e slug entre os dez materiais profundos das Sprints 6F.1, 6F.2 e 6F.3.

## Banco e Regras Preservadas

Os novos materiais nao foram importados no Supabase.

Nao foram alterados:

- Banco ou migrations.
- Supabase e RLS.
- Autenticacao.
- Pagamentos e webhooks.
- Mentor IA.
- Simulados, scoring, gabaritos ou tentativas.
- Analytics.
- Trilhas ou progress tracking.
- Conteudo publicado da Etapa 8F.

## Validacoes Editoriais

- Quantidade exata de tres materiais.
- Intervalo de 1.500 a 3.000 palavras.
- Treze secoes obrigatorias.
- Versao `pgm-2026-v2` e fonte Sprint 6F.3.
- Taxonomia `english/grammar`.
- Competencia `eng-apply-grammar-rule`.
- Relacoes com flashcards e questoes existentes.
- IDs e slugs unicos dentro e entre as tres sprints de materiais profundos.

## Validacoes Executadas

- `npm run content:validate`: passou.
  - Prepositions: 2.503 palavras e 13 secoes.
  - Adverbs of Frequency: 2.408 palavras e 13 secoes.
  - Comparatives and Superlatives: 2.374 palavras e 13 secoes.
  - Todos os IDs de flashcards e questoes relacionados foram encontrados.
- `npm run content:validate-imported`: passou.
  - O Supabase permanece com os 12 materiais publicados da Etapa 8F.
  - Nenhum material das Sprints 6F.1, 6F.2 ou 6F.3 foi importado.
  - As fixtures temporarias usadas pelo validador existente foram removidas ao final.
- `npx tsc --noEmit`: passou.
- `git diff --check`: passou.

## Riscos e Limitacoes

1. Os materiais ainda nao aparecem para os alunos.
   - O lote permanece somente no acervo-fonte porque a sprint nao solicitou importacao nem alteracao de banco.

2. O renderizador atual possui suporte Markdown limitado.
   - As tabelas existem editorialmente, mas podem nao ser renderizadas como tabelas HTML completas na interface atual.

3. Revisao humana continua recomendada.
   - Uma revisao final por professor de Ingles deve confirmar naturalidade, precisao e nivel antes da publicacao comercial.

4. A competencia central nao representa toda a cobertura.
   - Os materiais usam `eng-apply-grammar-rule` para manter a taxonomia existente, embora tambem desenvolvam leitura de dados, orientacoes e inferencia.

## Proximos Passos

1. Fazer revisao linguistica integrada dos dez materiais `pgm-2026-v2`.
2. Planejar a importacao editorial somente depois da aprovacao humana.
3. Evoluir a renderizacao de Markdown para tabelas e hierarquia completa de titulos.
4. Vincular os materiais aos modulos adequados da Academia PGM.
5. Medir erros por competencia nos simulados intensivos apos a publicacao.
