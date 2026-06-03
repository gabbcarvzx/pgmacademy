import assert from "node:assert/strict";

import { buildTemplateAccessList } from "../src/lib/simulations/catalog";
import {
  calculateObjectiveScore,
  summarizeAttemptHistory,
} from "../src/lib/simulations/scoring";

const score = calculateObjectiveScore([
  {
    questionId: "q1",
    categoryId: "grammar",
    categoryName: "Grammar",
    selectedOptionId: "a",
    correctOptionId: "a",
    points: 2,
  },
  {
    questionId: "q2",
    categoryId: "grammar",
    categoryName: "Grammar",
    selectedOptionId: "b",
    correctOptionId: "c",
    points: 2,
  },
  {
    questionId: "q3",
    categoryId: "vocabulary",
    categoryName: "Vocabulary",
    selectedOptionId: null,
    correctOptionId: "d",
  },
]);

assert.equal(score.totalQuestions, 3);
assert.equal(score.answeredQuestions, 2);
assert.equal(score.correctAnswers, 1);
assert.equal(score.incorrectAnswers, 2);
assert.equal(score.score, 2);
assert.equal(score.maxScore, 5);
assert.equal(score.percentage, 40);
assert.deepEqual(
  score.byCategory.map((category) => ({
    categoryName: category.categoryName,
    percentage: category.percentage,
  })),
  [
    { categoryName: "Grammar", percentage: 50 },
    { categoryName: "Vocabulary", percentage: 0 },
  ],
);
assert.equal(score.strongCategories.length, 0);
assert.deepEqual(
  score.weakCategories.map((category) => category.categoryName),
  ["Grammar", "Vocabulary"],
);

const emptyScore = calculateObjectiveScore([]);

assert.equal(emptyScore.percentage, 0);
assert.equal(emptyScore.score, 0);
assert.equal(emptyScore.maxScore, 0);

const history = summarizeAttemptHistory([
  { status: "completed", percentage: 80 },
  { status: "completed", percentage: 60 },
  { status: "started", percentage: null },
]);

assert.equal(history.totalAttempts, 3);
assert.equal(history.completedAttempts, 2);
assert.equal(history.averagePercentage, 70);
assert.equal(history.bestPercentage, 80);
assert.equal(history.lastPercentage, 80);

const templateAccess = buildTemplateAccessList(
  [
    {
      id: "quick-template",
      title: "Fixture quick",
      description: null,
      type: "quick",
      language: "english",
      total_questions: 2,
      is_premium: false,
    },
    {
      id: "full-template",
      title: "Fixture full",
      description: null,
      type: "full",
      language: "mixed",
      total_questions: 20,
      is_premium: true,
    },
    {
      id: "empty-template",
      title: "Fixture empty",
      description: null,
      type: "quick",
      language: "portuguese",
      total_questions: 5,
      is_premium: false,
    },
    {
      id: "insufficient-template",
      title: "Fixture insufficient",
      description: null,
      type: "quick",
      language: "english",
      total_questions: 3,
      is_premium: false,
    },
  ],
  [
    { id: "q1", language: "english", type: "objective" },
    { id: "q2", language: "english", type: "objective" },
    { id: "q3", language: "spanish", type: "subjective" },
  ],
  false,
);

assert.deepEqual(
  templateAccess.map((template) => ({
    id: template.id,
    availableQuestionCount: template.availableQuestionCount,
    lockedReason: template.lockedReason,
  })),
  [
    {
      id: "quick-template",
      availableQuestionCount: 2,
      lockedReason: null,
    },
    {
      id: "full-template",
      availableQuestionCount: 2,
      lockedReason: "premium_required",
    },
    {
      id: "empty-template",
      availableQuestionCount: 0,
      lockedReason: "no_questions",
    },
    {
      id: "insufficient-template",
      availableQuestionCount: 2,
      lockedReason: "insufficient_questions",
    },
  ],
);

console.log("Simulation scoring passed");
