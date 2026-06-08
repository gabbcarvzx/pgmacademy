import type {
  EditorialImportQuestion,
  EditorialImportRepository,
  EditorialQuestionExistingRecord,
  EditorialQuestionPersistPayload,
} from "./types";

type StoredQuestion = {
  id: string;
  editorialId: string;
  payload: EditorialQuestionPersistPayload;
};

export class InMemoryEditorialImportRepository implements EditorialImportRepository {
  private questions = new Map<string, StoredQuestion>();
  public created = 0;
  public updated = 0;

  constructor(existingEditorialIds: string[] = []) {
    for (const editorialId of existingEditorialIds) {
      this.questions.set(editorialId, {
        id: `existing-${editorialId}`,
        editorialId,
        payload: null as unknown as EditorialQuestionPersistPayload,
      });
    }
  }

  async findQuestionByEditorialId(
    editorialId: string,
  ): Promise<EditorialQuestionExistingRecord | null> {
    const existing = this.questions.get(editorialId);
    return existing ? { id: existing.id, editorialId } : null;
  }

  async prepareQuestionDependencies(question: EditorialImportQuestion) {
    return {
      bankId: `bank-${question.editorial_version}-${question.language}`,
      categoryId: `category-${question.category}-${question.subcategory}`,
      editorialVersionId: `version-${question.editorial_version}`,
      primaryCompetencyId: `competency-${question.competence}`,
    };
  }

  async createQuestion(payload: EditorialQuestionPersistPayload): Promise<string> {
    const id = `question-${payload.question.id}`;
    if (!this.questions.has(payload.question.id)) {
      this.created += 1;
    }

    this.questions.set(payload.question.id, {
      id,
      editorialId: payload.question.id,
      payload,
    });

    return id;
  }

  async updateQuestion(
    existingQuestionId: string,
    payload: EditorialQuestionPersistPayload,
  ): Promise<void> {
    this.updated += 1;
    this.questions.set(payload.question.id, {
      id: existingQuestionId,
      editorialId: payload.question.id,
      payload,
    });
  }

  countQuestions() {
    return this.questions.size;
  }
}
