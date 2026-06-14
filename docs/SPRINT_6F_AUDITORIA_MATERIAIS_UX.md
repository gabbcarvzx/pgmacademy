# Sprint 6F-A - Auditoria de Materiais e Refinamento UX

Data: 13/06/2026  
Objetivo: confirmar existência, profundidade, cobertura e disponibilidade dos novos materiais da Reta Final PGM, além de elevar com segurança a experiência da Central de Estudos.

## Resumo Executivo

A auditoria encontrou **19 materiais novos**, e não 18. São 12 materiais de Inglês e 7 de Espanhol, todos adicionados ao Git em 13/06/2026, na versão editorial `pgm-2026-v2`.

Editorialmente, o conjunto é profundo: os materiais possuem entre 1.501 e 3.814 palavras, tabelas, exemplos, questões estilo PGM, resolução comentada e relações declaradas com flashcards e simulados. Não foram encontrados arquivos vazios, hashes duplicados ou similaridade relevante entre textos. A maior similaridade de blocos de cinco palavras foi de apenas 0,9%, entre os dois cursos de leitura.

O achado crítico é operacional: **nenhum dos 19 materiais está publicado no Supabase**. A consulta somente leitura encontrou 12 materiais antigos e zero registros com `editorial_id` iniciado por `MAT-DEEP-`. Portanto, os novos materiais não aparecem em `/estudos`, não podem ser abertos por slug, não podem registrar progresso e não podem ser vinculados visualmente às trilhas no produto atual.

Por essa razão, a seção “Novidades da Semana” não foi adicionada ao Dashboard. Exibir títulos sem páginas acessíveis criaria uma promessa quebrada. A publicação deve ocorrer em uma sprint própria, com autorização explícita para importar conteúdo no banco.

O refinamento visual seguro foi aplicado à biblioteca e ao leitor de materiais já publicados: cards mais escaneáveis, recomendação baseada na ordenação existente por progresso e filtros, metadados claros, orientação antes/depois do estudo e renderização real de títulos, listas, tabelas, citações e formatação inline.

## Metodologia

- Leitura dos cinco manifests das Sprints 6F.1 a 6F.5.
- Validação dos 19 arquivos Markdown em `content/study-materials/pgm-2026-v2`.
- Contagem de palavras e verificação das 13 seções editoriais obrigatórias.
- Verificação de tabelas, exemplos, resolução, menções ao PGM e relações editoriais.
- Hash SHA-256 e similaridade por blocos de cinco palavras para detectar duplicação.
- Consulta somente leitura da tabela `study_materials` no Supabase.
- Leitura direta da prova PGM 2024 fornecida, com 6 páginas e 30 questões de Inglês.
- Comparação com o banco editorial da Sprint 6B e os dois simulados intensivos da Sprint 6E.
- Auditoria estática das rotas `/dashboard`, `/estudos` e `/estudos/[slug]`.
- Verificação local sem sessão em desktop e viewport mobile 390×844.

## Inventário dos Materiais

Todos os itens são Premium, ativos no source, versão `pgm-2026-v2` e foram criados no Git em 13/06/2026. “Não publicado” significa que o item existe no repositório, mas não possui registro em `study_materials`.

| ID | Título | Categoria | Competência | Idioma | Nível | Tempo | Palavras | Sprint | Qualidade | Publicação |
|---|---|---|---|---|---|---:|---:|---|---|---|
| MAT-DEEP-EN-001 | Verb To Be: Base Completa Para a Reta Final PGM | english/grammar | eng-apply-grammar-rule | Inglês | Iniciante | 55 min | 2.077 | 6F.1 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-002 | Subject Pronouns: Quem Faz a Acao em Ingles | english/grammar | eng-apply-grammar-rule | Inglês | Iniciante | 50 min | 2.189 | 6F.1 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-003 | Possessive Adjectives: Posse Sem Confusao | english/grammar | eng-apply-grammar-rule | Inglês | Iniciante | 50 min | 2.063 | 6F.1 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-004 | Present Simple: Rotinas, Habitos e Fatos | english/grammar | eng-apply-grammar-rule | Inglês | Intermediário | 65 min | 2.115 | 6F.1 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-005 | Present Continuous: Acoes em Andamento no Contexto PGM | english/grammar | eng-apply-grammar-rule | Inglês | Intermediário | 60 min | 2.313 | 6F.2 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-006 | Question Words: Como Entender o Que a Questao Pede | english/grammar | eng-apply-grammar-rule | Inglês | Intermediário | 60 min | 2.136 | 6F.2 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-007 | Articles A, An e The: Referencia e Sentido em Ingles | english/grammar | eng-apply-grammar-rule | Inglês | Intermediário | 60 min | 2.288 | 6F.2 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-008 | Prepositions: Tempo, Lugar e Movimento no Contexto PGM | english/grammar | eng-apply-grammar-rule | Inglês | Intermediário | 70 min | 2.503 | 6F.3 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-009 | Adverbs of Frequency: Posicao, Sentido e Rotina | english/grammar | eng-apply-grammar-rule | Inglês | Intermediário | 65 min | 2.408 | 6F.3 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-010 | Comparatives and Superlatives: Comparar Com Precisao | english/grammar | eng-apply-grammar-rule | Inglês | Avançado | 75 min | 2.374 | 6F.3 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-011 | Present Perfect: Experiencias, Resultados e Conexao Com o Presente | english/grammar | eng-apply-grammar-rule | Inglês | Avançado | 85 min | 2.885 | 6F.4 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-EN-012 | Reading Strategies for PGM: Ler, Localizar Evidencias e Decidir | english/reading-comprehension | eng-identify-main-idea | Inglês | Avançado | 110 min | 3.814 | 6F.4 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-001 | Ser vs Estar: Identidade, Estado e Localizacao em Espanhol | spanish/gramatica | spa-apply-grammar | Espanhol | Iniciante | 65 min | 1.607 | 6F.5 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-002 | Pronombres Personales: Sujeito, Tratamento e Referencia | spanish/gramatica | spa-apply-grammar | Espanhol | Iniciante | 60 min | 1.501 | 6F.5 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-003 | Articulos en Espanol: Genero, Numero e Referencia | spanish/gramatica | spa-apply-grammar | Espanhol | Intermediário | 65 min | 1.631 | 6F.5 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-004 | Verbos Basicos: Comunicar Rotina, Necessidade e Planos | spanish/gramatica | spa-apply-grammar | Espanhol | Intermediário | 85 min | 1.538 | 6F.5 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-005 | Comparativos y Superlativos: Comparar Dados e Experiencias | spanish/gramatica | spa-apply-grammar | Espanhol | Intermediário | 65 min | 1.530 | 6F.5 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-006 | Falsos Cognatos: Semelhanca Visual sem Armadilha de Sentido | spanish/vocabulario | spa-recognize-false-cognates | Espanhol | Intermediário | 70 min | 1.597 | 6F.5 | Melhorar copy | Crítico: não publicado |
| MAT-DEEP-ES-007 | Comprension Lectora para el PGM: Evidencia, Inferencia e Estrategia | spanish/comprension-lectora | spa-interpret-texts | Espanhol | Avançado | 115 min | 2.515 | 6F.5 | Melhorar copy | Crítico: não publicado |

## Validação de Conteúdo

### Resultado Estrutural

| Verificação | Resultado |
|---|---|
| Material vazio | 0 |
| Material abaixo de 1.500 palavras | 0 |
| Hash duplicado | 0 |
| Similaridade textual relevante | 0 |
| Sem tabelas | 0 |
| Sem exemplos | 0 |
| Sem resolução comentada | 0 |
| Sem menção/contexto PGM | 0 |
| Sem relação com flashcards | 0 |
| Sem relação com simulados | 0 |

### Classificação Editorial

- **Profundidade: OK.** Todos superam o mínimo e possuem estrutura de mini-curso.
- **Aplicabilidade: OK.** Os exemplos usam escola, viagem, família anfitriã, documentos e intercâmbio.
- **Relação com o PGM: OK.** Os materiais citam a preparação, trabalham pegadinhas e apontam questões dos acervos 6B/6E.
- **Originalidade: OK.** Não há duplicação significativa entre os 19 textos.
- **Copy final: Melhorar.** Os manifests e títulos de seção usam grafia sem acentos em expressões portuguesas e espanholas, como “Acao”, “Ingles”, “Introducao” e “Importancia”. O conteúdo é compreensível, mas essa apresentação não atinge o acabamento editorial premium esperado.
- **Disponibilidade: Crítico.** Nenhum item está publicado na tabela consumida pela aplicação.

## Cobertura Editorial

### Prova PGM 2024

A prova fornecida possui 30 questões objetivas de Inglês e duração de 3 horas. As questões 1 a 27 cobrem uso funcional e gramática; as questões 28 a 30 usam textos curtos de compreensão.

Cobertura direta dos materiais profundos:

- Subject Pronouns: questão 2.
- Possessive Adjectives: questão 3.
- Verb To Be: questão 4.
- Present Continuous: questão 5.
- Articles: questão 8.
- Question Words: questão 11.
- Present Simple: questão 12.
- Adverbs of Frequency: questão 13.
- Prepositions: questões 14 e 17.
- Comparatives/Superlatives: questões 24 e 26.
- Present Perfect: questão 27.
- Reading Strategies: questões 28 a 30.

O conjunto cobre com profundidade 13 dos assuntos mais importantes da prova, mas não é uma cobertura integral da matriz observada em 2024.

### GAP Analysis - Inglês

| Tema solicitado | Cobertura | Material |
|---|---|---|
| Verb To Be | Completa | MAT-DEEP-EN-001 |
| Subject Pronouns | Completa | MAT-DEEP-EN-002 |
| Possessives | Completa para possessive adjectives | MAT-DEEP-EN-003 |
| Present Simple | Completa | MAT-DEEP-EN-004 |
| Present Continuous | Completa | MAT-DEEP-EN-005 |
| Articles | Completa | MAT-DEEP-EN-007 |
| Question Words | Completa | MAT-DEEP-EN-006 |
| Prepositions | Completa | MAT-DEEP-EN-008 |
| Frequency Adverbs | Completa | MAT-DEEP-EN-009 |
| Comparatives | Completa | MAT-DEEP-EN-010 |
| Superlatives | Completa, no mesmo material | MAT-DEEP-EN-010 |
| Present Perfect | Completa | MAT-DEEP-EN-011 |
| Reading Strategies | Completa e aprofundada | MAT-DEEP-EN-012 |

Gaps adicionais observados na prova 2024 e/ou Sprint 6E:

- Greetings e expressões cotidianas.
- Demonstratives.
- Números, preços e horários.
- Countable/uncountable nouns e quantificadores.
- Indefinite pronouns.
- Simple Past e Past Continuous.
- Direções.
- Adjectives e posição do adjetivo.
- Have, Can e Simple Future.
- Singular/plural e plurais irregulares.

Esses temas estão presentes em questões e simulados, mas não possuem mini-curso profundo dedicado neste lote.

### GAP Analysis - Espanhol

| Tema solicitado | Cobertura | Material |
|---|---|---|
| Ser | Completa, agrupada com Estar | MAT-DEEP-ES-001 |
| Estar | Completa, agrupada com Ser | MAT-DEEP-ES-001 |
| Tener | Parcial/funcional dentro de Verbos Básicos | MAT-DEEP-ES-004 |
| Pronombres | Completa | MAT-DEEP-ES-002 |
| Artículos | Completa | MAT-DEEP-ES-003 |
| Comparativos | Completa | MAT-DEEP-ES-005 |
| Superlativos | Completa, no mesmo material | MAT-DEEP-ES-005 |
| Falsos Cognatos | Completa | MAT-DEEP-ES-006 |
| Comprensión Lectora | Completa e aprofundada | MAT-DEEP-ES-007 |

Gaps adicionais observados no Simulado Intensivo de Espanhol:

- Possessivos.
- Demonstrativos.
- Preposições.
- Interrogativos.
- Advérbios de frequência.
- Adjetivos, gênero e número fora do contexto de artigos.
- Passado e futuro próximo como cursos dedicados.

### Sprint 6B e Sprint 6E

- Os 19 materials possuem relações declaradas com flashcards existentes.
- Todos possuem relações declaradas com questões da base anterior, da Sprint 6E ou de ambas.
- `MAT-DEEP-EN-012` relaciona 18 questões de leitura.
- `MAT-DEEP-ES-007` relaciona 20 questões de compreensão leitora.
- As validações editoriais confirmam a existência dos IDs relacionados no source aprovado.
- Como os materiais não estão no Supabase, essas relações ainda não geram navegação ou progresso no produto.

## Avaliação UX

### Descoberta

**Resposta para os novos materiais: Não.**

O aluno não encontra os 19 itens porque a Central de Estudos consulta exclusivamente `study_materials`. Não existe fallback para arquivos do repositório, e criar esse fallback seria uma mudança de arquitetura e regra de publicação fora do escopo.

Para os 12 materiais antigos, a descoberta é **parcialmente adequada**: há busca, idioma, categoria, dificuldade e paginação. O refinamento desta sprint tornou a leitura dos cards mais rápida e adicionou uma recomendação baseada na ordenação existente por progresso e filtros.

### Fluxo e Cliques

Fluxo desejado:

`Dashboard → Estudos → Material → Prática → Simulado`

| Tarefa | Situação atual |
|---|---|
| Encontrar Estudos pelo menu | 1 clique |
| Abrir um material publicado | 2 cliques a partir do Dashboard/menu |
| Continuar por material recomendado em Estudos | 1 clique |
| Ir do material para Flashcards | 1 clique após o refinamento |
| Ir do material para Trilha | 1 clique após o refinamento |
| Ir do material para Simulados | 1 clique após o refinamento |
| Encontrar/abrir um dos 19 novos materiais | Impossível enquanto não publicado |

### Gargalos

1. Publicação desconectada do source editorial.
2. Competência não faz parte do contrato atual de `MaterialCard`; para o acervo antigo, a categoria ainda funciona como aproximação visual.
3. Não há dados de eventos de clique/abandono nesta sprint; abandono não pode ser afirmado com evidência.
4. O Dashboard não pode apresentar novidades que ainda retornariam 404.
5. A recomendação de Estudos usa progresso e filtros existentes, mas não cruza resultados de simulados nesta tela. O Dashboard continua sendo a fonte segura de recomendação baseada em desempenho.

### Mobile

Problemas encontrados antes do ajuste:

- Conteúdo Markdown sem hierarquia real.
- Tabelas dos mini-cursos seriam exibidas como texto corrido.
- Metadados e CTA dos cards tinham menor distinção visual.
- Ausência de orientação clara para o próximo passo.

Ajustes:

- Cards responsivos com quebra segura de título e metadados.
- CTAs ocupam a largura disponível no mobile.
- Tabelas Markdown usam um container local com scroll horizontal, sem provocar overflow da página.
- Cabeçalho do material usa `minmax(0, 1fr)` e `min-w-0` para impedir expansão indevida.
- Blocos “Antes de começar” e “Após concluir” organizam o estudo sem aumentar o header inicial.

Limitação: não havia fixture autenticada segura. O navegador confirmou o redirect para `/login`, ausência de overlay e ausência de overflow em 390×844, mas não foi possível capturar `/estudos` logado.

## Melhorias Aplicadas

### Central de Estudos

- Migração visual para `AppPageHeader`, `SectionHeader`, `ContentCard`, `StatusBadge` e `EmptyState`.
- Cards com ícone, área/competência, idioma, nível, tempo e badge Premium/Gratuito.
- Badge “Reta final” preparado por slug para os 19 materiais quando forem publicados.
- Seção “Recomendado para você” usando a lista já ordenada por progresso e os filtros atuais, sem IA e sem nova query.
- Paginação com estado desabilitado acessível.

### Material Individual

- Bloco “Antes de começar” com objetivos de uso.
- Tempo, nível, idioma e competência em leitura rápida.
- Bloco “Após concluir” com links para Flashcards, Trilhas e Simulados.
- CTA de conclusão responsivo.
- Relações existentes preservadas.

### Leitor Markdown

- Títulos H1/H2/H3.
- Listas ordenadas e não ordenadas.
- Tabelas responsivas.
- Citações e separadores.
- Negrito, itálico e código inline sem `dangerouslySetInnerHTML`.
- Supressão do primeiro H1 do Markdown para evitar repetição do título da página.

### Decisões de Segurança

- Nenhum material source-only foi exposto por fallback.
- Nenhum slug inexistente foi promovido no Dashboard.
- Nenhuma regra premium foi contornada.
- Nenhuma query, service, action ou regra de progresso foi alterada.

## Conversão e Retenção

Não há instrumentação suficiente para afirmar onde usuários abandonam ou clicam. As oportunidades abaixo são hipóteses de produto, não conclusões analíticas.

Oportunidades seguras:

- Após publicação, criar “Novidades da Semana” com no máximo 4 destaques e acesso à coleção completa.
- Usar o resultado do Simulado Intensivo para apontar 1 a 3 materiais específicos, em sprint própria.
- Mostrar preview da estrutura do mini-curso para usuário free sem expor `content_md`.
- Manter um CTA principal por card: abrir, continuar ou ver detalhes.
- Medir `material_card_view`, `material_open`, `material_complete` e `next_step_click` antes de inferir abandono.
- Não usar banners globais repetitivos; preferir recomendação contextual no Dashboard, Estudos e resultado de simulado.

## Avaliação UX

| Dimensão | Nota | Justificativa |
|---|---:|---|
| Descoberta | 3/10 | Biblioteca funcional para o acervo antigo, mas os 19 novos materiais não estão publicados. |
| Organização | 8/10 | Filtros, cards e leitor foram refinados; competência ainda não é um campo próprio no contrato atual. |
| Mobile | 8/10 | Estrutura responsiva e tabelas seguras; falta QA autenticado real. |
| Conversão | 6/10 | Valor premium está mais claro, mas novidades e recomendação pós-simulado dependem da publicação. |
| Qualidade do conteúdo | 9/10 | Profundidade e relações fortes; falta revisão final de acentuação/copy dos manifests e headings. |

## Prioridades

### P0 - Críticas

1. Publicar os 19 materiais por pipeline controlado, em sprint autorizada a alterar conteúdo no banco.
2. Validar de volta os 19 `editorial_id`, slugs, `is_active`, premium e relações depois do import.
3. Corrigir a expectativa de “18 materiais” nos documentos de produto: o source atual contém 19.

### P1 - Importantes

1. Revisar acentuação dos títulos, headings e metadados antes da importação.
2. Adicionar a coleção “Novidades da Semana” somente depois de os slugs responderem com sucesso.
3. Integrar recomendações de Estudos aos resultados reais dos simulados usando serviço existente ou contrato dedicado, em sprint de regra de recomendação.
4. Executar QA autenticado com usuário free e premium em desktop e mobile.
5. Criar mini-cursos para os gaps de alta incidência da prova 2024 e Sprint 6E.

### P2 - Futuras

1. Instrumentar eventos de descoberta, abertura, conclusão e próximo passo.
2. Calibrar tempo estimado com dados reais de leitura.
3. Permitir coleção editorial/versionada sem duplicar metadados entre source e banco.
4. Avaliar competência como metadado de primeira classe dos materiais em uma sprint de arquitetura própria.

## Arquivos Alterados

- `src/app/(app)/estudos/page.tsx`
- `src/app/(app)/estudos/[slug]/page.tsx`
- `src/components/learning/markdown-content.tsx`
- `src/lib/learning/material-presentation.ts`
- `docs/SPRINT_6F_AUDITORIA_MATERIAIS_UX.md`

## Restrições Preservadas

Não foram alterados:

- Banco e migrations.
- Supabase e RLS.
- Autenticação.
- Pagamentos e webhooks.
- Mentor IA.
- Simulados, scoring, gabaritos e tentativas.
- Analytics.
- Service role.
- Conteúdo editorial dos 19 materiais.
- Queries, services, APIs e regras de negócio.

## Validações

- `npx tsc --noEmit`: passou.
- `npm run lint`: passou.
- `npm run build`: passou; 43 páginas geradas e rotas de Estudos compiladas.
- `npm run content:validate`: passou; confirmou os 19 materiais source-only e suas contagens.
- `npm run content:validate-imported`: passou; confirmou 12 materiais no banco atual.
- `git diff --check`: passou.

QA local:

- Dev server executado em `http://127.0.0.1:3000`.
- `/estudos` sem sessão redirecionou para `/login`.
- Viewport mobile 390×844 sem overflow horizontal.
- Nenhum overlay de erro do Next.js foi encontrado.
- Console apresentou apenas mensagens informativas de desenvolvimento/HMR.
