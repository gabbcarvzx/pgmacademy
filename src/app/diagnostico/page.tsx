import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileCheck2 } from "lucide-react";

import { EligibilityForm } from "@/components/eligibility/eligibility-form";
import { pgm2026OfficialSnapshot } from "@/lib/official/pgm-2026";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Diagnóstico de Elegibilidade",
  description:
    "Diagnóstico público de elegibilidade para estudantes que desejam se preparar para o Programa Ganhe o Mundo.",
};

export default async function DiagnosticoPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar para início
          </Link>
          <a
            href={siteConfig.editalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
          >
            Edital oficial
            <FileCheck2 className="size-4" aria-hidden="true" />
          </a>
        </div>

        <section className="py-10 sm:py-14">
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            PGM Academy
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-white sm:text-5xl">
            Diagnóstico de Elegibilidade
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Informe os dados escolares do estudante para receber uma análise
            clara baseada nos requisitos do {pgm2026OfficialSnapshot.editalTitle}.
          </p>
        </section>

        <EligibilityForm isAuthenticated={Boolean(user)} />
      </div>
    </main>
  );
}
