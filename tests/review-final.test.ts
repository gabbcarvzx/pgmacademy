import assert from "node:assert/strict";

import { buildReviewFinalSimulationLinks } from "../src/lib/review-final/content";

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

console.log("Review final links passed");
