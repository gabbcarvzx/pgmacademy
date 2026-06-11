import assert from "node:assert/strict";

import {
  officialObjectiveSimulation,
  officialSubjectiveRubric,
  officialSubjectiveSimulation,
  simulationDurationMinutes,
  simulationPointsPerQuestion,
  validateOfficialSubjectiveAnswer,
} from "../src/lib/simulations/official-pgm";
import {
  objectiveOptionLabels,
  type ObjectiveOptionLabel,
} from "../src/lib/simulations/answer-key";
import { loadApprovedContent } from "../scripts/content/approved-content";

const officialTemplate = {
  type: "full" as const,
  total_questions: 30,
};

assert.equal(officialObjectiveSimulation.questionCount, 30);
assert.equal(simulationDurationMinutes(officialTemplate), 240);
assert.equal(simulationPointsPerQuestion(officialTemplate), 2);

assert.equal(officialSubjectiveSimulation.questionCount, 5);
assert.equal(officialSubjectiveSimulation.minWords, 90);
assert.equal(officialSubjectiveSimulation.maxWords, 150);
assert.equal(officialSubjectiveSimulation.maxScore, 40);
assert.deepEqual(
  officialSubjectiveRubric.map((criterion) => criterion.key),
  ["grammar", "vocabulary", "syntax", "cohesion", "clarity"],
);

const ninetyWords = Array.from({ length: 90 }, (_, index) => `word${index}`).join(
  " ",
);
const oneHundredFiftyOneWords = Array.from(
  { length: 151 },
  (_, index) => `word${index}`,
).join(" ");

assert.equal(validateOfficialSubjectiveAnswer(ninetyWords).valid, true);
assert.equal(
  validateOfficialSubjectiveAnswer(oneHundredFiftyOneWords).valid,
  false,
);

const approvedContent = loadApprovedContent();

function emptyDistribution() {
  return Object.fromEntries(
    objectiveOptionLabels.map((label) => [label, 0]),
  ) as Record<ObjectiveOptionLabel, number>;
}

function correctLabelForQuestion(
  question: (typeof approvedContent.objectiveQuestions)[number],
) {
  const correctOptions = question.options.filter((option) => option.isCorrect);
  assert.equal(
    correctOptions.length,
    1,
    `${question.editorialId} must have exactly one correct option`,
  );

  return correctOptions[0].label;
}

function distributionForQuestions(
  questions: Array<(typeof approvedContent.objectiveQuestions)[number]>,
) {
  const distribution = emptyDistribution();

  for (const question of questions) {
    distribution[correctLabelForQuestion(question)] += 1;
  }

  return distribution;
}

function selectQuestionsForTemplate(
  template: (typeof approvedContent.templates)[number],
) {
  const eligibleQuestions = approvedContent.objectiveQuestions.filter(
    (question) =>
      template.language === "mixed" || question.language === template.language,
  );

  if (template.language !== "mixed") {
    return eligibleQuestions.slice(0, template.totalQuestions);
  }

  const languageOrder = [
    "english",
    "spanish",
    "portuguese",
    "mixed",
    "psychosocial",
  ] as const;
  const byLanguage = new Map(
    languageOrder.map((language) => [
      language,
      eligibleQuestions.filter((question) => question.language === language),
    ]),
  );
  const selected: typeof eligibleQuestions = [];

  while (selected.length < template.totalQuestions) {
    const previousLength = selected.length;

    for (const language of languageOrder) {
      const next = byLanguage.get(language)?.shift();
      if (next) {
        selected.push(next);
      }

      if (selected.length >= template.totalQuestions) {
        break;
      }
    }

    if (selected.length === previousLength) {
      break;
    }
  }

  return selected;
}

assert.deepEqual(distributionForQuestions(approvedContent.objectiveQuestions), {
  A: 20,
  B: 20,
  C: 20,
  D: 20,
  E: 20,
});

assert.deepEqual(
  distributionForQuestions(
    approvedContent.objectiveQuestions.filter(
      (question) => question.language === "english",
    ),
  ),
  { A: 7, B: 7, C: 7, D: 7, E: 7 },
);
assert.deepEqual(
  distributionForQuestions(
    approvedContent.objectiveQuestions.filter(
      (question) => question.language === "spanish",
    ),
  ),
  { A: 5, B: 5, C: 5, D: 5, E: 5 },
);

const expectedTemplateDistributions: Record<
  string,
  Record<ObjectiveOptionLabel, number>
> = {
  "TEMPLATE-SCALE-FULL-MIXED": { A: 6, B: 6, C: 6, D: 6, E: 6 },
  "TEMPLATE-SCALE-QUICK-EN": { A: 2, B: 2, C: 2, D: 2, E: 2 },
  "TEMPLATE-SCALE-QUICK-ES": { A: 2, B: 2, C: 2, D: 2, E: 2 },
  "TEMPLATE-SCALE-QUICK-PT": { A: 2, B: 2, C: 2, D: 2, E: 2 },
  "TEMPLATE-SCALE-QUICK-PSY": { A: 2, B: 2, C: 2, D: 2, E: 2 },
};

for (const template of approvedContent.templates) {
  const distribution = distributionForQuestions(selectQuestionsForTemplate(template));

  assert.deepEqual(
    distribution,
    expectedTemplateDistributions[template.editorialId],
    `${template.editorialId} must keep a balanced answer key`,
  );
}

assert.deepEqual(
  approvedContent.templates
    .filter(
      (template) =>
        template.editorialId === "TEMPLATE-SCALE-QUICK-EN" ||
        template.editorialId === "TEMPLATE-SCALE-QUICK-ES",
    )
    .map((template) => ({
      editorialId: template.editorialId,
      language: template.language,
      title: template.title,
    })),
  [
    {
      editorialId: "TEMPLATE-SCALE-QUICK-EN",
      language: "english",
      title: "Simulado Objetivo - Ingles",
    },
    {
      editorialId: "TEMPLATE-SCALE-QUICK-ES",
      language: "spanish",
      title: "Simulado Objetivo - Espanhol",
    },
  ],
);

console.log("Official simulations passed");
