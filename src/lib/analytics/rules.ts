export type CategoryRuleInput = {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  kind?: "objective" | "progress";
};

export type DiagnosticInsight = {
  id: string;
  type: "strength" | "weakness" | "attention" | "progress";
  title: string;
  description: string;
  categoryName: string;
  percentage: number;
};

export type WeeklyActivityInput = {
  materialsCompleted: number;
  flashcardsReviewed: number;
  pathsCompleted: number;
  simulationsCompleted: number;
};

export type GoalProgress = {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  percentage: number;
  completed: boolean;
};

export type AchievementProgress = {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
};

export type AchievementInput = {
  completedMaterials: number;
  completedSimulations: number;
  reviewedFlashcards: number;
  completedPaths: number;
  answeredQuestions: number;
  recordStreak: number;
};

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(value), 0), 100);
}

function buildProgressGoal(
  id: string,
  title: string,
  description: string,
  target: number,
  progress: number,
): GoalProgress {
  return {
    id,
    title,
    description,
    target,
    progress,
    percentage: target === 0 ? 100 : clampPercentage((progress / target) * 100),
    completed: progress >= target,
  };
}

function buildAchievement(
  id: string,
  title: string,
  description: string,
  target: number,
  progress: number,
): AchievementProgress {
  return {
    id,
    title,
    description,
    target,
    progress,
    completed: progress >= target,
  };
}

export function buildDiagnosticInsights(
  categories: CategoryRuleInput[],
): DiagnosticInsight[] {
  return categories
    .filter((category) => category.totalQuestions > 0)
    .map((category) => {
      if (category.kind === "progress") {
        return {
          id: `${category.categoryId}:progress`,
          type: category.percentage >= 60 ? "progress" : "attention",
          title:
            category.percentage >= 60
              ? `${category.categoryName} esta em evolucao`
              : `Reforce ${category.categoryName}`,
          description:
            category.percentage >= 60
              ? `Voce ja avancou ${category.percentage}% nessa frente.`
              : `Voce ainda tem pouco progresso em ${category.categoryName}.`,
          categoryName: category.categoryName,
          percentage: category.percentage,
        } satisfies DiagnosticInsight;
      }

      if (category.percentage < 60) {
        return {
          id: `${category.categoryId}:weakness`,
          type: "weakness",
          title: `Voce precisa reforcar ${category.categoryName}.`,
          description: `${category.correctAnswers} acertos e ${category.incorrectAnswers} erros indicam prioridade de revisao.`,
          categoryName: category.categoryName,
          percentage: category.percentage,
        } satisfies DiagnosticInsight;
      }

      if (category.percentage >= 80) {
        return {
          id: `${category.categoryId}:strength`,
          type: "strength",
          title: `${category.categoryName} e um dos seus pontos fortes.`,
          description: `Seu desempenho de ${category.percentage}% mostra boa consistencia nessa categoria.`,
          categoryName: category.categoryName,
          percentage: category.percentage,
        } satisfies DiagnosticInsight;
      }

      return {
        id: `${category.categoryId}:attention`,
        type: "attention",
        title: `${category.categoryName} esta em zona de atencao.`,
        description: `Com ${category.percentage}%, essa categoria pode subir com revisao dirigida.`,
        categoryName: category.categoryName,
        percentage: category.percentage,
      } satisfies DiagnosticInsight;
    })
    .sort((a, b) => {
      const priority = { weakness: 0, attention: 1, progress: 2, strength: 3 };
      return priority[a.type] - priority[b.type] || a.percentage - b.percentage;
    });
}

export function buildWeeklyGoals(activity: WeeklyActivityInput): GoalProgress[] {
  return [
    buildProgressGoal(
      "materials-weekly",
      "Completar 3 materiais",
      "Meta semanal para manter contato com teoria.",
      3,
      activity.materialsCompleted,
    ),
    buildProgressGoal(
      "flashcards-weekly",
      "Revisar 20 flashcards",
      "Meta semanal para fixar vocabulario e conceitos.",
      20,
      activity.flashcardsReviewed,
    ),
    buildProgressGoal(
      "path-weekly",
      "Concluir 1 trilha",
      "Meta semanal para fechar uma sequencia pedagogica.",
      1,
      activity.pathsCompleted,
    ),
    buildProgressGoal(
      "simulation-weekly",
      "Realizar 1 simulado",
      "Meta semanal para medir desempenho real.",
      1,
      activity.simulationsCompleted,
    ),
  ];
}

export function buildAchievements(
  input: AchievementInput,
): AchievementProgress[] {
  return [
    buildAchievement(
      "first-material",
      "Primeiro Material",
      "Conclua seu primeiro material de estudo.",
      1,
      input.completedMaterials,
    ),
    buildAchievement(
      "first-simulation",
      "Primeiro Simulado",
      "Finalize seu primeiro simulado objetivo.",
      1,
      input.completedSimulations,
    ),
    buildAchievement(
      "ten-flashcards",
      "10 Flashcards Revisados",
      "Revise 10 flashcards para acelerar memorizacao.",
      10,
      input.reviewedFlashcards,
    ),
    buildAchievement(
      "first-path",
      "Primeira Trilha Concluida",
      "Conclua uma trilha de aprendizagem.",
      1,
      input.completedPaths,
    ),
    buildAchievement(
      "fifty-questions",
      "50 Questoes Respondidas",
      "Responda 50 questoes em simulados.",
      50,
      input.answeredQuestions,
    ),
    buildAchievement(
      "hundred-questions",
      "100 Questoes Respondidas",
      "Responda 100 questoes em simulados.",
      100,
      input.answeredQuestions,
    ),
    buildAchievement(
      "dedicated-student",
      "Aluno Dedicado",
      "Some 20 atividades entre materiais, flashcards e simulados.",
      20,
      input.completedMaterials +
        input.reviewedFlashcards +
        input.completedSimulations,
    ),
    buildAchievement(
      "seven-day-streak",
      "7 Dias Consecutivos",
      "Mantenha uma sequencia de 7 dias de estudo.",
      7,
      input.recordStreak,
    ),
  ];
}

export function calculateStudyStreak(dateKeys: string[], todayKey: string) {
  const uniqueDates = [...new Set(dateKeys)].sort();
  const uniqueSet = new Set(uniqueDates);
  const today = new Date(`${todayKey}T00:00:00.000Z`);

  function addDays(date: Date, amount: number) {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + amount);
    return next;
  }

  function keyFromDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  let recordStreak = 0;
  let runningStreak = 0;
  let previousKey: string | null = null;

  for (const key of uniqueDates) {
    if (!previousKey) {
      runningStreak = 1;
    } else {
      const previousDate = new Date(`${previousKey}T00:00:00.000Z`);
      const expected = keyFromDate(addDays(previousDate, 1));
      runningStreak = key === expected ? runningStreak + 1 : 1;
    }

    recordStreak = Math.max(recordStreak, runningStreak);
    previousKey = key;
  }

  let currentStreak = 0;
  let cursor = today;
  const yesterdayKey = keyFromDate(addDays(today, -1));

  if (!uniqueSet.has(todayKey) && uniqueSet.has(yesterdayKey)) {
    cursor = addDays(today, -1);
  }

  while (uniqueSet.has(keyFromDate(cursor))) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    currentStreak,
    recordStreak,
    lastStudyDate: uniqueDates.at(-1) ?? null,
  };
}
