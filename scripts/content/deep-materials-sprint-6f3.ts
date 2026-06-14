import { readFileSync } from "node:fs";
import { join } from "node:path";

import { countMaterialWords } from "./deep-materials-sprint-6f1";

export const DEEP_MATERIALS_6F3_EDITORIAL_VERSION = "pgm-2026-v2";
export const DEEP_MATERIALS_6F3_SOURCE_REFERENCE =
  "Sprint 6F.3 Deep Materials";

export type DeepMaterial6F3 = {
  editorialId: string;
  title: string;
  slug: string;
  category: "english";
  subcategory: "grammar";
  competence: "eng-apply-grammar-rule";
  language: "english";
  difficulty: "intermediate" | "advanced";
  estimatedTime: number;
  isPremium: true;
  editorialVersion: typeof DEEP_MATERIALS_6F3_EDITORIAL_VERSION;
  sourceReference: typeof DEEP_MATERIALS_6F3_SOURCE_REFERENCE;
  relatedFlashcardIds: string[];
  relatedSimulationQuestionIds: string[];
  contentMd: string;
};

type Definition = Omit<DeepMaterial6F3, "contentMd"> & { fileName: string };

const contentDirectory = join(
  process.cwd(),
  "content",
  "study-materials",
  DEEP_MATERIALS_6F3_EDITORIAL_VERSION,
);

const definitions: Definition[] = [
  {
    editorialId: "MAT-DEEP-EN-008",
    title: "Prepositions: Tempo, Lugar e Movimento no Contexto PGM",
    slug: "prepositions-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "intermediate",
    estimatedTime: 70,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F3_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F3_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-004", "FLA-SCALE-006", "FLA-SCALE-008"],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-007",
      "PGM-INT-EN-014",
      "PGM-INT-EN-017",
      "PGM-INT-EN-018",
    ],
    fileName: "prepositions.md",
  },
  {
    editorialId: "MAT-DEEP-EN-009",
    title: "Adverbs of Frequency: Posicao, Sentido e Rotina",
    slug: "adverbs-of-frequency-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "intermediate",
    estimatedTime: 65,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F3_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F3_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-001", "FLA-SCALE-002", "FLA-SCALE-013"],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-001",
      "OBJ-SCALE-009",
      "PGM-INT-EN-012",
      "PGM-INT-EN-013",
      "PGM-INT-EN-024",
    ],
    fileName: "adverbs-of-frequency.md",
  },
  {
    editorialId: "MAT-DEEP-EN-010",
    title: "Comparatives and Superlatives: Comparar Com Precisao",
    slug: "comparatives-superlatives-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "advanced",
    estimatedTime: 75,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F3_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F3_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-003", "FLA-SCALE-004", "FLA-SCALE-009"],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-004",
      "PGM-INT-EN-019",
      "PGM-INT-EN-022",
      "PGM-INT-EN-029",
    ],
    fileName: "comparatives-superlatives.md",
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

export function loadDeepMaterialsSprint6F3(): DeepMaterial6F3[] {
  return definitions.map(({ fileName, ...definition }) => ({
    ...definition,
    contentMd: readFileSync(join(contentDirectory, fileName), "utf8").trim(),
  }));
}

export function validateDeepMaterialsSprint6F3(materials: DeepMaterial6F3[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  if (materials.length !== 3) {
    errors.push(`Esperados 3 materiais da Sprint 6F.3; encontrados ${materials.length}.`);
  }

  for (const material of materials) {
    const wordCount = countMaterialWords(material.contentMd);
    if (ids.has(material.editorialId)) errors.push(`editorial_id duplicado: ${material.editorialId}.`);
    if (slugs.has(material.slug)) errors.push(`slug duplicado: ${material.slug}.`);
    ids.add(material.editorialId);
    slugs.add(material.slug);

    if (material.editorialVersion !== DEEP_MATERIALS_6F3_EDITORIAL_VERSION) {
      errors.push(`${material.editorialId} esta fora da versao pgm-2026-v2.`);
    }
    if (material.sourceReference !== DEEP_MATERIALS_6F3_SOURCE_REFERENCE) {
      errors.push(`${material.editorialId} esta com source_reference incorreto.`);
    }
    if (
      material.category !== "english" ||
      material.subcategory !== "grammar" ||
      material.language !== "english" ||
      material.competence !== "eng-apply-grammar-rule"
    ) {
      errors.push(`${material.editorialId} esta fora da taxonomia de English Grammar.`);
    }
    if (wordCount < 1500) errors.push(`${material.editorialId} possui apenas ${wordCount} palavras.`);
    if (wordCount > 3000) errors.push(`${material.editorialId} excede 3000 palavras: ${wordCount}.`);
    if (material.relatedFlashcardIds.length === 0) errors.push(`${material.editorialId} nao referencia flashcards.`);
    if (material.relatedSimulationQuestionIds.length === 0) errors.push(`${material.editorialId} nao referencia simulados.`);

    for (const heading of requiredHeadings) {
      if (!material.contentMd.includes(heading)) {
        errors.push(`${material.editorialId} esta sem a secao: ${heading}.`);
      }
    }
  }
  return errors;
}

export function validateDeepMaterialRelationsSprint6F3(
  materials: DeepMaterial6F3[],
  relations: { flashcardIds: Set<string>; simulationQuestionIds: Set<string> },
) {
  const errors: string[] = [];
  for (const material of materials) {
    for (const id of material.relatedFlashcardIds) {
      if (!relations.flashcardIds.has(id)) errors.push(`${material.editorialId} referencia flashcard inexistente: ${id}.`);
    }
    for (const id of material.relatedSimulationQuestionIds) {
      if (!relations.simulationQuestionIds.has(id)) errors.push(`${material.editorialId} referencia questao inexistente: ${id}.`);
    }
  }
  return errors;
}

export function formatDeepMaterialsSprint6F3Summary(materials: DeepMaterial6F3[]) {
  return [
    `Materiais profundos Sprint 6F.3: ${materials.length}`,
    ...materials.map((material) => `${material.editorialId}: ${countMaterialWords(material.contentMd)} palavras`),
    `Editorial version: ${DEEP_MATERIALS_6F3_EDITORIAL_VERSION}`,
    `Source reference: ${DEEP_MATERIALS_6F3_SOURCE_REFERENCE}`,
  ].join("\n");
}
