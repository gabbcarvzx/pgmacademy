import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type QuestionBankRow = Pick<
  Database["public"]["Tables"]["question_banks"]["Row"],
  | "id"
  | "title"
  | "description"
  | "language"
  | "is_premium"
  | "is_active"
  | "created_at"
>;
type QuestionCategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "name" | "slug" | "language"
>;
type SimulationTemplateRow = Pick<
  Database["public"]["Tables"]["simulation_templates"]["Row"],
  | "id"
  | "title"
  | "description"
  | "type"
  | "language"
  | "total_questions"
  | "is_premium"
  | "is_active"
  | "created_at"
>;

export type AdminLearningDashboard = {
  stats: {
    banks: number;
    categories: number;
    templates: number;
    activeTemplates: number;
  };
  banks: QuestionBankRow[];
  categories: QuestionCategoryRow[];
  templates: SimulationTemplateRow[];
};

export type LearningLanguage =
  | "english"
  | "spanish"
  | "portuguese"
  | "mixed"
  | "psychosocial";
export type SimulationTemplateType = "quick" | "full";

export type CreateQuestionBankInput = {
  title: string;
  description: string | null;
  language: LearningLanguage;
  isPremium: boolean;
  isActive: boolean;
};

export type CreateSimulationTemplateInput = {
  title: string;
  description: string | null;
  type: SimulationTemplateType;
  language: LearningLanguage;
  totalQuestions: number;
  isPremium: boolean;
  isActive: boolean;
};

export class AdminLearningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminLearningError";
  }
}

const languages = new Set<LearningLanguage>([
  "english",
  "spanish",
  "portuguese",
  "mixed",
  "psychosocial",
]);
const templateTypes = new Set<SimulationTemplateType>(["quick", "full"]);

function normalizeTitle(value: string) {
  const title = value.trim();

  if (title.length < 3) {
    throw new AdminLearningError("Informe um titulo com pelo menos 3 caracteres.");
  }

  return title.slice(0, 140);
}

function normalizeDescription(value: string | null) {
  const description = value?.trim() ?? "";

  return description ? description.slice(0, 500) : null;
}

export function parseLearningLanguage(value: string): LearningLanguage {
  if (!languages.has(value as LearningLanguage)) {
    throw new AdminLearningError("Idioma invalido.");
  }

  return value as LearningLanguage;
}

export function parseSimulationTemplateType(value: string) {
  if (!templateTypes.has(value as SimulationTemplateType)) {
    throw new AdminLearningError("Tipo de simulado invalido.");
  }

  return value as SimulationTemplateType;
}

export function parseTotalQuestions(value: string) {
  const totalQuestions = Number.parseInt(value, 10);

  if (!Number.isFinite(totalQuestions) || totalQuestions < 0) {
    throw new AdminLearningError("Total de questoes deve ser maior ou igual a zero.");
  }

  return totalQuestions;
}

export async function getAdminLearningDashboard(): Promise<AdminLearningDashboard> {
  const admin = getSupabaseAdminClient();
  const [
    banksResponse,
    categoriesResponse,
    templatesResponse,
    activeTemplatesResponse,
  ] = await Promise.all([
    admin
      .from("question_banks")
      .select("id, title, description, language, is_premium, is_active, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("question_categories")
      .select("id, name, slug, language", { count: "exact" })
      .order("language", { ascending: true })
      .order("name", { ascending: true }),
    admin
      .from("simulation_templates")
      .select(
        "id, title, description, type, language, total_questions, is_premium, is_active, created_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("simulation_templates")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  if (banksResponse.error) {
    throw new AdminLearningError("Nao foi possivel consultar bancos de questoes.");
  }

  if (categoriesResponse.error) {
    throw new AdminLearningError("Nao foi possivel consultar categorias.");
  }

  if (templatesResponse.error) {
    throw new AdminLearningError("Nao foi possivel consultar templates.");
  }

  if (activeTemplatesResponse.error) {
    throw new AdminLearningError("Nao foi possivel consultar templates ativos.");
  }

  return {
    stats: {
      banks: banksResponse.count ?? 0,
      categories: categoriesResponse.count ?? 0,
      templates: templatesResponse.count ?? 0,
      activeTemplates: activeTemplatesResponse.count ?? 0,
    },
    banks: (banksResponse.data ?? []) as QuestionBankRow[],
    categories: (categoriesResponse.data ?? []) as QuestionCategoryRow[],
    templates: (templatesResponse.data ?? []) as SimulationTemplateRow[],
  };
}

export async function createQuestionBank(input: CreateQuestionBankInput) {
  const admin = getSupabaseAdminClient();
  const title = normalizeTitle(input.title);
  const description = normalizeDescription(input.description);

  const { error } = await admin.from("question_banks").insert({
    tenant_id: null,
    title,
    description,
    language: input.language,
    is_premium: input.isPremium,
    is_active: input.isActive,
  });

  if (error) {
    throw new AdminLearningError("Nao foi possivel criar banco de questoes.");
  }
}

export async function createSimulationTemplate(
  input: CreateSimulationTemplateInput,
) {
  const admin = getSupabaseAdminClient();
  const title = normalizeTitle(input.title);
  const description = normalizeDescription(input.description);

  const { error } = await admin.from("simulation_templates").insert({
    tenant_id: null,
    title,
    description,
    type: input.type,
    language: input.language,
    total_questions: input.totalQuestions,
    is_premium: input.isPremium,
    is_active: input.isActive,
  });

  if (error) {
    throw new AdminLearningError("Nao foi possivel criar template de simulado.");
  }
}
