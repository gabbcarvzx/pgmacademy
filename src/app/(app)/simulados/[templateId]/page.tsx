import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileQuestion,
  LockKeyhole,
} from "lucide-react";

import { startSimulationAttemptAction } from "@/app/(app)/simulados/actions";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { languageLabel } from "@/lib/learning/labels";
import { getSimulationStartView } from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ templateId: string }>;
};

const typeLabel = {
  quick: "Rápido",
  full: "Oficial PGM",
} as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { templateId } = await params;
  return {
    title: `Simulado - ${templateId}`,
  };
}

function lockMessage(reason: string | null) {
  if (reason === "premium_required") {
    return "Este simulado está disponível apenas para usuários premium.";
  }
  if (reason === "insufficient_questions") {
    return "O banco ainda não possui questões suficientes para este template.";
  }
  if (reason === "no_questions") {
    return "O banco ainda não possui questões para este template.";
  }
  return null;
}

export default async function SimulationStartPage({ params }: PageProps) {
  const { templateId } = await params;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getSimulationStartView(user.id, templateId);

  if (!data.template) {
    notFound();
  }

  const message = lockMessage(data.template.lockedReason);
  const canStart = data.template.lockedReason === null;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/simulados"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Link>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-pgm-yellow">
                {typeLabel[data.template.type]} ·{" "}
                {languageLabel[data.template.language]}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                {data.template.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
                {data.template.description ??
                  "Simulado objetivo com correção automática e resultado por categoria."}
              </p>
            </div>
            {canStart ? (
              <FileQuestion
                className="size-6 shrink-0 text-pgm-yellow"
                aria-hidden="true"
              />
            ) : (
              <LockKeyhole
                className="size-6 shrink-0 text-pgm-yellow"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
              {data.template.total_questions} questões
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
              <Clock3 className="size-4" aria-hidden="true" />
              {data.estimatedMinutes} min
            </span>
            <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-2 text-sm font-semibold text-pgm-yellow">
              {data.template.is_premium ? "Premium" : "Gratuito"}
            </span>
          </div>

          <div className="mt-6 rounded-md border border-border-soft bg-background p-5">
            <p className="text-sm font-semibold text-white">Instruções</p>
            <ul className="mt-4 grid gap-3">
              {[
                "Leia cada enunciado com calma antes de marcar uma alternativa.",
                "Sua resposta é salva automaticamente durante a tentativa.",
                "Você pode revisar as questões antes de finalizar.",
                "O gabarito e as explicações aparecem somente depois da finalização.",
                data.template.type === "full"
                  ? "Use o cronômetro como referência profissional de 4 horas."
                  : "Use o cronômetro para treinar ritmo e foco.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                  <CheckCircle2
                    className="mt-1 size-4 shrink-0 text-pgm-yellow"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {message ? (
            <div className="mt-6">
              {data.template.lockedReason === "premium_required" ? (
                <PremiumUpgradeCard description={message} />
              ) : (
                <div className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5">
                  <p className="text-sm font-semibold text-white">
                    Template indisponível
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
                </div>
              )}
            </div>
          ) : data.activeAttemptId ? (
            <Link
              href={`/simulados/tentativas/${data.activeAttemptId}`}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
            >
              Continuar tentativa ativa
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <form action={startSimulationAttemptAction} className="mt-6">
              <input type="hidden" name="templateId" value={data.template.id} />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Iniciar simulado
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </article>

        <aside className="grid content-start gap-4">
          <InstitutionalNotice />
          <div className="rounded-md border border-border-soft bg-surface p-5">
            <p className="text-sm font-semibold text-white">
              Segurança da tentativa
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              A seleção de questões, a correção e a nota final são calculadas
              no servidor. O cliente não recebe o gabarito durante a resolução.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
