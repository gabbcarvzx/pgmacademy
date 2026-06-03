"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  reviewManualAttempt,
  type ManualReviewKind,
  type ManualReviewStatus,
} from "@/lib/manual-review/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

async function requireAdminId() {
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

  return user.id;
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithError(target: string, error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Não foi possível salvar correção.";
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}error=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(target: string, message: string): never {
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}success=${encodeURIComponent(message)}`);
}

export async function reviewManualAttemptAction(formData: FormData) {
  const reviewerId = await requireAdminId();
  const target = formString(formData, "returnTo") || "/admin/correcoes";
  const kind = formString(formData, "kind") as ManualReviewKind;
  const status = formString(formData, "status") as ManualReviewStatus;

  try {
    await reviewManualAttempt({
      reviewerId,
      kind,
      attemptId: formString(formData, "attempt_id"),
      score: Number(formString(formData, "score")),
      maxScore: Number(formString(formData, "max_score") || "10"),
      feedback: formString(formData, "feedback"),
      status,
    });
  } catch (error) {
    redirectWithError(target, error);
  }

  revalidatePath("/admin/correcoes");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/subjetivas/minhas-respostas");
  revalidatePath("/entrevista/minhas-respostas");
  redirectWithSuccess(target, "Correção manual salva.");
}
