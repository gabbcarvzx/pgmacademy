import "server-only";

import { hasPremiumAccess } from "@/lib/access/premium";
import { getSimulationOverview } from "@/lib/simulations/service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import {
  buildReviewFinalNavigation,
  buildReviewFinalSimulationLinks,
  reviewFinalModules,
} from "./content";

type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "access_status" | "role"
>;

export type ReviewFinalPageData = {
  accessStatus: ProfileRow["access_status"];
  hasPaidAccess: boolean;
  navigation: ReturnType<typeof buildReviewFinalNavigation>;
  modules: typeof reviewFinalModules;
  simulationLinks: ReturnType<typeof buildReviewFinalSimulationLinks>;
};

async function getProfile(userId: string): Promise<ProfileRow> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, access_status, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Perfil do aluno nao encontrado.");
  }

  return data as ProfileRow;
}

export async function getReviewFinalPageData(
  userId: string,
): Promise<ReviewFinalPageData> {
  const [profile, overview] = await Promise.all([
    getProfile(userId),
    getSimulationOverview(userId),
  ]);

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPremiumAccess(profile),
    navigation: buildReviewFinalNavigation(reviewFinalModules),
    modules: reviewFinalModules,
    simulationLinks: buildReviewFinalSimulationLinks(overview.templates),
  };
}
