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
  "id" | "bank_id" | "category_id" | "language" | "type"
>;
type QuestionOptionRow = Pick<
  Database["public"]["Tables"]["question_options"]["Row"],
  "id" | "question_id" | "is_correct"
>;
type QuestionBankRow = Pick<
  Database["public"]["Tables"]["question_banks"]["Row"],
  "id" | "tenant_id" | "is_active" | "is_premium"
>;
type QuestionCategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "name"
>;

export type SimulationOverview = {
  accessStatus: ProfileRow["access_status"];
  hasPaidAccess: boolean;
  schema: {
    categoriesCount: number;
    templatesCount: number;
    activeObjectiveQuestionsCount: number;
  };
  templates: SimulationTemplateAccess[];
  attempts: Array<
    Pick<
      AttemptRow,
      "id" | "started_at" | "completed_at" | "score" | "percentage" | "status"
    >
  >;
  historySummary: ReturnType<typeof summarizeAttemptHistory>;
};

export type StartSimulationAttemptResult = {
  attemptId: string;
  status: "started";
};

export type SubmitSimulationAttemptInput = {
  selectedOptions: Array<{
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
      (!bank.is_premium || hasPaidAccess(profile)),
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
    .select("id, bank_id, category_id, language, type")
    .eq("is_active", true)
    .eq("type", "objective");

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
    .limit(5);

  if (error) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar historico de simulados.",
      500,
    );
  }

  return (data ?? []) as AttemptRow[];
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
    attempts: attempts.map(
      ({ id, started_at, completed_at, score, percentage, status }) => ({
        id,
        started_at,
        completed_at,
        score,
        percentage,
        status,
      }),
    ),
    historySummary: summarizeAttemptHistory(attempts),
  };
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
      "Simulado completo disponivel apenas para usuarios premium.",
      403,
    );
  }

  if (template.lockedReason === "no_questions") {
    throw new SimulationServiceError(
      "Banco de questoes ainda nao alimentado para este simulado.",
      409,
    );
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

  return {
    attemptId: data.id,
    status: "started",
  };
}

export async function submitSimulationAttempt(
  userId: string,
  attemptId: string,
  input: SubmitSimulationAttemptInput,
): Promise<SubmitSimulationAttemptResult> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const selectedOptions = input.selectedOptions.filter(
    (answer) => answer.questionId,
  );

  if (selectedOptions.length === 0) {
    throw new SimulationServiceError("Envie ao menos uma resposta.", 400);
  }

  const { data: attempt, error: attemptError } = await admin
    .from("simulation_attempts")
    .select(
      "id, tenant_id, user_id, template_id, started_at, completed_at, score, percentage, status",
    )
    .eq("id", attemptId)
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .single();

  if (attemptError || !attempt) {
    throw new SimulationServiceError("Tentativa nao encontrada.", 404);
  }

  const questionIds = selectedOptions.map((answer) => answer.questionId);
  const { data: questions, error: questionsError } = await admin
    .from("questions")
    .select("id, bank_id, category_id, language, type")
    .in("id", questionIds)
    .eq("is_active", true)
    .eq("type", "objective");

  if (questionsError) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar questoes da tentativa.",
      500,
    );
  }

  if (!questions || questions.length !== questionIds.length) {
    throw new SimulationServiceError(
      "Uma ou mais questoes nao estao disponiveis.",
      400,
    );
  }

  const visibleQuestions = await getVisibleObjectiveQuestions(profile);
  const visibleQuestionIds = new Set(visibleQuestions.map((item) => item.id));
  const unauthorizedQuestion = questions.find(
    (question) => !visibleQuestionIds.has(question.id),
  );

  if (unauthorizedQuestion) {
    throw new SimulationServiceError(
      "Questao indisponivel para o usuario atual.",
      403,
    );
  }

  const { data: options, error: optionsError } = await admin
    .from("question_options")
    .select("id, question_id, is_correct")
    .in("question_id", questionIds);

  if (optionsError) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar alternativas.",
      500,
    );
  }

  const optionsByQuestion = new Map<string, QuestionOptionRow[]>();
  for (const option of (options ?? []) as QuestionOptionRow[]) {
    optionsByQuestion.set(option.question_id, [
      ...(optionsByQuestion.get(option.question_id) ?? []),
      option,
    ]);
  }

  const invalidOption = selectedOptions.find((answer) => {
    if (!answer.selectedOptionId) {
      return false;
    }

    return !optionsByQuestion
      .get(answer.questionId)
      ?.some((option) => option.id === answer.selectedOptionId);
  });

  if (invalidOption) {
    throw new SimulationServiceError(
      "Alternativa selecionada nao pertence a tentativa.",
      400,
    );
  }

  const categoryIds = questions
    .map((question) => question.category_id)
    .filter((id): id is string => Boolean(id));
  const { data: categories, error: categoriesError } =
    categoryIds.length > 0
      ? await admin.from("question_categories").select("id, name").in("id", categoryIds)
      : { data: [], error: null };

  if (categoriesError) {
    throw new SimulationServiceError(
      "Nao foi possivel consultar categorias da tentativa.",
      500,
    );
  }
  const categoryById = new Map(
    ((categories ?? []) as QuestionCategoryRow[]).map((category) => [
      category.id,
      category.name,
    ]),
  );

  const selectedByQuestionId = new Map(
    selectedOptions.map((answer) => [answer.questionId, answer.selectedOptionId]),
  );
  const scoreInput: ObjectiveAnswerInput[] = questions.map((question) => {
    const questionOptions = optionsByQuestion.get(question.id) ?? [];
    const correctOption = questionOptions.find((option) => option.is_correct);

    return {
      questionId: question.id,
      categoryId: question.category_id,
      categoryName:
        (question.category_id && categoryById.get(question.category_id)) ||
        "Sem categoria",
      selectedOptionId: selectedByQuestionId.get(question.id) ?? null,
      correctOptionId: correctOption?.id ?? null,
      points: 1,
    };
  });
  const score = calculateObjectiveScore(scoreInput);

  await admin.from("simulation_answers").delete().eq("attempt_id", attempt.id);

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
    const { error: insertAnswersError } = await admin
      .from("simulation_answers")
      .insert(answerRows);

    if (insertAnswersError) {
      throw new SimulationServiceError(
        "Nao foi possivel salvar respostas da tentativa.",
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
