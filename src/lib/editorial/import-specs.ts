export type EditorialFieldRequirement = {
  field: string;
  required: boolean;
  description: string;
};

export type EditorialImportSpec = {
  code: string;
  title: string;
  targetCount: number;
  targetSprint: "6B" | "6C" | "6D";
  entity: "objective_question" | "premium_material" | "subjective_question" | "psychosocial_question";
  requirements: EditorialFieldRequirement[];
  notes: string[];
};

const commonMetadataRequirements: EditorialFieldRequirement[] = [
  {
    field: "editorial_id",
    required: true,
    description: "Identificador único, estável e auditável do item editorial.",
  },
  {
    field: "category",
    required: true,
    description: "Categoria oficial da matriz editorial.",
  },
  {
    field: "subcategory",
    required: true,
    description: "Subcategoria oficial vinculada à categoria.",
  },
  {
    field: "primary_competency_code",
    required: true,
    description: "Competência principal que o item avalia ou desenvolve.",
  },
  {
    field: "language",
    required: true,
    description: "Idioma operacional do conteúdo.",
  },
  {
    field: "editorial_difficulty_level",
    required: true,
    description: "Nível oficial de 1 a 4, preservando mapeamento com difficulty legado.",
  },
  {
    field: "tags",
    required: true,
    description: "Tags editoriais para busca, relatórios e composição de simulados.",
  },
  {
    field: "editorial_version_code",
    required: true,
    description: "Versão editorial e edital vinculado.",
  },
  {
    field: "source_reference",
    required: true,
    description: "Fonte, referência interna ou justificativa editorial.",
  },
];

export const objectiveQuestionImportSpec: EditorialImportSpec = {
  code: "sprint-6b-objective-questions",
  title: "Especificação para importação de 400 questões objetivas",
  targetCount: 400,
  targetSprint: "6B",
  entity: "objective_question",
  requirements: [
    ...commonMetadataRequirements,
    {
      field: "statement",
      required: true,
      description: "Enunciado claro, revisado e sem ambiguidade.",
    },
    {
      field: "alternatives",
      required: true,
      description: "Alternativas com identificador, texto e marcação única de gabarito.",
    },
    {
      field: "correct_option",
      required: true,
      description: "Gabarito único e consistente com as alternativas.",
    },
    {
      field: "explanation",
      required: true,
      description: "Explicação objetiva da resposta correta e dos distratores relevantes.",
    },
  ],
  notes: [
    "Não importar questões duplicadas por editorial_id.",
    "Toda questão deve apontar para competência principal.",
    "O importador deve bloquear questão sem alternativa correta única.",
  ],
};

export const premiumMaterialImportSpec: EditorialImportSpec = {
  code: "sprint-6c-premium-materials",
  title: "Especificação para importação de materiais premium",
  targetCount: 0,
  targetSprint: "6C",
  entity: "premium_material",
  requirements: [
    ...commonMetadataRequirements,
    {
      field: "introduction",
      required: true,
      description: "Contexto inicial e objetivo do material.",
    },
    {
      field: "theory",
      required: true,
      description: "Base teórica organizada em seções.",
    },
    {
      field: "examples",
      required: true,
      description: "Exemplos aplicados ao PGM e ao idioma quando relevante.",
    },
    {
      field: "common_mistakes",
      required: true,
      description: "Erros recorrentes e como evitá-los.",
    },
    {
      field: "solved_questions",
      required: true,
      description: "Questões resolvidas ou demonstrações guiadas.",
    },
    {
      field: "flashcards",
      required: true,
      description: "Itens de revisão vinculados ao material.",
    },
    {
      field: "checklist",
      required: true,
      description: "Lista final de domínio do conteúdo.",
    },
  ],
  notes: [
    "Materiais devem permanecer premium quando ligados à Academia PGM.",
    "Cada material deve ter slug único por tenant/global.",
    "Flashcards vinculados devem reaproveitar a mesma competência editorial sempre que possível.",
  ],
};

export const subjectiveQuestionImportSpec: EditorialImportSpec = {
  code: "sprint-6d-subjective-questions",
  title: "Especificação para importação de 50 subjetivas",
  targetCount: 50,
  targetSprint: "6D",
  entity: "subjective_question",
  requirements: [
    ...commonMetadataRequirements,
    {
      field: "statement",
      required: true,
      description: "Comando de escrita compatível com resposta de 90 a 150 palavras.",
    },
    {
      field: "rubric",
      required: true,
      description: "Critérios de correção gramatical, vocabulário, sintaxe, coesão e clareza.",
    },
  ],
  notes: [
    "Subjetivas devem usar type=subjective em questions.",
    "O enunciado deve indicar idioma esperado.",
    "A correção futura deve conseguir relacionar cada resposta aos critérios da rubrica.",
  ],
};

export const psychosocialQuestionImportSpec: EditorialImportSpec = {
  code: "sprint-6d-psychosocial-questions",
  title: "Especificação para importação de 80 psicossociais",
  targetCount: 80,
  targetSprint: "6D",
  entity: "psychosocial_question",
  requirements: [
    ...commonMetadataRequirements.filter(
      (requirement) => requirement.field !== "language",
    ),
    {
      field: "question",
      required: true,
      description: "Pergunta situacional clara e alinhada à competência psicossocial.",
    },
    {
      field: "ideal_answer_guidelines",
      required: true,
      description: "Diretrizes de resposta ideal para revisão manual.",
    },
    {
      field: "common_mistakes",
      required: true,
      description: "Erros comuns que o avaliador deve observar.",
    },
  ],
  notes: [
    "Psicossociais devem usar linguagem comportamental e não clínica.",
    "Cada item deve apontar para competência psicossocial principal.",
    "A revisão deve preservar tenant_id, user_id e fila premium existente.",
  ],
};

export const editorialImportSpecs = [
  objectiveQuestionImportSpec,
  premiumMaterialImportSpec,
  subjectiveQuestionImportSpec,
  psychosocialQuestionImportSpec,
] as const;
