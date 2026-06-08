import {
  editorialCategories,
  editorialCompetencies,
  editorialDifficultyLevels,
  editorialVersion,
  type EditorialLanguage,
} from "@/lib/editorial/taxonomy";

import type {
  EditorialImportOptionLabel,
  EditorialImportQuestion,
  EditorialValidationIssue,
  EditorialValidationReport,
} from "./types";

const validLanguages: EditorialLanguage[] = [
  "english",
  "spanish",
  "portuguese",
  "mixed",
  "psychosocial",
];
const validOptionLabels: EditorialImportOptionLabel[] = ["A", "B", "C", "D", "E"];

export function validateEditorialImportQuestions(
  questions: EditorialImportQuestion[],
): EditorialValidationReport {
  const issues: EditorialValidationIssue[] = [];
  const seenIds = new Set<string>();
  const duplicatedIds = new Set<string>();
  const invalidQuestionIds = new Set<string>();

  for (const question of questions) {
    if (!question.id) {
      addIssue(issues, null, "critical", "missing_id", "Questão sem ID editorial.");
      continue;
    }

    if (seenIds.has(question.id)) {
      duplicatedIds.add(question.id);
      addIssue(
        issues,
        question.id,
        "critical",
        "duplicate_id",
        `ID duplicado no arquivo: ${question.id}.`,
      );
    }
    seenIds.add(question.id);
  }

  for (const question of questions) {
    validateQuestion(question, issues);
  }

  for (const issue of issues) {
    if (issue.questionId && issue.severity !== "warning") {
      invalidQuestionIds.add(issue.questionId);
    }
  }

  for (const id of duplicatedIds) {
    invalidQuestionIds.add(id);
  }

  const warnings = issues.filter((issue) => issue.severity === "warning");
  const errors = issues.filter((issue) => issue.severity === "error");
  const criticalErrors = issues.filter((issue) => issue.severity === "critical");
  const validQuestionIds = questions
    .map((question) => question.id)
    .filter((id) => id && !invalidQuestionIds.has(id));

  return {
    totalQuestions: questions.length,
    validQuestions: validQuestionIds.length,
    invalidQuestions: questions.length - validQuestionIds.length,
    warnings,
    errors,
    criticalErrors,
    validQuestionIds,
    invalidQuestionIds: [...invalidQuestionIds],
  };
}

function validateQuestion(
  question: EditorialImportQuestion,
  issues: EditorialValidationIssue[],
) {
  const questionId = question.id || null;

  requireText(issues, questionId, question.title, "missing_title", "Título obrigatório.");
  requireText(
    issues,
    questionId,
    question.statement,
    "missing_statement",
    "Enunciado obrigatório.",
  );
  requireText(
    issues,
    questionId,
    question.explanation,
    "missing_explanation",
    "Explicação obrigatória.",
  );
  requireText(
    issues,
    questionId,
    question.source_reference,
    "missing_source_reference",
    "Fonte editorial obrigatória.",
  );

  if (question.statement && question.statement.length < 30) {
    addIssue(
      issues,
      questionId,
      "error",
      "statement_too_short",
      "Enunciado muito curto para questão objetiva.",
    );
  } else if (question.statement && question.statement.length < 80) {
    addIssue(
      issues,
      questionId,
      "warning",
      "statement_shallow",
      "Enunciado curto; revise se há contexto suficiente.",
    );
  }

  if (question.explanation && question.explanation.length < 80) {
    addIssue(
      issues,
      questionId,
      "error",
      "explanation_too_shallow",
      "Explicação rasa; detalhe a resposta correta e os distratores.",
    );
  } else if (question.explanation && question.explanation.length < 140) {
    addIssue(
      issues,
      questionId,
      "warning",
      "explanation_could_be_stronger",
      "Explicação aceita, mas pode ser mais robusta.",
    );
  }

  validateLanguage(question, issues);
  validateCategoryAndCompetence(question, issues);
  validateDifficulty(question, issues);
  validateOptions(question, issues);

  if (question.tags.length === 0) {
    addIssue(issues, questionId, "error", "missing_tags", "Tags obrigatórias.");
  }

  if (question.editorial_version !== editorialVersion.code) {
    addIssue(
      issues,
      questionId,
      "critical",
      "invalid_editorial_version",
      `Versão editorial inválida: ${question.editorial_version || "vazia"}.`,
    );
  }

  if (question.status === "inactive") {
    addIssue(
      issues,
      questionId,
      "warning",
      "inactive_question",
      "Questão marcada como inactive; será importada como inativa.",
    );
  }
}

function validateLanguage(
  question: EditorialImportQuestion,
  issues: EditorialValidationIssue[],
) {
  if (!validLanguages.includes(question.language)) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "invalid_language",
      `Idioma inválido: ${question.language || "vazio"}.`,
    );
  }
}

function validateCategoryAndCompetence(
  question: EditorialImportQuestion,
  issues: EditorialValidationIssue[],
) {
  const category = editorialCategories.find(
    (item) => item.slug === question.category,
  );

  if (!category) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "invalid_category",
      `Categoria inválida: ${question.category || "vazia"}.`,
    );
    return;
  }

  if (
    !category.subcategories.some(
      (subcategory) => subcategory.slug === question.subcategory,
    )
  ) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "invalid_subcategory",
      `Subcategoria inválida para ${question.category}: ${question.subcategory || "vazia"}.`,
    );
  }

  const competence = editorialCompetencies.find(
    (item) => item.code === question.competence,
  );

  if (!competence) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "invalid_competence",
      `Competência inválida: ${question.competence || "vazia"}.`,
    );
    return;
  }

  if (
    competence.categorySlug !== question.category ||
    competence.subcategorySlug !== question.subcategory
  ) {
    addIssue(
      issues,
      question.id || null,
      "error",
      "competence_scope_mismatch",
      `Competência ${question.competence} não pertence à categoria/subcategoria informada.`,
    );
  }
}

function validateDifficulty(
  question: EditorialImportQuestion,
  issues: EditorialValidationIssue[],
) {
  if (
    !editorialDifficultyLevels.some(
      (level) => level.level === question.difficulty_level,
    )
  ) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "invalid_difficulty",
      `Dificuldade inválida: ${question.difficulty_level || "vazia"}.`,
    );
  }
}

function validateOptions(
  question: EditorialImportQuestion,
  issues: EditorialValidationIssue[],
) {
  const labels = question.options.map((option) => option.label);
  const uniqueLabels = new Set(labels);
  const normalizedTexts = question.options.map((option) =>
    option.text.trim().toLowerCase(),
  );
  const uniqueTexts = new Set(normalizedTexts);
  const correctMarked = question.options.filter((option) => option.isCorrect);

  if (question.options.length < 4 || question.options.length > 5) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "invalid_option_count",
      "Questão deve possuir 4 ou 5 alternativas.",
    );
  }

  if (uniqueLabels.size !== labels.length) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "duplicate_option_label",
      "Alternativas possuem rótulos duplicados.",
    );
  }

  if (uniqueTexts.size !== normalizedTexts.length) {
    addIssue(
      issues,
      question.id || null,
      "error",
      "duplicate_option_text",
      "Alternativas duplicadas detectadas.",
    );
  }

  for (const option of question.options) {
    if (!validOptionLabels.includes(option.label) || !option.text) {
      addIssue(
        issues,
        question.id || null,
        "critical",
        "invalid_option",
        "Alternativa inválida ou sem texto.",
      );
    }
  }

  if (!question.correct_answer) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "missing_correct_answer",
      "Questão sem gabarito.",
    );
  }

  if (!question.options.some((option) => option.label === question.correct_answer)) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "correct_answer_not_found",
      `Alternativa correta inexistente: ${question.correct_answer || "vazia"}.`,
    );
  }

  if (correctMarked.length > 1) {
    addIssue(
      issues,
      question.id || null,
      "critical",
      "multiple_correct_options",
      "Apenas uma alternativa pode estar marcada como correta.",
    );
  }
}

function requireText(
  issues: EditorialValidationIssue[],
  questionId: string | null,
  value: string,
  code: string,
  message: string,
) {
  if (!value.trim()) {
    addIssue(issues, questionId, "critical", code, message);
  }
}

function addIssue(
  issues: EditorialValidationIssue[],
  questionId: string | null,
  severity: EditorialValidationIssue["severity"],
  code: string,
  message: string,
) {
  issues.push({ questionId, severity, code, message });
}
