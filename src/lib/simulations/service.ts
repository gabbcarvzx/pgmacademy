import "server-only";

import {
  buildTemplateAccessList,
  type ObjectiveQuestionCatalogItem,
  type SimulationTemplateAccess,
  type SimulationTemplateCatalogItem,
} from "@/lib/simulations/catalog";
import {
  balancedCorrectLabelForObjectiveQuestion,
  compareObjectiveOptionLabels,
} from "@/lib/simulations/answer-key";
import {
  canAccessPremiumContent,
  hasPremiumAccess,
} from "@/lib/access/premium";
import {
  calculateObjectiveScore,
  summarizeAttemptHistory,
  type CategoryPerformance,
  type ObjectiveAnswerInput,
  type ObjectiveScoreResult,
} from "@/lib/simulations/scoring";
import {
  officialObjectiveSimulation,
  simulationDurationMinutes,
  simulationPointsPerQuestion,
} from "@/lib/simulations/official-pgm";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "tenant_id" | "access_status" | "role"
>;
type AttemptRow = Pick<
  Database["public"]["Tables"]["simulation_attempts"]["Row"],
  | "id"
  | "tenant_id"
  | "user_id"
  | "template_id"
  | "started_at"
  | "completed_at"
  | "score"
  | "percentage"
  | "status"
>;
type QuestionRow = Pick<
  Database["public"]["Tables"]["questions"]["Row"],
  | "id"
  | "editorial_id"
  | "source_reference"
  | "primary_competency_id"
  | "editorial_difficulty_level"
  | "bank_id"
  | "category_id"
  | "language"
  | "type"
  | "difficulty"
  | "statement"
  | "explanation"
>;
type QuestionOptionRow = Pick<
  Database["public"]["Tables"]["question_options"]["Row"],
  "id" | "question_id" | "option_label" | "option_text" | "is_correct"
>;
type QuestionBankRow = Pick<
  Database["public"]["Tables"]["question_banks"]["Row"],
  "id" | "tenant_id" | "is_active" | "is_premium"
>;
type QuestionCategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "name" | "slug"
>;
type EditorialCompetencyRow = Pick<
  Database["public"]["Tables"]["editorial_competencies"]["Row"],
  "id" | "code" | "title"
>;
type AttemptAnswerRow = Pick<
  Database["public"]["Tables"]["simulation_answers"]["Row"],
  | "id"
  | "attempt_id"
  | "question_id"
  | "selected_option_id"
  | "is_correct"
  | "points"
>;
type LearningPathRow = Pick<
  Database["public"]["Tables"]["learning_paths"]["Row"],
  "id" | "tenant_id" | "title" | "slug" | "language" | "is_premium" | "is_active"
>;

export type SimulationHistoryItem = Pick<
  AttemptRow,
  "id" | "started_at" | "completed_at" | "score" | "percentage" | "status"
> & {
  templateId: string | null;
  templateTitle: string;
  templateLanguage: SimulationTemplateCatalogItem["language"] | null;
  templateType: SimulationTemplateCatalogItem["type"] | null;
  answerCount: number;
};

export type SimulationOverview = {
  accessStatus: ProfileRow["access_status"];
  hasPaidAccess: boolean;
  schema: {
    categoriesCount: number;
    templatesCount: number;
    activeObjectiveQuestionsCount: number;
    byCategory: SimulationBankBreakdownItem[];
    byCompetency: SimulationBankBreakdownItem[];
    byDifficulty: SimulationBankBreakdownItem[];
  };
  templates: SimulationTemplateAccess[];
  attempts: SimulationHistoryItem[];
  historySummary: ReturnType<typeof summarizeAttemptHistory>;
};

export type SimulationBankBreakdownItem = {
  id: string;
  label: string;
  count: number;
  detail: string | null;
};

export type SimulationStartView = {
  accessStatus: ProfileRow["access_status"];
  hasPaidAccess: boolean;
  template: SimulationTemplateAccess | null;
  activeAttemptId: string | null;
  estimatedMinutes: number;
};

export type StartSimulationAttemptResult = {
  attemptId: string;
  reused: boolean;
  status: "started";
};

export type SubmitSimulationAttemptInput = {
  selectedOptions?: Array<{
    questionId: string;
    selectedOptionId: string | null;
  }>;
};

export type SubmitSimulationAttemptResult = {
  attemptId: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
};

export type SimulationRunnerQuestion = {
  id: string;
  categoryName: string;
  difficulty: QuestionRow["difficulty"];
  language: QuestionRow["language"];
  statement: string;
  selectedOptionId: string | null;
  options: Array<{
    id: string;
    label: string;
    text: string;
  }>;
};

export type SimulationRunnerView = {
  attemptId: string;
  startedAt: string;
  template: {
    id: string;
    title: string;
    type: SimulationTemplateCatalogItem["type"];
    language: SimulationTemplateCatalogItem["language"];
    totalQuestions: number;
    durationMinutes: number;
  };
  answeredCount: number;
  questions: SimulationRunnerQuestion[];
};

export type SimulationQuestionResult = {
  id: string;
  categoryName: string;
  statement: string;
  explanation: string | null;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  isCorrect: boolean;
  options: Array<{
    id: string;
    label: string;
    text: string;
    isSelected: boolean;
    isCorrect: boolean;
  }>;
};

export type SimulationResultView = {
  attemptId: string;
  templateTitle: string;
  startedAt: string;
  completedAt: string;
  elapsedMinutes: number;
  score: number;
  maxScore: number;
  percentage: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  byCategory: CategoryPerformance[];
  strongCategories: CategoryPerformance[];
  weakCategories: CategoryPerformance[];
  nextSteps: string[];
  recommendedPaths: Array<{
    id: string;
    title: string;
    href: string;
    reason: string;
    isPremium: boolean;
    canAccess: boolean;
  }>;
  questions: SimulationQuestionResult[];
};

class SimulationServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "SimulationServiceError";
  }
}

export { SimulationServiceError };

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function canAccessPremium(isPremium: boolean, profile: ProfileRow) {
  return canAccessPremiumContent(isPremium, profile);
}

function assertDatabaseResult<T>(
  data: T | null,
  error: { message: string } | null,
  message: string,
) {
  if (error || !data) {
    throw new SimulationServiceError(message, 500);
  }

  return data;
}

function normalizeTemplateForOfficialPgm(
  template: SimulationTemplateCatalogItem,
): SimulationTemplateCatalogItem {
  const templateCopy = { ...template };

  if (templateCopy.editorial_id === "TEMPLATE-SCALE-QUICK-EN") {
    return {
      ...templateCopy,
      title: "Simulado Objetivo - Ingles",
      description:
        "Treino objetivo por idioma com questoes de leitura, vocabulario, gramatica funcional e comunicacao em ingles.",
      is_premium: true,
    };
  }

  if (templateCopy.editorial_id === "TEMPLATE-SCALE-QUICK-ES") {
    return {
      ...templateCopy,
      title: "Simulado Objetivo - Espanhol",
      description:
        "Treino objetivo por idioma com questoes de compreensao leitora, vocabulario e gramatica basica em espanhol.",
      is_premium: true,
    };
  }

  if (templateCopy.editorial_id === "TEMPLATE-SCALE-FULL-MIXED") {
    return {
      ...templateCopy,
      title: "Simulado Geral - Banco misto PGM",
      description:
        "Treino de apoio com questoes de idiomas, edital, escrita e psicossocial. Use os simulados por idioma para preparar a prova escolhida.",
      total_questions: officialObjectiveSimulation.questionCount,
      is_premium: true,
    };
  }

  return templateCopy;
}

function minutesBetween(startedAt: string, completedAt: string | null) {
  if (!completedAt) {
    return 0;
  }

  const started = new Date(startedAt).getTime();
  const completed = new Date(completedAt).getTime();

  if (!Number.isFinite(started) || !Number.isFinite(completed)) {
    return 0;
  }

  return Math.max(Math.round((completed - started) / 60000), 0);
}

function searchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

async function getProfile(userId: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, access_status, role")
    .eq("id", userId)
    .single();

  return assertDatabaseResult(
    data,
    error,
    "Perfil do aluno não encontrado.",
  ) as ProfileRow;
}

async function getVisibleBanks(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("question_banks")
    .select("id, tenant_id, is_active, is_premium")
    .eq("is_active", true);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar bancos de questões.",
      500,
    );
  }

  return ((data ?? []) as QuestionBankRow[]).filter(
    (bank) =>
      isTenantVisible(bank.tenant_id, profile) &&
      canAccessPremium(bank.is_premium, profile),
  );
}

async function getVisibleObjectiveQuestions(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const banks = await getVisibleBanks(profile);
  const visibleBankIds = new Set(banks.map((bank) => bank.id));

  if (visibleBankIds.size === 0) {
    return [];
  }

  const { data, error } = await admin
    .from("questions")
    .select(
      "id, editorial_id, source_reference, primary_competency_id, editorial_difficulty_level, bank_id, category_id, language, type, difficulty, statement, explanation",
    )
    .eq("is_active", true)
    .eq("type", "objective")
    .order("editorial_id", { ascending: true });

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar questões objetivas.",
      500,
    );
  }

  return ((data ?? []) as QuestionRow[]).filter((question) =>
    visibleBankIds.has(question.bank_id),
  );
}

async function getActiveTemplates(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_templates")
    .select(
      "id, editorial_id, source_reference, tenant_id, title, description, type, language, total_questions, is_premium",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar modelos de simulado.",
      500,
    );
  }

  return ((data ?? []) as SimulationTemplateCatalogItem[])
    .filter((template) => isTenantVisible(template.tenant_id ?? null, profile))
    .map(normalizeTemplateForOfficialPgm);
}

async function getCategoriesById(categoryIds: string[]) {
  if (categoryIds.length === 0) {
    return new Map<string, QuestionCategoryRow>();
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("question_categories")
    .select("id, name, slug")
    .in("id", [...new Set(categoryIds)]);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar categorias.",
      500,
    );
  }

  return new Map(
    ((data ?? []) as QuestionCategoryRow[]).map((category) => [
      category.id,
      category,
    ]),
  );
}

async function getCompetenciesById(competencyIds: string[]) {
  if (competencyIds.length === 0) {
    return new Map<string, EditorialCompetencyRow>();
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("editorial_competencies")
    .select("id, code, title")
    .in("id", [...new Set(competencyIds)]);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar competências editoriais.",
      500,
    );
  }

  return new Map(
    ((data ?? []) as EditorialCompetencyRow[]).map((competency) => [
      competency.id,
      competency,
    ]),
  );
}

function incrementBreakdown(
  map: Map<string, SimulationBankBreakdownItem>,
  item: Omit<SimulationBankBreakdownItem, "count">,
) {
  const current = map.get(item.id);
  map.set(item.id, {
    ...item,
    count: (current?.count ?? 0) + 1,
  });
}

function sortBreakdown(items: SimulationBankBreakdownItem[]) {
  return items.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR"));
}

function difficultyBreakdownLabel(question: Pick<QuestionRow, "difficulty" | "editorial_difficulty_level">) {
  if (question.editorial_difficulty_level) {
    return {
      id: `level-${question.editorial_difficulty_level}`,
      label: `Nível editorial ${question.editorial_difficulty_level}`,
      detail:
        question.editorial_difficulty_level >= 3
          ? "Maior exigência de interpretação e decisão."
          : "Base e aplicação guiada.",
    };
  }

  const legacyLabel = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
    mixed: "Misto",
  } satisfies Record<QuestionRow["difficulty"], string>;

  return {
    id: `legacy-${question.difficulty}`,
    label: legacyLabel[question.difficulty],
    detail: "Classificação legada sem nível editorial vinculado.",
  };
}

async function getQuestionBankBreakdown(questions: QuestionRow[]) {
  const [categories, competencies] = await Promise.all([
    getCategoriesById(
      questions
        .map((question) => question.category_id)
        .filter((id): id is string => Boolean(id)),
    ),
    getCompetenciesById(
      questions
        .map((question) => question.primary_competency_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ]);
  const byCategory = new Map<string, SimulationBankBreakdownItem>();
  const byCompetency = new Map<string, SimulationBankBreakdownItem>();
  const byDifficulty = new Map<string, SimulationBankBreakdownItem>();

  for (const question of questions) {
    const category = question.category_id ? categories.get(question.category_id) : null;
    incrementBreakdown(byCategory, {
      id: question.category_id ?? "uncategorized",
      label: category?.name ?? "Sem categoria",
      detail: category?.slug ?? null,
    });

    const competency = question.primary_competency_id
      ? competencies.get(question.primary_competency_id)
      : null;
    incrementBreakdown(byCompetency, {
      id: question.primary_competency_id ?? "unlinked",
      label: competency?.title ?? "Competência não vinculada",
      detail: competency?.code ?? "Aguardando vínculo editorial no acervo.",
    });

    incrementBreakdown(byDifficulty, difficultyBreakdownLabel(question));
  }

  return {
    byCategory: sortBreakdown([...byCategory.values()]),
    byCompetency: sortBreakdown([...byCompetency.values()]),
    byDifficulty: sortBreakdown([...byDifficulty.values()]),
  };
}

function questionMatchesTemplate(
  template: Pick<SimulationTemplateCatalogItem, "language" | "source_reference">,
  question: Pick<QuestionRow, "language" | "type" | "source_reference">,
) {
  const sourceMatches =
    !template.source_reference ||
    question.source_reference === template.source_reference;

  return (
    question.type === "objective" &&
    sourceMatches &&
    (template.language === "mixed" || question.language === template.language)
  );
}

function selectQuestionsForTemplate(
  template: Pick<
    SimulationTemplateCatalogItem,
    "language" | "source_reference" | "total_questions"
  >,
  questions: QuestionRow[],
) {
  const eligibleQuestions = questions.filter((question) =>
    questionMatchesTemplate(template, question),
  );

  if (template.language !== "mixed") {
    return eligibleQuestions.slice(0, template.total_questions);
  }

  const languageOrder: QuestionRow["language"][] = [
    "english",
    "spanish",
    "portuguese",
    "mixed",
    "psychosocial",
  ];
  const byLanguage = new Map<QuestionRow["language"], QuestionRow[]>(
    languageOrder.map((language) => [
      language,
      eligibleQuestions.filter((question) => question.language === language),
    ]),
  );
  const selected: QuestionRow[] = [];

  while (selected.length < template.total_questions) {
    const previousLength = selected.length;
    for (const language of languageOrder) {
      const next = byLanguage.get(language)?.shift();
      if (next) {
        selected.push(next);
      }

      if (selected.length >= template.total_questions) {
        break;
      }
    }

    if (selected.length === previousLength) {
      break;
    }
  }

  return selected;
}

async function getRecentAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_attempts")
    .select(
      "id, tenant_id, user_id, template_id, started_at, completed_at, score, percentage, status",
    )
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(12);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar histórico de simulados.",
      500,
    );
  }

  return (data ?? []) as AttemptRow[];
}

async function getAnswerCountsByAttempt(attemptIds: string[]) {
  if (attemptIds.length === 0) {
    return new Map<string, number>();
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_answers")
    .select("attempt_id")
    .in("attempt_id", attemptIds);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar respostas do histórico.",
      500,
    );
  }

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as Pick<AttemptAnswerRow, "attempt_id">[]) {
    counts.set(row.attempt_id, (counts.get(row.attempt_id) ?? 0) + 1);
  }
  return counts;
}

async function getCategoriesCount() {
  const admin = getSupabaseAdminClient();
  const { count, error } = await admin
    .from("question_categories")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar categorias.",
      500,
    );
  }

  return count ?? 0;
}

export async function getSimulationOverview(
  userId: string,
): Promise<SimulationOverview> {
  const profile = await getProfile(userId);
  const [templates, questions, attempts, categoriesCount] = await Promise.all([
    getActiveTemplates(profile),
    getVisibleObjectiveQuestions(profile),
    getRecentAttempts(userId, profile),
    getCategoriesCount(),
  ]);
  const answerCounts = await getAnswerCountsByAttempt(
    attempts.map((attempt) => attempt.id),
  );
  const bankBreakdown = await getQuestionBankBreakdown(questions);
  const templateById = new Map(templates.map((template) => [template.id, template]));
  const hasPaid = hasPremiumAccess(profile);

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaid,
    schema: {
      categoriesCount,
      templatesCount: templates.length,
      activeObjectiveQuestionsCount: questions.length,
      ...bankBreakdown,
    },
    templates: buildTemplateAccessList(
      templates,
      questions as ObjectiveQuestionCatalogItem[],
      hasPaid,
    ),
    attempts: attempts.map((attempt) => {
      const template = attempt.template_id
        ? templateById.get(attempt.template_id)
        : null;

      return {
        id: attempt.id,
        started_at: attempt.started_at,
        completed_at: attempt.completed_at,
        score: attempt.score,
        percentage: attempt.percentage,
        status: attempt.status,
        templateId: attempt.template_id,
        templateTitle: template?.title ?? "Simulado removido",
        templateLanguage: template?.language ?? null,
        templateType: template?.type ?? null,
        answerCount: answerCounts.get(attempt.id) ?? 0,
      };
    }),
    historySummary: summarizeAttemptHistory(attempts),
  };
}

export async function getSimulationStartView(
  userId: string,
  templateId: string,
): Promise<SimulationStartView> {
  const profile = await getProfile(userId);
  const overview = await getSimulationOverview(userId);
  const template = overview.templates.find((item) => item.id === templateId) ?? null;
  const activeAttempt = overview.attempts.find(
    (attempt) =>
      attempt.templateId === templateId && attempt.status === "started",
  );

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPremiumAccess(profile),
    template,
    activeAttemptId: activeAttempt?.id ?? null,
    estimatedMinutes: template ? simulationDurationMinutes(template) : 0,
  };
}

async function ensureAttemptQuestions(
  attemptId: string,
  profile: ProfileRow,
  template: SimulationTemplateCatalogItem,
) {
  const admin = getSupabaseAdminClient();
  const { data: existingRows, error: existingError } = await admin
    .from("simulation_answers")
    .select("question_id")
    .eq("attempt_id", attemptId);

  if (existingError) {
    throw new SimulationServiceError(
      "Não foi possível consultar questões da tentativa.",
      500,
    );
  }

  if ((existingRows ?? []).length > 0) {
    return;
  }

  const visibleQuestions = await getVisibleObjectiveQuestions(profile);
  const selectedQuestions = selectQuestionsForTemplate(template, visibleQuestions);

  if (selectedQuestions.length < template.total_questions) {
    throw new SimulationServiceError(
      selectedQuestions.length === 0
        ? "Banco de questões ainda não alimentado para este simulado."
        : "Banco de questões insuficiente para este simulado.",
      409,
    );
  }

  const rows = selectedQuestions.map((question) => ({
    tenant_id: profile.tenant_id,
    attempt_id: attemptId,
    question_id: question.id,
    selected_option_id: null,
    is_correct: null,
    points: 0,
  }));

  const { error } = await admin.from("simulation_answers").insert(rows);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível vincular questões a tentativa.",
      500,
    );
  }
}

export async function startSimulationAttempt(
  userId: string,
  templateId: string,
): Promise<StartSimulationAttemptResult> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const overview = await getSimulationOverview(userId);
  const template = overview.templates.find((item) => item.id === templateId);

  if (!template) {
    throw new SimulationServiceError("Modelo de simulado não encontrado.", 404);
  }

  if (template.lockedReason === "premium_required") {
    throw new SimulationServiceError(
      "Este simulado está disponível apenas para usuários premium.",
      403,
    );
  }

  if (
    template.lockedReason === "no_questions" ||
    template.lockedReason === "insufficient_questions"
  ) {
    throw new SimulationServiceError(
      template.lockedReason === "insufficient_questions"
        ? "Banco de questões insuficiente para este simulado."
        : "Banco de questões ainda não alimentado para este simulado.",
      409,
    );
  }

  const { data: activeAttempt, error: activeAttemptError } = await admin
    .from("simulation_attempts")
    .select(
      "id, tenant_id, user_id, template_id, started_at, completed_at, score, percentage, status",
    )
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .eq("template_id", templateId)
    .eq("status", "started")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeAttemptError) {
    throw new SimulationServiceError(
      "Não foi possível consultar tentativa ativa.",
      500,
    );
  }

  if (activeAttempt?.id) {
    await ensureAttemptQuestions(activeAttempt.id, profile, template);
    return {
      attemptId: activeAttempt.id,
      reused: true,
      status: "started",
    };
  }

  const { data, error } = await admin
    .from("simulation_attempts")
    .insert({
      tenant_id: profile.tenant_id,
      user_id: userId,
      template_id: templateId,
      status: "started",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new SimulationServiceError(
      "Não foi possível iniciar a tentativa.",
      500,
    );
  }

  await ensureAttemptQuestions(data.id, profile, template);

  return {
    attemptId: data.id,
    reused: false,
    status: "started",
  };
}

async function getAttemptForUser(userId: string, attemptId: string) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const { data, error } = await admin
    .from("simulation_attempts")
    .select(
      "id, tenant_id, user_id, template_id, started_at, completed_at, score, percentage, status",
    )
    .eq("id", attemptId)
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new SimulationServiceError("Tentativa não encontrada.", 404);
  }

  return {
    profile,
    attempt: data as AttemptRow,
  };
}

async function getTemplateById(templateId: string | null) {
  if (!templateId) {
    return null;
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_templates")
    .select(
      "id, editorial_id, source_reference, tenant_id, title, description, type, language, total_questions, is_premium",
    )
    .eq("id", templateId)
    .maybeSingle();

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar modelo da tentativa.",
      500,
    );
  }

  return data
    ? normalizeTemplateForOfficialPgm(data as SimulationTemplateCatalogItem)
    : null;
}

async function getAttemptAnswers(attemptId: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_answers")
    .select("id, attempt_id, question_id, selected_option_id, is_correct, points")
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar respostas da tentativa.",
      500,
    );
  }

  return (data ?? []) as AttemptAnswerRow[];
}

async function getQuestionsById(questionIds: string[]) {
  if (questionIds.length === 0) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("questions")
    .select(
      "id, editorial_id, source_reference, primary_competency_id, editorial_difficulty_level, bank_id, category_id, language, type, difficulty, statement, explanation",
    )
    .in("id", questionIds);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar questões da tentativa.",
      500,
    );
  }

  return (data ?? []) as QuestionRow[];
}

async function getRunnerQuestionsById(questionIds: string[]) {
  if (questionIds.length === 0) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("questions")
    .select(
      "id, editorial_id, source_reference, primary_competency_id, editorial_difficulty_level, bank_id, category_id, language, type, difficulty, statement",
    )
    .in("id", questionIds);

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar questões da tentativa.",
      500,
    );
  }

  return ((data ?? []) as Array<Omit<QuestionRow, "explanation">>).map(
    (question) => ({
      ...question,
      explanation: null,
    }),
  );
}

async function getOptionsByQuestionId(questionIds: string[], includeCorrect: boolean) {
  if (questionIds.length === 0) {
    return new Map<string, QuestionOptionRow[]>();
  }

  const admin = getSupabaseAdminClient();
  const response = includeCorrect
    ? await admin
        .from("question_options")
        .select("id, question_id, option_label, option_text, is_correct")
        .in("question_id", questionIds)
        .order("option_label", { ascending: true })
    : await admin
        .from("question_options")
        .select("id, question_id, option_label, option_text")
        .in("question_id", questionIds)
        .order("option_label", { ascending: true });
  const { data, error } = response;

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar alternativas.",
      500,
    );
  }

  const optionsByQuestion = new Map<string, QuestionOptionRow[]>();
  const options = includeCorrect
    ? ((data ?? []) as QuestionOptionRow[])
    : ((data ?? []) as Array<Omit<QuestionOptionRow, "is_correct">>).map(
        (option) => ({
          ...option,
          is_correct: false,
        }),
      );

  for (const option of options) {
    optionsByQuestion.set(option.question_id, [
      ...(optionsByQuestion.get(option.question_id) ?? []),
      option,
    ]);
  }

  return optionsByQuestion;
}

function balancedDisplayOptionsForQuestion(
  question: Pick<QuestionRow, "editorial_id" | "language">,
  options: QuestionOptionRow[],
) {
  const targetLabel = balancedCorrectLabelForObjectiveQuestion({
    editorialId: question.editorial_id,
    language: question.language,
  });
  const sortedOptions = [...options].sort((a, b) =>
    compareObjectiveOptionLabels(a.option_label, b.option_label),
  );
  const correctOption = sortedOptions.find((option) => option.is_correct);

  if (!targetLabel || !correctOption || correctOption.option_label === targetLabel) {
    return sortedOptions;
  }

  const targetOption = sortedOptions.find(
    (option) => option.option_label === targetLabel,
  );

  if (!targetOption) {
    return sortedOptions;
  }

  return sortedOptions
    .map((option) => {
      if (option.id === correctOption.id) {
        return {
          ...option,
          option_label: targetLabel,
        };
      }

      if (option.id === targetOption.id) {
        return {
          ...option,
          option_label: correctOption.option_label,
        };
      }

      return option;
    })
    .sort((a, b) => compareObjectiveOptionLabels(a.option_label, b.option_label));
}

async function getRecommendedPaths(
  profile: ProfileRow,
  weakCategories: CategoryPerformance[],
) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_paths")
    .select("id, tenant_id, title, slug, language, is_premium, is_active")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    throw new SimulationServiceError(
      "Não foi possível consultar trilhas recomendadas.",
      500,
    );
  }

  const visiblePaths = ((data ?? []) as LearningPathRow[]).filter(
    (path): path is LearningPathRow & { slug: string } =>
      isTenantVisible(path.tenant_id, profile) && Boolean(path.slug),
  );
  const weakText = weakCategories
    .map((category) => searchText(category.categoryName))
    .join(" ");
  const ranked = visiblePaths
    .map((path) => {
      const title = searchText(path.title);
      let score = 0;

      if (includesAny(weakText, ["english", "ingl"])) {
        score += path.language === "english" || title.includes("ingles") ? 3 : 0;
      }
      if (includesAny(weakText, ["spanish", "espan"])) {
        score += path.language === "spanish" || title.includes("espanhol") ? 3 : 0;
      }
      if (includesAny(weakText, ["escrita", "subjet"])) {
        score += title.includes("escrita") || title.includes("subjetiva") ? 4 : 0;
      }
      if (includesAny(weakText, ["programa", "edital"])) {
        score += includesAny(title, ["edital", "preparacao segura"]) ? 4 : 0;
      }
      if (includesAny(weakText, ["psicossocial", "entrevista"])) {
        score += includesAny(title, ["entrevista", "psicossocial"]) ? 4 : 0;
      }

      return { path, score };
    })
    .sort((a, b) => b.score - a.score || a.path.title.localeCompare(b.path.title));

  const selected = (ranked.some((item) => item.score > 0)
    ? ranked.filter((item) => item.score > 0)
    : ranked
  ).slice(0, 3);

  return selected.map(({ path }) => ({
    id: path.id,
    title: path.title,
    href: `/trilhas/${path.slug}`,
    reason:
      weakCategories.length > 0
        ? "Reforça categorias com margem de melhoria no simulado."
        : "Mantém ritmo de estudo após o bom desempenho.",
    isPremium: path.is_premium,
    canAccess: canAccessPremium(path.is_premium, profile),
  }));
}

function buildNextSteps(score: ObjectiveScoreResult) {
  if (score.totalQuestions === 0) {
    return ["Inicie um simulado oficial para gerar recomendações reais."];
  }

  if (score.percentage >= 80) {
    return [
      "Revise os erros pontuais antes de iniciar outro simulado oficial.",
      "Treine a subjetiva oficial para equilibrar desempenho objetivo e escrito.",
      "Use as trilhas recomendadas para manter consistência até a prova.",
    ];
  }

  if (score.percentage >= 60) {
    return [
      "Priorize as categorias abaixo de 60% antes de refazer um simulado completo.",
      "Revise flashcards e materiais relacionados às categorias fracas.",
      "Faça um simulado rápido por idioma antes do próximo oficial.",
    ];
  }

  return [
    "Volte para as trilhas básicas das categorias fracas.",
    "Revise vocabulário, gramática e interpretação antes de tentar outro oficial.",
    "Faça uma rotina curta diária com material, flashcards e 10 questões.",
  ];
}

export async function getSimulationRunner(
  userId: string,
  attemptId: string,
): Promise<SimulationRunnerView> {
  const { attempt } = await getAttemptForUser(userId, attemptId);

  if (attempt.status === "completed") {
    throw new SimulationServiceError("Tentativa já finalizada.", 409);
  }

  const template = await getTemplateById(attempt.template_id);
  if (!template) {
    throw new SimulationServiceError("Modelo de simulado não encontrado.", 404);
  }

  const answers = await getAttemptAnswers(attempt.id);
  const questionIds = answers.map((answer) => answer.question_id);
  const [questions, optionsByQuestion] = await Promise.all([
    getRunnerQuestionsById(questionIds),
    getOptionsByQuestionId(questionIds, true),
  ]);
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const categories = await getCategoriesById(
    questions.map((question) => question.category_id).filter((id): id is string => Boolean(id)),
  );

  return {
    attemptId: attempt.id,
    startedAt: attempt.started_at,
    template: {
      id: template.id,
      title: template.title,
      type: template.type,
      language: template.language,
      totalQuestions: answers.length,
      durationMinutes: simulationDurationMinutes(template),
    },
    answeredCount: answers.filter((answer) => answer.selected_option_id).length,
    questions: answers.map((answer) => {
      const question = questionById.get(answer.question_id);
      if (!question) {
        throw new SimulationServiceError("Questão da tentativa não encontrada.", 500);
      }

      return {
        id: question.id,
        categoryName:
          (question.category_id && categories.get(question.category_id)?.name) ||
          "Sem categoria",
        difficulty: question.difficulty,
        language: question.language,
        statement: question.statement,
        selectedOptionId: answer.selected_option_id,
        options: balancedDisplayOptionsForQuestion(
          question,
          optionsByQuestion.get(question.id) ?? [],
        ).map((option) => ({
          id: option.id,
          label: option.option_label,
          text: option.option_text,
        })),
      };
    }),
  };
}

export async function saveSimulationAnswer(
  userId: string,
  input: {
    attemptId: string;
    questionId: string;
    selectedOptionId: string | null;
  },
): Promise<void> {
  const admin = getSupabaseAdminClient();
  const { attempt } = await getAttemptForUser(userId, input.attemptId);

  if (attempt.status !== "started") {
    throw new SimulationServiceError("Tentativa já finalizada.", 409);
  }

  const answers = await getAttemptAnswers(attempt.id);
  const answer = answers.find((item) => item.question_id === input.questionId);

  if (!answer) {
    throw new SimulationServiceError("Questão não pertence a tentativa.", 403);
  }

  if (input.selectedOptionId) {
    const optionsByQuestion = await getOptionsByQuestionId([input.questionId], false);
    const optionBelongsToQuestion = optionsByQuestion
      .get(input.questionId)
      ?.some((option) => option.id === input.selectedOptionId);

    if (!optionBelongsToQuestion) {
      throw new SimulationServiceError("Alternativa inválida para a questão.", 400);
    }
  }

  const { error } = await admin
    .from("simulation_answers")
    .update({
      selected_option_id: input.selectedOptionId,
      is_correct: null,
      points: 0,
    })
    .eq("id", answer.id)
    .eq("attempt_id", attempt.id);

  if (error) {
    throw new SimulationServiceError("Não foi possível salvar resposta.", 500);
  }
}

export async function submitSimulationAttempt(
  userId: string,
  attemptId: string,
  input: SubmitSimulationAttemptInput = {},
): Promise<SubmitSimulationAttemptResult> {
  const admin = getSupabaseAdminClient();
  const { profile, attempt } = await getAttemptForUser(userId, attemptId);

  if (attempt.status === "completed") {
    const result = await getSimulationResult(userId, attempt.id);
    return {
      attemptId: attempt.id,
      score: result.score,
      percentage: result.percentage,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
    };
  }

  let answers = await getAttemptAnswers(attempt.id);
  const selectedOptions = Array.from(
    new Map(
      (input.selectedOptions ?? []).map((selectedOption) => [
        selectedOption.questionId,
        selectedOption,
      ]),
    ).values(),
  );

  if (selectedOptions.length > 0) {
    const answerByQuestionId = new Map(
      answers.map((answer) => [answer.question_id, answer]),
    );
    const selectedQuestionIds = [
      ...new Set(selectedOptions.map((item) => item.questionId)),
    ];

    for (const selectedOption of selectedOptions) {
      if (!answerByQuestionId.has(selectedOption.questionId)) {
        throw new SimulationServiceError(
          "Questão não pertence a tentativa.",
          403,
        );
      }
    }

    const optionsByQuestion = await getOptionsByQuestionId(
      selectedQuestionIds,
      false,
    );

    for (const selectedOption of selectedOptions) {
      if (!selectedOption.selectedOptionId) {
        continue;
      }

      const optionBelongsToQuestion = optionsByQuestion
        .get(selectedOption.questionId)
        ?.some((option) => option.id === selectedOption.selectedOptionId);

      if (!optionBelongsToQuestion) {
        throw new SimulationServiceError(
          "Alternativa inválida para a questão.",
          400,
        );
      }
    }

    const rows = selectedOptions.map((selectedOption) => ({
      tenant_id: profile.tenant_id,
      attempt_id: attempt.id,
      question_id: selectedOption.questionId,
      selected_option_id: selectedOption.selectedOptionId,
      is_correct: null,
      points: 0,
    }));
    const { error } = await admin
      .from("simulation_answers")
      .upsert(rows, { onConflict: "attempt_id,question_id" });

    if (error) {
      throw new SimulationServiceError(
        "Não foi possível salvar respostas da tentativa.",
        500,
      );
    }

    answers = await getAttemptAnswers(attempt.id);
  }

  const questionIds = answers.map((answer) => answer.question_id);
  const [questions, optionsByQuestion, template] = await Promise.all([
    getQuestionsById(questionIds),
    getOptionsByQuestionId(questionIds, true),
    getTemplateById(attempt.template_id),
  ]);
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const categories = await getCategoriesById(
    questions.map((question) => question.category_id).filter((id): id is string => Boolean(id)),
  );
  const pointsPerQuestion = template ? simulationPointsPerQuestion(template) : 1;

  const scoreInput: ObjectiveAnswerInput[] = answers.map((answer) => {
    const question = questionById.get(answer.question_id);
    if (!question) {
      throw new SimulationServiceError("Questão da tentativa não encontrada.", 500);
    }

    const correctOption = optionsByQuestion
      .get(question.id)
      ?.find((option) => option.is_correct);

    return {
      questionId: question.id,
      categoryId: question.category_id,
      categoryName:
        (question.category_id && categories.get(question.category_id)?.name) ||
        "Sem categoria",
      selectedOptionId: answer.selected_option_id,
      correctOptionId: correctOption?.id ?? null,
      points: pointsPerQuestion,
    };
  });
  const score = calculateObjectiveScore(scoreInput);
  const answerRows = scoreInput.map((answer) => ({
    tenant_id: profile.tenant_id,
    attempt_id: attempt.id,
    question_id: answer.questionId,
    selected_option_id: answer.selectedOptionId,
    is_correct:
      Boolean(answer.selectedOptionId) &&
      answer.selectedOptionId === answer.correctOptionId,
    points:
      Boolean(answer.selectedOptionId) &&
      answer.selectedOptionId === answer.correctOptionId
        ? pointsPerQuestion
        : 0,
  }));

  if (answerRows.length > 0) {
    const { error: upsertAnswersError } = await admin
      .from("simulation_answers")
      .upsert(answerRows, { onConflict: "attempt_id,question_id" });

    if (upsertAnswersError) {
      throw new SimulationServiceError(
        "Não foi possível salvar correção da tentativa.",
        500,
      );
    }
  }

  const { error: updateAttemptError } = await admin
    .from("simulation_attempts")
    .update({
      completed_at: new Date().toISOString(),
      score: score.score,
      percentage: score.percentage,
      status: "completed",
    })
    .eq("id", attempt.id)
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId);

  if (updateAttemptError) {
    throw new SimulationServiceError(
      "Não foi possível finalizar a tentativa.",
      500,
    );
  }

  return {
    attemptId: attempt.id,
    score: score.score,
    percentage: score.percentage,
    correctAnswers: score.correctAnswers,
    totalQuestions: score.totalQuestions,
  };
}

export async function finishSimulationAttempt(
  userId: string,
  attemptId: string,
): Promise<SubmitSimulationAttemptResult> {
  return submitSimulationAttempt(userId, attemptId);
}

export async function getSimulationResult(
  userId: string,
  attemptId: string,
): Promise<SimulationResultView> {
  const { profile, attempt } = await getAttemptForUser(userId, attemptId);

  if (attempt.status !== "completed") {
    throw new SimulationServiceError("Tentativa ainda não finalizada.", 409);
  }

  const template = await getTemplateById(attempt.template_id);
  const answers = await getAttemptAnswers(attempt.id);
  const questionIds = answers.map((answer) => answer.question_id);
  const [questions, optionsByQuestion] = await Promise.all([
    getQuestionsById(questionIds),
    getOptionsByQuestionId(questionIds, true),
  ]);
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const categories = await getCategoriesById(
    questions.map((question) => question.category_id).filter((id): id is string => Boolean(id)),
  );
  const pointsPerQuestion = template ? simulationPointsPerQuestion(template) : 1;
  const scoreInput: ObjectiveAnswerInput[] = [];
  const questionResults: SimulationQuestionResult[] = [];

  for (const answer of answers) {
    const question = questionById.get(answer.question_id);
    if (!question) {
      continue;
    }

    const options = balancedDisplayOptionsForQuestion(
      question,
      optionsByQuestion.get(question.id) ?? [],
    );
    const correctOption = options.find((option) => option.is_correct);
    const categoryName =
      (question.category_id && categories.get(question.category_id)?.name) ||
      "Sem categoria";

    scoreInput.push({
      questionId: question.id,
      categoryId: question.category_id,
      categoryName,
      selectedOptionId: answer.selected_option_id,
      correctOptionId: correctOption?.id ?? null,
      points: pointsPerQuestion,
    });
    questionResults.push({
      id: question.id,
      categoryName,
      statement: question.statement,
      explanation: question.explanation,
      selectedOptionId: answer.selected_option_id,
      correctOptionId: correctOption?.id ?? null,
      isCorrect: Boolean(answer.is_correct),
      options: options.map((option) => ({
        id: option.id,
        label: option.option_label,
        text: option.option_text,
        isSelected: option.id === answer.selected_option_id,
        isCorrect: option.is_correct,
      })),
    });
  }

  const score = calculateObjectiveScore(scoreInput);
  const completedAt = attempt.completed_at ?? new Date().toISOString();
  const recommendedPaths = await getRecommendedPaths(profile, score.weakCategories);

  return {
    attemptId: attempt.id,
    templateTitle: template?.title ?? "Simulado removido",
    startedAt: attempt.started_at,
    completedAt,
    elapsedMinutes: minutesBetween(attempt.started_at, completedAt),
    score: attempt.score ?? score.score,
    maxScore: score.maxScore,
    percentage: attempt.percentage ?? score.percentage,
    totalQuestions: score.totalQuestions,
    answeredQuestions: score.answeredQuestions,
    correctAnswers: score.correctAnswers,
    incorrectAnswers: score.incorrectAnswers,
    byCategory: score.byCategory,
    strongCategories: score.strongCategories,
    weakCategories: score.weakCategories,
    nextSteps: buildNextSteps(score),
    recommendedPaths,
    questions: questionResults,
  };
}
