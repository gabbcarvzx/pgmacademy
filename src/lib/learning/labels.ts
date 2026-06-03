import type { LearningItemType } from "@/lib/learning/service";

export const languageLabel = {
  english: "Ingles",
  spanish: "Espanhol",
  portuguese: "Portugues",
  mixed: "Misto",
  psychosocial: "Psicossocial",
} as const;

export const difficultyLabel = {
  beginner: "Iniciante",
  intermediate: "Intermediario",
  advanced: "Avancado",
  mixed: "Misto",
} as const;

export const itemTypeLabel = {
  study_material: "Material",
  flashcard: "Flashcards",
  question: "Questoes",
  psychosocial_question: "Psicossocial",
  simulation_template: "Simulado",
} satisfies Record<LearningItemType, string>;
