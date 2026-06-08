import { academyModules } from "@/lib/academy/content";
import { officialSubjectiveRubric } from "@/lib/simulations/official-pgm";

import { editorialVersion, type EditorialCategorySlug } from "./taxonomy";

export type ObjectiveSimulationBlueprint = {
  code: string;
  title: string;
  editorialVersionCode: string;
  totalQuestions: number;
  durationMinutes: number;
  pointsPerQuestion: number;
  languageMode: "english_or_spanish";
  categoryDistribution: {
    categorySlug: EditorialCategorySlug;
    subcategorySlug: string;
    questions: number;
    notes: string;
  }[];
  difficultyDistribution: {
    level: 1 | 2 | 3 | 4;
    questions: number;
  }[];
  minimumCompetencyCodes: string[];
};

export type AcademyModuleBlueprint = {
  moduleId: string;
  order: number;
  title: string;
  objectives: string[];
  competencyCodes: string[];
  contentCount: number;
  activityTypes: string[];
  relatedSimulationCodes: string[];
};

export type ManualReviewBlueprint = {
  code: string;
  title: string;
  targetItems: number;
  criteria: string[];
  metadataRequired: string[];
};

export const objectiveSimulationBlueprint: ObjectiveSimulationBlueprint = {
  code: "official-objective-pgm-2026",
  title: "Blueprint Editorial do Simulado Objetivo PGM 2026",
  editorialVersionCode: editorialVersion.code,
  totalQuestions: 30,
  durationMinutes: 240,
  pointsPerQuestion: 2,
  languageMode: "english_or_spanish",
  categoryDistribution: [
    {
      categorySlug: "english",
      subcategorySlug: "reading-comprehension",
      questions: 8,
      notes: "Usar Inglês ou substituir por Comprensión Lectora quando o idioma escolhido for Espanhol.",
    },
    {
      categorySlug: "english",
      subcategorySlug: "grammar",
      questions: 5,
      notes: "Usar Grammar ou Gramática conforme idioma escolhido.",
    },
    {
      categorySlug: "english",
      subcategorySlug: "vocabulary",
      questions: 5,
      notes: "Usar Vocabulary ou Vocabulario conforme idioma escolhido.",
    },
    {
      categorySlug: "english",
      subcategorySlug: "communication",
      questions: 2,
      notes: "Usar Communication ou Comunicación conforme idioma escolhido.",
    },
    {
      categorySlug: "pgm-selection-process",
      subcategorySlug: "edital",
      questions: 2,
      notes: "Questões sobre leitura segura de edital, etapas e regras.",
    },
    {
      categorySlug: "pgm-selection-process",
      subcategorySlug: "eligibilidade",
      questions: 2,
      notes: "Questões sobre requisitos, documentação e critérios.",
    },
    {
      categorySlug: "international-life",
      subcategorySlug: "cultura",
      questions: 3,
      notes: "Situações de cultura, convivência e rotina internacional.",
    },
    {
      categorySlug: "international-life",
      subcategorySlug: "adaptacao-cultural",
      questions: 3,
      notes: "Situações de adaptação, host family, escola e intercâmbio.",
    },
  ],
  difficultyDistribution: [
    { level: 1, questions: 8 },
    { level: 2, questions: 12 },
    { level: 3, questions: 7 },
    { level: 4, questions: 3 },
  ],
  minimumCompetencyCodes: [
    "eng-identify-main-idea",
    "eng-infer-implicit-information",
    "eng-contextual-vocabulary",
    "eng-apply-grammar-rule",
    "spa-interpret-texts",
    "spa-apply-grammar",
    "spa-recognize-false-cognates",
    "pgm-understand-edital",
    "pgm-check-eligibility",
    "life-understand-cultural-differences",
  ],
};

export const academyModuleBlueprints: AcademyModuleBlueprint[] = [
  {
    moduleId: "approval-route",
    order: 1,
    title: "Rota de Aprovação PGM",
    objectives: [
      "Entender o processo seletivo sem depender de informação informal.",
      "Conectar diagnóstico, edital, plano de estudo e simulados.",
    ],
    competencyCodes: [
      "pgm-understand-edital",
      "pgm-check-eligibility",
      "pgm-organize-documentation",
    ],
    contentCount: 5,
    activityTypes: ["material", "onboarding", "diagnostico"],
    relatedSimulationCodes: ["official-objective-pgm-2026"],
  },
  {
    moduleId: "english",
    order: 2,
    title: "Inglês para o PGM",
    objectives: [
      "Treinar leitura, vocabulário, gramática e comunicação em inglês.",
      "Preparar o aluno para questões objetivas aplicadas.",
    ],
    competencyCodes: [
      "eng-identify-main-idea",
      "eng-infer-implicit-information",
      "eng-contextual-vocabulary",
      "eng-apply-grammar-rule",
      "eng-everyday-communication",
    ],
    contentCount: 5,
    activityTypes: ["path", "flashcards", "material", "simulation"],
    relatedSimulationCodes: ["official-objective-pgm-2026"],
  },
  {
    moduleId: "spanish",
    order: 3,
    title: "Espanhol para o PGM",
    objectives: [
      "Treinar leitura, vocabulário, gramática e comunicação em espanhol.",
      "Reduzir erros por falsos cognatos e interpretação literal.",
    ],
    competencyCodes: [
      "spa-interpret-texts",
      "spa-apply-grammar",
      "spa-recognize-false-cognates",
      "spa-everyday-communication",
    ],
    contentCount: 5,
    activityTypes: ["path", "flashcards", "material", "simulation"],
    relatedSimulationCodes: ["official-objective-pgm-2026"],
  },
  {
    moduleId: "international-writing",
    order: 4,
    title: "Escrita Internacional",
    objectives: [
      "Preparar respostas entre 90 e 150 palavras.",
      "Treinar estrutura, coesão, clareza, gramática e vocabulário.",
    ],
    competencyCodes: [
      "writing-structure-answer",
      "writing-use-cohesion",
      "writing-keep-clarity",
    ],
    contentCount: 5,
    activityTypes: ["subjective", "rubric", "manual_review"],
    relatedSimulationCodes: ["official-subjective-pgm-2026"],
  },
  {
    moduleId: "psychosocial",
    order: 5,
    title: "Treino Psicossocial",
    objectives: [
      "Treinar comunicação, maturidade, autonomia e convivência.",
      "Preparar respostas para entrevista e adaptação internacional.",
    ],
    competencyCodes: [
      "psy-demonstrate-autonomy",
      "psy-demonstrate-maturity",
      "psy-resolve-conflicts",
      "psy-communicate-adequately",
      "psy-respect-cultural-diversity",
    ],
    contentCount: 5,
    activityTypes: ["psychosocial", "manual_review"],
    relatedSimulationCodes: ["psychosocial-training-bank"],
  },
  {
    moduleId: "international-life",
    order: 6,
    title: "Vida Internacional",
    objectives: [
      "Preparar o aluno para cultura, escola, host family e adaptação.",
      "Transformar orientação prática em repertório para prova e convivência.",
    ],
    competencyCodes: [
      "life-understand-cultural-differences",
      "life-host-family-rules",
      "life-school-routine",
      "psy-respect-cultural-diversity",
    ],
    contentCount: 6,
    activityTypes: ["material", "checklist"],
    relatedSimulationCodes: ["official-objective-pgm-2026"],
  },
  {
    moduleId: "boarding-documents",
    order: 7,
    title: "Embarque e Documentação",
    objectives: [
      "Organizar passaporte, visto, mala, aeroporto, viagem e primeiros dias.",
      "Reduzir risco operacional nas etapas posteriores à seleção.",
    ],
    competencyCodes: ["pgm-organize-documentation", "psy-demonstrate-autonomy"],
    contentCount: 6,
    activityTypes: ["material", "checklist"],
    relatedSimulationCodes: ["official-objective-pgm-2026"],
  },
];

export const subjectiveImportBlueprint: ManualReviewBlueprint = {
  code: "subjective-bank-pgm-2026",
  title: "Blueprint de 50 Subjetivas PGM 2026",
  targetItems: 50,
  criteria: officialSubjectiveRubric.map((criterion) => criterion.title),
  metadataRequired: [
    "editorial_id",
    "category",
    "subcategory",
    "primary_competency_code",
    "language",
    "editorial_difficulty_level",
    "tags",
    "editorial_version_code",
    "source_reference",
  ],
};

export const psychosocialImportBlueprint: ManualReviewBlueprint = {
  code: "psychosocial-bank-pgm-2026",
  title: "Blueprint de 80 Psicossociais PGM 2026",
  targetItems: 80,
  criteria: [
    "autonomia",
    "maturidade",
    "comunicação",
    "responsabilidade",
    "adaptabilidade",
    "diversidade cultural",
    "resolução de conflitos",
  ],
  metadataRequired: [
    "editorial_id",
    "category",
    "subcategory",
    "primary_competency_code",
    "editorial_difficulty_level",
    "tags",
    "editorial_version_code",
    "source_reference",
  ],
};

export function academyBlueprintMatchesCurrentModules() {
  const currentModules = academyModules.map((academyModule) => ({
    id: academyModule.id,
    order: academyModule.order,
    contentCount: academyModule.contents.length,
  }));

  return academyModuleBlueprints.every((blueprint) =>
    currentModules.some(
      (currentModule) =>
        currentModule.id === blueprint.moduleId &&
        currentModule.order === blueprint.order &&
        currentModule.contentCount === blueprint.contentCount,
    ),
  );
}
