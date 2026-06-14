import { readFileSync } from "node:fs";
import { join } from "node:path";

import { countMaterialWords } from "./deep-materials-sprint-6f1";

export const DEEP_MATERIALS_6F5_EDITORIAL_VERSION = "pgm-2026-v2";
export const DEEP_MATERIALS_6F5_SOURCE_REFERENCE =
  "Sprint 6F.5 Deep Materials";

export type DeepMaterial6F5 = {
  editorialId: string;
  title: string;
  slug: string;
  category: "spanish";
  subcategory: "gramatica" | "vocabulario" | "comprension-lectora";
  competence:
    | "spa-apply-grammar"
    | "spa-recognize-false-cognates"
    | "spa-interpret-texts";
  language: "spanish";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  isPremium: true;
  editorialVersion: typeof DEEP_MATERIALS_6F5_EDITORIAL_VERSION;
  sourceReference: typeof DEEP_MATERIALS_6F5_SOURCE_REFERENCE;
  relatedFlashcardIds: string[];
  relatedSimulationQuestionIds: string[];
  contentMd: string;
};

type Definition = Omit<DeepMaterial6F5, "contentMd"> & { fileName: string };

const contentDirectory = join(
  process.cwd(),
  "content",
  "study-materials",
  DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
);

const definitions: Definition[] = [
  {
    editorialId: "MAT-DEEP-ES-001",
    title: "Ser vs Estar: Identidade, Estado e Localizacao em Espanhol",
    slug: "spanish-ser-vs-estar-pgm",
    category: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    language: "spanish",
    difficulty: "beginner",
    estimatedTime: 65,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-024", "FLA-SCALE-025", "FLA-SCALE-026"],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-044",
      "OBJ-SCALE-045",
      "OBJ-SCALE-049",
      "OBJ-SCALE-057",
      "PGM-INT-ES-004",
      "PGM-INT-ES-005",
      "PGM-INT-ES-017",
    ],
    fileName: "spanish-ser-vs-estar.md",
  },
  {
    editorialId: "MAT-DEEP-ES-002",
    title: "Pronombres Personales: Sujeito, Tratamento e Referencia",
    slug: "spanish-pronombres-personales-pgm",
    category: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    language: "spanish",
    difficulty: "beginner",
    estimatedTime: 60,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-024", "FLA-SCALE-025", "FLA-SCALE-026"],
    relatedSimulationQuestionIds: [
      "PGM-INT-ES-002",
      "PGM-INT-ES-003",
      "PGM-INT-ES-006",
      "PGM-INT-ES-015",
      "PGM-INT-ES-016",
    ],
    fileName: "spanish-pronombres-personales.md",
  },
  {
    editorialId: "MAT-DEEP-ES-003",
    title: "Articulos en Espanol: Genero, Numero e Referencia",
    slug: "spanish-articulos-pgm",
    category: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    language: "spanish",
    difficulty: "intermediate",
    estimatedTime: 65,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-019",
      "FLA-SCALE-020",
      "FLA-SCALE-021",
      "FLA-SCALE-026",
    ],
    relatedSimulationQuestionIds: [
      "PGM-INT-ES-008",
      "PGM-INT-ES-009",
      "PGM-INT-ES-021",
    ],
    fileName: "spanish-articulos.md",
  },
  {
    editorialId: "MAT-DEEP-ES-004",
    title: "Verbos Basicos: Comunicar Rotina, Necessidade e Planos",
    slug: "spanish-verbos-basicos-pgm",
    category: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    language: "spanish",
    difficulty: "intermediate",
    estimatedTime: 85,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-019",
      "FLA-SCALE-020",
      "FLA-SCALE-021",
      "FLA-SCALE-026",
    ],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-046",
      "OBJ-SCALE-050",
      "PGM-INT-ES-006",
      "PGM-INT-ES-007",
      "PGM-INT-ES-015",
      "PGM-INT-ES-016",
      "PGM-INT-ES-017",
      "PGM-INT-ES-018",
      "PGM-INT-ES-019",
    ],
    fileName: "spanish-verbos-basicos.md",
  },
  {
    editorialId: "MAT-DEEP-ES-005",
    title: "Comparativos y Superlativos: Comparar Dados e Experiencias",
    slug: "spanish-comparativos-pgm",
    category: "spanish",
    subcategory: "gramatica",
    competence: "spa-apply-grammar",
    language: "spanish",
    difficulty: "intermediate",
    estimatedTime: 65,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-019",
      "FLA-SCALE-020",
      "FLA-SCALE-021",
      "FLA-SCALE-059",
    ],
    relatedSimulationQuestionIds: ["PGM-INT-ES-020", "PGM-INT-ES-021"],
    fileName: "spanish-comparativos.md",
  },
  {
    editorialId: "MAT-DEEP-ES-006",
    title: "Falsos Cognatos: Semelhanca Visual sem Armadilha de Sentido",
    slug: "spanish-falsos-cognatos-pgm",
    category: "spanish",
    subcategory: "vocabulario",
    competence: "spa-recognize-false-cognates",
    language: "spanish",
    difficulty: "intermediate",
    estimatedTime: 70,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-019",
      "FLA-SCALE-020",
      "FLA-SCALE-021",
      "FLA-SCALE-027",
      "FLA-SCALE-058",
      "FLA-SCALE-059",
    ],
    relatedSimulationQuestionIds: ["PGM-INT-ES-022", "PGM-INT-ES-026"],
    fileName: "spanish-falsos-cognatos.md",
  },
  {
    editorialId: "MAT-DEEP-ES-007",
    title: "Comprension Lectora para el PGM: Evidencia, Inferencia e Estrategia",
    slug: "spanish-comprension-lectora-pgm",
    category: "spanish",
    subcategory: "comprension-lectora",
    competence: "spa-interpret-texts",
    language: "spanish",
    difficulty: "advanced",
    estimatedTime: 115,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_6F5_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_6F5_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-019",
      "FLA-SCALE-020",
      "FLA-SCALE-021",
      "FLA-SCALE-022",
      "FLA-SCALE-023",
      "FLA-SCALE-027",
      "FLA-SCALE-028",
      "FLA-SCALE-029",
      "FLA-SCALE-058",
      "FLA-SCALE-059",
    ],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-036",
      "OBJ-SCALE-037",
      "OBJ-SCALE-038",
      "OBJ-SCALE-039",
      "OBJ-SCALE-040",
      "OBJ-SCALE-041",
      "OBJ-SCALE-042",
      "OBJ-SCALE-043",
      "OBJ-SCALE-054",
      "OBJ-SCALE-055",
      "OBJ-SCALE-056",
      "OBJ-SCALE-059",
      "PGM-INT-ES-023",
      "PGM-INT-ES-024",
      "PGM-INT-ES-025",
      "PGM-INT-ES-026",
      "PGM-INT-ES-027",
      "PGM-INT-ES-028",
      "PGM-INT-ES-029",
      "PGM-INT-ES-030",
    ],
    fileName: "spanish-comprension-lectora.md",
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

export function loadDeepMaterialsSprint6F5(): DeepMaterial6F5[] {
  return definitions.map(({ fileName, ...definition }) => ({
    ...definition,
    contentMd: readFileSync(join(contentDirectory, fileName), "utf8").trim(),
  }));
}

export function validateDeepMaterialsSprint6F5(materials: DeepMaterial6F5[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  if (materials.length !== 7) {
    errors.push(`Esperados 7 materiais da Sprint 6F.5; encontrados ${materials.length}.`);
  }

  for (const material of materials) {
    const wordCount = countMaterialWords(material.contentMd);
    const isReading = material.subcategory === "comprension-lectora";
    const minimumWords = isReading ? 2500 : 1500;
    const maximumWords = isReading ? 4000 : 3000;

    if (ids.has(material.editorialId)) errors.push(`editorial_id duplicado: ${material.editorialId}.`);
    if (slugs.has(material.slug)) errors.push(`slug duplicado: ${material.slug}.`);
    ids.add(material.editorialId);
    slugs.add(material.slug);

    if (material.editorialVersion !== DEEP_MATERIALS_6F5_EDITORIAL_VERSION) {
      errors.push(`${material.editorialId} esta fora da versao pgm-2026-v2.`);
    }
    if (material.sourceReference !== DEEP_MATERIALS_6F5_SOURCE_REFERENCE) {
      errors.push(`${material.editorialId} esta com source_reference incorreto.`);
    }
    if (material.category !== "spanish" || material.language !== "spanish") {
      errors.push(`${material.editorialId} esta fora da categoria Spanish.`);
    }
    if (!hasValidTaxonomy(material)) {
      errors.push(`${material.editorialId} esta com taxonomia editorial invalida.`);
    }
    if (wordCount < minimumWords) {
      errors.push(`${material.editorialId} possui apenas ${wordCount} palavras; minimo ${minimumWords}.`);
    }
    if (wordCount > maximumWords) {
      errors.push(`${material.editorialId} excede ${maximumWords} palavras: ${wordCount}.`);
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

export function validateDeepMaterialRelationsSprint6F5(
  materials: DeepMaterial6F5[],
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

export function formatDeepMaterialsSprint6F5Summary(materials: DeepMaterial6F5[]) {
  return [
    `Materiais profundos Sprint 6F.5: ${materials.length}`,
    ...materials.map(
      (material) => `${material.editorialId}: ${countMaterialWords(material.contentMd)} palavras`,
    ),
    `Editorial version: ${DEEP_MATERIALS_6F5_EDITORIAL_VERSION}`,
    `Source reference: ${DEEP_MATERIALS_6F5_SOURCE_REFERENCE}`,
  ].join("\n");
}

function hasValidTaxonomy(material: DeepMaterial6F5) {
  return (
    (material.subcategory === "gramatica" &&
      material.competence === "spa-apply-grammar") ||
    (material.subcategory === "vocabulario" &&
      material.competence === "spa-recognize-false-cognates") ||
    (material.subcategory === "comprension-lectora" &&
      material.competence === "spa-interpret-texts")
  );
}
