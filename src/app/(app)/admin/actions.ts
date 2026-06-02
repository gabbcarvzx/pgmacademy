"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AdminLearningError,
  createQuestionBank,
  createSimulationTemplate,
  parseLearningLanguage,
  parseSimulationTemplateType,
  parseTotalQuestions,
} from "@/lib/admin/learning-content";
import { getServerSupabaseClient } from "@/lib/supabase/server";

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

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function redirectWithError(error: unknown): never {
  const message =
    error instanceof AdminLearningError || error instanceof Error
      ? error.message
      : "Nao foi possivel salvar.";

  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

export async function createQuestionBankAction(formData: FormData) {
  await requireAdmin();

  try {
    await createQuestionBank({
      title: formString(formData, "title"),
      description: formString(formData, "description"),
      language: parseLearningLanguage(formString(formData, "language")),
      isPremium: formBoolean(formData, "is_premium"),
      isActive: formBoolean(formData, "is_active"),
    });
  } catch (error) {
    redirectWithError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/simulados");
  redirect("/admin?created=bank");
}

export async function createSimulationTemplateAction(formData: FormData) {
  await requireAdmin();

  try {
    await createSimulationTemplate({
      title: formString(formData, "title"),
      description: formString(formData, "description"),
      type: parseSimulationTemplateType(formString(formData, "type")),
      language: parseLearningLanguage(formString(formData, "language")),
      totalQuestions: parseTotalQuestions(
        formString(formData, "total_questions"),
      ),
      isPremium: formBoolean(formData, "is_premium"),
      isActive: formBoolean(formData, "is_active"),
    });
  } catch (error) {
    redirectWithError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/simulados");
  redirect("/admin?created=template");
}
