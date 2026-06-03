import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type LearningLanguage =
  Database["public"]["Tables"]["study_materials"]["Row"]["language"];
export type LearningDifficulty =
  Database["public"]["Tables"]["study_materials"]["Row"]["difficulty"];
export type QuestionType = Database["public"]["Tables"]["questions"]["Row"]["type"];
export type SimulationTemplateType =
  Database["public"]["Tables"]["simulation_templates"]["Row"]["type"];
export type PathItemType =
  Database["public"]["Tables"]["learning_path_items"]["Row"]["item_type"];

type QuestionBankRow = Pick<
  Database["public"]["Tables"]["question_banks"]["Row"],
  | "id"
  | "editorial_id"
  | "title"
  | "description"
  | "language"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "created_at"
  | "updated_at"
>;
type QuestionCategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "name" | "slug" | "language"
>;
export type AdminTemplateRow = Pick<
  Database["public"]["Tables"]["simulation_templates"]["Row"],
  | "id"
  | "editorial_id"
  | "title"
  | "description"
  | "type"
  | "language"
  | "total_questions"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "created_at"
>;
export type AdminMaterialRow = Pick<
  Database["public"]["Tables"]["study_materials"]["Row"],
  | "id"
  | "editorial_id"
  | "category_id"
  | "title"
  | "slug"
  | "content_md"
  | "difficulty"
  | "language"
  | "estimated_time"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "updated_at"
>;
export type AdminFlashcardRow = Pick<
  Database["public"]["Tables"]["flashcards"]["Row"],
  | "id"
  | "editorial_id"
  | "category_id"
  | "front_content"
  | "back_content"
  | "language"
  | "difficulty"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "updated_at"
>;
export type AdminQuestionRow = Pick<
  Database["public"]["Tables"]["questions"]["Row"],
  | "id"
  | "editorial_id"
  | "bank_id"
  | "category_id"
  | "type"
  | "difficulty"
  | "language"
  | "statement"
  | "explanation"
  | "source_reference"
  | "is_active"
  | "updated_at"
>;
export type AdminQuestionOptionRow = Pick<
  Database["public"]["Tables"]["question_options"]["Row"],
  "id" | "question_id" | "option_label" | "option_text" | "is_correct"
>;
export type AdminPsychosocialRow = Pick<
  Database["public"]["Tables"]["psychosocial_questions"]["Row"],
  | "id"
  | "editorial_id"
  | "category"
  | "question"
  | "ideal_answer_guidelines"
  | "common_mistakes"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "updated_at"
>;
export type AdminPathRow = Pick<
  Database["public"]["Tables"]["learning_paths"]["Row"],
  | "id"
  | "editorial_id"
  | "title"
  | "description"
  | "slug"
  | "language"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "updated_at"
>;
export type AdminPathItemRow = Pick<
  Database["public"]["Tables"]["learning_path_items"]["Row"],
  "id" | "path_id" | "item_type" | "item_id" | "sort_order"
>;

export type AdminLearningDashboard = {
  stats: {
    materials: number;
    flashcards: number;
    questions: number;
    paths: number;
    templates: number;
    psychosocialQuestions: number;
    activeContent: number;
    inactiveContent: number;
    premiumContent: number;
    freeContent: number;
    banks: number;
    categories: number;
    activeTemplates: number;
  };
  banks: QuestionBankRow[];
  categories: QuestionCategoryRow[];
  templates: AdminTemplateRow[];
};

export type AdminListFilters = {
  search?: string;
  language?: string;
  categoryId?: string;
  bankId?: string;
  status?: string;
  type?: string;
};

export type AdminSelectOptions = {
  categories: QuestionCategoryRow[];
  banks: QuestionBankRow[];
  materials: Array<{ id: string; title: string }>;
  flashcards: Array<{ id: string; title: string }>;
  questions: Array<{ id: string; title: string; type: QuestionType }>;
  psychosocialQuestions: Array<{ id: string; title: string }>;
  templates: Array<{ id: string; title: string }>;
};

export type MaterialInput = {
  title: string;
  slug: string;
  categoryId: string | null;
  language: LearningLanguage;
  difficulty: LearningDifficulty;
  estimatedTime: number;
  contentMd: string;
  isPremium: boolean;
  isActive: boolean;
  sourceReference: string | null;
};

export type FlashcardInput = {
  categoryId: string | null;
  frontContent: string;
  backContent: string;
  language: LearningLanguage;
  difficulty: LearningDifficulty;
  isPremium: boolean;
  isActive: boolean;
  sourceReference: string | null;
};

export type QuestionOptionInput = {
  label: "A" | "B" | "C" | "D" | "E";
  text: string;
  isCorrect: boolean;
};

export type QuestionInput = {
  bankId: string;
  categoryId: string | null;
  type: QuestionType;
  language: LearningLanguage;
  difficulty: LearningDifficulty;
  statement: string;
  explanation: string | null;
  sourceReference: string | null;
  isActive: boolean;
  options: QuestionOptionInput[];
};

export type PsychosocialInput = {
  category: string;
  question: string;
  idealAnswerGuidelines: string | null;
  commonMistakes: string | null;
  isPremium: boolean;
  isActive: boolean;
  sourceReference: string | null;
};

export type PathInput = {
  title: string;
  slug: string | null;
  description: string | null;
  language: LearningLanguage;
  isPremium: boolean;
  isActive: boolean;
  sourceReference: string | null;
};

export type PathItemsInput = {
  existingItems: Array<{
    id: string;
    sortOrder: number;
    remove: boolean;
  }>;
  newItem: {
    itemType: PathItemType;
    itemId: string;
    sortOrder: number;
  } | null;
};

export type SimulationTemplateInput = {
  title: string;
  description: string | null;
  type: SimulationTemplateType;
  language: LearningLanguage;
  totalQuestions: number;
  isPremium: boolean;
  isActive: boolean;
  sourceReference?: string | null;
};

export class AdminLearningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminLearningError";
  }
}

export const learningLanguages: LearningLanguage[] = [
  "english",
  "spanish",
  "portuguese",
  "mixed",
  "psychosocial",
];
export const learningDifficulties: LearningDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
];
export const questionTypes: QuestionType[] = [
  "objective",
  "subjective",
  "psychosocial",
];
export const templateTypes: SimulationTemplateType[] = ["quick", "full"];
export const pathItemTypes: PathItemType[] = [
  "study_material",
  "flashcard",
  "question",
  "psychosocial_question",
  "simulation_template",
];

const optionLabels: QuestionOptionInput["label"][] = ["A", "B", "C", "D", "E"];

function normalizeTitle(value: string) {
  const title = value.trim();

  if (title.length < 3) {
    throw new AdminLearningError("Informe um título com pelo menos 3 caracteres.");
  }

  return title.slice(0, 160);
}

function normalizeSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (slug.length < 3) {
    throw new AdminLearningError("Informe um slug válido com pelo menos 3 caracteres.");
  }

  return slug.slice(0, 160);
}

function normalizeOptionalSlug(value: string | null) {
  const raw = value?.trim() ?? "";

  return raw ? normalizeSlug(raw) : null;
}

function normalizeDescription(value: string | null, maxLength = 800) {
  const description = value?.trim() ?? "";

  return description ? description.slice(0, maxLength) : null;
}

function normalizeRequiredText(value: string, message: string, maxLength = 6000) {
  const text = value.trim();

  if (text.length < 3) {
    throw new AdminLearningError(message);
  }

  return text.slice(0, maxLength);
}

function normalizeNonNegativeInteger(value: number, message: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new AdminLearningError(message);
  }

  return Math.floor(value);
}

function assertLanguage(value: LearningLanguage) {
  if (!learningLanguages.includes(value)) {
    throw new AdminLearningError("Idioma inválido.");
  }
}

function assertDifficulty(value: LearningDifficulty) {
  if (!learningDifficulties.includes(value)) {
    throw new AdminLearningError("Dificuldade inválida.");
  }
}

function assertQuestionType(value: QuestionType) {
  if (!questionTypes.includes(value)) {
    throw new AdminLearningError("Tipo de questão inválido.");
  }
}

function assertPathItemType(value: PathItemType) {
  if (!pathItemTypes.includes(value)) {
    throw new AdminLearningError("Tipo de item de trilha inválido.");
  }
}

function activeFilter(status?: string) {
  if (status === "active") return true;
  if (status === "inactive") return false;

  return null;
}

function searchIncludes(value: string | null, search: string) {
  return (value ?? "").toLowerCase().includes(search.toLowerCase());
}

function assertObjectiveOptions(options: QuestionOptionInput[]) {
  if (options.length !== 5) {
    throw new AdminLearningError("Questão objetiva precisa ter 5 alternativas.");
  }

  const labels = new Set(options.map((option) => option.label));
  const correctCount = options.filter((option) => option.isCorrect).length;

  if (optionLabels.some((label) => !labels.has(label))) {
    throw new AdminLearningError("Alternativas A-E são obrigatorias.");
  }

  if (correctCount !== 1) {
    throw new AdminLearningError("Questão objetiva precisa ter exatamente 1 alternativa correta.");
  }

  for (const option of options) {
    normalizeRequiredText(
      option.text,
      `Alternativa ${option.label} precisa ter texto.`,
      2000,
    );
  }
}

export function parseLearningLanguage(value: string): LearningLanguage {
  if (!learningLanguages.includes(value as LearningLanguage)) {
    throw new AdminLearningError("Idioma inválido.");
  }

  return value as LearningLanguage;
}

export function parseLearningDifficulty(value: string): LearningDifficulty {
  if (!learningDifficulties.includes(value as LearningDifficulty)) {
    throw new AdminLearningError("Dificuldade inválida.");
  }

  return value as LearningDifficulty;
}

export function parseQuestionType(value: string): QuestionType {
  if (!questionTypes.includes(value as QuestionType)) {
    throw new AdminLearningError("Tipo de questão inválido.");
  }

  return value as QuestionType;
}

export function parsePathItemType(value: string): PathItemType {
  if (!pathItemTypes.includes(value as PathItemType)) {
    throw new AdminLearningError("Tipo de item de trilha inválido.");
  }

  return value as PathItemType;
}

export function parseSimulationTemplateType(value: string) {
  if (!templateTypes.includes(value as SimulationTemplateType)) {
    throw new AdminLearningError("Tipo de simulado inválido.");
  }

  return value as SimulationTemplateType;
}

export function parseTotalQuestions(value: string) {
  const totalQuestions = Number.parseInt(value, 10);

  return normalizeNonNegativeInteger(
    totalQuestions,
    "Total de questões deve ser maior ou igual a zero.",
  );
}

export function parseEstimatedTime(value: string) {
  const estimatedTime = Number.parseInt(value, 10);

  return normalizeNonNegativeInteger(
    estimatedTime,
    "Tempo estimado deve ser maior ou igual a zero.",
  );
}

async function countTable(
  table:
    | "study_materials"
    | "flashcards"
    | "questions"
    | "learning_paths"
    | "simulation_templates"
    | "psychosocial_questions"
    | "question_banks"
    | "question_categories",
  filters?: { column: "is_active" | "is_premium"; value: boolean },
) {
  const admin = getSupabaseAdminClient();
  let query = admin.from(table).select("id", { count: "exact", head: true });

  if (filters) {
    query = (
      query as {
        eq: (column: string, value: boolean) => typeof query;
      }
    ).eq(filters.column, filters.value);
  }

  const { count, error } = await query;

  if (error) {
    throw new AdminLearningError("Não foi possível consultar estatisticas.");
  }

  return count ?? 0;
}

export async function getAdminLearningDashboard(): Promise<AdminLearningDashboard> {
  const admin = getSupabaseAdminClient();
  const [
    materials,
    flashcards,
    questions,
    paths,
    templates,
    psychosocialQuestions,
    activeMaterials,
    activeFlashcards,
    activeQuestions,
    activePaths,
    activeTemplates,
    activePsychosocial,
    premiumMaterials,
    premiumFlashcards,
    premiumPaths,
    premiumTemplates,
    premiumPsychosocial,
    banksCount,
    categoriesCount,
    banksResponse,
    categoriesResponse,
    templatesResponse,
  ] = await Promise.all([
    countTable("study_materials"),
    countTable("flashcards"),
    countTable("questions"),
    countTable("learning_paths"),
    countTable("simulation_templates"),
    countTable("psychosocial_questions"),
    countTable("study_materials", { column: "is_active", value: true }),
    countTable("flashcards", { column: "is_active", value: true }),
    countTable("questions", { column: "is_active", value: true }),
    countTable("learning_paths", { column: "is_active", value: true }),
    countTable("simulation_templates", { column: "is_active", value: true }),
    countTable("psychosocial_questions", { column: "is_active", value: true }),
    countTable("study_materials", { column: "is_premium", value: true }),
    countTable("flashcards", { column: "is_premium", value: true }),
    countTable("learning_paths", { column: "is_premium", value: true }),
    countTable("simulation_templates", { column: "is_premium", value: true }),
    countTable("psychosocial_questions", { column: "is_premium", value: true }),
    countTable("question_banks"),
    countTable("question_categories"),
    admin
      .from("question_banks")
      .select(
        "id, editorial_id, title, description, language, is_premium, is_active, source_reference, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("question_categories")
      .select("id, name, slug, language")
      .order("language", { ascending: true })
      .order("name", { ascending: true }),
    admin
      .from("simulation_templates")
      .select(
        "id, editorial_id, title, description, type, language, total_questions, is_premium, is_active, source_reference, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (banksResponse.error) {
    throw new AdminLearningError("Não foi possível consultar bancos de questões.");
  }
  if (categoriesResponse.error) {
    throw new AdminLearningError("Não foi possível consultar categorias.");
  }
  if (templatesResponse.error) {
    throw new AdminLearningError("Não foi possível consultar templates.");
  }

  const totalContent =
    materials + flashcards + questions + paths + templates + psychosocialQuestions;
  const activeContent =
    activeMaterials +
    activeFlashcards +
    activeQuestions +
    activePaths +
    activeTemplates +
    activePsychosocial;
  const premiumContent =
    premiumMaterials +
    premiumFlashcards +
    premiumPaths +
    premiumTemplates +
    premiumPsychosocial;

  return {
    stats: {
      materials,
      flashcards,
      questions,
      paths,
      templates,
      psychosocialQuestions,
      activeContent,
      inactiveContent: totalContent - activeContent,
      premiumContent,
      freeContent: totalContent - premiumContent,
      banks: banksCount,
      categories: categoriesCount,
      activeTemplates,
    },
    banks: (banksResponse.data ?? []) as QuestionBankRow[],
    categories: (categoriesResponse.data ?? []) as QuestionCategoryRow[],
    templates: (templatesResponse.data ?? []) as AdminTemplateRow[],
  };
}

export async function getAdminSelectOptions(): Promise<AdminSelectOptions> {
  const admin = getSupabaseAdminClient();
  const [
    categoriesResponse,
    banksResponse,
    materialsResponse,
    flashcardsResponse,
    questionsResponse,
    psychosocialResponse,
    templatesSelectResponse,
  ] = await Promise.all([
    admin
      .from("question_categories")
      .select("id, name, slug, language")
      .order("language", { ascending: true })
      .order("name", { ascending: true }),
    admin
      .from("question_banks")
      .select(
        "id, editorial_id, title, description, language, is_premium, is_active, source_reference, created_at",
      )
      .order("title", { ascending: true }),
    admin
      .from("study_materials")
      .select("id, title")
      .eq("is_active", true)
      .order("title", { ascending: true })
      .limit(300),
    admin
      .from("flashcards")
      .select("id, front_content")
      .eq("is_active", true)
      .order("front_content", { ascending: true })
      .limit(300),
    admin
      .from("questions")
      .select("id, editorial_id, statement, type")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(300),
    admin
      .from("psychosocial_questions")
      .select("id, question")
      .eq("is_active", true)
      .order("question", { ascending: true })
      .limit(300),
    admin
      .from("simulation_templates")
      .select("id, title")
      .eq("is_active", true)
      .order("title", { ascending: true })
      .limit(200),
  ]);

  for (const response of [
    categoriesResponse,
    banksResponse,
    materialsResponse,
    flashcardsResponse,
    questionsResponse,
    psychosocialResponse,
    templatesSelectResponse,
  ]) {
    if (response.error) {
      throw new AdminLearningError("Não foi possível consultar opções do admin.");
    }
  }

  return {
    categories: (categoriesResponse.data ?? []) as QuestionCategoryRow[],
    banks: (banksResponse.data ?? []) as QuestionBankRow[],
    materials: (materialsResponse.data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
    })),
    flashcards: (flashcardsResponse.data ?? []).map((item) => ({
      id: item.id,
      title: item.front_content,
    })),
    questions: ((questionsResponse.data ?? []) as Array<{
      id: string;
      editorial_id: string | null;
      statement: string;
      type: QuestionType;
    }>).map((item) => ({
      id: item.id,
      title: item.editorial_id ?? item.statement.slice(0, 90),
      type: item.type,
    })),
    psychosocialQuestions: (psychosocialResponse.data ?? []).map((item) => ({
      id: item.id,
      title: item.question,
    })),
    templates: (templatesSelectResponse.data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
    })),
  };
}

export async function listAdminMaterials(filters: AdminListFilters) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("study_materials")
    .select(
      "id, editorial_id, category_id, title, slug, content_md, difficulty, language, estimated_time, is_premium, is_active, source_reference, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(150);

  if (error) {
    throw new AdminLearningError("Não foi possível consultar materiais.");
  }

  return ((data ?? []) as AdminMaterialRow[]).filter((item) =>
    filterCommon(item, filters, item.title),
  );
}

export async function getAdminMaterial(id: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("study_materials")
    .select(
      "id, editorial_id, category_id, title, slug, content_md, difficulty, language, estimated_time, is_premium, is_active, source_reference, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminLearningError("Não foi possível consultar material.");
  }

  return data as AdminMaterialRow | null;
}

export async function saveMaterial(input: MaterialInput, id?: string) {
  assertLanguage(input.language);
  assertDifficulty(input.difficulty);

  const payload = {
    tenant_id: null,
    category_id: input.categoryId,
    title: normalizeTitle(input.title),
    slug: normalizeSlug(input.slug),
    content_md: normalizeRequiredText(input.contentMd, "Conteúdo Markdown é obrigatório.", 30000),
    difficulty: input.difficulty,
    language: input.language,
    estimated_time: normalizeNonNegativeInteger(
      input.estimatedTime,
      "Tempo estimado inválido.",
    ),
    is_premium: input.isPremium,
    is_active: input.isActive,
    source_reference: normalizeDescription(input.sourceReference, 300),
  };
  const admin = getSupabaseAdminClient();
  const response = id
    ? await admin.from("study_materials").update(payload).eq("id", id)
    : await admin.from("study_materials").insert(payload);

  if (response.error) {
    throw new AdminLearningError("Não foi possível salvar material.");
  }
}

export async function listAdminFlashcards(filters: AdminListFilters) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("flashcards")
    .select(
      "id, editorial_id, category_id, front_content, back_content, language, difficulty, is_premium, is_active, source_reference, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(150);

  if (error) {
    throw new AdminLearningError("Não foi possível consultar flashcards.");
  }

  return ((data ?? []) as AdminFlashcardRow[]).filter((item) =>
    filterCommon(item, filters, `${item.front_content} ${item.back_content}`),
  );
}

export async function getAdminFlashcard(id: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("flashcards")
    .select(
      "id, editorial_id, category_id, front_content, back_content, language, difficulty, is_premium, is_active, source_reference, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminLearningError("Não foi possível consultar flashcard.");
  }

  return data as AdminFlashcardRow | null;
}

export async function saveFlashcard(input: FlashcardInput, id?: string) {
  assertLanguage(input.language);
  assertDifficulty(input.difficulty);

  const payload = {
    tenant_id: null,
    category_id: input.categoryId,
    front_content: normalizeRequiredText(input.frontContent, "Frente do flashcard é obrigatória.", 5000),
    back_content: normalizeRequiredText(input.backContent, "Verso do flashcard é obrigatório.", 5000),
    language: input.language,
    difficulty: input.difficulty,
    is_premium: input.isPremium,
    is_active: input.isActive,
    source_reference: normalizeDescription(input.sourceReference, 300),
  };
  const admin = getSupabaseAdminClient();
  const response = id
    ? await admin.from("flashcards").update(payload).eq("id", id)
    : await admin.from("flashcards").insert(payload);

  if (response.error) {
    throw new AdminLearningError("Não foi possível salvar flashcard.");
  }
}

export async function listAdminQuestions(filters: AdminListFilters) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("questions")
    .select(
      "id, editorial_id, bank_id, category_id, type, difficulty, language, statement, explanation, source_reference, is_active, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(180);

  if (error) {
    throw new AdminLearningError("Não foi possível consultar questões.");
  }

  return ((data ?? []) as AdminQuestionRow[]).filter(
    (item) =>
      filterCommon(item, filters, `${item.editorial_id ?? ""} ${item.statement}`) &&
      (!filters.bankId || item.bank_id === filters.bankId) &&
      (!filters.type || item.type === filters.type),
  );
}

export async function getAdminQuestion(id: string) {
  const admin = getSupabaseAdminClient();
  const [questionResponse, optionsResponse] = await Promise.all([
    admin
      .from("questions")
      .select(
        "id, editorial_id, bank_id, category_id, type, difficulty, language, statement, explanation, source_reference, is_active, updated_at",
      )
      .eq("id", id)
      .maybeSingle(),
    admin
      .from("question_options")
      .select("id, question_id, option_label, option_text, is_correct")
      .eq("question_id", id)
      .order("option_label", { ascending: true }),
  ]);

  if (questionResponse.error || optionsResponse.error) {
    throw new AdminLearningError("Não foi possível consultar questão.");
  }

  return questionResponse.data
    ? {
        question: questionResponse.data as AdminQuestionRow,
        options: (optionsResponse.data ?? []) as AdminQuestionOptionRow[],
      }
    : null;
}

export async function saveQuestion(input: QuestionInput, id?: string) {
  assertQuestionType(input.type);
  assertLanguage(input.language);
  assertDifficulty(input.difficulty);

  const admin = getSupabaseAdminClient();
  const payload = {
    tenant_id: null,
    bank_id: input.bankId,
    category_id: input.categoryId,
    type: input.type,
    difficulty: input.difficulty,
    language: input.language,
    statement: normalizeRequiredText(input.statement, "Enunciado é obrigatório.", 20000),
    explanation: normalizeDescription(input.explanation, 12000),
    source_reference: normalizeDescription(input.sourceReference, 300),
    is_active: input.isActive,
  };
  const questionResponse = id
    ? await admin.from("questions").update(payload).eq("id", id).select("id").single()
    : await admin.from("questions").insert(payload).select("id").single();

  if (questionResponse.error || !questionResponse.data) {
    throw new AdminLearningError("Não foi possível salvar questão.");
  }

  const questionId = questionResponse.data.id;

  if (input.type === "objective") {
    assertObjectiveOptions(input.options);
    await upsertObjectiveOptions(questionId, input.options);
  }
}

async function upsertObjectiveOptions(
  questionId: string,
  options: QuestionOptionInput[],
) {
  const admin = getSupabaseAdminClient();

  for (const option of options) {
    const { data: existing, error: existingError } = await admin
      .from("question_options")
      .select("id")
      .eq("question_id", questionId)
      .eq("option_label", option.label)
      .maybeSingle();

    if (existingError) {
      throw new AdminLearningError("Não foi possível consultar alternativas.");
    }

    const payload = {
      tenant_id: null,
      question_id: questionId,
      option_label: option.label,
      option_text: normalizeRequiredText(
        option.text,
        `Alternativa ${option.label} precisa ter texto.`,
        2000,
      ),
      is_correct: option.isCorrect,
    };
    const response = existing?.id
      ? await admin.from("question_options").update(payload).eq("id", existing.id)
      : await admin.from("question_options").insert(payload);

    if (response.error) {
      throw new AdminLearningError("Não foi possível salvar alternativas.");
    }
  }
}

export async function listAdminPsychosocial(filters: AdminListFilters) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("psychosocial_questions")
    .select(
      "id, editorial_id, category, question, ideal_answer_guidelines, common_mistakes, is_premium, is_active, source_reference, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(150);

  if (error) {
    throw new AdminLearningError("Não foi possível consultar perguntas psicossociais.");
  }

  return ((data ?? []) as AdminPsychosocialRow[]).filter((item) => {
    const status = activeFilter(filters.status);
    const matchesStatus = status === null || item.is_active === status;
    const matchesSearch =
      !filters.search ||
      searchIncludes(`${item.category} ${item.question}`, filters.search);

    return matchesStatus && matchesSearch;
  });
}

export async function getAdminPsychosocial(id: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("psychosocial_questions")
    .select(
      "id, editorial_id, category, question, ideal_answer_guidelines, common_mistakes, is_premium, is_active, source_reference, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminLearningError("Não foi possível consultar pergunta psicossocial.");
  }

  return data as AdminPsychosocialRow | null;
}

export async function savePsychosocial(input: PsychosocialInput, id?: string) {
  const payload = {
    tenant_id: null,
    category: normalizeRequiredText(input.category, "Categoria psicossocial é obrigatória.", 120),
    question: normalizeRequiredText(input.question, "Pergunta psicossocial é obrigatória.", 5000),
    ideal_answer_guidelines: normalizeDescription(input.idealAnswerGuidelines, 5000),
    common_mistakes: normalizeDescription(input.commonMistakes, 5000),
    is_premium: input.isPremium,
    is_active: input.isActive,
    source_reference: normalizeDescription(input.sourceReference, 300),
  };
  const admin = getSupabaseAdminClient();
  const response = id
    ? await admin.from("psychosocial_questions").update(payload).eq("id", id)
    : await admin.from("psychosocial_questions").insert(payload);

  if (response.error) {
    throw new AdminLearningError("Não foi possível salvar pergunta psicossocial.");
  }
}

export async function listAdminPaths(filters: AdminListFilters) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_paths")
    .select(
      "id, editorial_id, title, description, slug, language, is_premium, is_active, source_reference, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(150);

  if (error) {
    throw new AdminLearningError("Não foi possível consultar trilhas.");
  }

  return ((data ?? []) as AdminPathRow[]).filter((item) =>
    filterPath(item, filters),
  );
}

export async function getAdminPath(id: string) {
  const admin = getSupabaseAdminClient();
  const [pathResponse, itemsResponse] = await Promise.all([
    admin
      .from("learning_paths")
      .select(
        "id, editorial_id, title, description, slug, language, is_premium, is_active, source_reference, updated_at",
      )
      .eq("id", id)
      .maybeSingle(),
    admin
      .from("learning_path_items")
      .select("id, path_id, item_type, item_id, sort_order")
      .eq("path_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (pathResponse.error || itemsResponse.error) {
    throw new AdminLearningError("Não foi possível consultar trilha.");
  }

  return pathResponse.data
    ? {
        path: pathResponse.data as AdminPathRow,
        items: (itemsResponse.data ?? []) as AdminPathItemRow[],
      }
    : null;
}

export async function savePath(input: PathInput, id?: string) {
  assertLanguage(input.language);

  const payload = {
    tenant_id: null,
    title: normalizeTitle(input.title),
    slug: normalizeOptionalSlug(input.slug),
    description: normalizeDescription(input.description, 1000),
    language: input.language,
    is_premium: input.isPremium,
    is_active: input.isActive,
    source_reference: normalizeDescription(input.sourceReference, 300),
  };
  const admin = getSupabaseAdminClient();
  const response = id
    ? await admin.from("learning_paths").update(payload).eq("id", id)
    : await admin.from("learning_paths").insert(payload);

  if (response.error) {
    throw new AdminLearningError("Não foi possível salvar trilha.");
  }
}

export async function updatePathItems(pathId: string, input: PathItemsInput) {
  const admin = getSupabaseAdminClient();

  for (const item of input.existingItems) {
    if (item.remove) {
      const { error } = await admin
        .from("learning_path_items")
        .delete()
        .eq("id", item.id)
        .eq("path_id", pathId);

      if (error) {
        throw new AdminLearningError("Não foi possível remover item da trilha.");
      }
      continue;
    }

    const { error } = await admin
      .from("learning_path_items")
      .update({
        sort_order: normalizeNonNegativeInteger(item.sortOrder, "Ordem inválida."),
      })
      .eq("id", item.id)
      .eq("path_id", pathId);

    if (error) {
      throw new AdminLearningError("Não foi possível reordenar item da trilha.");
    }
  }

  if (input.newItem) {
    assertPathItemType(input.newItem.itemType);
    await assertPathItemExists(input.newItem.itemType, input.newItem.itemId);

    const { error } = await admin.from("learning_path_items").insert({
      tenant_id: null,
      path_id: pathId,
      item_type: input.newItem.itemType,
      item_id: input.newItem.itemId,
      sort_order: normalizeNonNegativeInteger(input.newItem.sortOrder, "Ordem inválida."),
    });

    if (error) {
      throw new AdminLearningError("Não foi possível adicionar item a trilha.");
    }
  }
}

async function assertPathItemExists(itemType: PathItemType, itemId: string) {
  const admin = getSupabaseAdminClient();
  const table =
    itemType === "study_material"
      ? "study_materials"
      : itemType === "flashcard"
        ? "flashcards"
        : itemType === "question"
          ? "questions"
          : itemType === "psychosocial_question"
            ? "psychosocial_questions"
            : "simulation_templates";
  const { data, error } = await admin
    .from(table)
    .select("id")
    .eq("id", itemId)
    .maybeSingle();

  if (error || !data) {
    throw new AdminLearningError("Item de trilha não encontrado.");
  }
}

export async function listAdminTemplates(filters: AdminListFilters) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_templates")
    .select(
      "id, editorial_id, title, description, type, language, total_questions, is_premium, is_active, source_reference, created_at, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(150);

  if (error) {
    throw new AdminLearningError("Não foi possível consultar templates.");
  }

  return ((data ?? []) as AdminTemplateRow[]).filter((item) => {
    const status = activeFilter(filters.status);

    return (
      (status === null || item.is_active === status) &&
      (!filters.search ||
        searchIncludes(`${item.title} ${item.description ?? ""}`, filters.search)) &&
      (!filters.language || item.language === filters.language) &&
      (!filters.type || item.type === filters.type)
    );
  });
}

export async function getAdminTemplate(id: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_templates")
    .select(
      "id, editorial_id, title, description, type, language, total_questions, is_premium, is_active, source_reference, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminLearningError("Não foi possível consultar template.");
  }

  return data as AdminTemplateRow | null;
}

export async function saveSimulationTemplate(
  input: SimulationTemplateInput,
  id?: string,
) {
  if (!templateTypes.includes(input.type)) {
    throw new AdminLearningError("Tipo de simulado inválido.");
  }
  assertLanguage(input.language);

  const payload = {
    tenant_id: null,
    title: normalizeTitle(input.title),
    description: normalizeDescription(input.description),
    type: input.type,
    language: input.language,
    total_questions: normalizeNonNegativeInteger(
      input.totalQuestions,
      "Total de questões inválido.",
    ),
    is_premium: input.isPremium,
    is_active: input.isActive,
    source_reference: normalizeDescription(input.sourceReference ?? null, 300),
  };
  const admin = getSupabaseAdminClient();
  const response = id
    ? await admin.from("simulation_templates").update(payload).eq("id", id)
    : await admin.from("simulation_templates").insert(payload);

  if (response.error) {
    throw new AdminLearningError("Não foi possível salvar template de simulado.");
  }
}

export async function deactivateContent(
  entity:
    | "material"
    | "flashcard"
    | "question"
    | "psychosocial"
    | "path"
    | "template",
  id: string,
) {
  const admin = getSupabaseAdminClient();
  const table =
    entity === "material"
      ? "study_materials"
      : entity === "flashcard"
        ? "flashcards"
        : entity === "question"
          ? "questions"
          : entity === "psychosocial"
            ? "psychosocial_questions"
            : entity === "path"
              ? "learning_paths"
              : "simulation_templates";
  const { error } = await admin.from(table).update({ is_active: false }).eq("id", id);

  if (error) {
    throw new AdminLearningError("Não foi possível desativar conteúdo.");
  }
}

export type CreateQuestionBankInput = {
  title: string;
  description: string | null;
  language: LearningLanguage;
  isPremium: boolean;
  isActive: boolean;
};

export type CreateSimulationTemplateInput = SimulationTemplateInput;

export async function createQuestionBank(input: CreateQuestionBankInput) {
  assertLanguage(input.language);
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("question_banks").insert({
    tenant_id: null,
    title: normalizeTitle(input.title),
    description: normalizeDescription(input.description),
    language: input.language,
    is_premium: input.isPremium,
    is_active: input.isActive,
  });

  if (error) {
    throw new AdminLearningError("Não foi possível criar banco de questões.");
  }
}

export async function createSimulationTemplate(input: CreateSimulationTemplateInput) {
  await saveSimulationTemplate(input);
}

function filterCommon(
  item: {
    category_id?: string | null;
    language?: LearningLanguage;
    is_active?: boolean;
  },
  filters: AdminListFilters,
  searchText: string,
) {
  const status = activeFilter(filters.status);
  const matchesStatus = status === null || item.is_active === status;
  const matchesSearch = !filters.search || searchIncludes(searchText, filters.search);
  const matchesLanguage = !filters.language || item.language === filters.language;
  const matchesCategory =
    !filters.categoryId || item.category_id === filters.categoryId;

  return matchesStatus && matchesSearch && matchesLanguage && matchesCategory;
}

function filterPath(item: AdminPathRow, filters: AdminListFilters) {
  const status = activeFilter(filters.status);

  return (
    (status === null || item.is_active === status) &&
    (!filters.search ||
      searchIncludes(`${item.title} ${item.description ?? ""}`, filters.search)) &&
    (!filters.language || item.language === filters.language)
  );
}
