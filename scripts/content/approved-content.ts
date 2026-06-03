import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "mixed"
  | "psychosocial";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "mixed";

export type QuestionType = "objective" | "subjective" | "psychosocial";

export type PathItemType =
  | "question"
  | "study_material"
  | "flashcard"
  | "simulation_template"
  | "psychosocial_question";

export type CategorySeed = {
  editorialId: string;
  name: string;
  slug: string;
  language: Language;
  parentSlug: string | null;
  sourceReference: string;
};

export type BankSeed = {
  editorialId: string;
  title: string;
  description: string;
  language: Language;
  isPremium: boolean;
  sourceReference: string;
};

export type TemplateSeed = {
  editorialId: string;
  title: string;
  description: string;
  type: "quick" | "full";
  language: Language;
  totalQuestions: number;
  isPremium: boolean;
  sourceReference: string;
};

export type MaterialSeed = {
  editorialId: string;
  title: string;
  slug: string;
  categorySlug: string;
  language: Language;
  difficulty: Difficulty;
  estimatedTime: number;
  isPremium: boolean;
  contentMd: string;
  sourceReference: string;
};

export type FlashcardSeed = {
  editorialId: string;
  categorySlug: string;
  frontContent: string;
  backContent: string;
  language: Language;
  difficulty: Difficulty;
  isPremium: boolean;
  sourceReference: string;
};

export type QuestionOptionSeed = {
  label: "A" | "B" | "C" | "D" | "E";
  text: string;
  isCorrect: boolean;
};

export type QuestionSeed = {
  editorialId: string;
  bankId: string;
  categorySlug: string;
  type: QuestionType;
  difficulty: Difficulty;
  language: Language;
  statement: string;
  explanation: string;
  sourceReference: string;
  options: QuestionOptionSeed[];
};

export type PsychosocialQuestionSeed = {
  editorialId: string;
  category: string;
  question: string;
  idealAnswerGuidelines: string;
  commonMistakes: string;
  isPremium: boolean;
  sourceReference: string;
};

export type PathItemSeed = {
  itemType: PathItemType;
  editorialId: string;
};

export type LearningPathSeed = {
  editorialId: string;
  title: string;
  slug: string;
  language: Language;
  description: string;
  isPremium: boolean;
  sourceReference: string;
  items: PathItemSeed[];
};

export type ApprovedContent = {
  categories: CategorySeed[];
  banks: BankSeed[];
  templates: TemplateSeed[];
  materials: MaterialSeed[];
  flashcards: FlashcardSeed[];
  objectiveQuestions: QuestionSeed[];
  subjectiveQuestions: QuestionSeed[];
  psychosocialQuestions: PsychosocialQuestionSeed[];
  learningPaths: LearningPathSeed[];
};

export const SOURCE_REFERENCE = "Autoral PGM Academy - Etapa 8F";

const scaleReviewPath = join(process.cwd(), "docs", "CONTENT_SCALE_REVIEW.md");
const contentReviewPath = join(process.cwd(), "docs", "CONTENT_REVIEW.md");

const baseCategories: CategorySeed[] = [
  category("BASE-CAT-READING-COMPREHENSION", "Reading Comprehension", "reading-comprehension", "english"),
  category("BASE-CAT-VOCABULARY", "Vocabulary", "vocabulary", "english"),
  category("BASE-CAT-GRAMMAR", "Grammar", "grammar", "english"),
  category("BASE-CAT-EVERYDAY-ENGLISH", "Everyday English", "everyday-english", "english"),
  category("BASE-CAT-COMPRENSION-LECTORA", "Comprension Lectora", "comprension-lectora", "spanish"),
  category("BASE-CAT-GRAMATICA", "Gramatica", "gramatica", "spanish"),
  category("BASE-CAT-WRITING", "Writing", "writing", "mixed"),
  category("BASE-CAT-AUTOCONHECIMENTO", "Autoconhecimento", "autoconhecimento", "psychosocial"),
  category("BASE-CAT-ADAPTABILIDADE", "Adaptabilidade", "adaptabilidade", "psychosocial"),
  category("BASE-CAT-RESPONSABILIDADE", "Responsabilidade", "responsabilidade", "psychosocial"),
];

function category(
  editorialId: string,
  name: string,
  slug: string,
  language: Language,
  parentSlug: string | null = null,
): CategorySeed {
  return {
    editorialId,
    name,
    slug,
    language,
    parentSlug,
    sourceReference: SOURCE_REFERENCE,
  };
}

export function loadApprovedContent(): ApprovedContent {
  const scaleReview = readFileSync(scaleReviewPath, "utf8");
  const contentReview = readFileSync(contentReviewPath, "utf8");

  return {
    categories: [...baseCategories, ...parseRefinedCategories(contentReview)],
    banks: parseBanks(scaleReview),
    templates: derivedSimulationTemplates(),
    materials: parseMaterials(scaleReview),
    flashcards: parseFlashcards(scaleReview),
    objectiveQuestions: parseObjectiveQuestions(scaleReview),
    subjectiveQuestions: parseSubjectiveQuestions(scaleReview),
    psychosocialQuestions: parsePsychosocialQuestions(scaleReview),
    learningPaths: parseLearningPaths(scaleReview),
  };
}

export function validateApprovedContent(content: ApprovedContent): string[] {
  const errors: string[] = [];
  const allQuestions = [...content.objectiveQuestions, ...content.subjectiveQuestions];
  const categorySlugs = new Set(content.categories.map((item) => item.slug));
  const bankIds = new Set(content.banks.map((item) => item.editorialId));
  const materialIds = new Set(content.materials.map((item) => item.editorialId));
  const flashcardIds = new Set(content.flashcards.map((item) => item.editorialId));
  const questionIds = new Set(allQuestions.map((item) => item.editorialId));
  const psychosocialIds = new Set(content.psychosocialQuestions.map((item) => item.editorialId));

  expectCount(errors, "bancos", content.banks, 5);
  expectCount(errors, "templates derivados", content.templates, 5);
  expectCount(errors, "materiais", content.materials, 12);
  expectCount(errors, "flashcards", content.flashcards, 60);
  expectCount(errors, "questões objetivas", content.objectiveQuestions, 100);
  expectCount(errors, "questões subjetivas", content.subjectiveQuestions, 20);
  expectCount(errors, "perguntas psicossociais", content.psychosocialQuestions, 30);
  expectCount(errors, "trilhas", content.learningPaths, 6);

  expectUnique(errors, "categorias", content.categories.map((item) => item.editorialId));
  expectUnique(errors, "slugs de categorias", content.categories.map((item) => item.slug));
  expectUnique(errors, "bancos", content.banks.map((item) => item.editorialId));
  expectUnique(errors, "templates", content.templates.map((item) => item.editorialId));
  expectUnique(errors, "materiais", content.materials.map((item) => item.editorialId));
  expectUnique(errors, "slugs de materiais", content.materials.map((item) => item.slug));
  expectUnique(errors, "flashcards", content.flashcards.map((item) => item.editorialId));
  expectUnique(errors, "questões", allQuestions.map((item) => item.editorialId));
  expectUnique(errors, "perguntas psicossociais", content.psychosocialQuestions.map((item) => item.editorialId));
  expectUnique(errors, "trilhas", content.learningPaths.map((item) => item.editorialId));
  expectUnique(errors, "slugs de trilhas", content.learningPaths.map((item) => item.slug));

  for (const item of content.categories) {
    if (item.parentSlug && !categorySlugs.has(item.parentSlug)) {
      errors.push(`Categoria ${item.editorialId} referência parent_slug inexistente: ${item.parentSlug}`);
    }
  }

  for (const item of [...content.materials, ...content.flashcards, ...allQuestions]) {
    if (!categorySlugs.has(item.categorySlug)) {
      errors.push(`${item.editorialId} referência category_slug inexistente: ${item.categorySlug}`);
    }
  }

  for (const item of allQuestions) {
    if (!bankIds.has(item.bankId)) {
      errors.push(`${item.editorialId} referência banco inexistente: ${item.bankId}`);
    }

    if (item.type === "objective") {
      const correctOptions = item.options.filter((option) => option.isCorrect);
      if (item.options.length !== 5 || correctOptions.length !== 1) {
        errors.push(`${item.editorialId} precisa ter 5 alternativas e exatamente 1 correta`);
      }
    }

    if (item.sourceReference !== SOURCE_REFERENCE) {
      errors.push(`${item.editorialId} está sem source_reference padrao`);
    }
  }

  for (const path of content.learningPaths) {
    for (const item of path.items) {
      if (item.itemType === "study_material" && !materialIds.has(item.editorialId)) {
        errors.push(`${path.editorialId} referência material inexistente: ${item.editorialId}`);
      }
      if (item.itemType === "flashcard" && !flashcardIds.has(item.editorialId)) {
        errors.push(`${path.editorialId} referência flashcard inexistente: ${item.editorialId}`);
      }
      if (item.itemType === "question" && !questionIds.has(item.editorialId)) {
        errors.push(`${path.editorialId} referência questão inexistente: ${item.editorialId}`);
      }
      if (item.itemType === "psychosocial_question" && !psychosocialIds.has(item.editorialId)) {
        errors.push(`${path.editorialId} referência psicossocial inexistente: ${item.editorialId}`);
      }
    }
  }

  for (const item of [...content.banks, ...content.templates, ...content.materials, ...content.flashcards, ...content.learningPaths]) {
    if (item.sourceReference !== SOURCE_REFERENCE) {
      errors.push(`${item.editorialId} está sem source_reference padrao`);
    }
  }

  for (const item of [...content.banks, ...content.templates, ...content.flashcards, ...content.learningPaths]) {
    if (!item.isPremium) {
      errors.push(`${item.editorialId} deveria permanecer premium no lote 8F`);
    }
  }

  const freeMaterials = content.materials.filter((item) => !item.isPremium).map((item) => item.editorialId);
  if (freeMaterials.length !== 1 || freeMaterials[0] !== "MAT-SCALE-004") {
    errors.push(`Materiais gratuitos esperados: MAT-SCALE-004; encontrados: ${freeMaterials.join(", ") || "nenhum"}`);
  }

  for (const item of content.categories) {
    if (item.sourceReference !== SOURCE_REFERENCE) {
      errors.push(`${item.editorialId} está sem source_reference padrao`);
    }
  }

  for (const item of content.psychosocialQuestions) {
    if (item.sourceReference !== SOURCE_REFERENCE || !item.isPremium) {
      errors.push(`${item.editorialId} precisa manter source_reference e premium`);
    }
  }

  return errors;
}

export function formatContentSummary(content: ApprovedContent): string {
  return [
    `Categorias totais: ${content.categories.length}`,
    `Bancos: ${content.banks.length}`,
    `Templates derivados: ${content.templates.length}`,
    `Materiais: ${content.materials.length}`,
    `Flashcards: ${content.flashcards.length}`,
    `Questões objetivas: ${content.objectiveQuestions.length}`,
    `Questões subjetivas: ${content.subjectiveQuestions.length}`,
    `Perguntas psicossociais: ${content.psychosocialQuestions.length}`,
    `Trilhas: ${content.learningPaths.length}`,
    `Source reference: ${SOURCE_REFERENCE}`,
  ].join("\n");
}

function parseRefinedCategories(markdown: string): CategorySeed[] {
  return parseSections(markdown, "CAT-").map((section) => {
    const metadata = parseMetadata(section.body);
    return category(
      section.id,
      required(metadata, "name", section.id),
      required(metadata, "slug", section.id),
      toLanguage(required(metadata, "language", section.id), section.id),
      toNullable(metadata.parent_slug),
    );
  });
}

function parseBanks(markdown: string): BankSeed[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| BANK-SCALE-"))
    .map((line) => {
      const [editorialId, title, language, isPremium, description] = parseRow(line);
      return {
        editorialId,
        title,
        description,
        language: toLanguage(language, editorialId),
        isPremium: toBoolean(isPremium, editorialId),
        sourceReference: SOURCE_REFERENCE,
      };
    });
}

function derivedSimulationTemplates(): TemplateSeed[] {
  return [
    {
      editorialId: "TEMPLATE-SCALE-FULL-MIXED",
      title: "Simulado Completo - Lote 8F",
      description: "Simulado premium com base no pacote autoral aprovado da Etapa 8F.",
      type: "full",
      language: "mixed",
      totalQuestions: 60,
      isPremium: true,
      sourceReference: SOURCE_REFERENCE,
    },
    {
      editorialId: "TEMPLATE-SCALE-QUICK-EN",
      title: "Simulado Rápido - Inglês",
      description: "Leitura, vocabulario, gramatica funcional e comunicacao em ingles.",
      type: "quick",
      language: "english",
      totalQuestions: 10,
      isPremium: true,
      sourceReference: SOURCE_REFERENCE,
    },
    {
      editorialId: "TEMPLATE-SCALE-QUICK-ES",
      title: "Simulado Rápido - Espanhol",
      description: "Compreensao leitora, vocabulario e gramatica basica em espanhol.",
      type: "quick",
      language: "spanish",
      totalQuestions: 10,
      isPremium: true,
      sourceReference: SOURCE_REFERENCE,
    },
    {
      editorialId: "TEMPLATE-SCALE-QUICK-PT",
      title: "Simulado Rápido - Preparação Segura",
      description: "Edital vigente, orientacoes seguras, responsabilidade e organizacao.",
      type: "quick",
      language: "portuguese",
      totalQuestions: 10,
      isPremium: true,
      sourceReference: SOURCE_REFERENCE,
    },
    {
      editorialId: "TEMPLATE-SCALE-QUICK-PSY",
      title: "Simulado Rápido - Psicossocial",
      description: "Postura, maturidade, adaptacao cultural e responsabilidade.",
      type: "quick",
      language: "psychosocial",
      totalQuestions: 10,
      isPremium: true,
      sourceReference: SOURCE_REFERENCE,
    },
  ];
}

function parseMaterials(markdown: string): MaterialSeed[] {
  return parseSections(markdown, "MAT-SCALE-").map((section) => {
    const metadata = parseMetadata(section.body);
    const contentMd = section.body.match(/```md\r?\n([\s\S]*?)\r?\n```/)?.[1]?.trim();

    if (!contentMd) {
      throw new Error(`${section.id} está sem bloco markdown de conteúdo`);
    }

    return {
      editorialId: section.id,
      title: required(metadata, "title", section.id),
      slug: required(metadata, "slug", section.id),
      categorySlug: required(metadata, "category_slug", section.id),
      language: toLanguage(required(metadata, "language", section.id), section.id),
      difficulty: toDifficulty(required(metadata, "difficulty", section.id), section.id),
      estimatedTime: toNumber(required(metadata, "estimated_time", section.id), section.id),
      isPremium: toBoolean(required(metadata, "is_premium", section.id), section.id),
      contentMd,
      sourceReference: SOURCE_REFERENCE,
    };
  });
}

function parseFlashcards(markdown: string): FlashcardSeed[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| FLA-SCALE-"))
    .map((line) => {
      const [editorialId, categorySlug, frontContent, backContent, language, difficulty] = parseRow(line);
      return {
        editorialId,
        categorySlug,
        frontContent,
        backContent,
        language: toLanguage(language, editorialId),
        difficulty: toDifficulty(difficulty, editorialId),
        isPremium: true,
        sourceReference: SOURCE_REFERENCE,
      };
    });
}

function parseObjectiveQuestions(markdown: string): QuestionSeed[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| OBJ-SCALE-"))
    .map((line) => {
      const [editorialId, categorySlug, difficulty, statement, optionA, optionB, optionC, optionD, optionE, correct, explanation] =
        parseRow(line);

      return {
        editorialId,
        bankId: bankIdForObjective(editorialId),
        categorySlug,
        type: "objective",
        difficulty: toDifficulty(difficulty, editorialId),
        language: languageForObjective(editorialId),
        statement,
        explanation,
        sourceReference: SOURCE_REFERENCE,
        options: [
          option("A", optionA, correct),
          option("B", optionB, correct),
          option("C", optionC, correct),
          option("D", optionD, correct),
          option("E", optionE, correct),
        ],
      };
    });
}

function parseSubjectiveQuestions(markdown: string): QuestionSeed[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| SUB-SCALE-"))
    .map((line) => {
      const [editorialId, categorySlug, language, difficulty, prompt, competencies, rubric] = parseRow(line);

      return {
        editorialId,
        bankId: "BANK-SCALE-WR-001",
        categorySlug,
        type: "subjective",
        difficulty: toDifficulty(difficulty, editorialId),
        language: toLanguage(language, editorialId),
        statement: prompt,
        explanation: `Competencias avaliadas: ${competencies}\nRubrica resumida: ${rubric}`,
        sourceReference: SOURCE_REFERENCE,
        options: [],
      };
    });
}

function parsePsychosocialQuestions(markdown: string): PsychosocialQuestionSeed[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| PSY-SCALE-"))
    .map((line) => {
      const [editorialId, categoryName, questionText, idealAnswerGuidelines, commonMistakes] = parseRow(line);
      return {
        editorialId,
        category: categoryName,
        question: questionText,
        idealAnswerGuidelines,
        commonMistakes,
        isPremium: true,
        sourceReference: SOURCE_REFERENCE,
      };
    });
}

function parseLearningPaths(markdown: string): LearningPathSeed[] {
  return parseSections(markdown, "PATH-SCALE-").map((section) => {
    const metadata = parseMetadata(section.body);
    const items = section.body
      .split("\n")
      .filter((line) => /^\d+\. /.test(line.trim()))
      .flatMap(parsePathItemLine);

    return {
      editorialId: section.id,
      title: required(metadata, "title", section.id),
      slug: required(metadata, "slug", section.id),
      language: toLanguage(required(metadata, "language", section.id), section.id),
      description: required(metadata, "description", section.id),
      isPremium: true,
      sourceReference: SOURCE_REFERENCE,
      items,
    };
  });
}

function parsePathItemLine(line: string): PathItemSeed[] {
  const match = line.trim().match(/^\d+\.\s+([^:]+):\s+(.+)$/);
  if (!match) {
    return [];
  }

  const [, rawType, rawIds] = match;
  const itemType = toPathItemType(rawType);
  return expandEditorialIds(rawIds).map((editorialId) => ({
    itemType,
    editorialId,
  }));
}

function toPathItemType(rawType: string): PathItemType {
  if (rawType === "study_material") return "study_material";
  if (rawType === "flashcard_set") return "flashcard";
  if (rawType === "objective_questions" || rawType === "subjective_questions") return "question";
  if (rawType === "psychosocial_questions") return "psychosocial_question";
  if (rawType === "simulation_template") return "simulation_template";
  throw new Error(`Tipo de item de trilha não suportado: ${rawType}`);
}

function expandEditorialIds(rawValue: string): string[] {
  const value = rawValue.trim();
  const rangeMatch = value.match(/^([A-Z]+(?:-[A-Z]+)*-)(\d{3})\s+a\s+([A-Z]+(?:-[A-Z]+)*-)?(\d{3})$/);

  if (rangeMatch) {
    const [, startPrefix, startNumber, endPrefix = startPrefix, endNumber] = rangeMatch;
    if (startPrefix !== endPrefix) {
      throw new Error(`Intervalo com prefixos diferentes: ${value}`);
    }

    const start = Number(startNumber);
    const end = Number(endNumber);
    return Array.from({ length: end - start + 1 }, (_, index) => {
      return `${startPrefix}${String(start + index).padStart(3, "0")}`;
    });
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseSections(markdown: string, prefix: string): { id: string; body: string }[] {
  const pattern = new RegExp(`^### (${escapeRegExp(prefix)}\\d{3})\\s*$`, "gm");
  const matches = [...markdown.matchAll(pattern)];
  const headings = [...markdown.matchAll(/^### .+$/gm)];

  return matches.map((match) => {
    const id = match[1];
    const start = match.index ?? 0;
    const end = headings.find((heading) => (heading.index ?? 0) > start)?.index ?? markdown.length;
    return {
      id,
      body: markdown.slice(start + match[0].length, end).trim(),
    };
  });
}

function parseMetadata(sectionBody: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  const lines = sectionBody.split("\n");

  for (const line of lines) {
    const match = line.match(/^- ([^:]+):\s*(.*)$/);
    if (match) {
      metadata[match[1].trim()] = match[2].trim();
    }
  }

  return metadata;
}

function parseRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function option(label: QuestionOptionSeed["label"], text: string, correct: string): QuestionOptionSeed {
  return {
    label,
    text,
    isCorrect: correct === label,
  };
}

function bankIdForObjective(editorialId: string): string {
  const sequence = sequenceFromEditorialId(editorialId);
  if (sequence <= 35) return "BANK-SCALE-EN-001";
  if (sequence <= 60) return "BANK-SCALE-ES-001";
  if (sequence <= 80) return "BANK-SCALE-PT-001";
  if (sequence <= 90) return "BANK-SCALE-WR-001";
  return "BANK-SCALE-PSY-001";
}

function languageForObjective(editorialId: string): Language {
  const sequence = sequenceFromEditorialId(editorialId);
  if (sequence <= 35) return "english";
  if (sequence <= 60) return "spanish";
  if (sequence <= 80) return "portuguese";
  if (sequence <= 90) return "mixed";
  return "psychosocial";
}

function sequenceFromEditorialId(editorialId: string): number {
  const sequence = Number(editorialId.match(/(\d{3})$/)?.[1]);
  if (!Number.isInteger(sequence)) {
    throw new Error(`ID editorial inválido: ${editorialId}`);
  }
  return sequence;
}

function expectCount<T>(errors: string[], label: string, items: T[], expected: number): void {
  if (items.length !== expected) {
    errors.push(`${label}: esperado ${expected}, encontrado ${items.length}`);
  }
}

function expectUnique(errors: string[], label: string, values: string[]): void {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    errors.push(`${label}: valores duplicados ${[...new Set(duplicates)].join(", ")}`);
  }
}

function required(metadata: Record<string, string>, key: string, context: string): string {
  const value = metadata[key];
  if (!value) {
    throw new Error(`${context} está sem metadado obrigatório: ${key}`);
  }
  return value;
}

function toNullable(value: string | undefined): string | null {
  if (!value || value === "null") {
    return null;
  }
  return value;
}

function toBoolean(value: string, context: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${context} tem boolean inválido: ${value}`);
}

function toNumber(value: string, context: string): number {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue)) {
    throw new Error(`${context} tem número inválido: ${value}`);
  }
  return numberValue;
}

function toLanguage(value: string, context: string): Language {
  if (
    value === "english" ||
    value === "spanish" ||
    value === "portuguese" ||
    value === "mixed" ||
    value === "psychosocial"
  ) {
    return value;
  }
  throw new Error(`${context} tem language invalida: ${value}`);
}

function toDifficulty(value: string, context: string): Difficulty {
  if (value === "beginner" || value === "intermediate" || value === "advanced" || value === "mixed") {
    return value;
  }
  throw new Error(`${context} tem difficulty invalida: ${value}`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
