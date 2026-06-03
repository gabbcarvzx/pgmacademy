import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type PremiumAccessProfile =
  | (Pick<ProfileRow, "access_status"> & Partial<Pick<ProfileRow, "role">>)
  | null
  | undefined;

export function hasPremiumAccess(profile: PremiumAccessProfile) {
  return profile?.access_status === "paid" || profile?.role === "admin";
}

export function canAccessPremiumContent(
  isPremium: boolean,
  profile: PremiumAccessProfile,
) {
  return !isPremium || hasPremiumAccess(profile);
}
