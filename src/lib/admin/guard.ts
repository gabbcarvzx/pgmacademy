import "server-only";

import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  email: string | null;
  role: "student" | "mentor" | "admin";
};

export async function getAdminProfile() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? null,
    role: profile?.role ?? "student",
  } satisfies AdminProfile;
}

export async function requireAdminPage() {
  const profile = await getAdminProfile();

  if (profile.role !== "admin") {
    redirect("/admin?error=unauthorized");
  }

  return profile;
}
