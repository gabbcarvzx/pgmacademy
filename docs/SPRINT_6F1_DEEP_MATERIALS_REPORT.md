# Relatorio Sprint 6F.1 - Materiais Profundos Reta Final PGM

Data: 13/06/2026\
Objetivo: transformar quatro fundamentos de Ingles em mini-cursos completos, sem alterar banco, autenticacao, RLS, pagamentos, Mentor IA, simulados, analytics ou trilhas.

## Entregas Concluidas

- Mini-curso de Verb To Be.
- Mini-curso de Subject Pronouns.
- Mini-curso de Possessive Adjectives.
- Mini-curso de Present Simple.
- Manifesto editorial tipado para o lote `pgm-2026-v2`.
- Validacao automatica de tamanho, estrutura, taxonomia e relacionamentos.
- Integracao do lote ao comando local `npm run content:validate`.

## Estrategia Editorial

Os materiais existentes da Etapa 8F foram preservados. Como a sprint proibe alteracao de banco, os quatro mini-cursos foram criados como um lote editorial independente e pronto para revisao/importacao futura.

Metadados comuns:

- `category`: `english`
- `subcategory`: `grammar`
- `competence`: `eng-apply-grammar-rule`
- `language`: `english`
- `editorial_version`: `pgm-2026-v2`
- `source_reference`: `Sprint 6F.1 Deep Materials`
- `is_premium`: `true`

## Materiais Criados

| Editorial ID | Material | Palavras | Tempo estimado |
|---|---|---:|---:|
| `MAT-DEEP-EN-001` | Verb To Be: Base Completa Para a Reta Final PGM | 2.077 | 55 min |
| `MAT-DEEP-EN-002` | Subject Pronouns: Quem Faz a Acao em Ingles | 2.189 | 50 min |
| `MAT-DEEP-EN-003` | Possessive Adjectives: Posse Sem Confusao | 2.063 | 50 min |
| `MAT-DEEP-EN-004` | Present Simple: Rotinas, Habitos e Fatos | 2.115 | 65 min |

Todos superam o minimo de 1.500 palavras e atingem a meta editorial de 2.000 a 3.000 palavras.

## Estrutura Aplicada

Cada material possui as 13 secoes obrigatorias:

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

## Profundidade Pedagogica

### Verb To Be

- `am`, `is` e `are` por sujeito.
- Afirmativa, negativa, interrogativa e respostas curtas.
- Identidade, estado, localizacao, idade, data e horario.
- Contracoes e diferenca entre presente e passado.
- Seis questoes autorais com resolucao.

### Subject Pronouns

- `I`, `you`, `he`, `she`, `it`, `we` e `they`.
- Referencia textual e substituicao de nomes.
- Diferenca entre sujeito, objeto e possessivo.
- Concordancia com verb to be e present simple.
- Sete questoes autorais com resolucao.

### Possessive Adjectives

- `my`, `your`, `his`, `her`, `its`, `our` e `their`.
- Escolha pelo possuidor, nao pelo objeto.
- Diferenca entre adjective, pronoun e contraction.
- Pares `your/you're`, `their/they're` e `its/it's`.
- Sete questoes autorais com resolucao.

### Present Simple

- Rotinas, habitos, fatos, preferencias e horarios.
- Terceira pessoa e regras de `-s`, `-es` e `-ies`.
- Negativas e perguntas com `do/does`.
- Adverbs of frequency.
- Contraste com present continuous e verb to be.
- Oito questoes autorais com resolucao.

## Relacoes Com o Acervo

O manifesto valida se os IDs relacionados existem no acervo-fonte.

Flashcards relacionados:

- `FLA-SCALE-001`
- `FLA-SCALE-002`
- `FLA-SCALE-013`
- `FLA-SCALE-015`

Questoes e simulados relacionados:

- `OBJ-SCALE-021`
- `OBJ-SCALE-022`
- `OBJ-SCALE-025`
- `OBJ-SCALE-029`
- `PGM-INT-EN-002`
- `PGM-INT-EN-003`
- `PGM-INT-EN-004`
- `PGM-INT-EN-011`
- `PGM-INT-EN-012`
- `PGM-INT-EN-013`
- `PGM-INT-EN-020`

## Arquivos Criados

- `content/study-materials/pgm-2026-v2/verb-to-be.md`
- `content/study-materials/pgm-2026-v2/subject-pronouns.md`
- `content/study-materials/pgm-2026-v2/possessive-adjectives.md`
- `content/study-materials/pgm-2026-v2/present-simple.md`
- `scripts/content/deep-materials-sprint-6f1.ts`
- `docs/SPRINT_6F1_DEEP_MATERIALS_REPORT.md`

## Arquivos Alterados

- `scripts/validate-approved-content.ts`

O comando `content:validate` agora valida o acervo legado e o lote profundo separadamente. O carregador `loadApprovedContent`, o importador de conteudo e o snapshot esperado do banco nao foram alterados.

## Banco e Seguranca

Nao foram executados imports dos novos materiais.

Nao foram alterados:

- Banco de dados.
- Migrations.
- Supabase ou RLS.
- Autenticacao.
- Pagamentos ou webhooks.
- Mentor IA.
- Simulados ou scoring.
- Analytics.
- Trilhas ou progress tracking.
- Conteudo ja publicado da Etapa 8F.

## Validacao Editorial

O novo validador bloqueia:

- Menos ou mais de quatro materiais no lote.
- `editorial_id` ou slug duplicado.
- Versao e fonte incorretas.
- Categoria, idioma, subcategoria ou competencia incorretos.
- Material com menos de 1.500 ou mais de 3.200 palavras.
- Ausencia de qualquer uma das 13 secoes.
- Ausencia de relacao com flashcards ou simulados.
- Referencia a flashcard ou questao inexistente.

## Validacoes Executadas

- `npm run content:validate`: passou.
  - Acervo legado: 12 materiais preservados.
  - Lote profundo: 4 materiais validos.
  - Contagem: 2.077, 2.189, 2.063 e 2.115 palavras.
  - Versao: `pgm-2026-v2`.
  - Fonte: `Sprint 6F.1 Deep Materials`.
- `npm run content:validate-imported`: passou.
  - Snapshot publicado permanece com 12 materiais da Etapa 8F.
  - O validador criou fixtures temporarias de RLS conforme o fluxo existente e removeu os usuarios/tenants ao finalizar.
  - Nenhum material da Sprint 6F.1 foi importado.
- `npx tsc --noEmit`: passou.
- `git diff --check`: passou.

## Riscos e Limitacoes

1. Os novos materiais ainda nao aparecem na plataforma.
   - Isso e intencional: a sprint proibiu alterar o banco. O lote esta pronto para revisao e importacao editorial futura.

2. O renderizador atual de materiais e limitado.
   - `MarkdownContent` apresenta titulos e tabelas como linhas de texto, sem suporte completo a tabela Markdown. Nao foi alterado porque esta sprint e exclusivamente editorial.

3. Revisao linguistica humana.
   - O conteudo foi estruturado e validado automaticamente, mas uma revisao final por professor de Ingles continua recomendada antes da publicacao comercial.

4. Tempo estimado deve ser calibrado.
   - Os tempos foram definidos pela extensao e quantidade de exercicios. Podem ser ajustados depois de observar o tempo real de leitura dos alunos.

## Proximos Passos Recomendados

1. Realizar revisao linguistica e pedagogica humana.
2. Criar uma sprint curta de publicacao/importacao dos quatro materiais.
3. Evoluir `MarkdownContent` para headings, tabelas e destaque semantico, em sprint de frontend separada.
4. Vincular os materiais a uma trilha de fundamentos de Ingles sem alterar a ordem das trilhas atuais antes da aprovacao editorial.
5. Medir conclusao, tempo de leitura e impacto nos erros dos simulados intensivos.
