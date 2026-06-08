import "server-only";

import { hasPremiumAccess } from "@/lib/access/premium";
import {
  academyModules,
  normalizeAcademyText,
  type AcademyContentItem,
  type AcademyModuleDefinition,
} from "@/lib/academy/content";
import {
  calculateAcademyModuleProgress,
  calculateAcademyOverallProgress,
  type AcademyModuleProgress,
} from "@/lib/academy/rules";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type AccessStatus = Database["public"]["Tables"]["profiles"]["Row"]["access_status"];
type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "tenant_id" | "access_status" | "role"
>;
type LearningItemType =
  Database["public"]["Tables"]["user_learning_progress"]["Row"]["item_type"];
type ProgressRow = Pick<
  Database["public"]["Tables"]["user_learning_progress"]["Row"],
  "path_id" | "item_type" | "item_id" | "completed" | "completed_at"
>;
type LearningPathRow = Pick<
  Database["public"]["Tables"]["learning_paths"]["Row"],
  "id" | "tenant_id" | "title" | "slug" | "language" | "is_active" | "is_premium"
>;
type LearningPathItemRow = Pick<
  Database["public"]["Tables"]["learning_path_items"]["Row"],
  "path_id" | "item_type" | "item_id"
>;
type StudyMaterialRow = Pick<
  Database["public"]["Tables"]["study_materials"]["Row"],
  "id" | "tenant_id" | "title" | "slug" | "language" | "is_active" | "is_premium"
>;
type FlashcardRow = Pick<
  Database["public"]["Tables"]["flashcards"]["Row"],
  "id" | "tenant_id" | "front_content" | "language" | "is_active" | "is_premium"
>;
type AttemptRow = Pick<
  Database["public"]["Tables"]["simulation_attempts"]["Row"],
  "id" | "template_id" | "status" | "completed_at"
>;
type SubjectiveAttemptRow = Pick<
  Database["public"]["Tables"]["subjective_attempts"]["Row"],
  "id" | "status" | "created_at"
>;
type PsychosocialAttemptRow = Pick<
  Database["public"]["Tables"]["psychosocial_attempts"]["Row"],
  "id" | "status" | "created_at"
>;
type OnboardingRow = Pick<
  Database["public"]["Tables"]["student_onboarding"]["Row"],
  "id" | "onboarding_completed" | "idioma" | "objetivo_principal"
>;

export type AcademyContentView = AcademyContentItem & {
  completed: boolean;
  sourceLabel: string | null;
};

export type AcademyModuleView = Omit<AcademyModuleDefinition, "contents"> & {
  progress: AcademyModuleProgress;
  contents: AcademyContentView[];
  nextContent: AcademyContentView | null;
};

export type AcademyDashboardData = {
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  modules: AcademyModuleView[];
  overall: {
    totalModules: number;
    completedModules: number;
    totalContents: number;
    completedContents: number;
    progressPercent: number;
    completed: boolean;
  };
  nextActivity: {
    title: string;
    description: string;
    href: string;
    cta: string;
  };
  stats: {
    completedSimulations: number;
    subjectiveSubmitted: number;
    psychosocialSubmitted: number;
    completedProgressItems: number;
  };
};

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function keywordMatch(text: string, keywords: string[]) {
  const normalizedText = normalizeAcademyText(text);
  return keywords.some((keyword) =>
    normalizedText.includes(normalizeAcademyText(keyword)),
  );
}

function progressKey(
  itemType: LearningItemType,
  itemId: string,
  pathId: string | null,
) {
  return `${pathId ?? "global"}:${itemType}:${itemId}`;
}

async function getProfile(userId: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, access_status, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Perfil do aluno não encontrado.");
  }

  return data as ProfileRow;
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
    throw new Error("Não foi possível consultar progresso da academia.");
  }

  return (data ?? []) as ProgressRow[];
}

async function getLearningPaths(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_paths")
    .select("id, tenant_id, title, slug, language, is_active, is_premium")
    .eq("is_active", true);

  if (error) {
    throw new Error("Não foi possível consultar trilhas da academia.");
  }

  return ((data ?? []) as LearningPathRow[]).filter((path) =>
    isTenantVisible(path.tenant_id, profile),
  );
}

async function getPathItems(pathIds: string[]) {
  if (pathIds.length === 0) return [];
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_path_items")
    .select("path_id, item_type, item_id")
    .in("path_id", pathIds);

  if (error) {
    throw new Error("Não foi possível consultar itens de trilha da academia.");
  }

  return (data ?? []) as LearningPathItemRow[];
}

async function getStudyMaterials(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("study_materials")
    .select("id, tenant_id, title, slug, language, is_active, is_premium")
    .eq("is_active", true);

  if (error) {
    throw new Error("Não foi possível consultar materiais da academia.");
  }

  return ((data ?? []) as StudyMaterialRow[]).filter((material) =>
    isTenantVisible(material.tenant_id, profile),
  );
}

async function getFlashcards(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("flashcards")
    .select("id, tenant_id, front_content, language, is_active, is_premium")
    .eq("is_active", true);

  if (error) {
    throw new Error("Não foi possível consultar flashcards da academia.");
  }

  return ((data ?? []) as FlashcardRow[]).filter((card) =>
    isTenantVisible(card.tenant_id, profile),
  );
}

async function getAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("simulation_attempts")
    .select("id, template_id, status, completed_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Não foi possível consultar simulados da academia.");
  }

  return (data ?? []) as AttemptRow[];
}

async function getSubjectiveAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("subjective_attempts")
    .select("id, status, created_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Não foi possível consultar subjetivas da academia.");
  }

  return (data ?? []) as SubjectiveAttemptRow[];
}

async function getPsychosocialAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("psychosocial_attempts")
    .select("id, status, created_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Não foi possível consultar treinos psicossociais.");
  }

  return (data ?? []) as PsychosocialAttemptRow[];
}

async function getOnboarding(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("student_onboarding")
    .select("id, onboarding_completed, idioma, objetivo_principal")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível consultar onboarding da academia.");
  }

  return (data as OnboardingRow | null) ?? null;
}

function completedPaths(
  paths: LearningPathRow[],
  items: LearningPathItemRow[],
  progressRows: ProgressRow[],
) {
  const completedKeys = new Set(
    progressRows.map((row) => progressKey(row.item_type, row.item_id, row.path_id)),
  );

  return paths.filter((path) => {
    const pathItems = items.filter((item) => item.path_id === path.id);
    if (pathItems.length === 0) return false;
    return pathItems.every((item) =>
      completedKeys.has(progressKey(item.item_type, item.item_id, path.id)),
    );
  });
}

function completedMaterialTitles(
  materials: StudyMaterialRow[],
  progressRows: ProgressRow[],
) {
  const completedMaterialIds = new Set(
    progressRows
      .filter((row) => row.item_type === "study_material")
      .map((row) => row.item_id),
  );

  return materials.filter((material) => completedMaterialIds.has(material.id));
}

function reviewedFlashcards(
  flashcards: FlashcardRow[],
  progressRows: ProgressRow[],
) {
  const reviewedIds = new Set(
    progressRows
      .filter((row) => row.item_type === "flashcard")
      .map((row) => row.item_id),
  );

  return flashcards.filter((card) => reviewedIds.has(card.id));
}

function buildCompletionMap(input: {
  onboarding: OnboardingRow | null;
  paths: LearningPathRow[];
  pathItems: LearningPathItemRow[];
  materials: StudyMaterialRow[];
  flashcards: FlashcardRow[];
  progressRows: ProgressRow[];
  attempts: AttemptRow[];
  subjectiveAttempts: SubjectiveAttemptRow[];
  psychosocialAttempts: PsychosocialAttemptRow[];
}) {
  const completedContentIds = new Set<string>();
  const sourceByContentId = new Map<string, string>();
  const completedPathRows = completedPaths(
    input.paths,
    input.pathItems,
    input.progressRows,
  );
  const completedMaterials = completedMaterialTitles(
    input.materials,
    input.progressRows,
  );
  const reviewedCards = reviewedFlashcards(input.flashcards, input.progressRows);
  const completedSimulationCount = input.attempts.filter(
    (attempt) => attempt.status === "completed",
  ).length;
  const subjectiveCount = input.subjectiveAttempts.length;
  const psychosocialCount = input.psychosocialAttempts.length;

  function mark(content: AcademyContentItem, source: string) {
    completedContentIds.add(content.id);
    sourceByContentId.set(content.id, source);
  }

  for (const academyModule of academyModules) {
    for (const content of academyModule.contents) {
      if (content.type === "onboarding" && input.onboarding?.onboarding_completed) {
        mark(content, "Onboarding premium concluído");
        continue;
      }

      if (
        content.type === "simulation" &&
        completedSimulationCount > 0 &&
        content.matchKeywords.some((keyword) =>
          ["simulado", "questoes", "questões"].includes(normalizeAcademyText(keyword)),
        )
      ) {
        mark(content, `${completedSimulationCount} simulado(s) concluído(s)`);
        continue;
      }

      if (content.type === "subjective" && subjectiveCount > 0) {
        const subjectiveContents = academyModule.contents.filter(
          (item) => item.type === "subjective",
        );
        const index = subjectiveContents.findIndex((item) => item.id === content.id);
        if (index >= 0 && subjectiveCount > index) {
          mark(content, `${subjectiveCount} subjetiva(s) enviada(s)`);
          continue;
        }
      }

      if (content.type === "psychosocial" && psychosocialCount > 0) {
        const psychosocialContents = academyModule.contents.filter(
          (item) => item.type === "psychosocial",
        );
        const index = psychosocialContents.findIndex((item) => item.id === content.id);
        if (index >= 0 && psychosocialCount > index) {
          mark(content, `${psychosocialCount} treino(s) psicossocial(is)`);
          continue;
        }
      }

      const matchingPath = completedPathRows.find((path) =>
        keywordMatch(path.title, content.matchKeywords),
      );
      if (content.type === "path" && matchingPath) {
        mark(content, `Trilha concluída: ${matchingPath.title}`);
        continue;
      }

      const matchingMaterial = completedMaterials.find((material) =>
        keywordMatch(material.title, content.matchKeywords),
      );
      if (content.type === "material" && matchingMaterial) {
        mark(content, `Material concluído: ${matchingMaterial.title}`);
        continue;
      }

      const matchingFlashcard = reviewedCards.find((card) =>
        keywordMatch(`${card.front_content} ${card.language}`, content.matchKeywords),
      );
      if (content.type === "flashcards" && matchingFlashcard) {
        mark(content, "Flashcards revisados");
      }
    }
  }

  return { completedContentIds, sourceByContentId };
}

function buildModules(input: {
  completedContentIds: Set<string>;
  sourceByContentId: Map<string, string>;
}) {
  return academyModules.map((academyModule) => {
    const progress = calculateAcademyModuleProgress(
      academyModule.contents,
      input.completedContentIds,
    );
    const contents = academyModule.contents.map((content) => ({
      ...content,
      completed: input.completedContentIds.has(content.id),
      sourceLabel: input.sourceByContentId.get(content.id) ?? null,
    }));

    return {
      ...academyModule,
      progress,
      contents,
      nextContent: contents.find((content) => !content.completed) ?? null,
    } satisfies AcademyModuleView;
  });
}

function chooseNextActivity(input: {
  hasPaidAccess: boolean;
  onboarding: OnboardingRow | null;
  modules: AcademyModuleView[];
  completedSimulations: number;
}) {
  if (!input.hasPaidAccess) {
    return {
      title: "Desbloquear a Academia PGM",
      description:
        "Ative o premium para seguir a jornada completa de preparação.",
      href: "/planos",
      cta: "Ver planos",
    };
  }

  if (!input.onboarding?.onboarding_completed) {
    return {
      title: "Concluir onboarding premium",
      description: "Gere seu Plano de Aprovação antes de avançar na Academia.",
      href: "/onboarding",
      cta: "Abrir onboarding",
    };
  }

  const currentModule = input.modules.find(
    (academyModule) => academyModule.progress.status !== "completed",
  );

  if (input.completedSimulations === 0) {
    return {
      title: "Realizar Simulado Oficial PGM",
      description:
        "O primeiro simulado ajuda a calibrar as próximas recomendações da Academia.",
      href: "/simulados",
      cta: "Abrir simulados",
    };
  }

  if (currentModule?.nextContent) {
    return {
      title: currentModule.nextContent.title,
      description: `Continuar módulo: ${currentModule.title}.`,
      href: currentModule.nextContent.href,
      cta: "Continuar estudando",
    };
  }

  return {
    title: "Revisar relatório e manter ritmo",
    description:
      "A Academia foi concluída. Use analytics e simulados para manutenção.",
    href: "/analytics",
    cta: "Ver analytics",
  };
}

export async function getAcademyDashboard(
  userId: string,
): Promise<AcademyDashboardData> {
  const profile = await getProfile(userId);
  const [
    progressRows,
    paths,
    materials,
    flashcards,
    attempts,
    subjectiveAttempts,
    psychosocialAttempts,
    onboarding,
  ] = await Promise.all([
    getProgressRows(userId, profile),
    getLearningPaths(profile),
    getStudyMaterials(profile),
    getFlashcards(profile),
    getAttempts(userId, profile),
    getSubjectiveAttempts(userId, profile),
    getPsychosocialAttempts(userId, profile),
    getOnboarding(userId, profile),
  ]);
  const pathItems = await getPathItems(paths.map((path) => path.id));
  const completion = buildCompletionMap({
    onboarding,
    paths,
    pathItems,
    materials,
    flashcards,
    progressRows,
    attempts,
    subjectiveAttempts,
    psychosocialAttempts,
  });
  const modules = buildModules(completion);
  const overall = calculateAcademyOverallProgress(
    modules.map((academyModule) => academyModule.progress),
  );
  const completedSimulations = attempts.filter(
    (attempt) => attempt.status === "completed",
  ).length;

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPremiumAccess(profile),
    modules,
    overall,
    nextActivity: chooseNextActivity({
      hasPaidAccess: hasPremiumAccess(profile),
      onboarding,
      modules,
      completedSimulations,
    }),
    stats: {
      completedSimulations,
      subjectiveSubmitted: subjectiveAttempts.length,
      psychosocialSubmitted: psychosocialAttempts.length,
      completedProgressItems: new Set(
        progressRows.map((row) =>
          progressKey(row.item_type, row.item_id, row.path_id),
        ),
      ).size,
    },
  };
}
