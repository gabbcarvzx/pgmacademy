# Relatorio Sprint 6F.5 - Trilha Profunda de Espanhol PGM

Data: 14/06/2026\
Objetivo: criar a primeira base editorial robusta de Espanhol da PGM Academy, cobrindo gramatica, vocabulario estrategico e compreensao leitora sem alterar banco ou regras de negocio.

## Entregas Concluidas

- Sete mini-cursos profundos de Espanhol.
- Estrutura editorial comum com teoria, exemplos, erros, questoes, resolucao, dicas e integracao ao acervo.
- Mini-curso ampliado de Comprension Lectora com tres blocos de leitura e dez questoes comentadas.
- Manifesto editorial tipado da Sprint 6F.5.
- Validacao automatica de tamanho, estrutura, taxonomia e relacionamentos.
- Verificacao de IDs e slugs contra todos os lotes 6F anteriores.
- Integracao ao comando `npm run content:validate`.

## Metadados Editoriais

- `category`: `spanish`
- `language`: `spanish`
- `editorial_version`: `pgm-2026-v2`
- `source_reference`: `Sprint 6F.5 Deep Materials`
- `is_premium`: `true`

Taxonomias utilizadas:

| Area | Subcategoria | Competencia |
|---|---|---|
| Gramatica | `gramatica` | `spa-apply-grammar` |
| Falsos cognatos | `vocabulario` | `spa-recognize-false-cognates` |
| Leitura | `comprension-lectora` | `spa-interpret-texts` |

## Materiais Criados

| Editorial ID | Material | Palavras | Tempo estimado |
|---|---|---:|---:|
| `MAT-DEEP-ES-001` | Ser vs Estar | 1.607 | 65 min |
| `MAT-DEEP-ES-002` | Pronombres Personales | 1.501 | 60 min |
| `MAT-DEEP-ES-003` | Articulos en Espanol | 1.631 | 65 min |
| `MAT-DEEP-ES-004` | Verbos Basicos | 1.538 | 85 min |
| `MAT-DEEP-ES-005` | Comparativos y Superlativos | 1.530 | 65 min |
| `MAT-DEEP-ES-006` | Falsos Cognatos | 1.597 | 70 min |
| `MAT-DEEP-ES-007` | Comprension Lectora para el PGM | 2.515 | 115 min |

Os seis materiais-base estao dentro do intervalo de 1.500 a 3.000 palavras. Comprension Lectora esta dentro do intervalo especifico de 2.500 a 4.000 palavras.

## Estrutura Aplicada

Cada material contem:

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

### Ser vs Estar

- Identidade, origem, profissao e caracteristicas.
- Estados, condicoes e resultados.
- Localizacao de pessoas, objetos e eventos.
- Data, hora e eventos.
- `estar + gerundio`.
- Mudancas de sentido com `listo`, `aburrido`, `seguro` e outros adjetivos.

### Pronombres Personales

- Pronomes sujeito e concordancia verbal.
- Omissao e enfase do sujeito.
- `tu`, `usted` e `ustedes`.
- Grupos masculinos, femininos e mistos.
- Introducao a objetos diretos e indiretos.
- Acentos diferenciais: `el/él`, `tu/tú`, `mi/mí`.
- Referencia pronominal em textos.

### Articulos

- Artigos definidos, indefinidos e neutro `lo`.
- Genero, numero e excecoes frequentes.
- Primeira mencao e retomada.
- Contracoes `al` e `del`.
- Femininos com `a` tonico.
- Partes do corpo, idiomas, lugares e referencia generica.

### Verbos Basicos

- Presente regular em `-ar`, `-er` e `-ir`.
- `tener`, `ir`, `venir`, `hacer`, `poder`, `querer` e `necesitar`.
- Idade, obrigacao e pedidos.
- Mudancas vocalicas.
- `estar + gerundio`.
- Preterito indefinido.
- Futuro proximo com `ir a + infinitivo`.

### Comparativos

- Superioridade, inferioridade e igualdade.
- `tan...como` e `tanto...como`.
- Formas `mejor`, `peor`, `mayor` e `menor`.
- Superlativo relativo e absoluto.
- Comparacao de quantidades e limites numericos.
- Leitura responsavel de dados.

### Falsos Cognatos

- Falsos amigos em formularios, escola, alimentacao, convivencia e deslocamento.
- Pares como `apellido/apodo`, `asignatura/firma`, `exito/suceso` e `oficina/taller`.
- Uso de classe gramatical e consequencias contextuais.
- Metodo de caderno lexical por cenarios.
- Distincao entre cognato confiavel, falso cognato e polissemia.

### Comprension Lectora

- Leitura orientada pelo comando.
- Leitura sem traducao integral.
- Genero e finalidade textual.
- Informacao explicita, ideia principal e inferencia.
- Vocabulario contextual e falsos cognatos.
- Conectores, sequencia e modalizacao.
- Eliminacao de distratores.
- Gestao de tempo.
- Metodo LEER.
- Tres mini simulados e dez resolucoes comentadas.

## Relacoes Com o Acervo

### Flashcards

- `FLA-SCALE-019` a `FLA-SCALE-029`.
- `FLA-SCALE-058` e `FLA-SCALE-059`.

### Questoes Objetivas

- `OBJ-SCALE-036` a `OBJ-SCALE-060`, conforme a competencia de cada material.

### Simulados Intensivos

- `PGM-INT-ES-002` a `PGM-INT-ES-030`, conforme a competencia de cada material.

Todos os IDs explicitamente vinculados no manifesto foram conferidos automaticamente contra o acervo-fonte.

## Arquivos Criados

- `content/study-materials/pgm-2026-v2/spanish-ser-vs-estar.md`
- `content/study-materials/pgm-2026-v2/spanish-pronombres-personales.md`
- `content/study-materials/pgm-2026-v2/spanish-articulos.md`
- `content/study-materials/pgm-2026-v2/spanish-verbos-basicos.md`
- `content/study-materials/pgm-2026-v2/spanish-comparativos.md`
- `content/study-materials/pgm-2026-v2/spanish-falsos-cognatos.md`
- `content/study-materials/pgm-2026-v2/spanish-comprension-lectora.md`
- `scripts/content/deep-materials-sprint-6f5.ts`
- `docs/SPRINT_6F5_SPANISH_DEEP_MATERIALS_REPORT.md`

## Arquivos Alterados

- `scripts/validate-approved-content.ts`

O validador central passou a carregar a Sprint 6F.5, validar tres contratos taxonomicos de Espanhol, aplicar limite especifico a Comprension Lectora e verificar unicidade entre todos os materiais profundos.

## Banco e Regras Preservadas

Os materiais nao foram importados no Supabase e nenhuma learning path persistida foi criada.

Nao foram alterados:

- Banco ou migrations.
- Supabase e RLS.
- Autenticacao.
- Pagamentos e webhooks.
- Mentor IA.
- Simulados, scoring, gabaritos ou tentativas.
- Analytics.
- Trilhas e progress tracking existentes.
- Conteudo publicado da Etapa 8F.

O termo "trilha" nesta sprint representa uma sequencia editorial pronta para futura publicacao. A criacao de uma trilha no banco deve ocorrer apenas em sprint de importacao aprovada.

## Validacoes Editoriais

- Quantidade exata de sete materiais.
- Limite de 1.500 a 3.000 palavras nos seis materiais-base.
- Limite de 2.500 a 4.000 palavras em Comprension Lectora.
- Treze secoes obrigatorias.
- Versao `pgm-2026-v2`.
- Fonte `Sprint 6F.5 Deep Materials`.
- Taxonomias de gramatica, vocabulario e leitura coerentes.
- Relacoes com flashcards e questoes existentes.
- IDs e slugs unicos em todos os lotes 6F.

## Validacoes Executadas

- `npm run content:validate`: passou.
  - Sete materiais encontrados.
  - Todas as contagens dentro dos limites.
  - Todas as secoes e relacoes validadas.
- `npm run content:validate-imported`: passou.
  - O Supabase permanece com 12 materiais e 6 trilhas publicados da Etapa 8F.
  - Nenhum material das Sprints 6F.1 a 6F.5 foi importado.
  - As fixtures temporarias usadas pelo validador existente foram removidas ao final.
- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
  - Compilacao de producao concluida e 43 paginas geradas/verificadas.
- `git diff --check`: passou.

## Riscos e Limitacoes

1. A trilha ainda nao esta publicada.
   - O lote permanece no acervo-fonte e nao aparece para alunos ate revisao e importacao futuras.

2. A taxonomia permite uma competencia central por material.
   - Comprension Lectora tambem cobre vocabulario e falsos cognatos, mas permanece vinculada a `spa-interpret-texts`.

3. O renderizador Markdown atual e limitado.
   - Tabelas, citacoes e blocos de mini simulado podem precisar de refinamento visual em sprint de frontend.

4. Variacao regional do Espanhol.
   - O conteudo prioriza formas amplamente compreensiveis, com observacoes sobre `ustedes`, vocabulario e usos regionais quando necessario.

5. Revisao humana permanece recomendada.
   - Um professor de Espanhol deve revisar naturalidade, acentuacao, variedade e progressao antes da publicacao comercial.

## Ordem Editorial Recomendada

1. Ser vs Estar.
2. Pronombres Personales.
3. Articulos.
4. Verbos Basicos.
5. Comparativos.
6. Falsos Cognatos.
7. Comprension Lectora.

## Proximos Passos

1. Fazer revisao linguistica dos sete materiais com professor de Espanhol.
2. Planejar importacao versionada sem substituir conteudo publicado antes da aprovacao.
3. Criar learning path persistida somente em sprint propria.
4. Melhorar renderizacao de tabelas e questoes em Markdown.
5. Vincular desempenho em simulados aos materiais correspondentes.
6. Medir erros de gramatica, falsos cognatos e inferencia apos a publicacao.
