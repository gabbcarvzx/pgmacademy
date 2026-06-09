import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock3, ListChecks, ShieldCheck } from "lucide-react";

import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { SimulationRunner } from "@/components/simulations/simulation-runner";
import { languageLabel } from "@/lib/learning/labels";
import {
  getSimulationRunner,
  SimulationServiceError,
} from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

const typeLabel = {
  quick: "Rápido",
  full: "Oficial PGM",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { attemptId } = await params;
  return {
    title: `Tentativa - ${attemptId}`,
  };
}

export default async function SimulationAttemptPage({ params }: PageProps) {
  const { attemptId } = await params;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let data;
  try {
    data = await getSimulationRunner(user.id, attemptId);
  } catch (error) {
    if (error instanceof SimulationServiceError && error.status === 409) {
      redirect(`/simulados/tentativas/${attemptId}/resultado`);
    }

    throw error;
  }

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
            Tentativa em andamento
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
            {data.template.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Responda com calma, revise antes de finalizar e acompanhe seu
            progresso. O gabarito será liberado somente no resultado.
          </p>
        </div>
        <InstitutionalNotice />
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-3">
        <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4">
          <ListChecks className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-muted">Questões</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {data.questions.length}
          </p>
        </article>
        <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4">
          <Clock3 className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-muted">Início</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {dateFormatter.format(new Date(data.startedAt))}
          </p>
        </article>
        <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4">
          <ShieldCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-muted">Modelo</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {typeLabel[data.template.type]} ·{" "}
            {languageLabel[data.template.language]}
          </p>
        </article>
      </section>

      <div className="mt-6 max-sm:mt-4">
        <SimulationRunner
          attemptId={data.attemptId}
          startedAt={data.startedAt}
          durationMinutes={data.template.durationMinutes}
          questions={data.questions}
        />
      </div>
    </main>
  );
}
