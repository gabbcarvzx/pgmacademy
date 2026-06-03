import type { LearningItemType } from "@/lib/learning/service";

export const languageLabel = {
  english: "Inglês",
  spanish: "Espanhol",
  portuguese: "Português",
  mixed: "Misto",
  psychosocial: "Psicossocial",
} as const;

export const difficultyLabel = {
  beginner: "Iniciante",
  intermediate: "Intermediario",
  advanced: "Avançado",
  mixed: "Misto",
} as const;

export const itemTypeLabel = {
  study_material: "Material",
  flashcard: "Flashcards",
  question: "Questões",
  psychosocial_question: "Psicossocial",
  simulation_template: "Simulado",
} satisfies Record<LearningItemType, string>;
