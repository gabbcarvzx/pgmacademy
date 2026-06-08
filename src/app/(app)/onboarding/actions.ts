"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  normalizeOnboardingInput,
  saveStudentOnboarding,
} from "@/lib/mission/service";
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

function redirectWithError(target: string, error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Não foi possível salvar onboarding.";
  redirect(`${target}?error=${encodeURIComponent(message)}`);
}

export async function completePremiumOnboardingAction(formData: FormData) {
  const userId = await requireUserId();

  try {
    await saveStudentOnboarding(userId, normalizeOnboardingInput(formData));
  } catch (error) {
    redirectWithError("/onboarding", error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
}
