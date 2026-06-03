import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../src/types/database";
import type {
  ApprovedContent,
  CategorySeed,
  FlashcardSeed,
  LearningPathSeed,
  MaterialSeed,
  PathItemType,
  PsychosocialQuestionSeed,
  QuestionOptionSeed,
  QuestionSeed,
} from "./content/approved-content";
import {
  formatContentSummary,
  loadApprovedContent,
  validateApprovedContent,
} from "./content/approved-content";

type DbError = { message: string };
type DbRecord = { id: string };
type DbResult<T> = { data: T | null; error: DbError | null };
type DbBuilder<T> = PromiseLike<DbResult<T>> & {
  eq(column: string, value: unknown): DbBuilder<T>;
  is(column: string, value: null): DbBuilder<T>;
  limit(count: number): DbBuilder<T>;
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
type AdminClient = ReturnType<typeof createClient<Database>>;

const execute = process.argv.includes("--execute");

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Erro na importacao editorial: ${message}`);
  process.exit(1);
});

async function main(): Promise<void> {
  const content = loadApprovedContent();
  const errors = validateApprovedContent(content);

  if (errors.length > 0) {
    console.error("Importacao bloqueada. Corrija a validacao primeiro:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(formatContentSummary(content));

  if (!execute) {
    console.log("\nDry-run concluido. Use `npm run content:import -- --execute` para gravar no Supabase.");
    return;
  }

  loadLocalEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de executar a importacao.");
  }

  const admin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  await importContent(admin, content);
}

async function importContent(client: AdminClient, approvedContent: ApprovedContent): Promise<void> {
  await assertMetadataMigration(client);

  const categoryIds = await importCategories(client, approvedContent.categories);
  const bankIds = await importBanks(client, approvedContent);
  const templateIds = await importTemplates(client, approvedContent);
  const materialIds = await importMaterials(client, approvedContent.materials, categoryIds);
  const flashcardIds = await importFlashcards(client, approvedContent.flashcards, categoryIds);
  const questionIds = await importQuestions(
    client,
    [...approvedContent.objectiveQuestions, ...approvedContent.subjectiveQuestions],
    categoryIds,
    bankIds,
  );
  const psychosocialQuestionIds = await importPsychosocialQuestions(client, approvedContent.psychosocialQuestions);

  await importLearningPaths(client, approvedContent.learningPaths, {
    flashcardIds,
    materialIds,
    psychosocialQuestionIds,
    questionIds,
    templateIds,
  });

  console.log("\nImportacao executada com sucesso.");
}

async function importCategories(
  client: AdminClient,
  categories: CategorySeed[],
): Promise<Map<string, string>> {
  const categoryIds = new Map<string, string>();

  for (const item of categories) {
    const parentId = item.parentSlug ? categoryIds.get(item.parentSlug) : null;

    if (item.parentSlug && !parentId) {
      throw new Error(`Categoria ${item.editorialId} referencia parent_slug sem ID importado: ${item.parentSlug}`);
    }

    const id = await upsertByEditorial(client, "question_categories", item.editorialId, {
      tenant_id: null,
      parent_id: parentId,
      name: item.name,
      slug: item.slug,
      language: item.language,
      source_reference: item.sourceReference,
    }, () => findGlobalCategoryId(client, item.slug, item.language));

    categoryIds.set(item.slug, id);
  }

  console.log(`Categorias importadas/atualizadas: ${categories.length}`);
  return categoryIds;
}

async function importBanks(
  client: AdminClient,
  approvedContent: ApprovedContent,
): Promise<Map<string, string>> {
  const bankIds = new Map<string, string>();

  for (const item of approvedContent.banks) {
    const id = await upsertByEditorial(client, "question_banks", item.editorialId, {
      tenant_id: null,
      title: item.title,
      description: item.description,
      language: item.language,
      is_premium: item.isPremium,
      is_active: true,
      source_reference: item.sourceReference,
    });
    bankIds.set(item.editorialId, id);
  }

  console.log(`Bancos importados/atualizados: ${approvedContent.banks.length}`);
  return bankIds;
}

async function importTemplates(
  client: AdminClient,
  approvedContent: ApprovedContent,
): Promise<Map<string, string>> {
  const templateIds = new Map<string, string>();

  for (const item of approvedContent.templates) {
    const id = await upsertByEditorial(client, "simulation_templates", item.editorialId, {
      tenant_id: null,
      title: item.title,
      description: item.description,
      type: item.type,
      language: item.language,
      total_questions: item.totalQuestions,
      is_premium: item.isPremium,
      is_active: true,
      source_reference: item.sourceReference,
    });
    templateIds.set(item.editorialId, id);
  }

  console.log(`Templates importados/atualizados: ${approvedContent.templates.length}`);
  return templateIds;
}

async function importMaterials(
  client: AdminClient,
  materials: MaterialSeed[],
  categoryIds: Map<string, string>,
): Promise<Map<string, string>> {
  const materialIds = new Map<string, string>();

  for (const item of materials) {
    const categoryId = categoryIds.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Material ${item.editorialId} referencia categoria nao importada: ${item.categorySlug}`);
    }

    const id = await upsertByEditorial(client, "study_materials", item.editorialId, {
      tenant_id: null,
      category_id: categoryId,
      title: item.title,
      slug: item.slug,
      content_md: item.contentMd,
      difficulty: item.difficulty,
      language: item.language,
      estimated_time: item.estimatedTime,
      is_premium: item.isPremium,
      is_active: true,
      source_reference: item.sourceReference,
    }, () => findGlobalSlugId(client, "study_materials", item.slug));

    materialIds.set(item.editorialId, id);
  }

  console.log(`Materiais importados/atualizados: ${materials.length}`);
  return materialIds;
}

async function importFlashcards(
  client: AdminClient,
  flashcards: FlashcardSeed[],
  categoryIds: Map<string, string>,
): Promise<Map<string, string>> {
  const flashcardIds = new Map<string, string>();

  for (const item of flashcards) {
    const categoryId = categoryIds.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Flashcard ${item.editorialId} referencia categoria nao importada: ${item.categorySlug}`);
    }

    const id = await upsertByEditorial(client, "flashcards", item.editorialId, {
      tenant_id: null,
      category_id: categoryId,
      front_content: item.frontContent,
      back_content: item.backContent,
      language: item.language,
      difficulty: item.difficulty,
      is_premium: item.isPremium,
      is_active: true,
      source_reference: item.sourceReference,
    });

    flashcardIds.set(item.editorialId, id);
  }

  console.log(`Flashcards importados/atualizados: ${flashcards.length}`);
  return flashcardIds;
}

async function importQuestions(
  client: AdminClient,
  questions: QuestionSeed[],
  categoryIds: Map<string, string>,
  bankIds: Map<string, string>,
): Promise<Map<string, string>> {
  const questionIds = new Map<string, string>();

  for (const item of questions) {
    const bankId = bankIds.get(item.bankId);
    const categoryId = categoryIds.get(item.categorySlug);

    if (!bankId) {
      throw new Error(`Questao ${item.editorialId} referencia banco nao importado: ${item.bankId}`);
    }
    if (!categoryId) {
      throw new Error(`Questao ${item.editorialId} referencia categoria nao importada: ${item.categorySlug}`);
    }

    const id = await upsertByEditorial(client, "questions", item.editorialId, {
      tenant_id: null,
      bank_id: bankId,
      category_id: categoryId,
      type: item.type,
      difficulty: item.difficulty,
      language: item.language,
      statement: item.statement,
      explanation: item.explanation,
      source_reference: item.sourceReference,
      is_active: true,
    });

    questionIds.set(item.editorialId, id);

    for (const option of item.options) {
      await upsertQuestionOption(client, id, option);
    }
  }

  console.log(`Questoes importadas/atualizadas: ${questions.length}`);
  return questionIds;
}

async function importPsychosocialQuestions(
  client: AdminClient,
  questions: PsychosocialQuestionSeed[],
): Promise<Map<string, string>> {
  const psychosocialQuestionIds = new Map<string, string>();

  for (const item of questions) {
    const id = await upsertByEditorial(client, "psychosocial_questions", item.editorialId, {
      tenant_id: null,
      category: item.category,
      question: item.question,
      ideal_answer_guidelines: item.idealAnswerGuidelines,
      common_mistakes: item.commonMistakes,
      is_premium: item.isPremium,
      is_active: true,
      source_reference: item.sourceReference,
    });

    psychosocialQuestionIds.set(item.editorialId, id);
  }

  console.log(`Perguntas psicossociais importadas/atualizadas: ${questions.length}`);
  return psychosocialQuestionIds;
}

async function importLearningPaths(
  client: AdminClient,
  paths: LearningPathSeed[],
  maps: {
    flashcardIds: Map<string, string>;
    materialIds: Map<string, string>;
    psychosocialQuestionIds: Map<string, string>;
    questionIds: Map<string, string>;
    templateIds: Map<string, string>;
  },
): Promise<void> {
  for (const path of paths) {
    const pathId = await upsertByEditorial(client, "learning_paths", path.editorialId, {
      tenant_id: null,
      title: path.title,
      description: path.description,
      slug: path.slug,
      language: path.language,
      is_premium: path.isPremium,
      is_active: true,
      source_reference: path.sourceReference,
    }, () => findGlobalSlugId(client, "learning_paths", path.slug));

    await assertNoError(
      `limpar itens da trilha ${path.editorialId}`,
      await dbTable(client, "learning_path_items").delete().eq("path_id", pathId),
    );

    const itemRows = path.items.map((item, index) => ({
      tenant_id: null,
      path_id: pathId,
      item_type: item.itemType,
      item_id: resolvePathItemId(item.itemType, item.editorialId, maps),
      sort_order: index + 1,
    }));

    if (itemRows.length > 0) {
      await assertNoError(
        `inserir itens da trilha ${path.editorialId}`,
        await dbTable(client, "learning_path_items").insert(itemRows),
      );
    }
  }

  console.log(`Trilhas importadas/atualizadas: ${paths.length}`);
}

function resolvePathItemId(
  itemType: PathItemType,
  editorialId: string,
  maps: {
    flashcardIds: Map<string, string>;
    materialIds: Map<string, string>;
    psychosocialQuestionIds: Map<string, string>;
    questionIds: Map<string, string>;
    templateIds: Map<string, string>;
  },
): string {
  if (itemType === "study_material") return requireMapId(maps.materialIds, editorialId, itemType);
  if (itemType === "flashcard") return requireMapId(maps.flashcardIds, editorialId, itemType);
  if (itemType === "question") return requireMapId(maps.questionIds, editorialId, itemType);
  if (itemType === "psychosocial_question") return requireMapId(maps.psychosocialQuestionIds, editorialId, itemType);
  return requireMapId(maps.templateIds, editorialId, itemType);
}

function requireMapId(ids: Map<string, string>, editorialId: string, itemType: PathItemType): string {
  const id = ids.get(editorialId);
  if (!id) {
    throw new Error(`Item de trilha nao importado (${itemType}): ${editorialId}`);
  }
  return id;
}

async function upsertQuestionOption(
  client: AdminClient,
  questionId: string,
  option: QuestionOptionSeed,
): Promise<void> {
  const existingId = await findQuestionOptionId(client, questionId, option.label);
  const payload = {
    tenant_id: null,
    question_id: questionId,
    option_label: option.label,
    option_text: option.text,
    is_correct: option.isCorrect,
  };

  if (existingId) {
    await assertNoError(
      `atualizar alternativa ${option.label}`,
      await dbTable(client, "question_options").update(payload).eq("id", existingId),
    );
    return;
  }

  await assertNoError(
    `inserir alternativa ${option.label}`,
    await dbTable(client, "question_options").insert(payload),
  );
}

async function upsertByEditorial(
  client: AdminClient,
  tableName: keyof Database["public"]["Tables"],
  editorialId: string,
  payload: Record<string, unknown>,
  fallbackFindId?: () => Promise<string | null>,
): Promise<string> {
  const existingId = await findByEditorialId(client, tableName, editorialId) ?? await fallbackFindId?.() ?? null;
  const nextPayload = {
    ...payload,
    editorial_id: editorialId,
  };

  if (existingId) {
    await assertNoError(
      `atualizar ${tableName}.${editorialId}`,
      await dbTable(client, tableName).update(nextPayload).eq("id", existingId),
    );
    return existingId;
  }

  const result = await dbTable(client, tableName).insert(nextPayload).select("id").single();
  await assertNoError(`inserir ${tableName}.${editorialId}`, result);

  if (!result.data?.id) {
    throw new Error(`Insercao de ${tableName}.${editorialId} nao retornou id`);
  }

  return result.data.id;
}

async function findByEditorialId(
  client: AdminClient,
  tableName: keyof Database["public"]["Tables"],
  editorialId: string,
): Promise<string | null> {
  const result = await dbTable(client, tableName)
    .select("id")
    .eq("editorial_id", editorialId)
    .maybeSingle();
  await assertNoError(`buscar ${tableName}.${editorialId}`, result);
  return result.data?.id ?? null;
}

async function findGlobalCategoryId(
  client: AdminClient,
  slug: string,
  language: string,
): Promise<string | null> {
  const result = await dbTable(client, "question_categories")
    .select("id")
    .eq("slug", slug)
    .eq("language", language)
    .is("tenant_id", null)
    .maybeSingle();
  await assertNoError(`buscar categoria ${slug}`, result);
  return result.data?.id ?? null;
}

async function findGlobalSlugId(
  client: AdminClient,
  tableName: "study_materials" | "learning_paths",
  slug: string,
): Promise<string | null> {
  const result = await dbTable(client, tableName)
    .select("id")
    .eq("slug", slug)
    .is("tenant_id", null)
    .maybeSingle();
  await assertNoError(`buscar ${tableName}.${slug}`, result);
  return result.data?.id ?? null;
}

async function findQuestionOptionId(
  client: AdminClient,
  questionId: string,
  label: string,
): Promise<string | null> {
  const result = await dbTable(client, "question_options")
    .select("id")
    .eq("question_id", questionId)
    .eq("option_label", label)
    .maybeSingle();
  await assertNoError(`buscar alternativa ${questionId}.${label}`, result);
  return result.data?.id ?? null;
}

async function assertMetadataMigration(client: AdminClient): Promise<void> {
  const checks: Array<[keyof Database["public"]["Tables"], string]> = [
    ["question_banks", "id, editorial_id, source_reference"],
    ["question_categories", "id, editorial_id, source_reference"],
    ["questions", "id, editorial_id, source_reference"],
    ["study_materials", "id, editorial_id, source_reference"],
    ["flashcards", "id, editorial_id, source_reference"],
    ["learning_paths", "id, editorial_id, slug, source_reference"],
    ["psychosocial_questions", "id, editorial_id, source_reference"],
    ["simulation_templates", "id, editorial_id, source_reference"],
  ];

  for (const [tableName, columns] of checks) {
    await assertNoError(
      `validar migration 005 em ${tableName}`,
      await dbTable(client, tableName).select(columns).limit(1),
    );
  }
}

async function assertNoError<T>(label: string, result: DbResult<T>): Promise<void> {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }
}

function dbTable(client: AdminClient, tableName: keyof Database["public"]["Tables"]): DbTable {
  return client.from(tableName as never) as unknown as DbTable;
}

function loadLocalEnv(): void {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = join(process.cwd(), fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1).replace(/^["']|["']$/g, "");
      process.env[key] ??= value;
    }
  }
}
