import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { OfficialSubjectiveRunner } from "@/components/simulations/official-subjective-runner";
import { getOfficialSubjectiveSimulation } from "@/lib/manual-review/service";
import { officialSubjectiveSimulation } from "@/lib/simulations/official-pgm";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: officialSubjectiveSimulation.title,
  description: "Simulado subjetivo oficial premium com 5 respostas e rubrica.",
};

export default async function OfficialSubjectiveSimulationPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const view = await getOfficialSubjectiveSimulation(user.id);
  const errorMessage =
    typeof params?.error === "string" ? params.error : null;

  return (
    <main className="px-4 py-6 max-sm:px-3 max-sm:py-4 sm:px-6 lg:px-8">
      <Link
        href="/simulados"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Simulados
      </Link>

      <section className="mt-6 grid gap-5 max-sm:mt-4 max-sm:gap-4 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Simulado subjetivo oficial
          </p>
          <h1 className="mt-4 max-w-4xl text-2xl font-semibold text-white sm:text-4xl">
            {officialSubjectiveSimulation.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            {officialSubjectiveSimulation.description} A correção fica na fila
            manual da plataforma e já nasce preparada para avaliação por
            competências.
          </p>
        </div>
        {view.hasPaidAccess ? (
          <InstitutionalNotice />
        ) : (
          <PremiumUpgradeCard description="O simulado subjetivo oficial está disponível para alunos premium." />
        )}
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Questões",
            value: String(view.questionCount),
            description: "Respostas individuais.",
            Icon: FileText,
          },
          {
            title: "Limite",
            value: `${view.minWords}-${view.maxWords}`,
            description: "Palavras por resposta.",
            Icon: ClipboardCheck,
          },
          {
            title: "Nota máxima",
            value: String(view.maxScore),
            description: `${view.pointsPerQuestion} pontos por questão.`,
            Icon: Scale,
          },
          {
            title: "Acesso",
            value: view.hasPaidAccess ? "Premium" : "Bloqueado",
            description: "Controle pelo status do perfil.",
            Icon: ShieldCheck,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4"
          >
            <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium text-muted">{item.title}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 max-sm:mt-4 max-sm:p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Scale className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">
            Rubrica de avaliação
          </h2>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          {view.rubric.map((criterion) => (
            <article
              key={criterion.key}
              className="rounded-md border border-border-soft bg-background p-4 max-sm:p-3"
            >
              <CheckCircle2
                className="size-4 text-pgm-yellow"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-semibold text-white">
                {criterion.title}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">
                {criterion.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 max-sm:mt-4">
        <OfficialSubjectiveRunner view={view} errorMessage={errorMessage} />
      </section>
    </main>
  );
}
