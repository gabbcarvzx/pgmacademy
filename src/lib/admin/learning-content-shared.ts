import type { Database } from "@/types/database";

export type LearningLanguage =
  Database["public"]["Tables"]["study_materials"]["Row"]["language"];
export type LearningDifficulty =
  Database["public"]["Tables"]["study_materials"]["Row"]["difficulty"];
export type QuestionType = Database["public"]["Tables"]["questions"]["Row"]["type"];
export type SimulationTemplateType =
  Database["public"]["Tables"]["simulation_templates"]["Row"]["type"];
export type PathItemType =
  Database["public"]["Tables"]["learning_path_items"]["Row"]["item_type"];

export type AdminCategoryOption = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "name" | "slug" | "language"
>;
export type AdminBankOption = Pick<
  Database["public"]["Tables"]["question_banks"]["Row"],
  | "id"
  | "editorial_id"
  | "title"
  | "description"
  | "language"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "created_at"
>;
export type AdminMaterialRow = Pick<
  Database["public"]["Tables"]["study_materials"]["Row"],
  | "id"
  | "editorial_id"
  | "category_id"
  | "title"
  | "slug"
  | "content_md"
  | "difficulty"
  | "language"
  | "estimated_time"
  | "is_premium"
  | "is_active"
  | "source_reference"
  | "updated_at"
>;
export type AdminSelectOptions = {
  categories: AdminCategoryOption[];
  banks: AdminBankOption[];
  materials: Array<{ id: string; title: string }>;
  flashcards: Array<{ id: string; title: string }>;
  questions: Array<{ id: string; title: string; type: QuestionType }>;
  psychosocialQuestions: Array<{ id: string; title: string }>;
  templates: Array<{ id: string; title: string }>;
};

export const learningLanguages: LearningLanguage[] = [
  "english",
  "spanish",
  "portuguese",
  "mixed",
  "psychosocial",
];
export const learningDifficulties: LearningDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
];
export const questionTypes: QuestionType[] = [
  "objective",
  "subjective",
  "psychosocial",
];
export const templateTypes: SimulationTemplateType[] = ["quick", "full"];
export const pathItemTypes: PathItemType[] = [
  "study_material",
  "flashcard",
  "question",
  "psychosocial_question",
  "simulation_template",
];
