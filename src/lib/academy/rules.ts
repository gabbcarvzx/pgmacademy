import type { AcademyContentItem } from "@/lib/academy/content";

export type AcademyModuleStatus = "not_started" | "in_progress" | "completed";

export type AcademyModuleProgress = {
  totalContents: number;
  completedContents: number;
  pendingContents: number;
  progressPercent: number;
  status: AcademyModuleStatus;
};

export type AcademyOverallProgress = {
  totalModules: number;
  completedModules: number;
  totalContents: number;
  completedContents: number;
  progressPercent: number;
  completed: boolean;
};

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

export function calculateAcademyModuleProgress(
  contents: AcademyContentItem[],
  completedContentIds: Set<string>,
): AcademyModuleProgress {
  const totalContents = contents.length;
  const completedContents = contents.filter((content) =>
    completedContentIds.has(content.id),
  ).length;
  const pendingContents = Math.max(totalContents - completedContents, 0);
  const progressPercent =
    totalContents === 0
      ? 0
      : clampPercentage((completedContents / totalContents) * 100);
  const status: AcademyModuleStatus =
    completedContents === 0
      ? "not_started"
      : completedContents >= totalContents
        ? "completed"
        : "in_progress";

  return {
    totalContents,
    completedContents,
    pendingContents,
    progressPercent,
    status,
  };
}

export function calculateAcademyOverallProgress(
  modules: AcademyModuleProgress[],
): AcademyOverallProgress {
  const totalModules = modules.length;
  const completedModules = modules.filter(
    (module) => module.status === "completed",
  ).length;
  const totalContents = modules.reduce(
    (sum, module) => sum + module.totalContents,
    0,
  );
  const completedContents = modules.reduce(
    (sum, module) => sum + module.completedContents,
    0,
  );
  const progressPercent =
    totalContents === 0
      ? 0
      : clampPercentage((completedContents / totalContents) * 100);

  return {
    totalModules,
    completedModules,
    totalContents,
    completedContents,
    progressPercent,
    completed: totalModules > 0 && completedModules === totalModules,
  };
}
