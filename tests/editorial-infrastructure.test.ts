import assert from "node:assert/strict";

import {
  academyBlueprintMatchesCurrentModules,
  academyModuleBlueprints,
  objectiveSimulationBlueprint,
  psychosocialImportBlueprint,
  subjectiveImportBlueprint,
} from "../src/lib/editorial/blueprints";
import {
  editorialImportSpecs,
  objectiveQuestionImportSpec,
  premiumMaterialImportSpec,
} from "../src/lib/editorial/import-specs";
import {
  editorialCategories,
  editorialCompetencies,
  editorialDifficultyLevels,
  editorialVersion,
} from "../src/lib/editorial/taxonomy";
import { validateEditorialInfrastructure } from "../src/lib/editorial/validation";

assert.equal(editorialVersion.code, "pgm-2026-v1");
assert.equal(editorialVersion.editalYear, 2026);
assert.equal(editorialCategories.length, 6);

assert.deepEqual(
  editorialCategories.map((category) => category.title),
  [
    "Inglês",
    "Espanhol",
    "Processo Seletivo PGM",
    "Vida Internacional",
    "Escrita Internacional",
    "Treino Psicossocial",
  ],
);

assert.deepEqual(
  editorialCategories.find((category) => category.slug === "english")?.subcategories.map(
    (subcategory) => subcategory.title,
  ),
  ["Reading Comprehension", "Grammar", "Vocabulary", "Communication"],
);

assert.deepEqual(
  editorialCategories
    .find((category) => category.slug === "psychosocial-training")
    ?.subcategories.map((subcategory) => subcategory.title),
  [
    "Comunicação",
    "Adaptabilidade",
    "Autonomia",
    "Responsabilidade",
    "Diversidade Cultural",
    "Resolução de Conflitos",
  ],
);

assert.equal(editorialCompetencies.length >= 20, true);
assert.equal(
  editorialCompetencies.some(
    (competency) => competency.code === "eng-identify-main-idea",
  ),
  true,
);
assert.equal(
  editorialCompetencies.some(
    (competency) => competency.code === "psy-resolve-conflicts",
  ),
  true,
);

assert.deepEqual(
  editorialDifficultyLevels.map((level) => level.title),
  ["Fundamentos", "Intermediário", "Avançado", "Competitivo PGM"],
);

assert.equal(objectiveSimulationBlueprint.totalQuestions, 30);
assert.equal(objectiveSimulationBlueprint.durationMinutes, 240);
assert.equal(
  objectiveSimulationBlueprint.categoryDistribution.reduce(
    (sum, item) => sum + item.questions,
    0,
  ),
  30,
);
assert.equal(
  objectiveSimulationBlueprint.difficultyDistribution.reduce(
    (sum, item) => sum + item.questions,
    0,
  ),
  30,
);

assert.equal(academyModuleBlueprints.length, 7);
assert.equal(academyBlueprintMatchesCurrentModules(), true);

assert.equal(objectiveQuestionImportSpec.targetCount, 400);
assert.equal(premiumMaterialImportSpec.targetSprint, "6C");
assert.equal(subjectiveImportBlueprint.targetItems, 50);
assert.equal(psychosocialImportBlueprint.targetItems, 80);
assert.equal(editorialImportSpecs.length, 4);

assert.deepEqual(validateEditorialInfrastructure(), []);

console.log("Editorial infrastructure passed");
