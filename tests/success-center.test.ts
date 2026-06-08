import assert from "node:assert/strict";

import {
  buildSuccessSearchIndex,
  professionalFaqs,
  searchSuccessCenter,
  successCenterCategories,
  successCenterGuides,
} from "../src/lib/success-center/content";

assert.equal(successCenterCategories.length, 12);

assert.deepEqual(
  successCenterCategories.map((category) => category.title),
  [
    "Primeiros Passos",
    "Conta e Acesso",
    "Assinatura Premium",
    "Pagamentos",
    "Simulados Oficiais",
    "Subjetivas",
    "Treino Psicossocial",
    "Mentor IA",
    "Edital PGM",
    "Vida Internacional",
    "Problemas Técnicos",
    "Segurança e Privacidade",
  ],
);

assert.equal(
  professionalFaqs.some(
    (faq) =>
      faq.question === "A PGM Academy é oficial?" &&
      faq.answer.includes("independente"),
  ),
  true,
);

assert.equal(
  professionalFaqs.some(
    (faq) =>
      faq.question === "A plataforma garante aprovação?" &&
      faq.answer.includes("Não"),
  ),
  true,
);

assert.equal(
  successCenterGuides.some((guide) =>
    guide.steps.some((step) => step.includes("Simulado Oficial")),
  ),
  true,
);

const searchIndex = buildSuccessSearchIndex();

assert.ok(searchIndex.length >= 30);
assert.equal(
  searchSuccessCenter("pagamento aprovado").some((item) =>
    ["Pagamento aprovado e acesso", "O pagamento foi aprovado?"].includes(
      item.title,
    ),
  ),
  true,
);
assert.equal(
  searchSuccessCenter("mentor edital").some((item) =>
    item.title.includes("Mentor"),
  ),
  true,
);
assert.equal(searchSuccessCenter("").length, 0);

console.log("Success center passed");
