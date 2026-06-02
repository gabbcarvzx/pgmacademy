export type ObjectiveAnswerInput = {
  questionId: string;
  categoryId: string | null;
  categoryName: string;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  points?: number;
};

export type CategoryPerformance = {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
};

export type ObjectiveScoreResult = {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
  byCategory: CategoryPerformance[];
  strongCategories: CategoryPerformance[];
  weakCategories: CategoryPerformance[];
};

export type AttemptHistoryInput = {
  percentage: number | null;
  status: "started" | "completed" | "abandoned";
};

export type AttemptHistorySummary = {
  totalAttempts: number;
  completedAttempts: number;
  averagePercentage: number;
  bestPercentage: number;
  lastPercentage: number | null;
};

const uncategorizedId = "uncategorized";
const uncategorizedName = "Sem categoria";

function roundPercentage(value: number) {
  return Number(value.toFixed(2));
}

function normalizePoints(points: number | undefined) {
  if (points === undefined) {
    return 1;
  }

  return Math.max(points, 0);
}

export function calculateObjectiveScore(
  answers: ObjectiveAnswerInput[],
): ObjectiveScoreResult {
  const categoryMap = new Map<string, CategoryPerformance>();

  let answeredQuestions = 0;
  let correctAnswers = 0;
  let score = 0;
  let maxScore = 0;

  for (const answer of answers) {
    const points = normalizePoints(answer.points);
    const isAnswered = Boolean(answer.selectedOptionId);
    const isCorrect =
      isAnswered && answer.selectedOptionId === answer.correctOptionId;
    const categoryId = answer.categoryId ?? uncategorizedId;
    const categoryName = answer.categoryName || uncategorizedName;

    answeredQuestions += isAnswered ? 1 : 0;
    correctAnswers += isCorrect ? 1 : 0;
    score += isCorrect ? points : 0;
    maxScore += points;

    const current = categoryMap.get(categoryId) ?? {
      categoryId,
      categoryName,
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      score: 0,
      maxScore: 0,
      percentage: 0,
    };

    current.totalQuestions += 1;
    current.correctAnswers += isCorrect ? 1 : 0;
    current.incorrectAnswers += isCorrect ? 0 : 1;
    current.score += isCorrect ? points : 0;
    current.maxScore += points;
    current.percentage =
      current.maxScore === 0
        ? 0
        : roundPercentage((current.score / current.maxScore) * 100);

    categoryMap.set(categoryId, current);
  }

  const byCategory = Array.from(categoryMap.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName),
  );

  return {
    totalQuestions: answers.length,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers: answers.length - correctAnswers,
    score,
    maxScore,
    percentage: maxScore === 0 ? 0 : roundPercentage((score / maxScore) * 100),
    byCategory,
    strongCategories: byCategory.filter((category) => category.percentage >= 75),
    weakCategories: byCategory.filter((category) => category.percentage < 60),
  };
}

export function summarizeAttemptHistory(
  attempts: AttemptHistoryInput[],
): AttemptHistorySummary {
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed" && attempt.percentage !== null,
  );
  const percentages = completedAttempts.map((attempt) => attempt.percentage ?? 0);
  const totalPercentage = percentages.reduce((sum, value) => sum + value, 0);

  return {
    totalAttempts: attempts.length,
    completedAttempts: completedAttempts.length,
    averagePercentage:
      percentages.length === 0
        ? 0
        : roundPercentage(totalPercentage / percentages.length),
    bestPercentage: percentages.length === 0 ? 0 : Math.max(...percentages),
    lastPercentage: percentages.at(0) ?? null,
  };
}
