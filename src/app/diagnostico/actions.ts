"use server";

import { revalidatePath } from "next/cache";

import {
  evaluateEligibility,
  type EligibilityInput,
} from "@/lib/eligibility/rules";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

type SaveEligibilityAssessmentResponse =
  | {
      ok: true;
      assessmentId: string;
      message: string;
    }
  | {
      ok: false;
      reason: "not_authenticated" | "profile_missing" | "database_error";
      message: string;
    };

export async function saveEligibilityAssessmentAction(
  input: EligibilityInput,
): Promise<SaveEligibilityAssessmentResponse> {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      reason: "not_authenticated",
      message: "Entre na conta para salvar este diagnóstico no dashboard.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return {
      ok: false,
      reason: "profile_missing",
      message:
        "Seu perfil ainda não foi criado. Confirme se a migration do Supabase foi aplicada.",
    };
  }

  const result = evaluateEligibility(input);
  const { data, error } = await supabase
    .from("eligibility_assessments")
    .insert({
      tenant_id: profile.tenant_id,
      user_id: user.id,
      status: result.status,
      readiness_score: result.readinessScore,
      birth_date: input.birthDate,
      school_year: input.schoolYear,
      has_state_school_enrollment: input.hasStateSchoolEnrollment,
      has_active_siepe_enrollment: input.hasActiveSiepeEnrollment,
      is_excluded_school: input.isExcludedSchool,
      attendance_percent: input.attendancePercent,
      portuguese_average: input.portugueseAverage,
      math_average: input.mathAverage,
      humanities_average: input.humanitiesAverage,
      has_partial_progression: input.hasPartialProgression,
      was_previously_selected: input.wasPreviouslySelected,
      result_details: result as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      reason: "database_error",
      message: "Não foi possível salvar o diagnóstico agora.",
    };
  }

  revalidatePath("/dashboard");

  return {
    ok: true,
    assessmentId: data.id,
    message: "Diagnóstico salvo no dashboard.",
  };
}
