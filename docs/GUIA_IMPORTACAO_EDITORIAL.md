# Guia de Importação Editorial

Data: 04/06/2026  
Pipeline: Sprint 6B.1

## Objetivo

Este guia explica como preparar, validar e importar arquivos editoriais de questões objetivas da PGM Academy.

O pipeline é administrativo/local. Ele não deve ser exposto para alunos, rotas públicas ou interfaces sem controle de permissão.

## Formatos Aceitos

- JSON
- CSV
- Markdown estruturado

O JSON é o formato recomendado para os lotes oficiais.

## Campos Obrigatórios

Cada questão deve possuir:

- `id`
- `title`
- `statement`
- `language`
- `category`
- `subcategory`
- `competence`
- `difficulty_level`
- `options`
- `correct_answer`
- `explanation`
- `tags`
- `editorial_version`
- `source_reference`
- `is_premium`
- `status`

## Exemplo JSON

```json
{
  "questions": [
    {
      "id": "ENG-RC-0001",
      "title": "Main idea in school exchange text",
      "statement": "Read the short exchange-program text and identify the main idea expressed by the student narrator.",
      "language": "english",
      "category": "english",
      "subcategory": "reading-comprehension",
      "competence": "eng-identify-main-idea",
      "difficulty_level": 2,
      "options": [
        { "label": "A", "text": "The student wants to compare weather in two countries." },
        { "label": "B", "text": "The student describes the central value of the exchange experience." },
        { "label": "C", "text": "The student explains airport procedures for international travel." },
        { "label": "D", "text": "The student lists documents required before enrollment." }
      ],
      "correct_answer": "B",
      "explanation": "The text focuses on the value of the exchange experience as a whole. The distractors mention details that could appear in PGM preparation, but they do not represent the central idea requested by the question.",
      "tags": ["sprint-6b-2", "reading", "main-idea"],
      "editorial_version": "pgm-2026-v1",
      "source_reference": "Autoral PGM Academy - Sprint 6B.2",
      "is_premium": true,
      "status": "active"
    }
  ]
}
```

## Exemplo CSV

Cabeçalho recomendado:

```csv
id,title,statement,language,category,subcategory,competence,difficulty_level,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation,tags,editorial_version,source_reference,is_premium,status
```

Use `;` para separar tags.

## Exemplo Markdown

```md
id: ENG-RC-0001
title: Main idea in school exchange text
statement: Read the short exchange-program text and identify the main idea expressed by the student narrator.
language: english
category: english
subcategory: reading-comprehension
competence: eng-identify-main-idea
difficulty_level: 2
A) The student wants to compare weather in two countries.
B) The student describes the central value of the exchange experience.
C) The student explains airport procedures for international travel.
D) The student lists documents required before enrollment.
correct_answer: B
explanation: The text focuses on the value of the exchange experience as a whole. The distractors mention details that could appear in PGM preparation, but they do not represent the central idea requested by the question.
tags: sprint-6b-2; reading; main-idea
editorial_version: pgm-2026-v1
source_reference: Autoral PGM Academy - Sprint 6B.2
is_premium: true
status: active
```

Separe múltiplas questões com uma linha `---`.

## Dry-run

Dry-run valida e simula sem alterar banco:

```bash
npm run editorial:import -- --file caminho/do/lote.json
```

Dry-run offline, sem consultar Supabase:

```bash
npm run editorial:import -- --file caminho/do/lote.json --offline
```

## Importação Real

Antes de executar, confirme:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- migrations aplicadas até `010_question_import_title.sql`

Executar importação real:

```bash
npm run editorial:import -- --file caminho/do/lote.json --execute
```

Atualizar questões existentes:

```bash
npm run editorial:import -- --file caminho/do/lote.json --execute --update
```

Sem `--update`, questões existentes são ignoradas para evitar duplicidade.

## Relatórios

Todo dry-run ou importação grava relatório em:

```text
docs/import-reports/
```

O relatório mostra:

- arquivo importado;
- data;
- total de itens;
- criados;
- atualizados;
- ignorados;
- inválidos;
- erros;
- avisos.

## Como Interpretar Erros

- `critical`: bloqueia importação real do arquivo inteiro.
- `error`: torna a questão inválida e bloqueia importação real do arquivo.
- `warning`: não bloqueia, mas deve ser revisado.

Exemplos:

- `duplicate_id`: ID duplicado no arquivo.
- `invalid_category`: categoria fora da matriz editorial.
- `invalid_competence`: competência não cadastrada.
- `missing_correct_answer`: questão sem gabarito.
- `explanation_too_shallow`: explicação rasa.

## Preparação do Lote 1

Sprint 6B.2:

- 50 questões
- Categoria: `english`
- Subcategoria: `reading-comprehension`
- Competências sugeridas:
  - `eng-identify-main-idea`
  - `eng-infer-implicit-information`
  - `eng-contextual-vocabulary`
- Níveis: 1 a 4
- Versão editorial: `pgm-2026-v1`
- Tags mínimas: `sprint-6b-2`, `reading`, competência ou habilidade específica

Não misture categorias no Lote 1. Isso facilita auditoria e validação.
