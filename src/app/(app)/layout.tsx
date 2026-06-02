import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileResponse = await supabase
    .from("profiles")
    .select("full_name, email, access_status, role")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileResponse.data as {
    full_name: string | null;
    email: string | null;
    access_status: "free" | "paid" | "blocked" | "refunded";
    role: "student" | "mentor" | "admin";
  } | null;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[280px_1fr]">
      <AppSidebar
        accessStatus={profile?.access_status ?? "free"}
        userRole={profile?.role ?? "student"}
        userEmail={profile?.email ?? user.email ?? "Aluno"}
        userName={profile?.full_name ?? null}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
