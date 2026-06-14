import { readFileSync } from "node:fs";
import { join } from "node:path";

export const DEEP_MATERIALS_EDITORIAL_VERSION = "pgm-2026-v2";
export const DEEP_MATERIALS_SOURCE_REFERENCE = "Sprint 6F.1 Deep Materials";

export type DeepMaterial = {
  editorialId: string;
  title: string;
  slug: string;
  category: "english";
  subcategory: "grammar";
  competence: "eng-apply-grammar-rule";
  language: "english";
  difficulty: "beginner" | "intermediate";
  estimatedTime: number;
  isPremium: true;
  editorialVersion: typeof DEEP_MATERIALS_EDITORIAL_VERSION;
  sourceReference: typeof DEEP_MATERIALS_SOURCE_REFERENCE;
  relatedFlashcardIds: string[];
  relatedSimulationQuestionIds: string[];
  contentMd: string;
};

type DeepMaterialDefinition = Omit<DeepMaterial, "contentMd"> & {
  fileName: string;
};

const contentDirectory = join(
  process.cwd(),
  "content",
  "study-materials",
  DEEP_MATERIALS_EDITORIAL_VERSION,
);

const definitions: DeepMaterialDefinition[] = [
  {
    editorialId: "MAT-DEEP-EN-001",
    title: "Verb To Be: Base Completa Para a Reta Final PGM",
    slug: "verb-to-be-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "beginner",
    estimatedTime: 55,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-015"],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-021",
      "OBJ-SCALE-022",
      "OBJ-SCALE-025",
      "PGM-INT-EN-004",
    ],
    fileName: "verb-to-be.md",
  },
  {
    editorialId: "MAT-DEEP-EN-002",
    title: "Subject Pronouns: Quem Faz a Acao em Ingles",
    slug: "subject-pronouns-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "beginner",
    estimatedTime: 50,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-013", "FLA-SCALE-015"],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-021",
      "OBJ-SCALE-022",
      "PGM-INT-EN-002",
      "PGM-INT-EN-003",
    ],
    fileName: "subject-pronouns.md",
  },
  {
    editorialId: "MAT-DEEP-EN-003",
    title: "Possessive Adjectives: Posse Sem Confusao",
    slug: "possessive-adjectives-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "beginner",
    estimatedTime: 50,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_SOURCE_REFERENCE,
    relatedFlashcardIds: ["FLA-SCALE-015"],
    relatedSimulationQuestionIds: [
      "PGM-INT-EN-002",
      "PGM-INT-EN-003",
      "PGM-INT-EN-020",
    ],
    fileName: "possessive-adjectives.md",
  },
  {
    editorialId: "MAT-DEEP-EN-004",
    title: "Present Simple: Rotinas, Habitos e Fatos",
    slug: "present-simple-reta-final-pgm",
    category: "english",
    subcategory: "grammar",
    competence: "eng-apply-grammar-rule",
    language: "english",
    difficulty: "intermediate",
    estimatedTime: 65,
    isPremium: true,
    editorialVersion: DEEP_MATERIALS_EDITORIAL_VERSION,
    sourceReference: DEEP_MATERIALS_SOURCE_REFERENCE,
    relatedFlashcardIds: [
      "FLA-SCALE-001",
      "FLA-SCALE-002",
      "FLA-SCALE-013",
      "FLA-SCALE-015",
    ],
    relatedSimulationQuestionIds: [
      "OBJ-SCALE-029",
      "PGM-INT-EN-011",
      "PGM-INT-EN-012",
      "PGM-INT-EN-013",
    ],
    fileName: "present-simple.md",
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

export function loadDeepMaterials(): DeepMaterial[] {
  return definitions.map(({ fileName, ...definition }) => ({
    ...definition,
    contentMd: readFileSync(join(contentDirectory, fileName), "utf8").trim(),
  }));
}

export function countMaterialWords(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```\w*/g, ""))
    .replace(/[#>*|`_\\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function validateDeepMaterials(materials: DeepMaterial[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  if (materials.length !== 4) {
    errors.push(`Esperados 4 materiais profundos; encontrados ${materials.length}.`);
  }

  for (const material of materials) {
    const wordCount = countMaterialWords(material.contentMd);

    if (ids.has(material.editorialId)) errors.push(`editorial_id duplicado: ${material.editorialId}.`);
    if (slugs.has(material.slug)) errors.push(`slug duplicado: ${material.slug}.`);
    ids.add(material.editorialId);
    slugs.add(material.slug);

    if (material.editorialVersion !== DEEP_MATERIALS_EDITORIAL_VERSION) {
      errors.push(`${material.editorialId} esta fora da versao pgm-2026-v2.`);
    }
    if (material.sourceReference !== DEEP_MATERIALS_SOURCE_REFERENCE) {
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
    if (wordCount > 3200) errors.push(`${material.editorialId} excede a meta editorial: ${wordCount} palavras.`);
    if (material.relatedFlashcardIds.length === 0) {
      errors.push(`${material.editorialId} nao referencia flashcards existentes.`);
    }
    if (material.relatedSimulationQuestionIds.length === 0) {
      errors.push(`${material.editorialId} nao referencia simulados existentes.`);
    }

    for (const heading of requiredHeadings) {
      if (!material.contentMd.includes(heading)) {
        errors.push(`${material.editorialId} esta sem a secao: ${heading}.`);
      }
    }
  }

  return errors;
}

export function validateDeepMaterialRelations(
  materials: DeepMaterial[],
  relations: {
    flashcardIds: Set<string>;
    simulationQuestionIds: Set<string>;
  },
) {
  const errors: string[] = [];

  for (const material of materials) {
    for (const flashcardId of material.relatedFlashcardIds) {
      if (!relations.flashcardIds.has(flashcardId)) {
        errors.push(`${material.editorialId} referencia flashcard inexistente: ${flashcardId}.`);
      }
    }

    for (const questionId of material.relatedSimulationQuestionIds) {
      if (!relations.simulationQuestionIds.has(questionId)) {
        errors.push(`${material.editorialId} referencia questao inexistente: ${questionId}.`);
      }
    }
  }

  return errors;
}

export function formatDeepMaterialsSummary(materials: DeepMaterial[]) {
  return [
    `Materiais profundos: ${materials.length}`,
    ...materials.map(
      (material) => `${material.editorialId}: ${countMaterialWords(material.contentMd)} palavras`,
    ),
    `Editorial version: ${DEEP_MATERIALS_EDITORIAL_VERSION}`,
    `Source reference: ${DEEP_MATERIALS_SOURCE_REFERENCE}`,
  ].join("\n");
}
