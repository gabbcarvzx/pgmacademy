import assert from "node:assert/strict";

import {
  buildReviewFinalNavigation,
  buildReviewFinalSimulationLinks,
  reviewFinalModules,
} from "../src/lib/review-final/content";

const links = buildReviewFinalSimulationLinks([
  {
    id: "db-template-en",
    editorial_id: "TEMPLATE-PGM-INTENSIVO-EN-2026",
    title: "English intensive",
    description: null,
    type: "full",
    language: "english",
    total_questions: 30,
    is_premium: true,
    availableQuestionCount: 30,
    lockedReason: null,
  },
  {
    id: "db-template-es",
    editorial_id: "TEMPLATE-PGM-INTENSIVO-ES-2026",
    title: "Spanish intensive",
    description: null,
    type: "full",
    language: "spanish",
    total_questions: 30,
    is_premium: true,
    availableQuestionCount: 30,
    lockedReason: null,
  },
]);

assert.equal(links.length, 5);
assert.equal(links[0].href, "/simulados/db-template-en");
assert.equal(links[1].href, "/simulados/db-template-es");
assert.equal(links[2].href, "/simulados/subjetivo-oficial?idioma=english");
assert.equal(links[3].href, "/simulados/subjetivo-oficial?idioma=spanish");
assert.equal(links[4].href, "/simulados");

const fallbackLinks = buildReviewFinalSimulationLinks([]);
assert.equal(fallbackLinks[0].href, "/simulados");
assert.equal(fallbackLinks[1].href, "/simulados");

const navigation = buildReviewFinalNavigation(reviewFinalModules);

assert.equal(reviewFinalModules.length >= 9, true);
assert.equal(navigation[0].title, "Introducao");
assert.equal(navigation.at(-1)?.title, "Simulados");

const grammarModule = reviewFinalModules.find((reviewModule) => reviewModule.id === "gramatica-inglesa");
assert.ok(grammarModule);
assert.equal(
  grammarModule.units.some((unit) => unit.title === "Present Simple e Present Continuous"),
  true,
);
assert.equal(
  grammarModule.units.some((unit) => unit.title === "Passive Voice, Reported Speech e Question Tags"),
  true,
);

const vocabularyModule = reviewFinalModules.find((reviewModule) => reviewModule.id === "vocabulario-ingles");
assert.ok(vocabularyModule);
assert.equal(
  vocabularyModule.units.some((unit) => unit.title === "Travel, School, Countries e Daily Routine"),
  true,
);
assert.equal(
  vocabularyModule.units.some((unit) => unit.title === "Common Expressions, Idioms e palavras confundidas"),
  true,
);

const spanishModule = reviewFinalModules.find((reviewModule) => reviewModule.id === "espanhol");
assert.ok(spanishModule);
assert.equal(
  spanishModule.units.some((unit) => unit.title === "Presente, Preterito, articulos e pronombres"),
  true,
);
assert.equal(
  spanishModule.units.some((unit) => unit.title === "Conectores, falsos cognatos e interpretacion"),
  true,
);

const strategyModule = reviewFinalModules.find((reviewModule) => reviewModule.id === "estrategias-de-prova");
assert.ok(strategyModule);
assert.equal(
  strategyModule.units.some((unit) => unit.title === "Administracao de tempo e eliminacao de alternativas"),
  true,
);

const interviewModule = reviewFinalModules.find((reviewModule) => reviewModule.id === "entrevista");
assert.ok(interviewModule);
assert.equal(
  interviewModule.units.some((unit) => unit.title === "Perguntas comuns e respostas-modelo"),
  true,
);

for (const reviewModule of reviewFinalModules) {
  assert.equal(reviewModule.units.length > 0, true, `${reviewModule.id} should have units`);
  for (const unit of reviewModule.units) {
    assert.equal(unit.examples.length > 0, true, `${unit.title} should have examples`);
    assert.equal(unit.commonMistakes.length > 0, true, `${unit.title} should have common mistakes`);
    assert.equal(unit.practicalTips.length > 0, true, `${unit.title} should have practical tips`);
    assert.equal(Boolean(unit.attention.title), true, `${unit.title} should have attention box`);
    assert.equal(Boolean(unit.quickSummary), true, `${unit.title} should have quick summary`);
    assert.equal(unit.commentedQuestion.options.length >= 4, true, `${unit.title} should have commented options`);
    assert.equal(
      unit.commentedQuestion.options.filter((option) => option.isCorrect).length,
      1,
      `${unit.title} should have exactly one correct option`,
    );
  }
}

console.log("Review final content passed");
