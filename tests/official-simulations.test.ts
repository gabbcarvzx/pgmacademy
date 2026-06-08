import assert from "node:assert/strict";

import {
  officialObjectiveSimulation,
  officialSubjectiveRubric,
  officialSubjectiveSimulation,
  simulationDurationMinutes,
  simulationPointsPerQuestion,
  validateOfficialSubjectiveAnswer,
} from "../src/lib/simulations/official-pgm";

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

console.log("Official simulations passed");
