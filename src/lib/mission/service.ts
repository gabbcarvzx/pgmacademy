import "server-only";

import { hasPremiumAccess } from "@/lib/access/premium";
import { getAnalyticsDashboard } from "@/lib/analytics/service";
import { officialSubjectiveSimulation } from "@/lib/simulations/official-pgm";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/types/database";
import {
  buildAutomaticApprovalPlan,
  buildDailyMission,
  calculatePreparationProgress,
  chooseNextAction,
  onboardingLabels,
  type ApprovalPlanWeek,
  type DailyMissionTask,
  type OnboardingInput,
  type OnboardingLanguage,
  type OnboardingMainGoal,
  type OnboardingSchoolYear,
  type OnboardingStudyTime,
  type PlanContentTarget,
  type PreparationComponent,
} from "@/lib/mission/rules";

type AccessStatus = Database["public"]["Tables"]["profiles"]["Row"]["access_status"];
type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "tenant_id" | "access_status" | "role" | "full_name"
>;
type StudentOnboardingRow =
  Database["public"]["Tables"]["student_onboarding"]["Row"];
type LearningPathRow = Pick<
  Database["public"]["Tables"]["learning_paths"]["Row"],
  "id" | "tenant_id" | "title" | "slug" | "language" | "is_active" | "is_premium"
>;
type LearningPathItemRow = Pick<
  Database["public"]["Tables"]["learning_path_items"]["Row"],
  "path_id" | "item_type" | "item_id"
>;
type ProgressRow = Pick<
  Database["public"]["Tables"]["user_learning_progress"]["Row"],
  "path_id" | "item_type" | "item_id" | "completed" | "completed_at"
>;
type SimulationTemplateRow = Pick<
  Database["public"]["Tables"]["simulation_templates"]["Row"],
  "id" | "tenant_id" | "is_active" | "is_premium"
>;
type SimulationAttemptRow = Pick<
  Database["public"]["Tables"]["simulation_attempts"]["Row"],
  "id" | "template_id" | "status" | "completed_at"
>;
type SimulationAnswerRow = Pick<
  Database["public"]["Tables"]["simulation_answers"]["Row"],
  "attempt_id" | "selected_option_id"
>;
type SubjectiveAttemptRow = Pick<
  Database["public"]["Tables"]["subjective_attempts"]["Row"],
  "id" | "status" | "created_at"
>;
type EligibilityAssessmentRow = Pick<
  Database["public"]["Tables"]["eligibility_assessments"]["Row"],
  "status" | "readiness_score" | "created_at"
>;
type SubscriptionRow = Pick<
  Database["public"]["Tables"]["subscriptions"]["Row"],
  "status"
>;

export type OnboardingStatus = {
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  onboardingCompleted: boolean;
  requiresOnboarding: boolean;
  onboarding: StudentOnboardingRow | null;
};

export type MissionDashboardData = {
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  requiresOnboarding: boolean;
  studentName: string;
  onboarding: StudentOnboardingRow | null;
  onboardingSummary: Array<{ label: string; value: string }>;
  approvalPlan: ApprovalPlanWeek[];
  dailyMission: {
    percentage: number;
    tasks: DailyMissionTask[];
  };
  nextAction: {
    title: string;
    description: string;
    href: string;
    cta: string;
  };
  preparation: {
    percentage: number;
    components: PreparationComponent[];
  };
  recommendations: Array<{
    title: string;
    description: string;
    href: string;
  }>;
  stats: {
    completedSimulations: number;
    completedPaths: number;
    completedMaterials: number;
    reviewedFlashcards: number;
    subjectiveSubmitted: number;
    currentStreak: number;
  };
  latestAssessment: EligibilityAssessmentRow | null;
  subscription: SubscriptionRow | null;
};

const saoPauloTimeZone = "America/Sao_Paulo";

function dateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: saoPauloTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function assertProfile(
  data: ProfileRow | null,
  error: { message: string } | null,
) {
  if (error || !data) {
    throw new Error("Perfil do aluno não encontrado.");
  }

  return data;
}

function parseApprovalPlan(value: Json): ApprovalPlanWeek[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((week): week is ApprovalPlanWeek => {
    return (
      typeof week === "object" &&
      week !== null &&
      "week" in week &&
      "tasks" in week &&
      Array.isArray((week as { tasks?: unknown }).tasks)
    );
  });
}

function onboardingToInput(row: StudentOnboardingRow | null): OnboardingInput | null {
  if (!row) return null;

  return {
    idioma: row.idioma,
    anoEscolar: row.ano_escolar,
    tempoDisponivel: row.tempo_disponivel,
    jaParticipouPgm: row.ja_participou_pgm,
    objetivoPrincipal: row.objetivo_principal,
  };
}

function buildOnboardingSummary(row: StudentOnboardingRow | null) {
  if (!row) {
    return [];
  }

  return [
    { label: "Idioma", value: onboardingLabels.idioma[row.idioma] },
    { label: "Ano escolar", value: onboardingLabels.anoEscolar[row.ano_escolar] },
    {
      label: "Tempo diário",
      value: onboardingLabels.tempoDisponivel[row.tempo_disponivel],
    },
    {
      label: "PGM anterior",
      value: row.ja_participou_pgm ? "Já participou" : "Primeira participação",
    },
    {
      label: "Objetivo",
      value: onboardingLabels.objetivoPrincipal[row.objetivo_principal],
    },
  ];
}

async function getProfile(userId: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, access_status, role, full_name")
    .eq("id", userId)
    .single();

  return assertProfile(data as ProfileRow | null, error);
}

async function getStudentOnboarding(
  userId: string,
  profile: ProfileRow,
): Promise<StudentOnboardingRow | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("student_onboarding")
    .select(
      "id, tenant_id, user_id, idioma, ano_escolar, tempo_disponivel, ja_participou_pgm, objetivo_principal, onboarding_completed, plan_version, plan, created_at, updated_at",
    )
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível consultar onboarding do aluno.");
  }

  return (data as StudentOnboardingRow | null) ?? null;
}

async function getVisiblePaths(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_paths")
    .select("id, tenant_id, title, slug, language, is_active, is_premium")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    throw new Error("Não foi possível consultar trilhas.");
  }

  return ((data ?? []) as LearningPathRow[]).filter(
    (path) => isTenantVisible(path.tenant_id, profile) && Boolean(path.slug),
  ) as Array<LearningPathRow & { slug: string }>;
}

async function getPathItems(pathIds: string[]) {
  if (pathIds.length === 0) return [];
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_path_items")
    .select("path_id, item_type, item_id")
    .in("path_id", pathIds);

  if (error) {
    throw new Error("Não foi possível consultar itens de trilha.");
  }

  return (data ?? []) as LearningPathItemRow[];
}

async function getProgressRows(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("user_learning_progress")
    .select("path_id, item_type, item_id, completed, completed_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    throw new Error("Não foi possível consultar progresso.");
  }

  return (data ?? []) as ProgressRow[];
}

async function getSimulationTemplates(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_templates")
    .select("id, tenant_id, is_active, is_premium")
    .eq("is_active", true);

  if (error) {
    throw new Error("Não foi possível consultar templates de simulado.");
  }

  return ((data ?? []) as SimulationTemplateRow[]).filter((template) =>
    isTenantVisible(template.tenant_id, profile),
  );
}

async function getSimulationAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_attempts")
    .select("id, template_id, status, completed_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Não foi possível consultar tentativas de simulado.");
  }

  return (data ?? []) as SimulationAttemptRow[];
}

async function getSimulationAnswers(attemptIds: string[]) {
  if (attemptIds.length === 0) return [];
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_answers")
    .select("attempt_id, selected_option_id")
    .in("attempt_id", attemptIds);

  if (error) {
    throw new Error("Não foi possível consultar respostas do simulado.");
  }

  return (data ?? []) as SimulationAnswerRow[];
}

async function getSubjectiveAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("subjective_attempts")
    .select("id, status, created_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Não foi possível consultar subjetivas.");
  }

  return (data ?? []) as SubjectiveAttemptRow[];
}

async function getLatestAssessment(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("eligibility_assessments")
    .select("status, readiness_score, created_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível consultar diagnóstico.");
  }

  return (data as EligibilityAssessmentRow | null) ?? null;
}

async function getLatestSubscription(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("status")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível consultar pagamento.");
  }

  return (data as SubscriptionRow | null) ?? null;
}

function summarizePathCompletion(
  paths: Array<LearningPathRow & { slug: string }>,
  pathItems: LearningPathItemRow[],
  progressRows: ProgressRow[],
) {
  const completedKeys = new Set(
    progressRows.map(
      (row) => `${row.path_id ?? "global"}:${row.item_type}:${row.item_id}`,
    ),
  );
  const pathSummaries = paths.map((path) => {
    const items = pathItems.filter((item) => item.path_id === path.id);
    const completedItems = items.filter((item) =>
      completedKeys.has(`${path.id}:${item.item_type}:${item.item_id}`),
    ).length;

    return {
      path,
      itemCount: items.length,
      completedItems,
      completed: items.length > 0 && completedItems === items.length,
    };
  });

  return {
    completedPaths: pathSummaries.filter((path) => path.completed).length,
    firstIncompletePath:
      pathSummaries.find((path) => !path.completed)?.path ?? paths[0] ?? null,
  };
}

function buildPlanTargets(
  paths: Array<LearningPathRow & { slug: string }>,
): PlanContentTarget[] {
  return paths.map((path) => ({
    title: path.title,
    href: `/trilhas/${path.slug}`,
    language: path.language,
  }));
}

function buildRecommendations(
  analytics: Awaited<ReturnType<typeof getAnalyticsDashboard>>,
  completedSimulations: number,
  subjectiveSubmitted: number,
) {
  const recommendations: MissionDashboardData["recommendations"] = [];

  if (completedSimulations === 0) {
    recommendations.push({
      title: "Realizar o Simulado Oficial PGM",
      description: "Primeiro relatório objetivo para identificar categorias fracas.",
      href: "/simulados",
    });
  }

  if (subjectiveSubmitted === 0) {
    recommendations.push({
      title: "Fazer o Simulado Subjetivo Oficial",
      description: "Treine escrita com limite oficial de 90 a 150 palavras.",
      href: "/simulados/subjetivo-oficial",
    });
  }

  for (const recommendation of analytics.recommendations.slice(0, 3)) {
    const material = recommendation.materials.find((item) => item.canAccess);
    const deck = recommendation.flashcards.find((item) => item.canAccess);
    recommendations.push({
      title: `Reforçar ${recommendation.categoryName}`,
      description: recommendation.reason,
      href: material?.href ?? deck?.href ?? "/analytics",
    });
  }

  return recommendations.slice(0, 4);
}

function weakRecommendationFromAnalytics(
  analytics: Awaited<ReturnType<typeof getAnalyticsDashboard>>,
) {
  const recommendation = analytics.recommendations[0];
  if (!recommendation) return null;

  const material = recommendation.materials.find((item) => item.canAccess);
  const deck = recommendation.flashcards.find((item) => item.canAccess);

  return {
    title: `Reforçar ${recommendation.categoryName}`,
    href: material?.href ?? deck?.href ?? "/analytics",
  };
}

export async function getOnboardingStatus(
  userId: string,
): Promise<OnboardingStatus> {
  const profile = await getProfile(userId);
  const onboarding = await getStudentOnboarding(userId, profile);
  const hasPaid = hasPremiumAccess(profile);
  const onboardingCompleted = Boolean(onboarding?.onboarding_completed);

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaid,
    onboardingCompleted,
    requiresOnboarding: hasPaid && !onboardingCompleted,
    onboarding,
  };
}

export async function saveStudentOnboarding(
  userId: string,
  input: OnboardingInput,
) {
  const profile = await getProfile(userId);

  if (!hasPremiumAccess(profile)) {
    throw new Error("Onboarding premium exige acesso premium ativo.");
  }

  const paths = await getVisiblePaths(profile);
  const plan = buildAutomaticApprovalPlan(input, buildPlanTargets(paths));
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("student_onboarding").upsert(
    {
      tenant_id: profile.tenant_id,
      user_id: userId,
      idioma: input.idioma,
      ano_escolar: input.anoEscolar,
      tempo_disponivel: input.tempoDisponivel,
      ja_participou_pgm: input.jaParticipouPgm,
      objetivo_principal: input.objetivoPrincipal,
      onboarding_completed: true,
      plan_version: "pgm-2026-v1",
      plan: plan as unknown as Json,
    },
    { onConflict: "tenant_id,user_id" },
  );

  if (error) {
    throw new Error("Não foi possível salvar onboarding premium.");
  }
}

export async function getMissionDashboard(
  userId: string,
): Promise<MissionDashboardData> {
  const profile = await getProfile(userId);
  const [
    onboarding,
    analytics,
    paths,
    progressRows,
    templates,
    attempts,
    subjectiveAttempts,
    latestAssessment,
    subscription,
  ] = await Promise.all([
    getStudentOnboarding(userId, profile),
    getAnalyticsDashboard(userId),
    getVisiblePaths(profile),
    getProgressRows(userId, profile),
    getSimulationTemplates(profile),
    getSimulationAttempts(userId, profile),
    getSubjectiveAttempts(userId, profile),
    getLatestAssessment(userId, profile),
    getLatestSubscription(userId, profile),
  ]);
  const pathItems = await getPathItems(paths.map((path) => path.id));
  const pathSummary = summarizePathCompletion(paths, pathItems, progressRows);
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed",
  );
  const completedTemplateIds = new Set(
    completedAttempts
      .map((attempt) => attempt.template_id)
      .filter((templateId): templateId is string => Boolean(templateId)),
  );
  const todayKey = dateKey(new Date());
  const todaysAttemptIds = completedAttempts
    .filter(
      (attempt) =>
        attempt.completed_at && dateKey(attempt.completed_at) === todayKey,
    )
    .map((attempt) => attempt.id);
  const todaysAnswers = await getSimulationAnswers(todaysAttemptIds);
  const todaysProgress = progressRows.filter(
    (row) => row.completed_at && dateKey(row.completed_at) === todayKey,
  );
  const todaysSubjective = subjectiveAttempts.filter(
    (attempt) => dateKey(attempt.created_at) === todayKey,
  );
  const onboardingInput = onboardingToInput(onboarding);
  const preferredLessonHref = pathSummary.firstIncompletePath
    ? `/trilhas/${pathSummary.firstIncompletePath.slug}`
    : "/estudos";
  const dailyMission = buildDailyMission(onboardingInput, {
    answeredQuestionsToday: todaysAnswers.filter(
      (answer) => answer.selected_option_id,
    ).length,
    reviewedFlashcardsToday: todaysProgress.filter(
      (row) => row.item_type === "flashcard",
    ).length,
    subjectiveSubmittedToday: todaysSubjective.length,
    completedLessonsToday: todaysProgress.filter(
      (row) => row.item_type === "study_material",
    ).length,
    preferredLessonHref,
  });
  const preparation = calculatePreparationProgress({
    completedPaths: pathSummary.completedPaths,
    totalPaths: paths.length,
    completedSimulationTemplates: completedTemplateIds.size,
    totalSimulationTemplates: templates.length,
    subjectiveSubmitted: subjectiveAttempts.length,
    targetSubjectiveAnswers: officialSubjectiveSimulation.questionCount,
    completedProgressItems: new Set(
      progressRows.map(
        (row) => `${row.path_id ?? "global"}:${row.item_type}:${row.item_id}`,
      ),
    ).size,
    totalProgressItems: pathItems.length,
  });
  const hasPaid = hasPremiumAccess(profile);
  const onboardingCompleted = Boolean(onboarding?.onboarding_completed);
  const recommendations = buildRecommendations(
    analytics,
    analytics.summary.completedSimulations,
    analytics.summary.subjectiveSubmitted,
  );

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaid,
    requiresOnboarding: hasPaid && !onboardingCompleted,
    studentName: profile.full_name ?? "Aluno PGM",
    onboarding,
    onboardingSummary: buildOnboardingSummary(onboarding),
    approvalPlan: onboarding
      ? parseApprovalPlan(onboarding.plan)
      : buildAutomaticApprovalPlan(
          {
            idioma: "english",
            anoEscolar: "first",
            tempoDisponivel: "30m",
            jaParticipouPgm: false,
            objetivoPrincipal: "pass_exam",
          },
          buildPlanTargets(paths),
        ),
    dailyMission,
    nextAction: chooseNextAction({
      hasPaidAccess: hasPaid,
      onboardingCompleted,
      hasDiagnostic: Boolean(latestAssessment),
      completedSimulations: analytics.summary.completedSimulations,
      subjectiveSubmitted: analytics.summary.subjectiveSubmitted,
      weakRecommendation: weakRecommendationFromAnalytics(analytics),
      completedPaths: analytics.summary.completedPaths,
    }),
    preparation,
    recommendations,
    stats: {
      completedSimulations: analytics.summary.completedSimulations,
      completedPaths: analytics.summary.completedPaths,
      completedMaterials: analytics.summary.completedMaterials,
      reviewedFlashcards: analytics.summary.reviewedFlashcards,
      subjectiveSubmitted: analytics.summary.subjectiveSubmitted,
      currentStreak: analytics.streak.currentStreak,
    },
    latestAssessment,
    subscription,
  };
}

export function normalizeOnboardingInput(formData: FormData): OnboardingInput {
  const idioma = String(formData.get("idioma") ?? "");
  const anoEscolar = String(formData.get("ano_escolar") ?? "");
  const tempoDisponivel = String(formData.get("tempo_disponivel") ?? "");
  const objetivoPrincipal = String(formData.get("objetivo_principal") ?? "");
  const jaParticipouPgm = String(formData.get("ja_participou_pgm") ?? "") === "yes";

  if (idioma !== "english" && idioma !== "spanish") {
    throw new Error("Escolha Inglês ou Espanhol.");
  }
  if (!["first", "second", "third"].includes(anoEscolar)) {
    throw new Error("Escolha o ano escolar.");
  }
  if (!["15m", "30m", "1h", "2h_plus"].includes(tempoDisponivel)) {
    throw new Error("Escolha o tempo disponível por dia.");
  }
  if (
    ![
      "improve_english",
      "improve_spanish",
      "pass_exam",
      "improve_writing",
      "improve_interview",
    ].includes(objetivoPrincipal)
  ) {
    throw new Error("Escolha o objetivo principal.");
  }

  return {
    idioma: idioma as OnboardingLanguage,
    anoEscolar: anoEscolar as OnboardingSchoolYear,
    tempoDisponivel: tempoDisponivel as OnboardingStudyTime,
    jaParticipouPgm,
    objetivoPrincipal: objetivoPrincipal as OnboardingMainGoal,
  };
}
