import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Circle,
  CircleDollarSign,
  Clock3,
  Flame,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  PenLine,
  Route,
  Target,
} from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import type { MissionDashboardData } from "@/lib/mission/service";
import { getMissionDashboard } from "@/lib/mission/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Painel de Missão",
  description: "Missão diária e plano automático da PGM Academy.",
};

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const subscriptionLabel = {
  pending: "Pendente",
  paid: "Pago",
  overdue: "Vencido",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const statusLabel = {
  eligible: "Elegível",
  partial: "Parcial",
  ineligible: "Não elegível",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-background">
      <div
        className="h-2 rounded-full bg-pgm-yellow transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  Icon: typeof Target;
}) {
  return (
    <article className="rounded-md border border-border-soft bg-surface p-5">
      <Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
      <p className="mt-5 text-sm font-medium text-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}

function MissionTaskList({ data }: { data: MissionDashboardData }) {
  return (
    <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Missão de hoje
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Estudo guiado para hoje
          </h2>
        </div>
        <span className="rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
          {data.dailyMission.percentage}%
        </span>
      </div>

      <div className="mt-5">
        <ProgressBar value={data.dailyMission.percentage} />
      </div>

      <div className="mt-5 grid gap-3">
        {data.dailyMission.tasks.map((task) => (
          <Link
            key={task.id}
            href={task.href}
            className="grid gap-4 rounded-md border border-border-soft bg-background p-4 transition hover:border-white/35 lg:grid-cols-[1fr_120px]"
          >
            <div className="flex gap-3">
              {task.completed ? (
                <CheckCircle2
                  className="mt-1 size-5 shrink-0 text-pgm-green"
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  className="mt-1 size-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white">{task.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {task.description}
                </p>
              </div>
            </div>
            <div className="self-center">
              <p className="text-right font-mono text-sm font-semibold text-pgm-yellow">
                {task.progress}/{task.target}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}

function PreparationPanel({ data }: { data: MissionDashboardData }) {
  return (
    <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Preparação PGM
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {data.preparation.percentage}% concluído
          </h2>
        </div>
        <GraduationCap className="size-6 text-pgm-yellow" aria-hidden="true" />
      </div>

      <div className="mt-5">
        <ProgressBar value={data.preparation.percentage} />
      </div>

      <div className="mt-5 grid gap-3">
        {data.preparation.components.map((component) => (
          <div
            key={component.id}
            className="rounded-md border border-border-soft bg-background p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {component.title}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {component.completed} de {component.total}
                </p>
              </div>
              <span className="font-mono text-sm font-semibold text-pgm-yellow">
                {component.percentage}%
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={component.percentage} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default async function DashboardPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getMissionDashboard(user.id);

  if (data.requiresOnboarding) {
    redirect("/onboarding");
  }

  const subscriptionStatus = data.subscription?.status;
  const paymentValue =
    subscriptionStatus && subscriptionStatus in subscriptionLabel
      ? subscriptionLabel[subscriptionStatus as keyof typeof subscriptionLabel]
      : "Asaas";
  const latestAssessment = data.latestAssessment;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <article className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Painel de missão
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-4xl">
            {data.nextAction.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            {data.nextAction.description}
          </p>
          <Link
            href={data.nextAction.href}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
          >
            {data.nextAction.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>

        <aside className="rounded-md border border-border-soft bg-surface p-5">
          <Flame className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-muted">Ritmo atual</p>
          <p className="mt-2 text-4xl font-semibold text-white">
            {data.stats.currentStreak} dias
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Acesso: {accessLabel[data.accessStatus]}. Pagamento: {paymentValue}.
          </p>
        </aside>
      </section>

      {!data.hasPaidAccess ? (
        <section className="mt-6">
          <PremiumUpgradeCard description="Ative o premium para liberar onboarding, plano automático e recomendações completas do Painel de Missão." />
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Diagnóstico"
          value={
            latestAssessment ? statusLabel[latestAssessment.status] : "Pendente"
          }
          description={
            latestAssessment
              ? `Salvo em ${dateFormatter.format(new Date(latestAssessment.created_at))}.`
              : "Primeiro passo recomendado para calibrar o plano."
          }
          Icon={BadgeCheck}
        />
        <MetricCard
          title="Simulados"
          value={data.stats.completedSimulations}
          description="Tentativas finalizadas com resultado real."
          Icon={ListChecks}
        />
        <MetricCard
          title="Subjetivas"
          value={data.stats.subjectiveSubmitted}
          description="Atividades enviadas para correção manual."
          Icon={PenLine}
        />
        <MetricCard
          title="Flashcards"
          value={data.stats.reviewedFlashcards}
          description="Revisões registradas no progresso."
          Icon={Brain}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <MissionTaskList data={data} />
        <PreparationPanel data={data} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-pgm-yellow">
                Plano de Aprovação PGM
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Próximas semanas
              </h2>
            </div>
            {data.hasPaidAccess ? (
              <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-2 text-sm font-semibold text-pgm-yellow">
                Personalizado
              </span>
            ) : (
              <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
            )}
          </div>

          <div className="mt-5 grid gap-4">
            {data.approvalPlan.map((week) => (
              <article
                key={week.week}
                className="rounded-md border border-border-soft bg-background p-4"
              >
                <p className="text-sm font-semibold text-pgm-yellow">
                  {week.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {week.focus}
                </p>
                <div className="mt-4 grid gap-2">
                  {week.tasks.map((task) => (
                    <Link
                      key={`${week.week}:${task.title}`}
                      href={task.href}
                      className="inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                    >
                      {task.title}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <article className="rounded-md border border-border-soft bg-surface p-5">
            <Clock3 className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-white">
              Perfil de estudo
            </p>
            <div className="mt-4 grid gap-3">
              {data.onboardingSummary.length === 0 ? (
                <p className="text-sm leading-6 text-muted">
                  O perfil aparece depois do onboarding premium.
                </p>
              ) : (
                data.onboardingSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-border-soft bg-background p-3"
                  >
                    <p className="text-xs font-semibold uppercase text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>

          {!data.hasPaidAccess ? (
            <article className="rounded-md border border-border-soft bg-surface p-5">
              <CircleDollarSign
                className="size-5 text-pgm-yellow"
                aria-hidden="true"
              />
              <p className="mt-4 text-sm font-medium text-muted">
                Pagamento único
              </p>
              <p className="mt-2 text-4xl font-semibold text-white">
                R$ 29,90
              </p>
              <div className="mt-5">
                <PaymentButton disabled={data.accessStatus === "blocked"} />
              </div>
            </article>
          ) : null}
        </aside>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Recomendações personalizadas
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              O que reforçar agora
            </h2>
          </div>
          <Link
            href="/analytics"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
          >
            Ver analytics
            <BarChart3 className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {data.recommendations.length === 0 ? (
            <div className="rounded-md border border-border-soft bg-background p-4">
              <BookOpenCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold text-white">
                Nenhuma lacuna crítica detectada
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Continue seguindo a missão diária para gerar dados mais ricos.
              </p>
            </div>
          ) : (
            data.recommendations.map((recommendation) => (
              <Link
                key={`${recommendation.title}:${recommendation.href}`}
                href={recommendation.href}
                className="rounded-md border border-border-soft bg-background p-4 transition hover:border-white/35"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {recommendation.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {recommendation.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-pgm-yellow"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Materiais"
          value={data.stats.completedMaterials}
          description="Aulas concluídas no progresso geral."
          Icon={BookOpenCheck}
        />
        <MetricCard
          title="Trilhas concluídas"
          value={data.stats.completedPaths}
          description="Sequências completas finalizadas."
          Icon={Route}
        />
        <MetricCard
          title="Preparação"
          value={`${data.preparation.percentage}%`}
          description="Cálculo com dados reais da plataforma."
          Icon={GraduationCap}
        />
        <MetricCard
          title="Acesso"
          value={accessLabel[data.accessStatus]}
          description="Controle central em profiles.access_status."
          Icon={LockKeyhole}
        />
      </section>
    </main>
  );
}
