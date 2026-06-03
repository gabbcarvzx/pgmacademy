import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { MentorChat } from "@/components/mentor/mentor-chat";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mentor PGM",
  description: "Recurso premium da PGM Academy para preparacao do aluno.",
};

export default async function MentorPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("access_status")
    .eq("id", user?.id ?? "")
    .single();

  if (profile?.access_status !== "paid") {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <LockKeyhole className="size-6 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
            Recurso premium
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Recurso premium bloqueado
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            O premium libera a experiencia completa de preparacao da PGM
            Academy. Consulte os planos para desbloquear os recursos avancados.
          </p>
          <Link
            href="/planos"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
          >
            Ver planos premium
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <MentorChat />
    </main>
  );
}
