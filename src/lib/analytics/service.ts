import "server-only";

import {
  buildAchievements,
  buildDiagnosticInsights,
  buildWeeklyGoals,
  calculateStudyStreak,
  type AchievementProgress,
  type DiagnosticInsight,
  type GoalProgress,
} from "@/lib/analytics/rules";
import { getManualReviewStats } from "@/lib/manual-review/service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type AccessStatus = Database["public"]["Tables"]["profiles"]["Row"]["access_status"];
type LearningItemType =
  Database["public"]["Tables"]["user_learning_progress"]["Row"]["item_type"];

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
type AnswerRow = Pick<
  Database["public"]["Tables"]["simulation_answers"]["Row"],
  "attempt_id" | "question_id" | "selected_option_id" | "is_correct" | "points"
>;
type QuestionRow = Pick<
  Database["public"]["Tables"]["questions"]["Row"],
  "id" | "category_id" | "language" | "type"
>;
type CategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "tenant_id" | "name" | "slug" | "language"
>;
type ProgressRow = Pick<
  Database["public"]["Tables"]["user_learning_progress"]["Row"],
  "path_id" | "item_type" | "item_id" | "completed" | "completed_at"
>;
type PathRow = Pick<
  Database["public"]["Tables"]["learning_paths"]["Row"],
  "id" | "tenant_id" | "title" | "slug" | "is_premium" | "is_active"
>;
type PathItemRow = Pick<
  Database["public"]["Tables"]["learning_path_items"]["Row"],
  "path_id" | "item_type" | "item_id"
>;
type MaterialRow = Pick<
  Database["public"]["Tables"]["study_materials"]["Row"],
  "id" | "tenant_id" | "category_id" | "title" | "slug" | "is_premium" | "is_active"
>;
type FlashcardRow = Pick<
  Database["public"]["Tables"]["flashcards"]["Row"],
  "id" | "tenant_id" | "category_id" | "is_premium" | "is_active"
>;
type PsychosocialQuestionRow = Pick<
  Database["public"]["Tables"]["psychosocial_questions"]["Row"],
  "id" | "tenant_id" | "is_premium" | "is_active"
>;

export type AnalyticsSummary = {
  completedSimulations: number;
  averageScore: number;
  overallAccuracy: number;
  averageSimulationMinutes: number;
  completedMaterials: number;
  reviewedFlashcards: number;
  startedPaths: number;
  completedPaths: number;
  answeredQuestions: number;
  subjectiveSubmitted: number;
  subjectiveReviewed: number;
  subjectiveAverage: number;
  psychosocialSubmitted: number;
  psychosocialReviewed: number;
  psychosocialAverage: number;
  manualFeedbacksReceived: number;
};

export type CategoryAnalytics = {
  categoryId: string;
  categoryName: string;
  categorySlug: string | null;
  language: CategoryRow["language"] | "mixed";
  kind: "objective" | "progress";
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
};

export type StudyRecommendation = {
  id: string;
  categoryName: string;
  reason: string;
  materials: Array<{
    id: string;
    title: string;
    href: string;
    isPremium: boolean;
    canAccess: boolean;
  }>;
  flashcards: Array<{
    categorySlug: string;
    title: string;
    totalCards: number;
    isPremium: boolean;
    canAccess: boolean;
    href: string;
  }>;
};

export type TimelinePoint = {
  label: string;
  dateKey: string;
  averagePercentage: number | null;
  activities: number;
};

export type AnalyticsDashboardData = {
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  summary: AnalyticsSummary;
  categoryPerformance: CategoryAnalytics[];
  diagnostics: DiagnosticInsight[];
  recommendations: StudyRecommendation[];
  evolution: {
    last7Days: TimelinePoint[];
    last30Days: TimelinePoint[];
    overall: TimelinePoint[];
  };
  goals: GoalProgress[];
  streak: {
    currentStreak: number;
    recordStreak: number;
    lastStudyDate: string | null;
  };
  achievements: AchievementProgress[];
};

const saoPauloTimeZone = "America/Sao_Paulo";
const uncategorizedId = "uncategorized";
const uncategorizedName = "Sem categoria";

function hasPaidAccess(profile: Pick<ProfileRow, "access_status" | "role">) {
  return profile.access_status === "paid" || profile.role === "admin";
}

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function canAccessPremiumItem(isPremium: boolean, profile: ProfileRow) {
  return !isPremium || hasPaidAccess(profile);
}

function round(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(2));
}

function dateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: saoPauloTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function keyFromUtcDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function minutesBetween(startedAt: string, completedAt: string | null) {
  if (!completedAt) {
    return 0;
  }

  return Math.max(
    Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60000),
    0,
  );
}

function progressKey(
  itemType: LearningItemType,
  itemId: string,
  pathId: string | null,
) {
  return `${pathId ?? "global"}:${itemType}:${itemId}`;
}

async function getProfile(userId: string): Promise<ProfileRow> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, access_status, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Perfil do aluno nao encontrado.");
  }

  return data as ProfileRow;
}

async function getAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_attempts")
    .select(
      "id, tenant_id, user_id, template_id, started_at, completed_at, score, percentage, status",
    )
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .order("started_at", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar tentativas.");
  }

  return (data ?? []) as AttemptRow[];
}

async function getAnswers(attemptIds: string[]) {
  if (attemptIds.length === 0) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_answers")
    .select("attempt_id, question_id, selected_option_id, is_correct, points")
    .in("attempt_id", attemptIds);

  if (error) {
    throw new Error("Nao foi possivel consultar respostas.");
  }

  return (data ?? []) as AnswerRow[];
}

async function getQuestions(questionIds: string[]) {
  if (questionIds.length === 0) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("questions")
    .select("id, category_id, language, type")
    .in("id", [...new Set(questionIds)]);

  if (error) {
    throw new Error("Nao foi possivel consultar questoes.");
  }

  return (data ?? []) as QuestionRow[];
}

async function getCategories(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("question_categories")
    .select("id, tenant_id, name, slug, language")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar categorias.");
  }

  return ((data ?? []) as CategoryRow[]).filter((category) =>
    isTenantVisible(category.tenant_id, profile),
  );
}

async function getProgressRows(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("user_learning_progress")
    .select("path_id, item_type, item_id, completed, completed_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .eq("completed", true)
    .order("completed_at", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar progresso.");
  }

  return (data ?? []) as ProgressRow[];
}

async function getPaths(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_paths")
    .select("id, tenant_id, title, slug, is_premium, is_active")
    .eq("is_active", true);

  if (error) {
    throw new Error("Nao foi possivel consultar trilhas.");
  }

  return ((data ?? []) as PathRow[]).filter((path) =>
    isTenantVisible(path.tenant_id, profile),
  );
}

async function getPathItems(pathIds: string[]) {
  if (pathIds.length === 0) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_path_items")
    .select("path_id, item_type, item_id")
    .in("path_id", pathIds);

  if (error) {
    throw new Error("Nao foi possivel consultar itens de trilha.");
  }

  return (data ?? []) as PathItemRow[];
}

async function getRecommendationContent(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const [materialsResponse, flashcardsResponse, psychosocialResponse] =
    await Promise.all([
      admin
        .from("study_materials")
        .select("id, tenant_id, category_id, title, slug, is_premium, is_active")
        .eq("is_active", true)
        .order("title", { ascending: true }),
      admin
        .from("flashcards")
        .select("id, tenant_id, category_id, is_premium, is_active")
        .eq("is_active", true),
      admin
        .from("psychosocial_questions")
        .select("id, tenant_id, is_premium, is_active")
        .eq("is_active", true),
    ]);

  if (materialsResponse.error) {
    throw new Error("Nao foi possivel consultar materiais para recomendacao.");
  }
  if (flashcardsResponse.error) {
    throw new Error("Nao foi possivel consultar flashcards para recomendacao.");
  }
  if (psychosocialResponse.error) {
    throw new Error("Nao foi possivel consultar perguntas psicossociais.");
  }

  return {
    materials: ((materialsResponse.data ?? []) as MaterialRow[]).filter(
      (material) => isTenantVisible(material.tenant_id, profile),
    ),
    flashcards: ((flashcardsResponse.data ?? []) as FlashcardRow[]).filter(
      (flashcard) => isTenantVisible(flashcard.tenant_id, profile),
    ),
    psychosocialQuestions: (
      (psychosocialResponse.data ?? []) as PsychosocialQuestionRow[]
    ).filter((question) => isTenantVisible(question.tenant_id, profile)),
  };
}

function summarizePaths(
  paths: PathRow[],
  pathItems: PathItemRow[],
  progressRows: ProgressRow[],
) {
  const completedKeys = new Set(
    progressRows.map((row) => progressKey(row.item_type, row.item_id, row.path_id)),
  );
  const pathsWithItems = paths.map((path) => {
    const items = pathItems.filter((item) => item.path_id === path.id);
    const completedItems = items.filter((item) =>
      completedKeys.has(progressKey(item.item_type, item.item_id, path.id)),
    );
    const itemCount = items.length;

    return {
      path,
      itemCount,
      completedItemCount: completedItems.length,
      completed: itemCount > 0 && completedItems.length === itemCount,
      latestCompletedAt:
        progressRows
          .filter((row) => row.path_id === path.id && row.completed_at)
          .map((row) => row.completed_at as string)
          .sort()
          .at(-1) ?? null,
    };
  });

  return {
    startedPaths: pathsWithItems.filter((item) => item.completedItemCount > 0)
      .length,
    completedPaths: pathsWithItems.filter((item) => item.completed).length,
    completedPathIds: new Set(
      pathsWithItems.filter((item) => item.completed).map((item) => item.path.id),
    ),
    completedPathsWithDates: pathsWithItems.filter(
      (item) => item.completed && item.latestCompletedAt,
    ),
  };
}

function buildCategoryPerformance(
  answers: AnswerRow[],
  questions: QuestionRow[],
  categories: CategoryRow[],
  psychosocialReviewed: number,
  psychosocialTotal: number,
) {
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const byCategory = new Map<string, CategoryAnalytics>();

  for (const answer of answers) {
    const question = questionById.get(answer.question_id);
    const category = question?.category_id
      ? categoryById.get(question.category_id)
      : null;
    const categoryId = category?.id ?? uncategorizedId;
    const current = byCategory.get(categoryId) ?? {
      categoryId,
      categoryName: category?.name ?? uncategorizedName,
      categorySlug: category?.slug ?? null,
      language: category?.language ?? question?.language ?? "mixed",
      kind: "objective" as const,
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      percentage: 0,
    };

    current.totalQuestions += 1;
    current.correctAnswers += answer.is_correct ? 1 : 0;
    current.incorrectAnswers += answer.is_correct ? 0 : 1;
    current.percentage =
      current.totalQuestions === 0
        ? 0
        : round((current.correctAnswers / current.totalQuestions) * 100);
    byCategory.set(categoryId, current);
  }

  const psychosocialCategory = categories.find(
    (category) => category.language === "psychosocial",
  );

  if (psychosocialTotal > 0) {
    byCategory.set("psychosocial-progress", {
      categoryId: "psychosocial-progress",
      categoryName: "Psychosocial",
      categorySlug: psychosocialCategory?.slug ?? null,
      language: "psychosocial",
      kind: "progress",
      totalQuestions: psychosocialTotal,
      correctAnswers: psychosocialReviewed,
      incorrectAnswers: Math.max(psychosocialTotal - psychosocialReviewed, 0),
      percentage: round((psychosocialReviewed / psychosocialTotal) * 100),
    });
  }

  return [...byCategory.values()].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName),
  );
}

function buildRecommendations(
  categories: CategoryAnalytics[],
  materials: MaterialRow[],
  flashcards: FlashcardRow[],
  categoryById: Map<string, CategoryRow>,
  profile: ProfileRow,
) {
  const weakCategories = categories
    .filter(
      (category) =>
        category.kind === "objective" &&
        category.totalQuestions > 0 &&
        category.percentage < 70,
    )
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 4);

  return weakCategories.map((category) => {
    const categoryMaterials = materials
      .filter((material) => material.category_id === category.categoryId)
      .slice(0, 3);
    const categoryFlashcards = flashcards.filter(
      (flashcard) => flashcard.category_id === category.categoryId,
    );
    const sourceCategory = categoryById.get(category.categoryId);

    return {
      id: `recommendation:${category.categoryId}`,
      categoryName: category.categoryName,
      reason: `Voce teve ${category.percentage}% em ${category.categoryName}. Priorize revisao guiada antes do proximo simulado.`,
      materials: categoryMaterials.map((material) => ({
        id: material.id,
        title: material.title,
        href: `/estudos/${material.slug}`,
        isPremium: material.is_premium,
        canAccess: canAccessPremiumItem(material.is_premium, profile),
      })),
      flashcards:
        sourceCategory && categoryFlashcards.length > 0
          ? [
              {
                categorySlug: sourceCategory.slug,
                title: `Flashcards de ${category.categoryName}`,
                totalCards: categoryFlashcards.length,
                isPremium: categoryFlashcards.some((card) => card.is_premium),
                canAccess: categoryFlashcards.some((card) =>
                  canAccessPremiumItem(card.is_premium, profile),
                ),
                href: `/flashcards?categoria=${sourceCategory.slug}`,
              },
            ]
          : [],
    } satisfies StudyRecommendation;
  });
}

function buildDailyTimeline(
  days: number,
  todayKey: string,
  completedAttempts: AttemptRow[],
  progressRows: ProgressRow[],
) {
  const today = new Date(`${todayKey}T00:00:00.000Z`);
  const points: TimelinePoint[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const currentKey = keyFromUtcDate(addDays(today, -offset));
    const attemptsForDay = completedAttempts.filter(
      (attempt) => attempt.completed_at && dateKey(attempt.completed_at) === currentKey,
    );
    const progressForDay = progressRows.filter(
      (row) => row.completed_at && dateKey(row.completed_at) === currentKey,
    );
    const percentages = attemptsForDay
      .map((attempt) => attempt.percentage)
      .filter((value): value is number => value !== null);
    const averagePercentage =
      percentages.length === 0
        ? null
        : round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length);

    points.push({
      label: currentKey.slice(5),
      dateKey: currentKey,
      averagePercentage,
      activities: attemptsForDay.length + progressForDay.length,
    });
  }

  return points;
}

function buildOverallTimeline(
  completedAttempts: AttemptRow[],
  progressRows: ProgressRow[],
) {
  const buckets = new Map<
    string,
    { percentages: number[]; activities: number }
  >();

  for (const attempt of completedAttempts) {
    if (!attempt.completed_at) continue;
    const key = dateKey(attempt.completed_at).slice(0, 7);
    const current = buckets.get(key) ?? { percentages: [], activities: 0 };
    if (attempt.percentage !== null) {
      current.percentages.push(attempt.percentage);
    }
    current.activities += 1;
    buckets.set(key, current);
  }

  for (const row of progressRows) {
    if (!row.completed_at) continue;
    const key = dateKey(row.completed_at).slice(0, 7);
    const current = buckets.get(key) ?? { percentages: [], activities: 0 };
    current.activities += 1;
    buckets.set(key, current);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, value]) => ({
      label: key,
      dateKey: key,
      averagePercentage:
        value.percentages.length === 0
          ? null
          : round(
              value.percentages.reduce((sum, item) => sum + item, 0) /
                value.percentages.length,
            ),
      activities: value.activities,
    }));
}

export async function getAnalyticsDashboard(
  userId: string,
): Promise<AnalyticsDashboardData> {
  const profile = await getProfile(userId);
  const [
    attempts,
    progressRows,
    categories,
    paths,
    recommendationContent,
    manualStats,
  ] =
    await Promise.all([
      getAttempts(userId, profile),
      getProgressRows(userId, profile),
      getCategories(profile),
      getPaths(profile),
      getRecommendationContent(profile),
      getManualReviewStats(userId),
    ]);
  const pathItems = await getPathItems(paths.map((path) => path.id));
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed",
  );
  const answerRows = await getAnswers(completedAttempts.map((attempt) => attempt.id));
  const questions = await getQuestions(answerRows.map((answer) => answer.question_id));
  const pathSummary = summarizePaths(paths, pathItems, progressRows);
  const completedMaterialIds = new Set(
    progressRows
      .filter((row) => row.item_type === "study_material")
      .map((row) => row.item_id),
  );
  const reviewedFlashcardIds = new Set(
    progressRows
      .filter((row) => row.item_type === "flashcard")
      .map((row) => row.item_id),
  );
  const reviewedPsychosocialIds = new Set(
    progressRows
      .filter((row) => row.item_type === "psychosocial_question")
      .map((row) => row.item_id),
  );
  const answeredRows = answerRows.filter((answer) => answer.selected_option_id);
  const correctAnswers = answerRows.filter((answer) => answer.is_correct).length;
  const averageScore =
    completedAttempts.length === 0
      ? 0
      : round(
          completedAttempts.reduce(
            (sum, attempt) => sum + (attempt.percentage ?? 0),
            0,
          ) / completedAttempts.length,
        );
  const averageSimulationMinutes =
    completedAttempts.length === 0
      ? 0
      : round(
          completedAttempts.reduce(
            (sum, attempt) =>
              sum + minutesBetween(attempt.started_at, attempt.completed_at),
            0,
          ) / completedAttempts.length,
        );
  const summary: AnalyticsSummary = {
    completedSimulations: completedAttempts.length,
    averageScore,
    overallAccuracy:
      answeredRows.length === 0
        ? 0
        : round((correctAnswers / answeredRows.length) * 100),
    averageSimulationMinutes,
    completedMaterials: completedMaterialIds.size,
    reviewedFlashcards: reviewedFlashcardIds.size,
    startedPaths: pathSummary.startedPaths,
    completedPaths: pathSummary.completedPaths,
    answeredQuestions: answeredRows.length,
    subjectiveSubmitted: manualStats.subjectiveSubmitted,
    subjectiveReviewed: manualStats.subjectiveReviewed,
    subjectiveAverage: manualStats.subjectiveAverage,
    psychosocialSubmitted: manualStats.psychosocialSubmitted,
    psychosocialReviewed: manualStats.psychosocialReviewed,
    psychosocialAverage: manualStats.psychosocialAverage,
    manualFeedbacksReceived: manualStats.feedbacksReceived,
  };
  const categoryPerformance = buildCategoryPerformance(
    answerRows,
    questions,
    categories,
    reviewedPsychosocialIds.size,
    recommendationContent.psychosocialQuestions.length,
  );
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const todayKey = dateKey(new Date());
  const last7DateSet = new Set(
    buildDailyTimeline(7, todayKey, completedAttempts, progressRows).map(
      (point) => point.dateKey,
    ),
  );
  const weeklyProgress = progressRows.filter(
    (row) => row.completed_at && last7DateSet.has(dateKey(row.completed_at)),
  );
  const weeklyAttempts = completedAttempts.filter(
    (attempt) =>
      attempt.completed_at && last7DateSet.has(dateKey(attempt.completed_at)),
  );
  const weeklyCompletedPathIds = new Set(
    pathSummary.completedPathsWithDates
      .filter(
        (item) =>
          item.latestCompletedAt && last7DateSet.has(dateKey(item.latestCompletedAt)),
      )
      .map((item) => item.path.id),
  );
  const activityDates = [
    ...progressRows
      .map((row) => row.completed_at)
      .filter((value): value is string => Boolean(value))
      .map((value) => dateKey(value)),
    ...completedAttempts
      .map((attempt) => attempt.completed_at)
      .filter((value): value is string => Boolean(value))
      .map((value) => dateKey(value)),
  ];

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaidAccess(profile),
    summary,
    categoryPerformance,
    diagnostics: buildDiagnosticInsights(categoryPerformance),
    recommendations: buildRecommendations(
      categoryPerformance,
      recommendationContent.materials,
      recommendationContent.flashcards,
      categoryById,
      profile,
    ),
    evolution: {
      last7Days: buildDailyTimeline(7, todayKey, completedAttempts, progressRows),
      last30Days: buildDailyTimeline(30, todayKey, completedAttempts, progressRows),
      overall: buildOverallTimeline(completedAttempts, progressRows),
    },
    goals: buildWeeklyGoals({
      materialsCompleted: new Set(
        weeklyProgress
          .filter((row) => row.item_type === "study_material")
          .map((row) => row.item_id),
      ).size,
      flashcardsReviewed: new Set(
        weeklyProgress
          .filter((row) => row.item_type === "flashcard")
          .map((row) => row.item_id),
      ).size,
      pathsCompleted: weeklyCompletedPathIds.size,
      simulationsCompleted: weeklyAttempts.length,
    }),
    streak: calculateStudyStreak(activityDates, todayKey),
    achievements: buildAchievements({
      completedMaterials: summary.completedMaterials,
      completedSimulations: summary.completedSimulations,
      reviewedFlashcards: summary.reviewedFlashcards,
      completedPaths: summary.completedPaths,
      answeredQuestions: summary.answeredQuestions,
      recordStreak: calculateStudyStreak(activityDates, todayKey).recordStreak,
    }),
  };
}
