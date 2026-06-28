import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Brain,
  CircleDollarSign,
  Clock3,
  Flame,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  PenLine,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import {
  AppPageHeader,
  ContentCard,
  EmptyState,
  LearningStepRow,
  MetricCard,
  MobileActionBar,
  PremiumLockCard,
  PrimaryActionPanel,
  ProgressBar,
  SectionHeader,
  StatusBadge,
} from "@/components/design-system";
import { ReviewFinalPromoBanner } from "@/components/premium/review-final-promo-banner";
import type { DesignSystemTone } from "@/components/design-system";
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

const accessTone = {
  free: "neutral",
  paid: "premium",
  blocked: "error",
  refunded: "warning",
} satisfies Record<keyof typeof accessLabel, DesignSystemTone>;

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

function taskProgressPercentage(progress: number, target: number) {
  if (target <= 0) return progress > 0 ? 100 : 0;
  return Math.round((progress / target) * 100);
}

function MissionTaskList({ data }: { data: MissionDashboardData }) {
  const firstOpenTaskId = data.dailyMission.tasks.find(
    (task) => !task.completed,
  )?.id;

  return (
    <article className="rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:p-4 sm:p-6">
      <SectionHeader
        eyebrow="Missão de hoje"
        title="Estudo guiado para hoje"
        description="Atividades priorizadas para manter ritmo real de preparação."
        density="compact"
        action={
          <StatusBadge tone="premium" size="md">
            {data.dailyMission.percentage}%
          </StatusBadge>
        }
      />

      <ProgressBar
        value={data.dailyMission.percentage}
        label="Progresso da missão"
        showValue
        className="mt-5"
      />

      <div className="mt-5 grid gap-3">
        {data.dailyMission.tasks.map((task) => (
          <LearningStepRow
            key={task.id}
            href={task.href}
            title={task.title}
            description={task.description}
            state={
              task.completed
                ? "completed"
                : task.id === firstOpenTaskId
                  ? "current"
                  : "upcoming"
            }
            progress={taskProgressPercentage(task.progress, task.target)}
            metadata={
              <span className="font-mono text-sm font-semibold text-accent-gold">
                {task.progress}/{task.target}
              </span>
            }
          />
        ))}
      </div>
    </article>
  );
}

function PreparationPanel({ data }: { data: MissionDashboardData }) {
  return (
    <article className="rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:p-4 sm:p-6">
      <SectionHeader
        eyebrow="Preparação PGM"
        title={`${data.preparation.percentage}% concluído`}
        description="Leitura consolidada do avanço em atividades reais."
        density="compact"
        action={<GraduationCap className="size-6 text-accent-gold" aria-hidden="true" />}
      />

      <ProgressBar
        value={data.preparation.percentage}
        label="Preparação geral"
        showValue
        className="mt-5"
      />

      <div className="mt-5 grid gap-3">
        {data.preparation.components.map((component) => (
          <ContentCard
            key={component.id}
            title={component.title}
            description={`${component.completed} de ${component.total} itens concluídos.`}
            badge={`${component.percentage}%`}
            tone={component.percentage >= 100 ? "success" : "premium"}
            metadata={
              <ProgressBar
                value={component.percentage}
                label={component.title}
                size="sm"
              />
            }
          />
        ))}
      </div>
    </article>
  );
}

function ApprovalPlanPanel({ data }: { data: MissionDashboardData }) {
  return (
    <article className="rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:p-4 sm:p-6">
      <SectionHeader
        eyebrow="Plano de Aprovação PGM"
        title="Próximas semanas"
        description="Plano visual preservando as recomendações geradas pelo motor atual."
        density="compact"
        action={
          data.hasPaidAccess ? (
            <StatusBadge tone="premium" size="md">
              Personalizado
            </StatusBadge>
          ) : (
            <StatusBadge tone="warning" size="md">
              Preview
            </StatusBadge>
          )
        }
      />

      <div className="mt-5 grid gap-4">
        {data.approvalPlan.map((week) => (
          <ContentCard
            key={week.week}
            eyebrow={`Semana ${week.week}`}
            title={week.title}
            description={week.focus}
            tone="premium"
            metadata={
              <div className="grid gap-2">
                {week.tasks.map((task) => (
                  <Link
                    key={`${week.week}:${task.title}`}
                    href={task.href}
                    className="inline-flex min-h-10 items-center justify-between gap-3 rounded-ds-12 border border-border-soft px-3 py-2 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary"
                  >
                    {task.title}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            }
          />
        ))}
      </div>
    </article>
  );
}

function StudentContextPanel({ data }: { data: MissionDashboardData }) {
  return (
    <aside className="grid content-start gap-4">
      <ContentCard
        title="Perfil de estudo"
        description={
          data.onboardingSummary.length === 0
            ? "O perfil aparece depois do onboarding premium."
            : "Dados usados para contextualizar a rotina de estudo."
        }
        Icon={Clock3}
        tone="premium"
        metadata={
          data.onboardingSummary.length > 0 ? (
            <div className="grid gap-3">
              {data.onboardingSummary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-ds-12 border border-border-soft bg-background-primary p-3"
                >
                  <p className="text-caption font-semibold uppercase text-text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null
        }
      />

      {!data.hasPaidAccess ? (
        <ContentCard
          title="Pagamento único"
          description="Libere a rotina premium, recomendações completas e plano automático."
          Icon={CircleDollarSign}
          tone="premium"
          metadata={
            <p className="text-4xl font-semibold text-text-primary">R$ 29,90</p>
          }
          action={<PaymentButton disabled={data.accessStatus === "blocked"} />}
        />
      ) : null}
    </aside>
  );
}

function RecommendationsPanel({ data }: { data: MissionDashboardData }) {
  return (
    <section className="rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:p-4 sm:p-6">
      <SectionHeader
        eyebrow="Recomendações personalizadas"
        title="O que reforçar agora"
        description="Sugestões calculadas a partir do uso real da plataforma."
        density="compact"
        action={
          <Link
            href="/analytics"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-ds-12 border border-border-soft px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary"
          >
            Ver analytics
            <BarChart3 className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {data.recommendations.length === 0 ? (
          <EmptyState
            title="Nenhuma lacuna crítica detectada"
            description="Continue seguindo a missão diária para gerar dados mais ricos."
            Icon={BookOpenCheck}
            compact
            className="lg:col-span-2"
          />
        ) : (
          data.recommendations.map((recommendation) => (
            <ContentCard
              key={`${recommendation.title}:${recommendation.href}`}
              href={recommendation.href}
              title={recommendation.title}
              description={recommendation.description}
              Icon={ArrowRight}
              tone="premium"
            />
          ))
        )}
      </div>
    </section>
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
    <main className="px-4 pb-28 pt-5 max-sm:px-3 max-sm:pb-36 max-sm:pt-3 sm:px-6 lg:px-8 lg:pb-8">
      <AppPageHeader
        eyebrow="Painel de Missão"
        title="Seu cockpit diário de preparação"
        description="Comece pela próxima ação recomendada e acompanhe o ritmo sem perder o foco."
        density="compact"
        aside={
          <div className="rounded-ds-16 border border-border-soft bg-background-primary p-4">
            <div className="flex items-center justify-between gap-4">
              <Flame className="size-5 text-accent-gold" aria-hidden="true" />
              <StatusBadge tone={accessTone[data.accessStatus]}>
                {accessLabel[data.accessStatus]}
              </StatusBadge>
            </div>
            <p className="mt-4 text-caption font-semibold uppercase text-text-muted">
              Ritmo atual
            </p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">
              {data.stats.currentStreak} dias
            </p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Pagamento: {paymentValue}.
            </p>
          </div>
        }
      />

      <section className="mt-5 grid gap-5 max-sm:mt-4 max-sm:gap-4 xl:grid-cols-[1fr_360px]">
        <PrimaryActionPanel
          eyebrow="Faça agora"
          title={data.nextAction.title}
          description={data.nextAction.description}
          Icon={Target}
          primaryAction={
            <Link
              href={data.nextAction.href}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white"
            >
              {data.nextAction.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
          secondaryAction={
            <Link
              href={data.hasPaidAccess ? "/premium" : "/planos"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-ds-12 border border-border-soft px-5 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary"
            >
              {data.hasPaidAccess ? "Abrir Academia" : "Ver Premium"}
              <Sparkles className="size-4" aria-hidden="true" />
            </Link>
          }
          metadata={
            <div className="flex flex-wrap gap-2 max-sm:gap-1.5">
              <StatusBadge tone="premium">
                Missão {data.dailyMission.percentage}%
              </StatusBadge>
              <StatusBadge tone="info">
                Preparação {data.preparation.percentage}%
              </StatusBadge>
            </div>
          }
        />

        {!data.hasPaidAccess ? (
          <PremiumLockCard
            title="Painel premium incompleto"
            description="Ative o Premium para liberar onboarding, plano automático e recomendações completas do Painel de Missão."
            benefits={[
              "Rotina guiada por missão diária.",
              "Plano de aprovação conectado ao progresso.",
              "Recomendações completas por lacuna.",
            ]}
          />
        ) : (
          <ContentCard
            title="Academia conectada"
            description="Seu acesso premium está ativo. Continue a jornada completa pela Academia PGM."
            href="/premium"
            Icon={GraduationCap}
            tone="premium"
            badge="Premium"
          />
        )}
      </section>

      <section className="mt-6 max-sm:mt-4">
        <ReviewFinalPromoBanner
          href="/premium/revisao-final"
          premiumLocked={!data.hasPaidAccess}
        />
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          tone={latestAssessment ? "success" : "warning"}
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

      <section className="mt-6 grid gap-6 max-sm:mt-4 max-sm:gap-4 xl:grid-cols-[1fr_380px]">
        <MissionTaskList data={data} />
        <PreparationPanel data={data} />
      </section>

      <section className="mt-6 grid gap-6 max-sm:mt-4 max-sm:gap-4 xl:grid-cols-[1fr_380px]">
        <ApprovalPlanPanel data={data} />
        <StudentContextPanel data={data} />
      </section>

      <section className="mt-6 max-sm:mt-4">
        <RecommendationsPanel data={data} />
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          tone="success"
        />
        <MetricCard
          title="Preparação"
          value={`${data.preparation.percentage}%`}
          description="Cálculo com dados reais da plataforma."
          Icon={GraduationCap}
          footer={
            <ProgressBar
              value={data.preparation.percentage}
              label="Preparação"
              size="sm"
            />
          }
        />
        <MetricCard
          title="Acesso"
          value={accessLabel[data.accessStatus]}
          description="Controle central em profiles.access_status."
          Icon={LockKeyhole}
          tone={accessTone[data.accessStatus]}
        />
      </section>

      <MobileActionBar label="Próxima ação do Painel de Missão">
        <Link
          href={data.nextAction.href}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white max-sm:w-full max-sm:px-3"
        >
          {data.nextAction.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </MobileActionBar>
    </main>
  );
}
