import type { SupabaseClient } from "@supabase/supabase-js";

import {
  editorialCategories,
  editorialCompetencies,
  editorialVersion,
} from "@/lib/editorial/taxonomy";
import type { Database } from "@/types/database";

import type {
  EditorialImportQuestion,
  EditorialImportRepository,
  EditorialQuestionExistingRecord,
  EditorialQuestionPersistPayload,
} from "./types";

type DbError = { message: string };
type DbRecord = { id: string };
type DbResult<T> = { data: T | null; error: DbError | null };
type DbBuilder<T> = PromiseLike<DbResult<T>> & {
  eq(column: string, value: unknown): DbBuilder<T>;
  is(column: string, value: null): DbBuilder<T>;
  maybeSingle(): PromiseLike<DbResult<T>>;
  select(columns: string): DbBuilder<T>;
  single(): PromiseLike<DbResult<T>>;
};
type DbTable = {
  delete(): DbBuilder<null>;
  insert(payload: Record<string, unknown> | Record<string, unknown>[]): DbBuilder<DbRecord>;
  select(columns: string): DbBuilder<DbRecord>;
  update(payload: Record<string, unknown>): DbBuilder<null>;
};

export class SupabaseEditorialImportRepository implements EditorialImportRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findQuestionByEditorialId(
    editorialId: string,
  ): Promise<EditorialQuestionExistingRecord | null> {
    const result = await dbTable(this.client, "questions")
      .select("id, editorial_id")
      .eq("editorial_id", editorialId)
      .maybeSingle();
    assertNoError(`buscar questão ${editorialId}`, result);

    return result.data?.id ? { id: result.data.id, editorialId } : null;
  }

  async prepareQuestionDependencies(question: EditorialImportQuestion) {
    const editorialVersionId = await this.ensureEditorialVersion();
    const primaryCompetencyId = await this.ensureCompetency(question.competence);
    const categoryId = await this.ensureCategory(question.category, question.subcategory, editorialVersionId);
    const bankId = await this.ensureQuestionBank(question, editorialVersionId);

    return {
      bankId,
      categoryId,
      editorialVersionId,
      primaryCompetencyId,
    };
  }

  async createQuestion(payload: EditorialQuestionPersistPayload): Promise<string> {
    const result = await dbTable(this.client, "questions")
      .insert(questionPayload(payload))
      .select("id")
      .single();
    assertNoError(`criar questão ${payload.question.id}`, result);

    if (!result.data?.id) {
      throw new Error(`Questão ${payload.question.id} não retornou ID.`);
    }

    await this.replaceOptions(result.data.id, payload.question);
    return result.data.id;
  }

  async updateQuestion(
    existingQuestionId: string,
    payload: EditorialQuestionPersistPayload,
  ): Promise<void> {
    assertNoError(
      `atualizar questão ${payload.question.id}`,
      await dbTable(this.client, "questions")
        .update(questionPayload(payload))
        .eq("id", existingQuestionId),
    );

    await this.replaceOptions(existingQuestionId, payload.question);
  }

  private async ensureEditorialVersion() {
    const existing = await this.findIdByColumn(
      "editorial_versions",
      "code",
      editorialVersion.code,
    );
    const payload = {
      code: editorialVersion.code,
      title: editorialVersion.title,
      edital_year: editorialVersion.editalYear,
      status: editorialVersion.status,
      source_reference: editorialVersion.sourceReference,
      summary: "Versão editorial usada pelo pipeline de importação da Sprint 6B.1.",
      published_at: new Date().toISOString(),
    };

    if (existing) {
      assertNoError(
        `atualizar versão editorial ${editorialVersion.code}`,
        await dbTable(this.client, "editorial_versions").update(payload).eq("id", existing),
      );
      return existing;
    }

    const result = await dbTable(this.client, "editorial_versions")
      .insert(payload)
      .select("id")
      .single();
    assertNoError(`criar versão editorial ${editorialVersion.code}`, result);
    return requireId(result, editorialVersion.code);
  }

  private async ensureCompetency(code: string) {
    const competency = editorialCompetencies.find((item) => item.code === code);
    if (!competency) {
      throw new Error(`Competência não existe na matriz editorial: ${code}.`);
    }

    const existing = await this.findIdByColumn("editorial_competencies", "code", code);
    const payload = {
      code: competency.code,
      title: competency.title,
      description: competency.description,
      category_slug: competency.categorySlug,
      subcategory_slug: competency.subcategorySlug,
      language: competency.language,
      is_active: true,
    };

    if (existing) {
      assertNoError(
        `atualizar competência ${code}`,
        await dbTable(this.client, "editorial_competencies").update(payload).eq("id", existing),
      );
      return existing;
    }

    const result = await dbTable(this.client, "editorial_competencies")
      .insert(payload)
      .select("id")
      .single();
    assertNoError(`criar competência ${code}`, result);
    return requireId(result, code);
  }

  private async ensureCategory(
    categorySlug: string,
    subcategorySlug: string,
    editorialVersionId: string,
  ) {
    const category = editorialCategories.find((item) => item.slug === categorySlug);
    const subcategory = category?.subcategories.find(
      (item) => item.slug === subcategorySlug,
    );

    if (!category || !subcategory) {
      throw new Error(`Categoria/subcategoria inválida: ${categorySlug}/${subcategorySlug}.`);
    }

    const existingSubcategory = await this.findGlobalCategoryId(
      subcategorySlug,
      category.language,
    );
    if (existingSubcategory) return existingSubcategory;

    const parentId = await this.ensureParentCategory(categorySlug, editorialVersionId);
    const result = await dbTable(this.client, "question_categories")
      .insert({
        editorial_id: `EDITORIAL-CAT-${categorySlug}-${subcategorySlug}`.toUpperCase(),
        editorial_version_id: editorialVersionId,
        tenant_id: null,
        parent_id: parentId,
        name: subcategory.title,
        slug: subcategory.slug,
        language: category.language,
        source_reference: editorialVersion.sourceReference,
        tags: [categorySlug, subcategorySlug],
      })
      .select("id")
      .single();
    assertNoError(`criar subcategoria ${subcategorySlug}`, result);
    return requireId(result, subcategorySlug);
  }

  private async ensureParentCategory(categorySlug: string, editorialVersionId: string) {
    const category = editorialCategories.find((item) => item.slug === categorySlug);
    if (!category) throw new Error(`Categoria inválida: ${categorySlug}.`);

    const existing = await this.findGlobalCategoryId(categorySlug, category.language);
    if (existing) return existing;

    const result = await dbTable(this.client, "question_categories")
      .insert({
        editorial_id: `EDITORIAL-CAT-${categorySlug}`.toUpperCase(),
        editorial_version_id: editorialVersionId,
        tenant_id: null,
        parent_id: null,
        name: category.title,
        slug: category.slug,
        language: category.language,
        source_reference: editorialVersion.sourceReference,
        tags: [categorySlug],
      })
      .select("id")
      .single();
    assertNoError(`criar categoria ${categorySlug}`, result);
    return requireId(result, categorySlug);
  }

  private async ensureQuestionBank(
    question: EditorialImportQuestion,
    editorialVersionId: string,
  ) {
    const bankEditorialId = `IMPORT-BANK-${question.editorial_version}-${question.language}`.toUpperCase();
    const existing = await this.findByEditorialId("question_banks", bankEditorialId);
    const payload = {
      editorial_id: bankEditorialId,
      editorial_version_id: editorialVersionId,
      tenant_id: null,
      title: `Banco Editorial ${question.editorial_version} - ${question.language}`,
      description: "Banco gerenciado pelo pipeline de importação editorial.",
      language: question.language,
      is_premium: true,
      is_active: true,
      source_reference: editorialVersion.sourceReference,
      tags: ["pipeline-editorial", question.editorial_version, question.language],
    };

    if (existing) {
      assertNoError(
        `atualizar banco ${bankEditorialId}`,
        await dbTable(this.client, "question_banks").update(payload).eq("id", existing),
      );
      return existing;
    }

    const result = await dbTable(this.client, "question_banks")
      .insert(payload)
      .select("id")
      .single();
    assertNoError(`criar banco ${bankEditorialId}`, result);
    return requireId(result, bankEditorialId);
  }

  private async replaceOptions(
    questionId: string,
    question: EditorialImportQuestion,
  ) {
    assertNoError(
      `remover alternativas anteriores ${question.id}`,
      await dbTable(this.client, "question_options").delete().eq("question_id", questionId),
    );

    assertNoError(
      `criar alternativas ${question.id}`,
      await dbTable(this.client, "question_options").insert(
        question.options.map((option) => ({
          tenant_id: null,
          question_id: questionId,
          option_label: option.label,
          option_text: option.text,
          is_correct: option.label === question.correct_answer,
        })),
      ),
    );
  }

  private async findGlobalCategoryId(slug: string, language: string) {
    const result = await dbTable(this.client, "question_categories")
      .select("id")
      .eq("slug", slug)
      .eq("language", language)
      .is("tenant_id", null)
      .maybeSingle();
    assertNoError(`buscar categoria ${slug}`, result);
    return result.data?.id ?? null;
  }

  private async findByEditorialId(
    tableName: keyof Database["public"]["Tables"],
    editorialId: string,
  ) {
    const result = await dbTable(this.client, tableName)
      .select("id")
      .eq("editorial_id", editorialId)
      .maybeSingle();
    assertNoError(`buscar ${tableName}.${editorialId}`, result);
    return result.data?.id ?? null;
  }

  private async findIdByColumn(
    tableName: keyof Database["public"]["Tables"],
    column: string,
    value: string,
  ) {
    const result = await dbTable(this.client, tableName)
      .select("id")
      .eq(column, value)
      .maybeSingle();
    assertNoError(`buscar ${tableName}.${value}`, result);
    return result.data?.id ?? null;
  }
}

function questionPayload(payload: EditorialQuestionPersistPayload) {
  const question = payload.question;

  return {
    editorial_id: question.id,
    editorial_version_id: payload.editorialVersionId,
    primary_competency_id: payload.primaryCompetencyId,
    editorial_difficulty_level: question.difficulty_level,
    tenant_id: null,
    bank_id: payload.bankId,
    category_id: payload.categoryId,
    title: question.title,
    type: "objective",
    difficulty: payload.legacyDifficulty,
    language: question.language,
    statement: question.statement,
    explanation: question.explanation,
    source_reference: question.source_reference,
    tags: question.tags,
    is_active: question.status === "active",
  };
}

function dbTable(
  client: SupabaseClient<Database>,
  tableName: keyof Database["public"]["Tables"],
): DbTable {
  return client.from(tableName as never) as unknown as DbTable;
}

function assertNoError<T>(label: string, result: DbResult<T>): asserts result is DbResult<T> {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }
}

function requireId(result: DbResult<DbRecord>, label: string) {
  if (!result.data?.id) {
    throw new Error(`${label} não retornou ID.`);
  }

  return result.data.id;
}
