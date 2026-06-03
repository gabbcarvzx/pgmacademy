import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  History,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { languageLabel } from "@/lib/learning/labels";
import { getSimulationOverview } from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Simulados",
  description: "Simulados objetivos da PGM Academy.",
};

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const statusLabel = {
  started: "Em andamento",
  completed: "Concluido",
  abandoned: "Abandonado",
} as const;

const typeLabel = {
  quick: "Rapido",
  full: "Completo",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function estimatedMinutes(totalQuestions: number) {
  return Math.max(Math.ceil(totalQuestions * 1.5), 10);
}

function lockLabel(reason: string | null) {
  if (reason === "premium_required") return "Premium bloqueado";
  if (reason === "insufficient_questions") return "Banco insuficiente";
  if (reason === "no_questions") return "Sem questoes";
  return null;
}

export default async function SimuladosPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const overview = await getSimulationOverview(user.id);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
            Simulados reais
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Treine com as questoes objetivas autorais ja aprovadas
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Escolha um template, inicie uma tentativa e acompanhe seu resultado
            por categoria. O gabarito fica protegido ate a finalizacao.
          </p>
        </div>
        {overview.hasPaidAccess ? (
          <InstitutionalNotice />
        ) : (
          <PremiumUpgradeCard description="Simulados premium exigem acesso pago. Voce pode visualizar os modelos, mas somente usuarios premium podem iniciar." />
        )}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Acesso",
            value: accessLabel[overview.accessStatus],
            description: "Controle central por profiles.access_status.",
            Icon: ShieldCheck,
          },
          {
            title: "Templates",
            value: String(overview.schema.templatesCount),
            description: "Modelos ativos disponiveis para estudo.",
            Icon: ListChecks,
          },
          {
            title: "Questoes",
            value: String(overview.schema.activeObjectiveQuestionsCount),
            description: "Objetivas visiveis para seu plano atual.",
            Icon: Trophy,
          },
          {
            title: "Historico",
            value: String(overview.historySummary.totalAttempts),
            description: `${overview.historySummary.completedAttempts} tentativas concluidas.`,
            Icon: History,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-border-soft bg-surface p-5"
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

      <section className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Templates
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Simulados disponiveis
            </h2>
          </div>
          <span className="inline-flex rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
            {overview.templates.length} modelos
          </span>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {overview.templates.map((template) => {
            const lockedMessage = lockLabel(template.lockedReason);
            const isLocked = Boolean(template.lockedReason);

            return (
              <article
                key={template.id}
                className={`rounded-md border p-5 sm:p-6 ${
                  isLocked
                    ? "border-pgm-yellow/25 bg-pgm-yellow/5"
                    : "border-border-soft bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                        {typeLabel[template.type]}
                      </span>
                      <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                        {languageLabel[template.language]}
                      </span>
                      <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-1 text-xs font-semibold text-pgm-yellow">
                        {template.is_premium ? "Premium" : "Gratuito"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {template.title}
                    </h3>
                  </div>
                  {isLocked ? (
                    <LockKeyhole
                      className="size-5 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  ) : (
                    <ListChecks
                      className="size-5 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-muted">
                  {template.description ??
                    "Simulado objetivo com correcao automatica."}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                    {template.total_questions} questoes
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                    <Clock3 className="size-4" aria-hidden="true" />
                    {estimatedMinutes(template.total_questions)} min
                  </span>
                  <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                    {template.availableQuestionCount} no banco
                  </span>
                </div>

                {template.lockedReason === "premium_required" ? (
                  <Link
                    href="/planos"
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
                  >
                    Quero continuar evoluindo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : isLocked ? (
                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted/70"
                  >
                    {lockedMessage}
                  </button>
                ) : (
                  <Link
                    href={`/simulados/${template.id}`}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                  >
                    Abrir instrucoes
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Historico
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Tentativas anteriores
            </h2>
          </div>
          <span className="rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
            Melhor: {overview.historySummary.bestPercentage}%
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {overview.attempts.length === 0 ? (
            <div className="rounded-md border border-border-soft bg-background p-4">
              <p className="text-sm font-semibold text-white">
                Nenhuma tentativa registrada
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Inicie um template disponivel para acompanhar desempenho,
                acertos e evolucao por categoria.
              </p>
            </div>
          ) : (
            overview.attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="grid gap-4 rounded-md border border-border-soft bg-background p-4 lg:grid-cols-[1fr_180px_160px]"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {attempt.templateTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {dateFormatter.format(new Date(attempt.started_at))} ·{" "}
                    {statusLabel[attempt.status]} · {attempt.answerCount} questoes
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Pontuacao
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {attempt.percentage === null
                      ? "--"
                      : `${attempt.percentage}%`}
                  </p>
                </div>
                <Link
                  href={
                    attempt.status === "completed"
                      ? `/simulados/tentativas/${attempt.id}/resultado`
                      : `/simulados/tentativas/${attempt.id}`
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  {attempt.status === "completed" ? "Ver resultado" : "Continuar"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
