# Infraestrutura Editorial PGM Academy

Data: 04/06/2026  
Sprint: 6A  
Objetivo: criar a base editorial versionada que sustentará importação futura de questões, materiais, subjetivas e psicossociais sem alterar as funcionalidades já entregues.

## Princípio

A Sprint 6A não importa conteúdo massivo. Ela define contratos, metadados, versionamento e blueprints para que as próximas sprints possam importar conteúdo em escala com rastreabilidade.

## Matriz Editorial

Todo conteúdo futuro deve possuir:

- Categoria
- Subcategoria
- Competência principal
- Idioma
- Nível editorial de dificuldade
- Tags
- Versão editorial
- Edital vinculado
- Fonte ou referência editorial

## Categorias Oficiais

| Categoria | Idioma | Subcategorias |
|---|---|---|
| Inglês | english | Reading Comprehension, Grammar, Vocabulary, Communication |
| Espanhol | spanish | Comprensión Lectora, Gramática, Vocabulario, Comunicación |
| Processo Seletivo PGM | portuguese | Edital, Elegibilidade, Cronograma, Documentação |
| Vida Internacional | mixed | Cultura, Host Family, Escola, Adaptação Cultural, Intercâmbio |
| Escrita Internacional | mixed | Estrutura, Coesão, Clareza, Gramática, Vocabulário |
| Treino Psicossocial | psychosocial | Comunicação, Adaptabilidade, Autonomia, Responsabilidade, Diversidade Cultural, Resolução de Conflitos |

## Competências

As competências ficam centralizadas em `src/lib/editorial/taxonomy.ts` e serão persistíveis em `editorial_competencies`.

Exemplos:

- `eng-identify-main-idea`: identificar ideia principal em inglês.
- `eng-infer-implicit-information`: inferir informação implícita.
- `spa-recognize-false-cognates`: reconhecer falsos cognatos.
- `pgm-understand-edital`: interpretar regras do edital.
- `writing-use-cohesion`: usar coesão em respostas curtas.
- `psy-resolve-conflicts`: resolver conflitos com maturidade.

Cada questão futura deve apontar para uma competência principal por `primary_competency_id`.

## Níveis de Dificuldade

| Nível | Nome | Uso |
|---:|---|---|
| 1 | Fundamentos | Reconhecimento direto de regra, vocabulário ou conceito. |
| 2 | Intermediário | Aplicação em contexto simples, com distratores controlados. |
| 3 | Avançado | Inferência, comparação e síntese de informações. |
| 4 | Competitivo PGM | Pressão de prova, combinação de competências e maior seletividade. |

O campo legado `difficulty` continua preservado. O novo campo `editorial_difficulty_level` permite a classificação oficial 1 a 4 sem quebrar fluxos atuais.

## Versionamento

A versão ativa inicial é:

- Código: `pgm-2026-v1`
- Edital: 2026
- Status: `active`
- Referência: Edital PGM 2026 e base oficial centralizada da Sprint 1

Novos editais devem criar novas linhas em `editorial_versions`, sem sobrescrever conteúdo antigo.

## Banco de Dados

Migration criada:

- `supabase/migrations/009_editorial_infrastructure.sql`

Novas tabelas:

- `editorial_versions`
- `editorial_competencies`
- `simulation_blueprints`
- `academy_blueprints`

Colunas adicionadas a entidades existentes:

- `editorial_version_id`
- `primary_competency_id`, quando aplicável
- `editorial_difficulty_level`, quando aplicável
- `tags`
- `blueprint_id` em `simulation_templates`
- `academy_blueprint_id` em `learning_paths`
- `material_structure` em `study_materials`

## Segurança

- Nenhuma política existente foi reduzida.
- Novas tabelas têm RLS habilitada.
- Usuários autenticados leem apenas metadados ativos.
- Administradores gerenciam versões, competências e blueprints.
- Conteúdos continuam respeitando `tenant_id`, `user_id`, premium access e RLS existentes.

## Código

Arquivos principais:

- `src/lib/editorial/taxonomy.ts`
- `src/lib/editorial/blueprints.ts`
- `src/lib/editorial/import-specs.ts`
- `src/lib/editorial/validation.ts`

Teste:

- `tests/editorial-infrastructure.test.ts`

## Próximas Sprints

- Sprint 6B: importar 400 questões objetivas usando a matriz.
- Sprint 6C: importar materiais premium com estrutura editorial.
- Sprint 6D: importar 50 subjetivas e 80 psicossociais com competência, rubrica e metadados.
