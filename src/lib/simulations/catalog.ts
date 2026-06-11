export type SimulationTemplateCatalogItem = {
  id: string;
  editorial_id?: string | null;
  source_reference?: string | null;
  tenant_id?: string | null;
  title: string;
  description: string | null;
  type: "quick" | "full";
  language: "english" | "spanish" | "portuguese" | "mixed" | "psychosocial";
  total_questions: number;
  is_premium: boolean;
};

export type ObjectiveQuestionCatalogItem = {
  id: string;
  source_reference?: string | null;
  language: "english" | "spanish" | "portuguese" | "mixed" | "psychosocial";
  type: "objective" | "subjective" | "psychosocial";
};

export type SimulationTemplateAccess = SimulationTemplateCatalogItem & {
  availableQuestionCount: number;
  lockedReason: "premium_required" | "no_questions" | "insufficient_questions" | null;
};

export function getTemplateLockReason(
  template: SimulationTemplateCatalogItem,
  hasPaidAccess: boolean,
) {
  if ((template.is_premium || template.type === "full") && !hasPaidAccess) {
    return "premium_required" as const;
  }

  return null;
}

export function countQuestionsForTemplate(
  template: SimulationTemplateCatalogItem,
  questions: ObjectiveQuestionCatalogItem[],
) {
  return questions.filter((question) => {
    if (question.type !== "objective") {
      return false;
    }

    const languageMatches =
      template.language === "mixed" || question.language === template.language;
    const sourceMatches =
      !template.source_reference ||
      question.source_reference === template.source_reference;

    return languageMatches && sourceMatches;
  }).length;
}

export function buildTemplateAccessList(
  templates: SimulationTemplateCatalogItem[],
  questions: ObjectiveQuestionCatalogItem[],
  hasPaidAccess: boolean,
) {
  return templates.map((template) => {
    const availableQuestionCount = countQuestionsForTemplate(
      template,
      questions,
    );
    const premiumLock = getTemplateLockReason(template, hasPaidAccess);

    return {
      ...template,
      availableQuestionCount,
      lockedReason:
        premiumLock ??
        (availableQuestionCount === 0
          ? "no_questions"
          : availableQuestionCount < template.total_questions
            ? "insufficient_questions"
            : null),
    } satisfies SimulationTemplateAccess;
  });
}
