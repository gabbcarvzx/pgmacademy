"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
