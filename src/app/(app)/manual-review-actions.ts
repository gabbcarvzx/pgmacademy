"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  submitPsychosocialAnswer,
  submitSubjectiveAnswer,
} from "@/lib/manual-review/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithError(target: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "Nao foi possivel enviar.";
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(target: string, message: string): never {
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}success=${encodeURIComponent(message)}`);
}

export async function submitSubjectiveAnswerAction(formData: FormData) {
  const userId = await requireUserId();
  const questionId = formString(formData, "question_id");
  const answerText = formString(formData, "answer_text");
  const target = `/subjetivas/${questionId}`;

  try {
    await submitSubjectiveAnswer(userId, questionId, answerText);
  } catch (error) {
    redirectWithError(target, error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/subjetivas");
  revalidatePath("/subjetivas/minhas-respostas");
  redirectWithSuccess(
    "/subjetivas/minhas-respostas",
    "Resposta enviada para correcao manual.",
  );
}

export async function submitPsychosocialAnswerAction(formData: FormData) {
  const userId = await requireUserId();
  const questionId = formString(formData, "question_id");
  const answerText = formString(formData, "answer_text");
  const target = `/entrevista/${questionId}`;

  try {
    await submitPsychosocialAnswer(userId, questionId, answerText);
  } catch (error) {
    redirectWithError(target, error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/entrevista");
  revalidatePath("/entrevista/minhas-respostas");
  redirectWithSuccess(
    "/entrevista/minhas-respostas",
    "Resposta psicossocial enviada para correcao manual.",
  );
}
