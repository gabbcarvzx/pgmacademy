import assert from "node:assert/strict";

import {
  intensiveEnglishQuestions,
  intensiveSimulationQuestions,
  intensiveSimulationTemplates,
  intensiveSpanishQuestions,
} from "../scripts/content/intensive-simulations";
import { validateEditorialImportQuestions } from "../src/lib/editorial/import/validation";
import {
  buildIntensiveRecoveryPlan,
  getIntensivePreparationAssessment,
  INTENSIVE_SIMULATION_SOURCE_REFERENCE,
  isIntensiveSimulationTemplate,
} from "../src/lib/simulations/intensive-pgm";
import { simulationDurationMinutes } from "../src/lib/simulations/official-pgm";

const labels = ["A", "B", "C", "D", "E"] as const;

assert.equal(intensiveSimulationTemplates.length, 2);
assert.equal(intensiveSimulationQuestions.length, 60);
assert.equal(intensiveEnglishQuestions.length, 30);
assert.equal(intensiveSpanishQuestions.length, 30);

const validation = validateEditorialImportQuestions(
  intensiveSimulationQuestions,
);
assert.equal(validation.validQuestions, 60);
assert.equal(validation.invalidQuestions, 0);
assert.equal(validation.warnings.length, 0);

for (const languageQuestions of [
  intensiveEnglishQuestions,
  intensiveSpanishQuestions,
]) {
  for (const label of labels) {
    assert.equal(
      languageQuestions.filter((question) => question.correct_answer === label)
        .length,
      6,
    );
  }

  assert.equal(
    languageQuestions.filter((question) =>
      question.tags.some((tag) => tag.startsWith("reading-") || tag.startsWith("lectura-")),
    ).length,
    8,
  );
  assert.equal(
    languageQuestions.filter((question) => question.difficulty_level >= 3)
      .length >= 10,
    true,
  );

  for (const question of languageQuestions) {
    assert.equal(question.options.length, 5);
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.equal(question.source_reference, INTENSIVE_SIMULATION_SOURCE_REFERENCE);
    assert.equal(question.is_premium, true);
  }
}

for (const template of intensiveSimulationTemplates) {
  assert.equal(template.totalQuestions, 30);
  assert.equal(template.durationMinutes, 180);
  assert.equal(template.isPremium, true);
  assert.equal(template.sourceReference, INTENSIVE_SIMULATION_SOURCE_REFERENCE);
  assert.equal(
    isIntensiveSimulationTemplate({ editorial_id: template.editorialId }),
    true,
  );
  assert.equal(
    simulationDurationMinutes({
      editorial_id: template.editorialId,
      type: template.type,
      total_questions: template.totalQuestions,
    }),
    180,
  );
}

assert.equal(getIntensivePreparationAssessment(80).tone, "success");
assert.equal(getIntensivePreparationAssessment(60).tone, "warning");
assert.equal(getIntensivePreparationAssessment(59).tone, "danger");

assert.deepEqual(
  buildIntensiveRecoveryPlan([
    {
      categoryId: "grammar",
      categoryName: "Grammar",
      totalQuestions: 10,
      correctAnswers: 4,
      incorrectAnswers: 6,
      score: 4,
      maxScore: 10,
      percentage: 40,
    },
    {
      categoryId: "reading",
      categoryName: "Reading Comprehension",
      totalQuestions: 8,
      correctAnswers: 3,
      incorrectAnswers: 5,
      score: 3,
      maxScore: 8,
      percentage: 37.5,
    },
    {
      categoryId: "vocabulary",
      categoryName: "Vocabulary",
      totalQuestions: 3,
      correctAnswers: 1,
      incorrectAnswers: 2,
      score: 1,
      maxScore: 3,
      percentage: 33.33,
    },
  ]).map((action) => action.area),
  ["grammar", "reading", "vocabulary"],
);

console.log("Intensive simulations passed");
