import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../src/types/database";
import {
  loadApprovedContent,
  SOURCE_REFERENCE,
  validateApprovedContent,
} from "./content/approved-content";

type DbError = { message: string };
type DbResult<T> = { data: T | null; error: DbError | null };
type AccessCounts = {
  categories: number;
  banks: number;
  templates: number;
  materials: number;
  flashcards: number;
  questions: number;
  questionOptions: number;
  psychosocialQuestions: number;
  learningPaths: number;
  learningPathItems: number;
};
type ContentSnapshot = AccessCounts & {
  objectiveQuestions: number;
  subjectiveQuestions: number;
  distinctQuestionEditorialIds: number;
  distinctOptionKeys: number;
};
type SourceTableName =
  | "question_categories"
  | "question_banks"
  | "simulation_templates"
  | "study_materials"
  | "flashcards"
  | "questions"
  | "psychosocial_questions"
  | "learning_paths";
type SourceSelectBuilder<T> = PromiseLike<DbResult<T[]>> & {
  eq(column: string, value: unknown): SourceSelectBuilder<T>;
};
type SourceTable<T> = {
  select(columns: string): SourceSelectBuilder<T>;
};
type IdRow = { id: string };
type CategoryRow = IdRow & { editorial_id: string | null; slug: string | null };
type PremiumRow = IdRow & { editorial_id: string | null; is_premium: boolean };
type PremiumContentRow = IdRow & { is_premium: boolean };
type ContentRelationRow = IdRow & {
  category_id: string | null;
  editorial_id: string | null;
  is_premium: boolean;
};
type QuestionRow = IdRow & {
  bank_id: string | null;
  category_id: string | null;
  editorial_id: string | null;
  source_reference: string | null;
  type: string;
};
type SupabaseClient = ReturnType<typeof createClient<Database>>;

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Falha na validação do conteúdo importado: ${message}`);
  process.exit(1);
});

async function main(): Promise<void> {
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY.");
  }

  const content = loadApprovedContent();
  const localErrors = validateApprovedContent(content);
  if (localErrors.length > 0) {
    throw new Error(`Conteúdo local inválido: ${localErrors.join("; ")}`);
  }

  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const snapshot = await validateServiceRoleSnapshot(admin, content);
  await validateRlsAccess({
    admin,
    anonKey,
    objectiveQuestionIds: snapshot.objectiveQuestionIds,
    pathIds: snapshot.pathIds,
    url,
  });

  console.log("Conteúdo importado validado com sucesso.");
  console.log(formatSnapshot(snapshot.counts));
}

async function validateServiceRoleSnapshot(
  admin: SupabaseClient,
  content: ReturnType<typeof loadApprovedContent>,
): Promise<{
  counts: ContentSnapshot;
  objectiveQuestionIds: string[];
  pathIds: string[];
}> {
  const categories = await selectBySource<CategoryRow>(admin, "question_categories", "id, editorial_id, slug");
  const banks = await selectBySource<PremiumRow>(admin, "question_banks", "id, editorial_id, is_premium");
  const templates = await selectBySource<PremiumRow>(admin, "simulation_templates", "id, editorial_id, is_premium");
  const materials = await selectBySource<ContentRelationRow>(
    admin,
    "study_materials",
    "id, editorial_id, category_id, is_premium",
  );
  const flashcards = await selectBySource<ContentRelationRow>(
    admin,
    "flashcards",
    "id, editorial_id, category_id, is_premium",
  );
  const questions = await selectBySource<QuestionRow>(
    admin,
    "questions",
    "id, editorial_id, bank_id, category_id, type, source_reference",
  );
  const psychosocialQuestions = await selectBySource<PremiumRow>(
    admin,
    "psychosocial_questions",
    "id, editorial_id, is_premium",
  );
  const learningPaths = await selectBySource<PremiumRow>(admin, "learning_paths", "id, editorial_id, is_premium");

  const objectiveQuestions = questions.filter((question) => question.type === "objective");
  const subjectiveQuestions = questions.filter((question) => question.type === "subjective");
  const objectiveQuestionIds = objectiveQuestions.map((question) => question.id);
  const pathIds = learningPaths.map((path) => path.id);

  const questionOptions = await selectQuestionOptions(admin, objectiveQuestionIds);
  const learningPathItems = await selectLearningPathItems(admin, pathIds);

  const expectedPathItemCount = content.learningPaths.reduce((total, path) => total + path.items.length, 0);
  const optionKeys = questionOptions.map((option) => `${option.question_id}:${option.option_label}`);
  const snapshot: ContentSnapshot = {
    categories: categories.length,
    banks: banks.length,
    templates: templates.length,
    materials: materials.length,
    flashcards: flashcards.length,
    questions: questions.length,
    objectiveQuestions: objectiveQuestions.length,
    subjectiveQuestions: subjectiveQuestions.length,
    questionOptions: questionOptions.length,
    distinctQuestionEditorialIds: new Set(questions.map((question) => question.editorial_id)).size,
    distinctOptionKeys: new Set(optionKeys).size,
    psychosocialQuestions: psychosocialQuestions.length,
    learningPaths: learningPaths.length,
    learningPathItems: learningPathItems.length,
  };

  expectEqual("categorias importadas", snapshot.categories, content.categories.length);
  expectEqual("bancos importados", snapshot.banks, content.banks.length);
  expectEqual("templates importados", snapshot.templates, content.templates.length);
  expectEqual("materiais importados", snapshot.materials, content.materials.length);
  expectEqual("flashcards importados", snapshot.flashcards, content.flashcards.length);
  expectEqual("questões importadas", snapshot.questions, content.objectiveQuestions.length + content.subjectiveQuestions.length);
  expectEqual("questões objetivas", snapshot.objectiveQuestions, content.objectiveQuestions.length);
  expectEqual("questões subjetivas", snapshot.subjectiveQuestions, content.subjectiveQuestions.length);
  expectEqual("alternativas importadas", snapshot.questionOptions, content.objectiveQuestions.length * 5);
  expectEqual("perguntas psicossociais", snapshot.psychosocialQuestions, content.psychosocialQuestions.length);
  expectEqual("trilhas importadas", snapshot.learningPaths, content.learningPaths.length);
  expectEqual("itens de trilha", snapshot.learningPathItems, expectedPathItemCount);
  expectEqual("editorial_id distintos em questões", snapshot.distinctQuestionEditorialIds, snapshot.questions);
  expectEqual("chaves distintas de alternativas", snapshot.distinctOptionKeys, snapshot.questionOptions);

  for (const material of materials) {
    if (!material.category_id) {
      throw new Error(`Material ${material.editorial_id} sem category_id`);
    }
  }

  for (const flashcard of flashcards) {
    if (!flashcard.category_id) {
      throw new Error(`Flashcard ${flashcard.editorial_id} sem category_id`);
    }
  }

  for (const question of questions) {
    if (!question.bank_id || !question.category_id) {
      throw new Error(`Questão ${question.editorial_id} sem banco ou categoria`);
    }
  }

  for (const question of objectiveQuestions) {
    const options = questionOptions.filter((option) => option.question_id === question.id);
    const correctOptions = options.filter((option) => option.is_correct);
    if (options.length !== 5 || correctOptions.length !== 1) {
      throw new Error(`Questão ${question.editorial_id} precisa ter 5 alternativas e 1 correta`);
    }
  }

  return {
    counts: snapshot,
    objectiveQuestionIds,
    pathIds,
  };
}

async function validateRlsAccess(input: {
  admin: SupabaseClient;
  anonKey: string;
  objectiveQuestionIds: string[];
  pathIds: string[];
  url: string;
}): Promise<void> {
  const freeUser = await createTemporaryUser(input, "free", false);
  const paidUser = await createTemporaryUser(input, "paid", true);

  try {
    const freeCounts = await visibleCountsFor(input, freeUser.client);
    const paidCounts = await visibleCountsFor(input, paidUser.client);

    expectCounts("usuário gratuito", freeCounts, {
      categories: 20,
      banks: 0,
      templates: 0,
      materials: 1,
      flashcards: 0,
      questions: 0,
      questionOptions: 0,
      psychosocialQuestions: 0,
      learningPaths: 0,
      learningPathItems: 0,
    });

    expectCounts("usuário premium", paidCounts, {
      categories: 20,
      banks: 5,
      templates: 5,
      materials: 12,
      flashcards: 60,
      questions: 120,
      questionOptions: 500,
      psychosocialQuestions: 30,
      learningPaths: 6,
      learningPathItems: 246,
    });

    await validateProgressPersistence(input.admin, freeUser, paidUser);
  } finally {
    await cleanupTemporaryUser(input.admin, freeUser);
    await cleanupTemporaryUser(input.admin, paidUser);
  }
}

async function validateProgressPersistence(
  admin: SupabaseClient,
  freeUser: {
    client: SupabaseClient;
    id: string;
    tenantId: string;
  },
  paidUser: {
    client: SupabaseClient;
    id: string;
    tenantId: string;
  },
): Promise<void> {
  const materials = await selectBySource<PremiumContentRow>(admin, "study_materials", "id, is_premium");
  const flashcards = await selectBySource<PremiumContentRow>(admin, "flashcards", "id, is_premium");
  const freeMaterial = materials.find((item) => !item.is_premium);
  const premiumFlashcard = flashcards.find((item) => item.is_premium);

  if (!freeMaterial || !premiumFlashcard) {
    throw new Error("Não foi possível localizar itens para validar progresso.");
  }

  const directInsert = await freeUser.client.from("user_learning_progress").insert({
    tenant_id: freeUser.tenantId,
    user_id: freeUser.id,
    path_id: null,
    item_type: "study_material",
    item_id: freeMaterial.id,
    completed: true,
    completed_at: new Date().toISOString(),
  });

  if (!directInsert.error) {
    throw new Error("Cliente autenticado conseguiu inserir progresso diretamente; esperado bloqueio por grant.");
  }

  await assertNoError(
    "salvar progresso de material gratuito",
    await admin.from("user_learning_progress").insert({
      tenant_id: freeUser.tenantId,
      user_id: freeUser.id,
      path_id: null,
      item_type: "study_material",
      item_id: freeMaterial.id,
      completed: true,
      completed_at: new Date().toISOString(),
    }),
  );

  await assertNoError(
    "salvar progresso de flashcard premium",
    await admin.from("user_learning_progress").insert({
      tenant_id: paidUser.tenantId,
      user_id: paidUser.id,
      path_id: null,
      item_type: "flashcard",
      item_id: premiumFlashcard.id,
      completed: true,
      completed_at: new Date().toISOString(),
    }),
  );

  const freeProgress = await freeUser.client
    .from("user_learning_progress")
    .select("id")
    .eq("user_id", freeUser.id)
    .eq("item_type", "study_material");
  await assertNoError("ler progresso gratuito", freeProgress);
  expectEqual("progresso gratuito visivel", freeProgress.data?.length ?? 0, 1);

  const paidProgress = await paidUser.client
    .from("user_learning_progress")
    .select("id")
    .eq("user_id", paidUser.id)
    .eq("item_type", "flashcard");
  await assertNoError("ler progresso premium", paidProgress);
  expectEqual("progresso premium visivel", paidProgress.data?.length ?? 0, 1);
}

async function createTemporaryUser(
  input: {
    admin: SupabaseClient;
    anonKey: string;
    url: string;
  },
  label: "free" | "paid",
  isPaid: boolean,
): Promise<{
  client: SupabaseClient;
  email: string;
  id: string;
  tenantId: string;
}> {
  const email = `pgm-content-${label}-${Date.now()}-${randomUUID().slice(0, 8)}@example.com`;
  const password = `Pgm-${randomUUID()}-8G!`;
  const createdUser = await input.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: `PGM Content ${label}`,
    },
  });

  if (createdUser.error || !createdUser.data.user) {
    throw new Error(`Criar usuário temporário ${label}: ${createdUser.error?.message ?? "sem usuário"}`);
  }

  const profile = await waitForProfile(input.admin, createdUser.data.user.id);

  if (isPaid) {
    await assertNoError(
      `marcar usuário temporário premium`,
      await input.admin.from("profiles").update({ access_status: "paid" }).eq("id", createdUser.data.user.id),
    );
  }

  const client = createClient<Database>(input.url, input.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const session = await client.auth.signInWithPassword({ email, password });
  if (session.error) {
    throw new Error(`Login usuário temporário ${label}: ${session.error.message}`);
  }

  return {
    client,
    email,
    id: createdUser.data.user.id,
    tenantId: profile.tenant_id,
  };
}

async function waitForProfile(admin: SupabaseClient, userId: string): Promise<{ tenant_id: string }> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const result = await admin.from("profiles").select("tenant_id").eq("id", userId).maybeSingle();
    await assertNoError("buscar profile temporário", result);

    if (result.data?.tenant_id) {
      return result.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Profile temporário não foi criado para ${userId}`);
}

async function cleanupTemporaryUser(
  admin: SupabaseClient,
  user: {
    client: SupabaseClient;
    email: string;
    id: string;
    tenantId: string;
  },
): Promise<void> {
  await user.client.auth.signOut();

  const deleteUser = await admin.auth.admin.deleteUser(user.id);
  if (deleteUser.error) {
    throw new Error(`Remover usuário temporário ${user.email}: ${deleteUser.error.message}`);
  }

  await assertNoError(
    `remover tenant temporário ${user.tenantId}`,
    await admin.from("tenants").delete().eq("id", user.tenantId),
  );
}

async function visibleCountsFor(
  input: {
    objectiveQuestionIds: string[];
    pathIds: string[];
  },
  client: SupabaseClient,
): Promise<AccessCounts> {
  const categories = await selectBySource<IdRow>(client, "question_categories", "id");
  const banks = await selectBySource<IdRow>(client, "question_banks", "id");
  const templates = await selectBySource<IdRow>(client, "simulation_templates", "id");
  const materials = await selectBySource<IdRow>(client, "study_materials", "id");
  const flashcards = await selectBySource<IdRow>(client, "flashcards", "id");
  const questions = await selectBySource<IdRow>(client, "questions", "id");
  const psychosocialQuestions = await selectBySource<IdRow>(client, "psychosocial_questions", "id");
  const learningPaths = await selectBySource<IdRow>(client, "learning_paths", "id");
  const questionOptions = await selectQuestionOptions(client, input.objectiveQuestionIds);
  const learningPathItems = await selectLearningPathItems(client, input.pathIds);

  return {
    categories: categories.length,
    banks: banks.length,
    templates: templates.length,
    materials: materials.length,
    flashcards: flashcards.length,
    questions: questions.length,
    questionOptions: questionOptions.length,
    psychosocialQuestions: psychosocialQuestions.length,
    learningPaths: learningPaths.length,
    learningPathItems: learningPathItems.length,
  };
}

async function selectBySource<T extends Record<string, unknown>>(
  client: SupabaseClient,
  tableName: SourceTableName,
  columns: string,
): Promise<T[]> {
  const result = await sourceTable<T>(client, tableName)
    .select(columns)
    .eq("source_reference", SOURCE_REFERENCE);
  await assertNoError(`buscar ${String(tableName)}`, result);
  return result.data ?? [];
}

function sourceTable<T extends Record<string, unknown>>(
  client: SupabaseClient,
  tableName: SourceTableName,
): SourceTable<T> {
  return client.from(tableName as never) as unknown as SourceTable<T>;
}

async function selectQuestionOptions(
  client: SupabaseClient,
  objectiveQuestionIds: string[],
): Promise<Array<{ id: string; is_correct: boolean; option_label: string; question_id: string }>> {
  if (objectiveQuestionIds.length === 0) {
    return [];
  }

  const result = await client
    .from("question_options")
    .select("id, question_id, option_label, is_correct")
    .in("question_id", objectiveQuestionIds);
  await assertNoError("buscar alternativas", result);
  return result.data ?? [];
}

async function selectLearningPathItems(
  client: SupabaseClient,
  pathIds: string[],
): Promise<Array<{ id: string; item_id: string; item_type: string; path_id: string }>> {
  if (pathIds.length === 0) {
    return [];
  }

  const result = await client
    .from("learning_path_items")
    .select("id, path_id, item_type, item_id")
    .in("path_id", pathIds);
  await assertNoError("buscar itens de trilha", result);
  return result.data ?? [];
}

async function assertNoError<T>(label: string, result: DbResult<T>): Promise<void> {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }
}

function expectEqual(label: string, actual: number, expected: number): void {
  if (actual !== expected) {
    throw new Error(`${label}: esperado ${expected}, encontrado ${actual}`);
  }
}

function expectCounts(label: string, actual: AccessCounts, expected: AccessCounts): void {
  for (const key of Object.keys(expected) as Array<keyof AccessCounts>) {
    expectEqual(`${label}.${key}`, actual[key], expected[key]);
  }
}

function formatSnapshot(snapshot: ContentSnapshot): string {
  return [
    `Categorias: ${snapshot.categories}`,
    `Bancos: ${snapshot.banks}`,
    `Templates: ${snapshot.templates}`,
    `Materiais: ${snapshot.materials}`,
    `Flashcards: ${snapshot.flashcards}`,
    `Questões: ${snapshot.questions}`,
    `Objetivas: ${snapshot.objectiveQuestions}`,
    `Subjetivas: ${snapshot.subjectiveQuestions}`,
    `Alternativas: ${snapshot.questionOptions}`,
    `Perguntas psicossociais: ${snapshot.psychosocialQuestions}`,
    `Trilhas: ${snapshot.learningPaths}`,
    `Itens de trilha: ${snapshot.learningPathItems}`,
  ].join("\n");
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
