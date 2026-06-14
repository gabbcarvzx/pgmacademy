import { readFileSync } from "node:fs";
import { join } from "node:path";

import { countMaterialWords } from "./deep-materials-sprint-6f1";
import {
  DEEP_MATERIALS_EDITORIAL_VERSION,
  DEEP_MATERIALS_SOURCE_REFERENCE,
} from "./deep-materials-constants";

export const DEEP_MATERIALS_6F4_EDITORIAL_VERSION =
  DEEP_MATERIALS_EDITORIAL_VERSION;
export const DEEP_MATERIALS_6F4_SOURCE_REFERENCE =
  DEEP_MATERIALS_SOURCE_REFERENCE;

export type DeepMaterial6F4 = {
  editorialId: string;
  title: string;
  slug: string;
  category: "english";
  subcategory: "grammar" | "reading-comprehension";
  competence: "eng-apply-grammar-rule" | "eng-identify-main-idea";
  language: "english";
  difficulty: "advanced";
  estimatedTime: number;
  isPremium: true;
  editorialVersion: typeof DEEP_MATERIALS_6F4_EDITORIAL_VERSION;
  sourceReference: typeof DEEP_MATERIALS_6F4_SOURCE_REFERENCE;
  relatedFlashcardIds: string[];
  relatedSimulationQuestionIds: string[];
  contentMd: string;
};

type Definition = Omit<DeepMaterial6F4, "contentMd"> & { fileName: string };

const contentDirectory = join(
  process.cwd(),
  "content",
  "study-materials",
  DEEP_MATERIALS_6F4_EDITORIAL_VERSION,
);

const definitions: Definition[] = [
  {
    editorialId: "MAT-DEEP-EN-011",
    title: "Present Perfect: Experiencias, Resultados e Conexao Com o Presente",
    slug: "present-perfect-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "advanced",
    estimatedTime: 85,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F4_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F4_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-001",
      "FLA-SCALE-002",
      "FLA-SCALE-013",
      "FLA-SCALE-014",
    ],
    relatedSimulationQuestionIds: [
      "PGM-INT-EN-022",
      "PGM-INT-EN-028",
      "PGM-INT-EN-029",
    ],
    fileName: "present-perfect.md",
  },
  {
    editorialId: "MAT-DEEP-EN-012",
    title: "Reading Strategies for PGM: Ler, Localizar Evidencias e Decidir",
    slug: "reading-strategies-for-pgm",
    category: "english",
    subcategory: "reading-comprehension",
    competence: "eng-identify-main-idea",
    language: "english",
    difficulty: "advanced",
    estimatedTime: 110,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F4_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F4_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-007",
      "FLA-SCALE-008",
      "FLA-SCALE-009",
      "FLA-SCALE-016",
      "FLA-SCALE-017",
      "FLA-SCALE-018",
    ],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-001",
      "OBJ-SCALE-002",
      "OBJ-SCALE-003",
      "OBJ-SCALE-004",
      "OBJ-SCALE-005",
      "OBJ-SCALE-006",
      "OBJ-SCALE-007",
      "OBJ-SCALE-008",
      "OBJ-SCALE-009",
      "OBJ-SCALE-010",
      "PGM-INT-EN-023",
      "PGM-INT-EN-024",
      "PGM-INT-EN-025",
      "PGM-INT-EN-026",
      "PGM-INT-EN-027",
      "PGM-INT-EN-028",
      "PGM-INT-EN-029",
      "PGM-INT-EN-030",
    ],
    fileName: "reading-strategies-for-pgm.md",
  },
];

const requiredHeadings = [
  "## 1. Introducao",
  "## 2. Importancia Para o PGM",
  "## 3. Explicacao Teorica Completa",
  "## 4. Tabelas",
  "## 5. Regras",
  "## 6. Exemplos Comentados",
  "## 7. Erros Comuns",
  "## 8. Questoes Estilo PGM",
  "## 9. Resolucao Comentada",
  "## 10. Resumo Final",
  "## 11. Dicas de Prova",
  "## 12. Relacao Com Flashcards",
  "## 13. Relacao Com Simulados Intensivos",
] as const;

export function loadDeepMaterialsSprint6F4(): DeepMaterial6F4[] {
  return definitions.map(({ fileName, ...definition }) => ({
    ...definition,
    contentMd: readFileSync(join(contentDirectory, fileName), "utf8").trim(),
  }));
}

export function validateDeepMaterialsSprint6F4(materials: DeepMaterial6F4[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  if (materials.length !== 2) {
    errors.push(`Esperados 2 materiais da Sprint 6F.4; encontrados ${materials.length}.`);
  }

  for (const material of materials) {
    const wordCount = countMaterialWords(material.contentMd);

    if (ids.has(material.editorialId)) {
      errors.push(`editorial_id duplicado: ${material.editorialId}.`);
    }
    if (slugs.has(material.slug)) {
      errors.push(`slug duplicado: ${material.slug}.`);
    }
    ids.add(material.editorialId);
    slugs.add(material.slug);

    if (material.editorialVersion !== DEEP_MATERIALS_6F4_EDITORIAL_VERSION) {
      errors.push(`${material.editorialId} esta fora da versao pgm-2026-v2.`);
    }
    if (material.sourceReference !== DEEP_MATERIALS_6F4_SOURCE_REFERENCE) {
      errors.push(`${material.editorialId} esta com source_reference incorreto.`);
    }
    if (material.category !== "english" || material.language !== "english") {
      errors.push(`${material.editorialId} esta fora da categoria English.`);
    }
    if (!hasValidTaxonomy(material)) {
      errors.push(`${material.editorialId} esta com taxonomia editorial invalida.`);
    }
    if (wordCount < 2500) {
      errors.push(`${material.editorialId} possui apenas ${wordCount} palavras.`);
    }
    if (wordCount > 4000) {
      errors.push(`${material.editorialId} excede 4000 palavras: ${wordCount}.`);
    }
    if (material.relatedFlashcardIds.length === 0) {
      errors.push(`${material.editorialId} nao referencia flashcards.`);
    }
    if (material.relatedSimulationQuestionIds.length === 0) {
      errors.push(`${material.editorialId} nao referencia simulados.`);
    }

    for (const heading of requiredHeadings) {
      if (!material.contentMd.includes(heading)) {
        errors.push(`${material.editorialId} esta sem a secao: ${heading}.`);
      }
    }
  }

  return errors;
}

export function validateDeepMaterialRelationsSprint6F4(
  materials: DeepMaterial6F4[],
  relations: { flashcardIds: Set<string>; simulationQuestionIds: Set<string> },
) {
  const errors: string[] = [];

  for (const material of materials) {
    for (const id of material.relatedFlashcardIds) {
      if (!relations.flashcardIds.has(id)) {
        errors.push(`${material.editorialId} referencia flashcard inexistente: ${id}.`);
      }
    }
    for (const id of material.relatedSimulationQuestionIds) {
      if (!relations.simulationQuestionIds.has(id)) {
        errors.push(`${material.editorialId} referencia questao inexistente: ${id}.`);
      }
    }
  }

  return errors;
}

export function formatDeepMaterialsSprint6F4Summary(materials: DeepMaterial6F4[]) {
  return [
    `Materiais profundos Sprint 6F.4: ${materials.length}`,
    ...materials.map(
      (material) => `${material.editorialId}: ${countMaterialWords(material.contentMd)} palavras`,
    ),
    `Editorial version: ${DEEP_MATERIALS_6F4_EDITORIAL_VERSION}`,
    `Source reference: ${DEEP_MATERIALS_6F4_SOURCE_REFERENCE}`,
  ].join("\n");
}

function hasValidTaxonomy(material: DeepMaterial6F4) {
  return (
    (material.subcategory === "grammar" &&
      material.competence === "eng-apply-grammar-rule") ||
    (material.subcategory === "reading-comprehension" &&
      material.competence === "eng-identify-main-idea")
  );
}
