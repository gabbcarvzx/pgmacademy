import assert from "node:assert/strict";

import {
  academyContentTotal,
  academyModules,
  academyOverview,
} from "../src/lib/academy/content";
import {
  calculateAcademyModuleProgress,
  calculateAcademyOverallProgress,
} from "../src/lib/academy/rules";

assert.equal(academyModules.length, 7);
assert.equal(academyOverview.title, "Academia PGM");
assert.equal(academyOverview.modules, 7);
assert.equal(academyContentTotal, 37);

assert.deepEqual(
  academyModules.map((academyModule) => academyModule.title),
  [
    "Rota de Aprovação PGM",
    "Inglês para o PGM",
    "Espanhol para o PGM",
    "Escrita Internacional",
    "Treino Psicossocial",
    "Vida Internacional",
    "Embarque e Documentação",
  ],
);

const expectedContentCountByModule = [5, 5, 5, 5, 5, 6, 6];

for (const [index, academyModule] of academyModules.entries()) {
  assert.equal(academyModule.contents.length, expectedContentCountByModule[index]);
  assert.equal(academyModule.order >= 1 && academyModule.order <= 7, true);
}

const firstModule = academyModules[0];
const notStarted = calculateAcademyModuleProgress(firstModule.contents, new Set());

assert.equal(notStarted.status, "not_started");
assert.equal(notStarted.completedContents, 0);
assert.equal(notStarted.pendingContents, 5);
assert.equal(notStarted.progressPercent, 0);

const partial = calculateAcademyModuleProgress(
  firstModule.contents,
  new Set(firstModule.contents.slice(0, 2).map((content) => content.id)),
);

assert.equal(partial.status, "in_progress");
assert.equal(partial.completedContents, 2);
assert.equal(partial.pendingContents, 3);
assert.equal(partial.progressPercent, 40);

const completed = calculateAcademyModuleProgress(
  firstModule.contents,
  new Set(firstModule.contents.map((content) => content.id)),
);

assert.equal(completed.status, "completed");
assert.equal(completed.completedContents, 5);
assert.equal(completed.pendingContents, 0);
assert.equal(completed.progressPercent, 100);

const overall = calculateAcademyOverallProgress([
  completed,
  partial,
  notStarted,
]);

assert.equal(overall.totalModules, 3);
assert.equal(overall.completedModules, 1);
assert.equal(overall.totalContents, 15);
assert.equal(overall.completedContents, 7);
assert.equal(overall.progressPercent, 47);
assert.equal(overall.completed, false);

const fullOverall = calculateAcademyOverallProgress(
  academyModules.map((academyModule) =>
    calculateAcademyModuleProgress(
      academyModule.contents,
      new Set(academyModule.contents.map((content) => content.id)),
    ),
  ),
);

assert.equal(fullOverall.completed, true);
assert.equal(fullOverall.progressPercent, 100);

console.log("Academy rules passed");
