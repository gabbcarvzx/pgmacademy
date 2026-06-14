import {
  formatContentSummary,
  loadApprovedContent,
  validateApprovedContent,
} from "./content/approved-content";
import {
  formatDeepMaterialsSummary,
  loadDeepMaterials,
  validateDeepMaterialRelations,
  validateDeepMaterials,
} from "./content/deep-materials-sprint-6f1";
import {
  formatDeepMaterialsSprint6F2Summary,
  loadDeepMaterialsSprint6F2,
  validateDeepMaterialRelationsSprint6F2,
  validateDeepMaterialsSprint6F2,
} from "./content/deep-materials-sprint-6f2";
import {
  formatDeepMaterialsSprint6F3Summary,
  loadDeepMaterialsSprint6F3,
  validateDeepMaterialRelationsSprint6F3,
  validateDeepMaterialsSprint6F3,
} from "./content/deep-materials-sprint-6f3";
import {
  formatDeepMaterialsSprint6F4Summary,
  loadDeepMaterialsSprint6F4,
  validateDeepMaterialRelationsSprint6F4,
  validateDeepMaterialsSprint6F4,
} from "./content/deep-materials-sprint-6f4";
import {
  formatDeepMaterialsSprint6F5Summary,
  loadDeepMaterialsSprint6F5,
  validateDeepMaterialRelationsSprint6F5,
  validateDeepMaterialsSprint6F5,
} from "./content/deep-materials-sprint-6f5";
import { intensiveSimulationQuestions } from "./content/intensive-simulations";

const content = loadApprovedContent();
const deepMaterials = loadDeepMaterials();
const deepMaterialsSprint6F2 = loadDeepMaterialsSprint6F2();
const deepMaterialsSprint6F3 = loadDeepMaterialsSprint6F3();
const deepMaterialsSprint6F4 = loadDeepMaterialsSprint6F4();
const deepMaterialsSprint6F5 = loadDeepMaterialsSprint6F5();
const flashcardIds = new Set(content.flashcards.map((item) => item.editorialId));
const simulationQuestionIds = new Set([
  ...content.objectiveQuestions.map((item) => item.editorialId),
  ...intensiveSimulationQuestions.map((item) => item.id),
]);
const errors = [
  ...validateApprovedContent(content),
  ...validateDeepMaterials(deepMaterials),
  ...validateDeepMaterialRelations(deepMaterials, {
    flashcardIds,
    simulationQuestionIds,
  }),
  ...validateDeepMaterialsSprint6F2(deepMaterialsSprint6F2),
  ...validateDeepMaterialRelationsSprint6F2(deepMaterialsSprint6F2, {
    flashcardIds,
    simulationQuestionIds,
  }),
  ...validateDeepMaterialsSprint6F3(deepMaterialsSprint6F3),
  ...validateDeepMaterialRelationsSprint6F3(deepMaterialsSprint6F3, {
    flashcardIds,
    simulationQuestionIds,
  }),
  ...validateDeepMaterialsSprint6F4(deepMaterialsSprint6F4),
  ...validateDeepMaterialRelationsSprint6F4(deepMaterialsSprint6F4, {
    flashcardIds,
    simulationQuestionIds,
  }),
  ...validateDeepMaterialsSprint6F5(deepMaterialsSprint6F5),
  ...validateDeepMaterialRelationsSprint6F5(deepMaterialsSprint6F5, {
    flashcardIds,
    simulationQuestionIds,
  }),
  ...validateUniqueDeepMaterialKeys([
    ...deepMaterials,
    ...deepMaterialsSprint6F2,
    ...deepMaterialsSprint6F3,
    ...deepMaterialsSprint6F4,
    ...deepMaterialsSprint6F5,
  ]),
];

if (errors.length > 0) {
  console.error("Falha na validação do conteúdo aprovado:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Conteúdo aprovado validado com sucesso.");
console.log(formatContentSummary(content));
console.log(formatDeepMaterialsSummary(deepMaterials));
console.log(formatDeepMaterialsSprint6F2Summary(deepMaterialsSprint6F2));
console.log(formatDeepMaterialsSprint6F3Summary(deepMaterialsSprint6F3));
console.log(formatDeepMaterialsSprint6F4Summary(deepMaterialsSprint6F4));
console.log(formatDeepMaterialsSprint6F5Summary(deepMaterialsSprint6F5));

function validateUniqueDeepMaterialKeys(
  materials: Array<{ editorialId: string; slug: string }>,
) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const material of materials) {
    if (ids.has(material.editorialId)) {
      errors.push(`editorial_id profundo duplicado entre sprints: ${material.editorialId}.`);
    }
    if (slugs.has(material.slug)) {
      errors.push(`slug profundo duplicado entre sprints: ${material.slug}.`);
    }
    ids.add(material.editorialId);
    slugs.add(material.slug);
  }

  return errors;
}
