# Relatorio Sprint 6F.2 - Materiais Profundos Reta Final PGM

Data: 13/06/2026\
Objetivo: ampliar o lote de mini-cursos de Ingles com Present Continuous, Question Words e Articles, seguindo o mesmo contrato editorial da Sprint 6F.1.

## Entregas Concluidas

- Mini-curso de Present Continuous.
- Mini-curso de Question Words.
- Mini-curso de Articles: A, An e The.
- Manifesto editorial tipado para a Sprint 6F.2.
- Validacao automatica de tamanho, estrutura, taxonomia e relacionamentos.
- Verificacao cruzada de IDs e slugs entre os lotes 6F.1 e 6F.2.
- Integracao ao comando `npm run content:validate`.

## Metadados Editoriais

- `category`: `english`
- `subcategory`: `grammar`
- `competence`: `eng-apply-grammar-rule`
- `language`: `english`
- `editorial_version`: `pgm-2026-v2`
- `source_reference`: `Sprint 6F.2 Deep Materials`
- `is_premium`: `true`

## Materiais Criados

| Editorial ID | Material | Palavras | Tempo estimado |
|---|---|---:|---:|
| `MAT-DEEP-EN-005` | Present Continuous: Acoes em Andamento no Contexto PGM | 2.313 | 60 min |
| `MAT-DEEP-EN-006` | Question Words: Como Entender o Que a Questao Pede | 2.136 | 60 min |
| `MAT-DEEP-EN-007` | Articles A, An e The: Referencia e Sentido em Ingles | 2.288 | 60 min |

Todos os materiais estao dentro do intervalo obrigatorio de 1.500 a 3.000 palavras.

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

### Present Continuous

- Estrutura `am/is/are + verb-ing`.
- Afirmativas, negativas, perguntas e respostas curtas.
- Regras ortograficas de `-ing`.
- Acoes atuais, situacoes temporarias, mudancas e planos organizados.
- Contraste com Present Simple.
- Stative verbs e pegadinhas com `now`.
- Oito questoes autorais com resolucao comentada.

### Question Words

- `what`, `where`, `when`, `who`, `why`, `which`, `whose` e `how`.
- Combinacoes `how many`, `how much`, `how often`, `how long` e `how far`.
- Ordem com verb to be, present simple, present continuous e simple past.
- Diferenca entre `who` como sujeito e objeto.
- Leitura do comando e categoria semantica da resposta.
- Pegadinhas entre lugar, tempo, causa, pessoa e posse.
- Oito questoes autorais com resolucao comentada.

### Articles A, An e The

- Artigos definidos, indefinidos e zero article.
- Escolha de `a/an` pelo som inicial.
- Primeira mencao e retomada com `the`.
- Referencia geral e especifica.
- Substantivos contaveis e incontaveis.
- Casos como `a university`, `an hour`, `information` e `luggage`.
- Uso com escola, profissoes, paises e possessivos.
- Oito questoes autorais com resolucao comentada.

## Relacoes Com o Acervo

### Flashcards

- `FLA-SCALE-001`
- `FLA-SCALE-002`
- `FLA-SCALE-003`
- `FLA-SCALE-004`
- `FLA-SCALE-007`
- `FLA-SCALE-008`
- `FLA-SCALE-013`
- `FLA-SCALE-015`
- `FLA-SCALE-032`

### Questoes e Simulados

- `OBJ-SCALE-001`
- `OBJ-SCALE-002`
- `OBJ-SCALE-022`
- `OBJ-SCALE-032`
- `PGM-INT-EN-005`
- `PGM-INT-EN-007`
- `PGM-INT-EN-008`
- `PGM-INT-EN-009`
- `PGM-INT-EN-011`
- `PGM-INT-EN-012`
- `PGM-INT-EN-016`

Todos os relacionamentos foram conferidos automaticamente contra o acervo-fonte.

## Arquivos Criados

- `content/study-materials/pgm-2026-v2/present-continuous.md`
- `content/study-materials/pgm-2026-v2/question-words.md`
- `content/study-materials/pgm-2026-v2/articles-a-an-the.md`
- `scripts/content/deep-materials-sprint-6f2.ts`
- `docs/SPRINT_6F2_DEEP_MATERIALS_REPORT.md`

## Arquivos Alterados

- `scripts/validate-approved-content.ts`

O validador agora trata os lotes 6F.1 e 6F.2 separadamente e tambem verifica duplicidade de `editorial_id` e slug entre eles.

## Banco e Regras Preservadas

Os novos materiais nao foram importados no Supabase.

Nao foram alterados:

- Banco ou migrations.
- Supabase e RLS.
- Autenticacao.
- Pagamentos e webhooks.
- Mentor IA.
- Simulados, scoring ou tentativas.
- Analytics.
- Trilhas ou progress tracking.
- Conteudo publicado da Etapa 8F.

## Validacoes Editoriais

- Quantidade exata de tres materiais.
- Intervalo de 1.500 a 3.000 palavras.
- Treze secoes obrigatorias.
- `pgm-2026-v2` e fonte Sprint 6F.2.
- Taxonomia `english/grammar`.
- Competencia `eng-apply-grammar-rule`.
- Relacoes com flashcards e questoes existentes.
- IDs e slugs unicos dentro e entre as Sprints 6F.1 e 6F.2.

## Validacoes Executadas

- `npm run content:validate`: passou.
  - Present Continuous: 2.313 palavras e 13 secoes.
  - Question Words: 2.136 palavras e 13 secoes.
  - Articles: 2.288 palavras e 13 secoes.
  - Todos os IDs de flashcards e questoes relacionados foram encontrados.
- `npm run content:validate-imported`: passou.
  - O Supabase permanece com os 12 materiais publicados da Etapa 8F.
  - Nenhum material 6F.1 ou 6F.2 foi importado.
  - As fixtures temporarias usadas pelo validador existente foram removidas ao final.
- `npx tsc --noEmit`: passou.
- `git diff --check`: passou.

## Riscos e Limitacoes

1. Os materiais ainda nao aparecem para os alunos.
   - O lote permanece somente no acervo-fonte porque esta sprint nao solicitou importacao nem alteracao de banco.

2. O renderizador atual possui suporte Markdown limitado.
   - As tabelas existem editorialmente, mas a interface atual nao as transforma em tabelas HTML completas. Esse ajuste deve ocorrer em sprint de frontend separada.

3. Revisao humana continua recomendada.
   - Uma revisao final por professor de Ingles deve confirmar naturalidade, progressao e nivel antes da publicacao comercial.

4. Question Words e Articles cruzam varias competencias.
   - Foram classificados em `eng-apply-grammar-rule` para manter a taxonomia existente, embora tambem apoiem leitura e comunicacao.

## Proximos Passos

1. Revisar linguisticamente os sete materiais profundos de `pgm-2026-v2`.
2. Planejar a importacao editorial sem substituir materiais publicados ate aprovacao.
3. Evoluir a renderizacao de Markdown para tabelas e hierarquia de titulos.
4. Vincular os mini-cursos a uma trilha de fundamentos de Ingles.
5. Medir impacto nos erros dos simulados intensivos depois da publicacao.
