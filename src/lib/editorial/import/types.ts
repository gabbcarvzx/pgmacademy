import type { EditorialLanguage } from "@/lib/editorial/taxonomy";

export type EditorialImportFormat = "json" | "csv" | "markdown";
export type EditorialImportMode = "dry-run" | "execute";
export type EditorialImportStatus = "active" | "draft" | "inactive";
export type EditorialImportOptionLabel = "A" | "B" | "C" | "D" | "E";

export type EditorialImportOption = {
  label: EditorialImportOptionLabel;
  text: string;
  isCorrect?: boolean;
};

export type EditorialImportQuestion = {
  id: string;
  title: string;
  statement: string;
  language: EditorialLanguage;
  category: string;
  subcategory: string;
  competence: string;
  difficulty_level: 1 | 2 | 3 | 4;
  options: EditorialImportOption[];
  correct_answer: EditorialImportOptionLabel;
  explanation: string;
  tags: string[];
  editorial_version: string;
  source_reference: string;
  is_premium: boolean;
  status: EditorialImportStatus;
};

export type EditorialImportParseResult = {
  format: EditorialImportFormat;
  questions: EditorialImportQuestion[];
  warnings: string[];
};

export type EditorialValidationIssue = {
  questionId: string | null;
  severity: "warning" | "error" | "critical";
  code: string;
  message: string;
};

export type EditorialValidationReport = {
  totalQuestions: number;
  validQuestions: number;
  invalidQuestions: number;
  warnings: EditorialValidationIssue[];
  errors: EditorialValidationIssue[];
  criticalErrors: EditorialValidationIssue[];
  validQuestionIds: string[];
  invalidQuestionIds: string[];
};

export type EditorialImportAction =
  | "would_create"
  | "would_update"
  | "would_ignore"
  | "would_reject"
  | "created"
  | "updated"
  | "ignored"
  | "rejected";

export type EditorialImportItemResult = {
  questionId: string;
  action: EditorialImportAction;
  reason: string;
};

export type EditorialImportReport = {
  filePath: string;
  generatedAt: string;
  mode: EditorialImportMode;
  updateExisting: boolean;
  totalItems: number;
  validItems: number;
  invalidItems: number;
  created: number;
  updated: number;
  ignored: number;
  rejected: number;
  warnings: EditorialValidationIssue[];
  errors: EditorialValidationIssue[];
  criticalErrors: EditorialValidationIssue[];
  items: EditorialImportItemResult[];
  reportPath?: string;
};

export type EditorialQuestionExistingRecord = {
  id: string;
  editorialId: string;
};

export type EditorialQuestionPersistPayload = {
  question: EditorialImportQuestion;
  legacyDifficulty: "beginner" | "intermediate" | "advanced";
  bankId: string;
  categoryId: string;
  editorialVersionId: string;
  primaryCompetencyId: string;
};

export type EditorialImportRepository = {
  findQuestionByEditorialId(editorialId: string): Promise<EditorialQuestionExistingRecord | null>;
  prepareQuestionDependencies(question: EditorialImportQuestion): Promise<{
    bankId: string;
    categoryId: string;
    editorialVersionId: string;
    primaryCompetencyId: string;
  }>;
  createQuestion(payload: EditorialQuestionPersistPayload): Promise<string>;
  updateQuestion(existingQuestionId: string, payload: EditorialQuestionPersistPayload): Promise<void>;
};

export type EditorialImportRunOptions = {
  filePath: string;
  mode: EditorialImportMode;
  updateExisting: boolean;
  repository?: EditorialImportRepository;
  reportDirectory?: string;
  writeReport?: boolean;
};
