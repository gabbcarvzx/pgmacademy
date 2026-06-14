# Relatorio Sprint 6F.4 - Materiais Mais Importantes do PGM

Data: 14/06/2026\
Objetivo: criar os dois materiais de maior impacto transversal da PGM Academy, aprofundando Present Perfect e estrategias de leitura aplicadas ao padrao de preparacao PGM.

## Entregas Concluidas

- Mini-curso avancado de Present Perfect.
- Mini-curso completo Reading Strategies for PGM.
- Tres mini simulados autorais de leitura, com dez questoes e resolucao comentada.
- Manifesto editorial tipado para a Sprint 6F.4.
- Validacao automatica de tamanho, estrutura, taxonomia e relacionamentos.
- Verificacao cruzada de IDs e slugs entre as Sprints 6F.1, 6F.2, 6F.3 e 6F.4.
- Integracao ao comando `npm run content:validate`.

## Metadados Editoriais

- `category`: `english`
- `language`: `english`
- `difficulty`: `advanced`
- `editorial_version`: `pgm-2026-v2`
- `source_reference`: `Sprint 6F.4 Deep Materials`
- `is_premium`: `true`

Taxonomias especificas:

| Material | Subcategoria | Competencia central |
|---|---|---|
| Present Perfect | `grammar` | `eng-apply-grammar-rule` |
| Reading Strategies for PGM | `reading-comprehension` | `eng-identify-main-idea` |

Reading Strategies tambem desenvolve `eng-infer-implicit-information` e `eng-contextual-vocabulary`, mas foi vinculado a uma unica competencia central para respeitar o contrato editorial atual.

## Materiais Criados

| Editorial ID | Material | Palavras | Tempo estimado |
|---|---|---:|---:|
| `MAT-DEEP-EN-011` | Present Perfect: Experiencias, Resultados e Conexao Com o Presente | 2.885 | 85 min |
| `MAT-DEEP-EN-012` | Reading Strategies for PGM: Ler, Localizar Evidencias e Decidir | 3.814 | 110 min |

Os dois materiais estao dentro do intervalo solicitado de 2.500 a 4.000 palavras.

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

### Present Perfect

- Estrutura `have/has + past participle`.
- Formas afirmativa, negativa, interrogativa e respostas curtas.
- Participios regulares e irregulares.
- Experiencias sem tempo passado especifico.
- Resultados presentes e acoes recentes.
- Periodos ainda abertos.
- Uso de `ever`, `never`, `just`, `already`, `yet` e `so far`.
- Diferenca entre `since` e `for`.
- Diferenca entre `been to` e `gone to`.
- Perguntas com `how long`.
- Contraste completo entre Present Perfect e Simple Past.
- Introducao ao Present Perfect Continuous.
- Dez questoes autorais com resolucao comentada.

### Reading Strategies for PGM

- Leitura orientada pelo comando.
- Leitura sem traducao palavra por palavra.
- Identificacao de palavras-chave, numeros, verbos e conectores.
- Reconhecimento de genero e intencao comunicativa.
- Identificacao da ideia principal.
- Localizacao de informacoes explicitas.
- Inferencia controlada por evidencias.
- Vocabulario contextual.
- Eliminacao sistematica de distratores.
- Deteccao de contradicao, exagero, invencao e escopo incorreto.
- Administracao de tempo e controle de releituras.
- Metodo PGM em seis passos: Pergunta, Genero, Marcas, Evidencia, Distratores e Resposta.
- Tres mini simulados com aviso escolar, mensagem de familia anfitria e relato de adaptacao.
- Dez questoes autorais com resolucao comentada e classificacao por competencia.

## Relacoes Com o Acervo

### Flashcards

- `FLA-SCALE-001`
- `FLA-SCALE-002`
- `FLA-SCALE-007`
- `FLA-SCALE-008`
- `FLA-SCALE-009`
- `FLA-SCALE-013`
- `FLA-SCALE-014`
- `FLA-SCALE-016`
- `FLA-SCALE-017`
- `FLA-SCALE-018`

### Questoes e Simulados

- `OBJ-SCALE-001` a `OBJ-SCALE-010`.
- `PGM-INT-EN-022`.
- `PGM-INT-EN-023` a `PGM-INT-EN-030`.

Todos os relacionamentos foram conferidos automaticamente contra o acervo-fonte existente.

## Arquivos Criados

- `content/study-materials/pgm-2026-v2/present-perfect.md`
- `content/study-materials/pgm-2026-v2/reading-strategies-for-pgm.md`
- `scripts/content/deep-materials-sprint-6f4.ts`
- `docs/SPRINT_6F4_DEEP_MATERIALS_REPORT.md`

## Arquivos Alterados

- `scripts/validate-approved-content.ts`

O validador central agora carrega a Sprint 6F.4, aceita as taxonomias de Grammar e Reading Comprehension, verifica o intervalo de 2.500 a 4.000 palavras e confere unicidade entre os doze materiais profundos existentes.

## Banco e Regras Preservadas

Os materiais nao foram importados no Supabase.

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

- Quantidade exata de dois materiais.
- Intervalo de 2.500 a 4.000 palavras.
- Treze secoes obrigatorias.
- Versao `pgm-2026-v2`.
- Fonte `Sprint 6F.4 Deep Materials`.
- Taxonomia coerente com Grammar e Reading Comprehension.
- Relacoes com flashcards e questoes existentes.
- IDs e slugs unicos dentro dos quatro lotes de materiais profundos.

## Validacoes Executadas

- `npm run content:validate`: passou.
  - Present Perfect: 2.885 palavras e 13 secoes.
  - Reading Strategies for PGM: 3.814 palavras e 13 secoes.
  - Todos os IDs relacionados foram encontrados.
- `npm run content:validate-imported`: passou.
  - O Supabase permanece com os 12 materiais publicados da Etapa 8F.
  - Nenhum material das Sprints 6F.1 a 6F.4 foi importado.
  - As fixtures temporarias usadas pelo validador existente foram removidas ao final.
- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `git diff --check`: passou.

## Riscos e Limitacoes

1. Os materiais ainda nao aparecem para os alunos.
   - Permanecem no acervo-fonte ate uma sprint especifica de revisao e publicacao.

2. O renderizador atual possui suporte Markdown limitado.
   - Tabelas e citacoes dos mini simulados podem nao receber a melhor apresentacao visual sem evolucao futura do frontend.

3. Reading Strategies possui cobertura multicompetencia.
   - O banco atual permite uma competencia central por material; inferencia e vocabulario contextual foram documentados, mas nao persistidos como relacoes adicionais.

4. Exemplos e mini simulados sao autorais.
   - Foram inspirados em formatos recorrentes de avaliacao e no acervo interno, sem copiar prova oficial.

5. Revisao humana continua recomendada.
   - Um professor de Ingles deve revisar naturalidade, progressao de dificuldade e precisao antes da publicacao comercial.

## Proximos Passos

1. Realizar revisao linguistica dos doze materiais profundos `pgm-2026-v2`.
2. Priorizar Reading Strategies na jornada premium e antes dos simulados intensivos.
3. Planejar importacao editorial versionada somente depois da aprovacao humana.
4. Melhorar a renderizacao de tabelas, citacoes e blocos de questoes.
5. Futuramente permitir multiplas competencias por material sem duplicar conteudo.
6. Medir impacto em acertos de ideia principal, inferencia e informacao explicita.
