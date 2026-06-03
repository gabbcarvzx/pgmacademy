import assert from "node:assert/strict";

import {
  buildAchievements,
  buildDiagnosticInsights,
  buildWeeklyGoals,
  calculateStudyStreak,
} from "../src/lib/analytics/rules";

const insights = buildDiagnosticInsights([
  {
    categoryId: "grammar",
    categoryName: "Grammar",
    totalQuestions: 10,
    correctAnswers: 5,
    incorrectAnswers: 5,
    percentage: 50,
  },
  {
    categoryId: "reading",
    categoryName: "Reading",
    totalQuestions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    percentage: 90,
  },
  {
    categoryId: "psychosocial",
    categoryName: "Psychosocial",
    totalQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    percentage: 70,
    kind: "progress",
  },
]);

assert.equal(insights[0].type, "weakness");
assert.equal(insights[0].categoryName, "Grammar");
assert.equal(insights.some((item) => item.type === "strength"), true);
assert.equal(insights.some((item) => item.type === "progress"), true);

const goals = buildWeeklyGoals({
  materialsCompleted: 2,
  flashcardsReviewed: 20,
  pathsCompleted: 0,
  simulationsCompleted: 1,
});

assert.equal(goals.find((goal) => goal.id === "flashcards-weekly")?.completed, true);
assert.equal(goals.find((goal) => goal.id === "materials-weekly")?.percentage, 67);
assert.equal(goals.find((goal) => goal.id === "simulation-weekly")?.completed, true);

const achievements = buildAchievements({
  completedMaterials: 1,
  completedSimulations: 1,
  reviewedFlashcards: 10,
  completedPaths: 0,
  answeredQuestions: 55,
  recordStreak: 7,
});

assert.equal(achievements.find((item) => item.id === "first-material")?.completed, true);
assert.equal(achievements.find((item) => item.id === "first-path")?.completed, false);
assert.equal(achievements.find((item) => item.id === "fifty-questions")?.completed, true);
assert.equal(achievements.find((item) => item.id === "seven-day-streak")?.completed, true);

const streak = calculateStudyStreak(
  ["2026-05-29", "2026-05-30", "2026-05-31", "2026-06-01"],
  "2026-06-02",
);

assert.equal(streak.currentStreak, 4);
assert.equal(streak.recordStreak, 4);
assert.equal(streak.lastStudyDate, "2026-06-01");

console.log("Analytics rules passed");
