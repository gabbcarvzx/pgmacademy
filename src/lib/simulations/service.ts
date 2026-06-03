import "server-only";

import {
  buildTemplateAccessList,
  type ObjectiveQuestionCatalogItem,
  type SimulationTemplateAccess,
  type SimulationTemplateCatalogItem,
} from "@/lib/simulations/catalog";
import {
  calculateObjectiveScore,
  summarizeAttemptHistory,
  type CategoryPerformance,
  type ObjectiveAnswerInput,
} from "@/lib/simulations/scoring";
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
type AttemptAnswerRow = Pick<
  Database["public"]["Tables"]["simulation_answers"]["Row"],
  | "id"
  | "attempt_id"
  | "question_id"
  | "selected_option_id"
  | "is_correct"
  | "points"
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
  };
  templates: SimulationTemplateAccess[];
  attempts: SimulationHistoryItem[];
  historySummary: ReturnType<typeof summarizeAttemptHistory>;
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
  score: number;
  percentage: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  byCategory: CategoryPerformance[];
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

function hasPaidAccess(profile: Pick<ProfileRow, "access_status">) {
  return profile.access_status === "paid";
}

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function canAccessPremium(isPremium: boolean, profile: ProfileRow) {
  return !isPremium || hasPaidAccess(profile) || profile.role === "admin";
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

function estimatedMinutes(totalQuestions: number) {
  return Math.max(Math.ceil(totalQuestions * 1.5), 10);
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
    "Perfil do aluno nao encontrado.",
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
      "Nao foi possivel consultar bancos de questoes.",
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
      "id, editorial_id, bank_id, category_id, language, type, difficulty, statement, explanation",
    )
    .eq("is_active", true)
    .eq("type", "objective")
    .order("editorial_id", { ascending: true });

  if (error) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar questoes objetivas.",
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
      "id, tenant_id, title, description, type, language, total_questions, is_premium",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar modelos de simulado.",
      500,
    );
  }

  return ((data ?? []) as SimulationTemplateCatalogItem[]).filter((template) =>
    isTenantVisible(template.tenant_id ?? null, profile),
  );
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
      "Nao foi possivel consultar categorias.",
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

function questionMatchesTemplate(
  template: Pick<SimulationTemplateCatalogItem, "language">,
  question: Pick<QuestionRow, "language" | "type">,
) {
  return (
    question.type === "objective" &&
    (template.language === "mixed" || question.language === template.language)
  );
}

function selectQuestionsForTemplate(
  template: Pick<SimulationTemplateCatalogItem, "language" | "total_questions">,
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
      "Nao foi possivel consultar historico de simulados.",
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
      "Nao foi possivel consultar respostas do historico.",
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
      "Nao foi possivel consultar categorias.",
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
  const templateById = new Map(templates.map((template) => [template.id, template]));
  const hasPaid = hasPaidAccess(profile);

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaid,
    schema: {
      categoriesCount,
      templatesCount: templates.length,
      activeObjectiveQuestionsCount: questions.length,
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
    hasPaidAccess: hasPaidAccess(profile),
    template,
    activeAttemptId: activeAttempt?.id ?? null,
    estimatedMinutes: template ? estimatedMinutes(template.total_questions) : 0,
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
      "Nao foi possivel consultar questoes da tentativa.",
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
        ? "Banco de questoes ainda nao alimentado para este simulado."
        : "Banco de questoes insuficiente para este simulado.",
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
      "Nao foi possivel vincular questoes a tentativa.",
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
    throw new SimulationServiceError("Modelo de simulado nao encontrado.", 404);
  }

  if (template.lockedReason === "premium_required") {
    throw new SimulationServiceError(
      "Este simulado esta disponivel apenas para usuarios premium.",
      403,
    );
  }

  if (
    template.lockedReason === "no_questions" ||
    template.lockedReason === "insufficient_questions"
  ) {
    throw new SimulationServiceError(
      template.lockedReason === "insufficient_questions"
        ? "Banco de questoes insuficiente para este simulado."
        : "Banco de questoes ainda nao alimentado para este simulado.",
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
      "Nao foi possivel consultar tentativa ativa.",
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
      "Nao foi possivel iniciar a tentativa.",
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
    throw new SimulationServiceError("Tentativa nao encontrada.", 404);
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
      "id, tenant_id, title, description, type, language, total_questions, is_premium",
    )
    .eq("id", templateId)
    .maybeSingle();

  if (error) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar modelo da tentativa.",
      500,
    );
  }

  return data as SimulationTemplateCatalogItem | null;
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
      "Nao foi possivel consultar respostas da tentativa.",
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
      "id, editorial_id, bank_id, category_id, language, type, difficulty, statement, explanation",
    )
    .in("id", questionIds);

  if (error) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar questoes da tentativa.",
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
      "id, editorial_id, bank_id, category_id, language, type, difficulty, statement",
    )
    .in("id", questionIds);

  if (error) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar questoes da tentativa.",
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
      "Nao foi possivel consultar alternativas.",
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

export async function getSimulationRunner(
  userId: string,
  attemptId: string,
): Promise<SimulationRunnerView> {
  const { attempt } = await getAttemptForUser(userId, attemptId);

  if (attempt.status === "completed") {
    throw new SimulationServiceError("Tentativa ja finalizada.", 409);
  }

  const template = await getTemplateById(attempt.template_id);
  if (!template) {
    throw new SimulationServiceError("Modelo de simulado nao encontrado.", 404);
  }

  const answers = await getAttemptAnswers(attempt.id);
  const questionIds = answers.map((answer) => answer.question_id);
  const [questions, optionsByQuestion] = await Promise.all([
    getRunnerQuestionsById(questionIds),
    getOptionsByQuestionId(questionIds, false),
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
    },
    answeredCount: answers.filter((answer) => answer.selected_option_id).length,
    questions: answers.map((answer) => {
      const question = questionById.get(answer.question_id);
      if (!question) {
        throw new SimulationServiceError("Questao da tentativa nao encontrada.", 500);
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
        options: (optionsByQuestion.get(question.id) ?? []).map((option) => ({
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
    throw new SimulationServiceError("Tentativa ja finalizada.", 409);
  }

  const answers = await getAttemptAnswers(attempt.id);
  const answer = answers.find((item) => item.question_id === input.questionId);

  if (!answer) {
    throw new SimulationServiceError("Questao nao pertence a tentativa.", 403);
  }

  if (input.selectedOptionId) {
    const optionsByQuestion = await getOptionsByQuestionId([input.questionId], false);
    const optionBelongsToQuestion = optionsByQuestion
      .get(input.questionId)
      ?.some((option) => option.id === input.selectedOptionId);

    if (!optionBelongsToQuestion) {
      throw new SimulationServiceError("Alternativa invalida para a questao.", 400);
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
    throw new SimulationServiceError("Nao foi possivel salvar resposta.", 500);
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
          "Questao nao pertence a tentativa.",
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
          "Alternativa invalida para a questao.",
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
        "Nao foi possivel salvar respostas da tentativa.",
        500,
      );
    }

    answers = await getAttemptAnswers(attempt.id);
  }

  const questionIds = answers.map((answer) => answer.question_id);
  const [questions, optionsByQuestion] = await Promise.all([
    getQuestionsById(questionIds),
    getOptionsByQuestionId(questionIds, true),
  ]);
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const categories = await getCategoriesById(
    questions.map((question) => question.category_id).filter((id): id is string => Boolean(id)),
  );

  const scoreInput: ObjectiveAnswerInput[] = answers.map((answer) => {
    const question = questionById.get(answer.question_id);
    if (!question) {
      throw new SimulationServiceError("Questao da tentativa nao encontrada.", 500);
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
      points: 1,
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
        ? 1
        : 0,
  }));

  if (answerRows.length > 0) {
    const { error: upsertAnswersError } = await admin
      .from("simulation_answers")
      .upsert(answerRows, { onConflict: "attempt_id,question_id" });

    if (upsertAnswersError) {
      throw new SimulationServiceError(
        "Nao foi possivel salvar correcao da tentativa.",
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
      "Nao foi possivel finalizar a tentativa.",
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
  const { attempt } = await getAttemptForUser(userId, attemptId);

  if (attempt.status !== "completed") {
    throw new SimulationServiceError("Tentativa ainda nao finalizada.", 409);
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
  const scoreInput: ObjectiveAnswerInput[] = [];
  const questionResults: SimulationQuestionResult[] = [];

  for (const answer of answers) {
    const question = questionById.get(answer.question_id);
    if (!question) {
      continue;
    }

    const options = optionsByQuestion.get(question.id) ?? [];
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
      points: 1,
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

  return {
    attemptId: attempt.id,
    templateTitle: template?.title ?? "Simulado removido",
    startedAt: attempt.started_at,
    completedAt: attempt.completed_at ?? new Date().toISOString(),
    score: attempt.score ?? score.score,
    percentage: attempt.percentage ?? score.percentage,
    totalQuestions: score.totalQuestions,
    answeredQuestions: score.answeredQuestions,
    correctAnswers: score.correctAnswers,
    incorrectAnswers: score.incorrectAnswers,
    byCategory: score.byCategory,
    questions: questionResults,
  };
}
