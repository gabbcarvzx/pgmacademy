"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { submitOfficialSubjectiveSimulation } from "@/lib/manual-review/service";
import {
  finishSimulationAttempt,
  saveSimulationAnswer,
  startSimulationAttempt,
} from "@/lib/simulations/service";
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
  const message =
    error instanceof Error ? error.message : "Não foi possível enviar.";
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(target: string, message: string): never {
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}success=${encodeURIComponent(message)}`);
}

export async function startSimulationAttemptAction(formData: FormData) {
  const userId = await requireUserId();
  const templateId = String(formData.get("templateId") ?? "");

  if (!templateId) {
    throw new Error("Modelo de simulado inválido.");
  }

  const attempt = await startSimulationAttempt(userId, templateId);

  revalidatePath("/simulados");
  redirect(`/simulados/tentativas/${attempt.attemptId}`);
}

export async function saveSimulationAnswerAction(input: {
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
}) {
  const userId = await requireUserId();

  await saveSimulationAnswer(userId, input);

  return { ok: true };
}

export async function finishSimulationAttemptAction(formData: FormData) {
  const userId = await requireUserId();
  const attemptId = String(formData.get("attemptId") ?? "");

  if (!attemptId) {
    throw new Error("Tentativa inválida.");
  }

  await finishSimulationAttempt(userId, attemptId);

  revalidatePath("/dashboard");
  revalidatePath("/simulados");
  revalidatePath(`/simulados/tentativas/${attemptId}`);
  redirect(`/simulados/tentativas/${attemptId}/resultado`);
}

export async function submitOfficialSubjectiveSimulationAction(
  formData: FormData,
) {
  const userId = await requireUserId();
  const language = formString(formData, "language") || "english";
  const target = `/simulados/subjetivo-oficial?idioma=${encodeURIComponent(language)}`;
  const questionIds = formData
    .getAll("question_id")
    .filter((value): value is string => typeof value === "string");
  const answers = questionIds.map((questionId) => ({
    questionId,
    answerText: formString(formData, `answer_${questionId}`),
  }));

  try {
    await submitOfficialSubjectiveSimulation(userId, answers, language);
  } catch (error) {
    redirectWithError(target, error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/simulados");
  revalidatePath("/simulados/subjetivo-oficial");
  revalidatePath("/subjetivas");
  revalidatePath("/subjetivas/minhas-respostas");
  redirectWithSuccess(
    "/subjetivas/minhas-respostas",
    "Simulado subjetivo oficial enviado para correção manual.",
  );
}
