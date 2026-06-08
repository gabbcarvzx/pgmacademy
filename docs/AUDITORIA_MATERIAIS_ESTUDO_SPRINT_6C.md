# Auditoria dos Materiais de Estudo - Preparação Sprint 6C

Data: 08/06/2026  
Escopo: auditar os 12 materiais de estudo existentes e propor a Sprint 6C para expansão editorial sem alterar banco, autenticação, pagamentos, Mentor IA ou rotas sensíveis.

## Resumo Executivo

Os 12 materiais atuais existem em `docs/CONTENT_SCALE_REVIEW.md` e são carregados por `scripts/content/approved-content.ts`. Eles funcionam como notas rápidas ou microaulas, mas ainda não têm profundidade suficiente para sustentar uma experiência premium madura.

Todos os 12 materiais estão rasos. Eles possuem entre 47 e 75 palavras, não seguem a estrutura editorial prevista na Sprint 6A para materiais premium e não cobrem todas as competências cadastradas em `src/lib/editorial/taxonomy.ts`.

Critério usado para classificar como raso:

- menos de 300 palavras;
- ausência de teoria organizada;
- poucos exemplos ou nenhum exemplo resolvido;
- ausência de seção de erros comuns completa;
- ausência de questões resolvidas;
- ausência de flashcards vinculados no próprio material;
- checklist inexistente ou muito curto.

## Auditoria Material por Material

| ID | Material | Palavras | Diagnóstico | Competências cobertas |
|---|---|---:|---|---|
| `MAT-SCALE-001` | Técnica dos 3 Passos Para Reading | 68 | Raso. Boa orientação inicial, mas sem texto exemplo, questão resolvida ou treino guiado. | `eng-identify-main-idea`, `eng-infer-implicit-information` |
| `MAT-SCALE-002` | Verbos Modais Para Conselhos e Regras | 68 | Raso. Lista usos e exemplos, mas falta teoria, contrastes, erros comuns e exercícios resolvidos. | `eng-apply-grammar-rule`, parcial `eng-everyday-communication` |
| `MAT-SCALE-003` | Conectores Em Inglês Para Responder Melhor | 75 | Raso. Útil para escrita, mas muito curto para treinar estrutura, coesão e clareza com profundidade. | `writing-use-cohesion`, `writing-keep-clarity`, parcial `writing-structure-answer` |
| `MAT-SCALE-004` | Espanhol Por Cognatos e Contexto | 66 | Raso. Material gratuito bom como amostra, mas insuficiente para premium ou simulado oficial. | `spa-interpret-texts`, `spa-recognize-false-cognates` |
| `MAT-SCALE-005` | Ser, Estar e Tener Em Contextos de Escola | 47 | Muito raso. Apenas lista usos básicos e três exemplos. | `spa-apply-grammar` |
| `MAT-SCALE-006` | Como Estudar Regras Sem Confundir Com Garantias | 75 | Raso. Boa postura institucional, mas falta aplicação em casos, checklist e exemplos de leitura de edital. | `pgm-understand-edital`, parcial `pgm-check-eligibility` |
| `MAT-SCALE-007` | Como Montar Uma Resposta Subjetiva Curta | 68 | Raso. Modelo P-E-F é bom, mas precisa de rubrica, exemplos por idioma e treino de 90 a 150 palavras. | `writing-structure-answer`, `writing-keep-clarity` |
| `MAT-SCALE-008` | Erros Comuns Em Respostas Escritas | 62 | Raso. Checklist útil, mas falta correção comentada e exemplos de erro versus resposta melhorada. | `writing-keep-clarity`, `writing-use-cohesion` |
| `MAT-SCALE-009` | Entrevista Psicossocial Sem Resposta Decorada | 59 | Muito raso. Introduz postura, mas não treina autonomia, maturidade ou comunicação com cenários. | `psy-demonstrate-maturity`, parcial `psy-communicate-adequately` |
| `MAT-SCALE-010` | Adaptação Cultural Na Prática | 55 | Muito raso. Bom tema, mas sem host family, escola, diversidade cultural e conflitos práticos em profundidade. | `life-understand-cultural-differences`, parcial `psy-respect-cultural-diversity` |
| `MAT-SCALE-011` | Responsabilidade Com Documentos e Prazos | 55 | Muito raso. Checklist inicial bom, mas falta fluxo de documentação, exemplos e rotina familiar. | `pgm-organize-documentation`, parcial `psy-demonstrate-autonomy` |
| `MAT-SCALE-012` | Como Analisar Alternativas Em Simulados | 66 | Raso. Estratégia útil, mas ainda não está vinculada claramente a competências da matriz. | Competência de estratégia de prova ainda não catalogada; apoio indireto a leitura e edital |

## Cobertura Atual por Competência

### Cobertas de Forma Aceitável Como Introdução

- `eng-identify-main-idea`
- `eng-infer-implicit-information`
- `eng-apply-grammar-rule`
- `spa-interpret-texts`
- `spa-apply-grammar`
- `spa-recognize-false-cognates`
- `pgm-understand-edital`
- `pgm-organize-documentation`
- `writing-structure-answer`
- `writing-use-cohesion`
- `writing-keep-clarity`
- `psy-demonstrate-maturity`
- `life-understand-cultural-differences`

Observação: “coberta” aqui significa que há algum material relacionado, não que a competência esteja plenamente desenvolvida.

### Cobertas Apenas Parcialmente

- `eng-everyday-communication`: aparece em modais e pedidos educados, mas não existe material próprio de comunicação cotidiana.
- `pgm-check-eligibility`: aparece de forma indireta em regras e edital, sem aula dedicada a critérios.
- `psy-communicate-adequately`: aparece em postura de entrevista, mas sem estrutura de resposta e cenários.
- `psy-demonstrate-autonomy`: aparece indiretamente em documentos e responsabilidade, sem treino específico.
- `psy-respect-cultural-diversity`: aparece em adaptação cultural, mas sem casos de diversidade e convivência.

### Sem Material Dedicado

- `eng-contextual-vocabulary`
- `spa-everyday-communication`
- `life-host-family-rules`
- `life-school-routine`
- `psy-resolve-conflicts`

### Competência ou Categoria a Considerar no Futuro

`MAT-SCALE-012` cobre uma habilidade real de prova: análise de alternativas, eliminação de distratores e revisão de erro. Essa habilidade é valiosa para simulados, mas ainda não existe como competência formal na matriz editorial. Para não alterar banco nesta sprint, a Sprint 6C deve apenas tratar esse material como estratégia transversal. Em uma sprint futura, pode ser avaliada a criação de uma competência editorial como `test-taking-analyze-alternatives`.

## Lacunas por Área

### Inglês

Há material de reading e grammar, mas falta:

- vocabulário contextual em inglês;
- comunicação cotidiana em inglês;
- aula de leitura com texto exemplo e questão resolvida;
- aula por tipo de questão: main idea, detail, inference e vocabulary in context.

### Espanhol

Há material de leitura por cognatos e gramática básica, mas falta:

- comunicação cotidiana;
- vocabulário funcional;
- leitura sem depender apenas de cognatos;
- falsos cognatos com exemplos resolvidos;
- conectores básicos em espanhol.

### Processo Seletivo PGM

Há material sobre postura diante do edital e documentos, mas falta:

- critérios de elegibilidade com exemplos;
- cronograma e leitura segura de chamadas;
- diferenças entre orientação de estudo, regra oficial e decisão administrativa;
- checklist de documentos por etapa.

### Vida Internacional

Há apenas adaptação cultural superficial. Falta:

- host family;
- escola no exterior;
- rotina internacional;
- regras de convivência;
- choque cultural;
- intercâmbio e primeiros dias.

### Escrita Internacional

Há bons microconteúdos, mas falta:

- estrutura completa de resposta de 90 a 150 palavras;
- rubrica explicada com exemplos;
- antes e depois de respostas;
- modelos em inglês e espanhol;
- exercícios guiados.

### Treino Psicossocial

Há postura geral e adaptação cultural, mas falta:

- autonomia;
- resolução de conflitos;
- comunicação adequada;
- diversidade cultural;
- responsabilidade com cenários;
- maturidade com exemplos de resposta fraca, mediana e forte.

## Proposta de Sprint 6C - Expansão dos Materiais Premium

### Objetivo

Transformar os 12 materiais atuais de microaulas em materiais premium completos, mantendo o mesmo modelo de dados, os mesmos scripts de conteúdo e as mesmas rotas.

### Restrições

Não alterar:

- banco de dados;
- autenticação;
- pagamentos;
- Mentor IA;
- rotas sensíveis;
- sistema premium;
- simulados oficiais;
- Academia PGM;
- Painel de Missão;
- Central de Sucesso.

### Arquivos Prováveis

- Editar `docs/CONTENT_SCALE_REVIEW.md`.
- Validar com `scripts/content/approved-content.ts`.
- Não criar migration.
- Não alterar `src/types/database.ts`.
- Não alterar rotas.

### Estrutura Obrigatória de Cada Material Expandido

Cada material deve passar a ter:

1. Introdução e objetivo.
2. Teoria organizada.
3. Exemplos aplicados ao PGM.
4. Erros comuns.
5. Questões resolvidas ou atividades guiadas.
6. Flashcards recomendados.
7. Checklist final.
8. Competência editorial principal.
9. Competências secundárias, quando houver.
10. Observação institucional quando tratar de edital, regras, documentos ou processo.

### Critério de Profundidade

Cada material premium deve ter:

- 700 a 1.200 palavras;
- pelo menos 2 exemplos;
- pelo menos 1 exercício resolvido;
- checklist com 5 a 8 itens;
- relação explícita com competências;
- linguagem independente, sem promessa de aprovação.

### Plano de Execução

#### Fase 1 - Reescrever os 12 Materiais Existentes

Prioridade alta:

1. `MAT-SCALE-001`: expandir para aula completa de Reading Comprehension.
2. `MAT-SCALE-005`: expandir gramática espanhola básica.
3. `MAT-SCALE-009`: expandir entrevista psicossocial.
4. `MAT-SCALE-010`: expandir adaptação cultural.
5. `MAT-SCALE-011`: expandir documentação e prazos.

Prioridade média:

6. `MAT-SCALE-002`: modais em inglês.
7. `MAT-SCALE-003`: conectores para escrita.
8. `MAT-SCALE-004`: cognatos e contexto em espanhol.
9. `MAT-SCALE-007`: resposta subjetiva curta.
10. `MAT-SCALE-008`: erros comuns em escrita.
11. `MAT-SCALE-006`: regras, edital e garantias.
12. `MAT-SCALE-012`: análise de alternativas.

#### Fase 2 - Criar Materiais para Competências Sem Cobertura

Sem alterar banco, adicionar novos blocos editoriais em `docs/CONTENT_SCALE_REVIEW.md` apenas se a sprint autorizar aumentar o número de materiais. Materiais recomendados:

- Vocabulário contextual em inglês.
- Comunicação cotidiana em inglês.
- Comunicação cotidiana em espanhol.
- Host family e regras de convivência.
- Escola no exterior.
- Resolução de conflitos.

Se a Sprint 6C precisar manter exatamente 12 materiais, essas lacunas devem ser incorporadas como seções dentro dos materiais existentes.

#### Fase 3 - Validar e Importar

Comandos recomendados:

```bash
npm run content:validate
npm run content:import -- --execute
npm run content:validate-imported
```

Antes de `--execute`, revisar diff do conteúdo e rodar build/testes.

## Critérios de Pronto da Sprint 6C

- Os 12 materiais deixam de ser rasos.
- Cada material informa competências cobertas.
- Todas as competências críticas têm material dedicado ou seção clara.
- O conteúdo continua independente e sem promessa de aprovação.
- Nenhuma migration é criada.
- Nenhuma rota sensível é alterada.
- `npm run content:validate` passa.
- `npm run build` passa.
- Testes de regressão das sprints anteriores passam.

## Riscos

- Expandir conteúdo diretamente no markdown pode deixar o arquivo grande; mitigação futura seria separar materiais em arquivos próprios, mas isso exigiria nova convenção de parser.
- Se novas competências forem necessárias, isso deve ficar para uma sprint editorial própria, não para a Sprint 6C sem alteração de banco.
- Materiais sobre edital, documentos e processo seletivo exigem linguagem cuidadosa para não parecer orientação oficial.
- Se os materiais forem importados sem revisão, a experiência premium pode ficar longa, mas não necessariamente didática. A expansão deve priorizar estrutura, exemplos e exercícios.
