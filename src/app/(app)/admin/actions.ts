"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AdminLearningError,
  createQuestionBank,
  createSimulationTemplate,
  deactivateContent,
  parseEstimatedTime,
  parseLearningDifficulty,
  parseLearningLanguage,
  parsePathItemType,
  parseQuestionType,
  parseSimulationTemplateType,
  parseTotalQuestions,
  saveFlashcard,
  saveMaterial,
  savePath,
  savePsychosocial,
  saveQuestion,
  saveSimulationTemplate,
  updatePathItems,
  type PathItemType,
  type QuestionOptionInput,
} from "@/lib/admin/learning-content";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type AdminEntity =
  | "material"
  | "flashcard"
  | "question"
  | "psychosocial"
  | "path"
  | "template";

const adminEntities: AdminEntity[] = [
  "material",
  "flashcard",
  "question",
  "psychosocial",
  "path",
  "template",
];

async function requireAdmin() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin?error=unauthorized");
  }
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function formOptionalString(formData: FormData, key: string) {
  const value = formString(formData, key).trim();

  return value ? value : null;
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function formNullableId(formData: FormData, key: string) {
  const value = formString(formData, key).trim();

  return value ? value : null;
}

function returnTo(formData: FormData, fallback = "/admin") {
  const value = formString(formData, "returnTo");

  return value.startsWith("/admin") ? value : fallback;
}

function redirectWithError(error: unknown, target: string): never {
  const message =
    error instanceof AdminLearningError || error instanceof Error
      ? error.message
      : "Não foi possível salvar.";
  const separator = target.includes("?") ? "&" : "?";

  redirect(`${target}${separator}error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(target: string, message: string): never {
  const separator = target.includes("?") ? "&" : "?";

  redirect(`${target}${separator}success=${encodeURIComponent(message)}`);
}

function revalidateAdminContent() {
  revalidatePath("/admin");
  revalidatePath("/admin/materials");
  revalidatePath("/admin/flashcards");
  revalidatePath("/admin/questions");
  revalidatePath("/admin/psychosocial");
  revalidatePath("/admin/paths");
  revalidatePath("/admin/templates");
  revalidatePath("/estudos");
  revalidatePath("/flashcards");
  revalidatePath("/trilhas");
  revalidatePath("/simulados");
}

function parseQuestionOptions(formData: FormData) {
  const correctOption = formString(formData, "correct_option");

  return ["A", "B", "C", "D", "E"].map((label) => ({
    label,
    text: formString(formData, `option_${label}`),
    isCorrect: correctOption === label,
  })) as QuestionOptionInput[];
}

function subjectiveExplanation(formData: FormData) {
  const explanation = formOptionalString(formData, "explanation");
  const competencies = formOptionalString(formData, "competencies");
  const rubric = formOptionalString(formData, "rubric");

  if (competencies || rubric) {
    return [
      competencies ? `Competências avaliadas: ${competencies}` : null,
      rubric ? `Rubrica resumida: ${rubric}` : null,
      explanation,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return explanation;
}

export async function createQuestionBankAction(formData: FormData) {
  await requireAdmin();
  const target = returnTo(formData);

  try {
    await createQuestionBank({
      title: formString(formData, "title"),
      description: formOptionalString(formData, "description"),
      language: parseLearningLanguage(formString(formData, "language")),
      isPremium: formBoolean(formData, "is_premium"),
      isActive: formBoolean(formData, "is_active"),
    });
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess(target, "Banco de questões criado.");
}

export async function createSimulationTemplateAction(formData: FormData) {
  await requireAdmin();
  const target = returnTo(formData);

  try {
    await createSimulationTemplate({
      title: formString(formData, "title"),
      description: formOptionalString(formData, "description"),
      type: parseSimulationTemplateType(formString(formData, "type")),
      language: parseLearningLanguage(formString(formData, "language")),
      totalQuestions: parseTotalQuestions(formString(formData, "total_questions")),
      isPremium: formBoolean(formData, "is_premium"),
      isActive: formBoolean(formData, "is_active"),
      sourceReference: formOptionalString(formData, "source_reference"),
    });
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess(target, "Template de simulado criado.");
}

export async function saveMaterialAction(formData: FormData) {
  await requireAdmin();
  const id = formNullableId(formData, "id") ?? undefined;
  const target = returnTo(formData, "/admin/materials");

  try {
    await saveMaterial(
      {
        title: formString(formData, "title"),
        slug: formString(formData, "slug"),
        categoryId: formNullableId(formData, "category_id"),
        language: parseLearningLanguage(formString(formData, "language")),
        difficulty: parseLearningDifficulty(formString(formData, "difficulty")),
        estimatedTime: parseEstimatedTime(formString(formData, "estimated_time")),
        contentMd: formString(formData, "content_md"),
        isPremium: formBoolean(formData, "is_premium"),
        isActive: formBoolean(formData, "is_active"),
        sourceReference: formOptionalString(formData, "source_reference"),
      },
      id,
    );
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess("/admin/materials", id ? "Material atualizado." : "Material criado.");
}

export async function saveFlashcardAction(formData: FormData) {
  await requireAdmin();
  const id = formNullableId(formData, "id") ?? undefined;
  const target = returnTo(formData, "/admin/flashcards");

  try {
    await saveFlashcard(
      {
        categoryId: formNullableId(formData, "category_id"),
        frontContent: formString(formData, "front_content"),
        backContent: formString(formData, "back_content"),
        language: parseLearningLanguage(formString(formData, "language")),
        difficulty: parseLearningDifficulty(formString(formData, "difficulty")),
        isPremium: formBoolean(formData, "is_premium"),
        isActive: formBoolean(formData, "is_active"),
        sourceReference: formOptionalString(formData, "source_reference"),
      },
      id,
    );
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess("/admin/flashcards", id ? "Flashcard atualizado." : "Flashcard criado.");
}

export async function saveQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = formNullableId(formData, "id") ?? undefined;
  const target = returnTo(formData, "/admin/questions");

  try {
    const type = parseQuestionType(formString(formData, "type"));
    await saveQuestion(
      {
        bankId: formString(formData, "bank_id"),
        categoryId: formNullableId(formData, "category_id"),
        type,
        language: parseLearningLanguage(formString(formData, "language")),
        difficulty: parseLearningDifficulty(formString(formData, "difficulty")),
        statement: formString(formData, "statement"),
        explanation:
          type === "subjective"
            ? subjectiveExplanation(formData)
            : formOptionalString(formData, "explanation"),
        sourceReference: formOptionalString(formData, "source_reference"),
        isActive: formBoolean(formData, "is_active"),
        options: type === "objective" ? parseQuestionOptions(formData) : [],
      },
      id,
    );
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess("/admin/questions", id ? "Questão atualizada." : "Questão criada.");
}

export async function saveTemplateAction(formData: FormData) {
  await requireAdmin();
  const id = formNullableId(formData, "id") ?? undefined;
  const target = returnTo(formData, "/admin/templates");

  try {
    await saveSimulationTemplate(
      {
        title: formString(formData, "title"),
        description: formOptionalString(formData, "description"),
        type: parseSimulationTemplateType(formString(formData, "type")),
        language: parseLearningLanguage(formString(formData, "language")),
        totalQuestions: parseTotalQuestions(formString(formData, "total_questions")),
        isPremium: formBoolean(formData, "is_premium"),
        isActive: formBoolean(formData, "is_active"),
        sourceReference: formOptionalString(formData, "source_reference"),
      },
      id,
    );
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess(
    "/admin/templates",
    id ? "Template atualizado." : "Template criado.",
  );
}

export async function savePsychosocialAction(formData: FormData) {
  await requireAdmin();
  const id = formNullableId(formData, "id") ?? undefined;
  const target = returnTo(formData, "/admin/psychosocial");

  try {
    await savePsychosocial(
      {
        category: formString(formData, "category"),
        question: formString(formData, "question"),
        idealAnswerGuidelines: formOptionalString(formData, "ideal_answer_guidelines"),
        commonMistakes: formOptionalString(formData, "common_mistakes"),
        isPremium: formBoolean(formData, "is_premium"),
        isActive: formBoolean(formData, "is_active"),
        sourceReference: formOptionalString(formData, "source_reference"),
      },
      id,
    );
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess(
    "/admin/psychosocial",
    id ? "Pergunta psicossocial atualizada." : "Pergunta psicossocial criada.",
  );
}

export async function savePathAction(formData: FormData) {
  await requireAdmin();
  const id = formNullableId(formData, "id") ?? undefined;
  const target = returnTo(formData, "/admin/paths");

  try {
    await savePath(
      {
        title: formString(formData, "title"),
        slug: formOptionalString(formData, "slug"),
        description: formOptionalString(formData, "description"),
        language: parseLearningLanguage(formString(formData, "language")),
        isPremium: formBoolean(formData, "is_premium"),
        isActive: formBoolean(formData, "is_active"),
        sourceReference: formOptionalString(formData, "source_reference"),
      },
      id,
    );
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess("/admin/paths", id ? "Trilha atualizada." : "Trilha criada.");
}

export async function updatePathItemsAction(formData: FormData) {
  await requireAdmin();
  const pathId = formString(formData, "path_id");
  const target = returnTo(formData, `/admin/paths/${pathId}/edit`);
  const existingIds = formData
    .getAll("path_item_id")
    .filter((value): value is string => typeof value === "string");
  const newItemValue = formString(formData, "new_item");
  const newItemParts = newItemValue.includes(":")
    ? (newItemValue.split(":") as [string, string])
    : null;

  try {
    await updatePathItems(pathId, {
      existingItems: existingIds.map((id) => ({
        id,
        sortOrder: parseTotalQuestions(formString(formData, `sort_${id}`)),
        remove: formBoolean(formData, `remove_${id}`),
      })),
      newItem:
        newItemParts && newItemParts[1]
          ? {
              itemType: parsePathItemType(newItemParts[0]) as PathItemType,
              itemId: newItemParts[1],
              sortOrder: parseTotalQuestions(formString(formData, "new_sort_order")),
            }
          : null,
    });
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess(target, "Itens da trilha atualizados.");
}

export async function deactivateContentAction(formData: FormData) {
  await requireAdmin();
  const rawEntity = formString(formData, "entity");
  const id = formString(formData, "id");
  const target = returnTo(formData);

  try {
    if (!adminEntities.includes(rawEntity as AdminEntity)) {
      throw new AdminLearningError("Tipo de conteúdo inválido.");
    }

    const entity = rawEntity as AdminEntity;
    await deactivateContent(entity, id);
  } catch (error) {
    redirectWithError(error, target);
  }

  revalidateAdminContent();
  redirectWithSuccess(target, "Conteúdo desativado.");
}
