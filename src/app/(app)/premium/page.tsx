import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Route,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import {
  AppPageHeader,
  ContentCard,
  LearningStepRow,
  MetricCard,
  MobileActionBar,
  PrimaryActionPanel,
  ProgressBar,
  SectionHeader,
  StatusBadge,
  UpgradeCard,
} from "@/components/design-system";
import type { DesignSystemTone } from "@/components/design-system";
import type { AcademyModuleStatus } from "@/lib/academy/rules";
import type {
  AcademyDashboardData,
  AcademyModuleView,
} from "@/lib/academy/service";
import { getAcademyDashboard } from "@/lib/academy/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Academia PGM",
  description:
    "Jornada premium da PGM Academy com rota de aprovação, idiomas, escrita, treino psicossocial, vida internacional e embarque.",
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

const statusLabel = {
  not_started: "Não iniciado",
  in_progress: "Em andamento",
  completed: "Concluído",
} satisfies Record<AcademyModuleStatus, string>;

const statusTone = {
  not_started: "neutral",
  in_progress: "premium",
  completed: "success",
} satisfies Record<AcademyModuleStatus, DesignSystemTone>;

const contentTypeLabel = {
  path: "Trilha",
  material: "Material",
  flashcards: "Flashcards",
  simulation: "Simulado",
  subjective: "Subjetiva",
  psychosocial: "Psicossocial",
  onboarding: "Onboarding",
} as const;

function JourneyRail({ modules }: { modules: AcademyModuleView[] }) {
  return (
    <section className="rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:p-4 sm:p-6">
      <SectionHeader
        eyebrow="Jornada oficial de estudo"
        title="Da estratégia ao embarque"
        description="Sete módulos organizados como uma trilha única de preparação."
        density="compact"
        action={<Route className="size-6 text-accent-gold" aria-hidden="true" />}
      />

      <ol className="mt-6 grid gap-3 max-sm:mt-4 sm:grid-cols-2 xl:grid-cols-7">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <li key={module.id}>
              <ContentCard
                eyebrow={`Módulo ${module.order}`}
                title={module.shortTitle}
                Icon={Icon}
                tone={statusTone[module.progress.status]}
                badge={statusLabel[module.progress.status]}
                metadata={
                  <ProgressBar
                    value={module.progress.progressPercent}
                    label={`${module.shortTitle}: ${module.progress.progressPercent}%`}
                    size="sm"
                  />
                }
                className="h-full"
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function NextActivityPanel({ data }: { data: AcademyDashboardData }) {
  return (
    <PrimaryActionPanel
      eyebrow="Continue daqui"
      title={data.nextActivity.title}
      description={data.nextActivity.description}
      Icon={Target}
      primaryAction={
        <Link
          href={data.nextActivity.href}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white"
        >
          {data.nextActivity.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
      secondaryAction={
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-ds-12 border border-border-soft px-5 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary"
        >
          Ver missão
          <LayoutDashboard className="size-4" aria-hidden="true" />
        </Link>
      }
      metadata={
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={accessTone[data.accessStatus]}>
            {accessLabel[data.accessStatus]}
          </StatusBadge>
          <StatusBadge tone="premium">
            {data.overall.progressPercent}% concluído
          </StatusBadge>
        </div>
      }
    />
  );
}

function FreeAcademyPreview({ modules }: { modules: AcademyModuleView[] }) {
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-2">
      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <ContentCard
            key={module.id}
            eyebrow={`Módulo ${module.order}`}
            title={module.title}
            description={module.description}
            Icon={Icon}
            tone="premium"
            badge="Preview"
            metadata={
              <div className="grid gap-2 text-sm text-text-muted">
                <p className="font-semibold text-text-primary">
                  {module.progress.totalContents} atividades guiadas
                </p>
                <p>Conteúdo completo, atividades e progresso liberados no Premium.</p>
              </div>
            }
          />
        );
      })}
    </section>
  );
}

function AcademyModuleCard({ module }: { module: AcademyModuleView }) {
  const Icon = module.icon;

  return (
    <article
      id={module.id}
      className="scroll-mt-6 rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:p-4 sm:p-6"
    >
      <SectionHeader
        eyebrow={`Módulo ${module.order}`}
        title={module.title}
        description={module.description}
        density="compact"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-ds-16 bg-accent-gold text-background-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <StatusBadge tone={statusTone[module.progress.status]} size="md">
              {statusLabel[module.progress.status]}
            </StatusBadge>
          </div>
        }
      />

      <div className="mt-5 grid gap-4 border-y border-border-soft py-5 max-sm:gap-3 max-sm:py-4 lg:grid-cols-2">
        <ContentCard
          title="Por que este módulo existe"
          description={module.whyItExists}
          tone="info"
        />
        <ContentCard
          title="Resultado esperado"
          description={module.outcome}
          tone="success"
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-text-primary">
            {module.progress.completedContents} de{" "}
            {module.progress.totalContents} atividades concluídas
          </p>
          <span className="font-mono text-sm font-semibold text-accent-gold">
            {module.progress.progressPercent}%
          </span>
        </div>
        <ProgressBar
          value={module.progress.progressPercent}
          label={`Progresso do módulo ${module.order}`}
          className="mt-3"
        />
      </div>

      <div className="mt-5 grid gap-3">
        {module.contents.map((content) => (
          <LearningStepRow
            key={content.id}
            href={content.href}
            title={content.title}
            description={content.description}
            state={
              content.completed
                ? "completed"
                : module.nextContent?.id === content.id
                  ? "current"
                  : "upcoming"
            }
            metadata={
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="neutral">
                  {contentTypeLabel[content.type]}
                </StatusBadge>
                {content.sourceLabel ? (
                  <StatusBadge tone="success">{content.sourceLabel}</StatusBadge>
                ) : null}
              </div>
            }
          />
        ))}
      </div>
    </article>
  );
}

function CompletionPanel({ data }: { data: AcademyDashboardData }) {
  if (!data.overall.completed) {
    return null;
  }

  return (
    <section className="mt-6 rounded-ds-20 border border-success/35 bg-success/10 p-5 shadow-card max-sm:mt-4 max-sm:p-4 sm:p-6">
      <Trophy className="size-6 text-success" aria-hidden="true" />
      <p className="mt-4 text-caption font-semibold uppercase text-success">
        Academia concluída
      </p>
      <h2 className="mt-3 text-heading-3 font-semibold text-text-primary">
        Você completou a jornada base da Academia PGM
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">
        Continue revisando simulados, analytics e atividades da missão para
        manter consistência até as etapas oficiais.
      </p>
      <div className="mt-5 grid gap-4 border-t border-success/25 pt-5 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Módulos"
          value={`${data.overall.completedModules}/${data.overall.totalModules}`}
          description="Módulos concluídos."
          tone="success"
        />
        <MetricCard
          title="Simulados"
          value={data.stats.completedSimulations}
          description="Tentativas realizadas."
          tone="success"
        />
        <MetricCard
          title="Subjetivas"
          value={data.stats.subjectiveSubmitted}
          description="Respostas enviadas."
          tone="success"
        />
        <MetricCard
          title="Progresso"
          value={`${data.overall.progressPercent}%`}
          description="Evolução geral."
          tone="success"
        />
        <MetricCard
          title="Próximo"
          value="Missão"
          description={data.nextActivity.title}
          tone="success"
        />
      </div>
    </section>
  );
}

export default async function PremiumPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getAcademyDashboard(user.id);
  const mobileHref = data.hasPaidAccess ? data.nextActivity.href : "/planos";
  const mobileLabel = data.hasPaidAccess ? data.nextActivity.cta : "Assinar Premium";

  return (
    <main className="px-4 pb-28 pt-5 max-sm:px-3 max-sm:pb-36 max-sm:pt-3 sm:px-6 lg:px-8 lg:pb-8">
      <AppPageHeader
        eyebrow="Academia PGM"
        title="A jornada premium para transformar estudo solto em preparação guiada"
        description="Sete módulos conectam rota de aprovação, idioma, escrita, entrevista, vida internacional e embarque."
        density="compact"
        aside={
          <div className="rounded-ds-16 border border-border-soft bg-background-primary p-4">
            <div className="flex items-center justify-between gap-4">
              <GraduationCap className="size-5 text-accent-gold" aria-hidden="true" />
              <StatusBadge tone={accessTone[data.accessStatus]}>
                {accessLabel[data.accessStatus]}
              </StatusBadge>
            </div>
            <p className="mt-4 text-caption font-semibold uppercase text-text-muted">
              Progresso geral
            </p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">
              {data.overall.progressPercent}%
            </p>
            <ProgressBar
              value={data.overall.progressPercent}
              label="Academia"
              size="sm"
              className="mt-4"
            />
          </div>
        }
      />

      <section className="mt-5 max-sm:mt-4">
        <NextActivityPanel data={data} />
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Acesso"
          value={accessLabel[data.accessStatus]}
          description="Validado antes de liberar a jornada."
          Icon={LockKeyhole}
          tone={accessTone[data.accessStatus]}
        />
        <MetricCard
          title="Módulos"
          value={`${data.overall.completedModules}/${data.overall.totalModules}`}
          description="Progresso calculado por atividades reais."
          Icon={GraduationCap}
        />
        <MetricCard
          title="Atividades"
          value={`${data.overall.completedContents}/${data.overall.totalContents}`}
          description="Materiais, trilhas, simulados, subjetivas e onboarding."
          Icon={ClipboardCheck}
        />
        <MetricCard
          title="Simulados"
          value={data.stats.completedSimulations}
          description="Tentativas oficiais finalizadas."
          Icon={BookOpenCheck}
        />
      </section>

      <section className="mt-6 rounded-ds-20 border border-border-soft bg-surface p-5 shadow-card max-sm:mt-4 max-sm:p-4 sm:p-6">
        <SectionHeader
          eyebrow="Progresso geral"
          title={`${data.overall.progressPercent}% da Academia concluída`}
          description="O progresso reúne atividades concluídas em trilhas, materiais, simulados, subjetivas e onboarding."
          density="compact"
          action={
            <StatusBadge tone="premium" size="md">
              {data.overall.completedContents}/{data.overall.totalContents}
            </StatusBadge>
          }
        />
        <ProgressBar
          value={data.overall.progressPercent}
          label="Progresso da Academia"
          showValue
          className="mt-5"
        />
      </section>

      <CompletionPanel data={data} />

      <section className="mt-6 max-sm:mt-4">
        <JourneyRail modules={data.modules} />
      </section>

      {!data.hasPaidAccess ? (
        <>
          <section className="mt-6 max-sm:mt-4">
            <UpgradeCard
              title="Desbloqueie a execução guiada da Academia"
              description="Alunos gratuitos conseguem entender a jornada. O acesso aos conteúdos completos, progresso por atividade e recomendações de continuidade permanece exclusivo do Premium."
              benefits={[
                "Sete módulos conectados a atividades reais.",
                "Progresso consolidado por conteúdo concluído.",
                "Próximo passo sempre visível no topo da jornada.",
              ]}
              href="/planos"
              ctaLabel="Assinar Premium"
            />
          </section>
          <FreeAcademyPreview modules={data.modules} />
        </>
      ) : (
        <section className="mt-6 grid gap-6 max-sm:mt-4 max-sm:gap-4">
          {data.modules.map((module) => (
            <AcademyModuleCard key={module.id} module={module} />
          ))}
        </section>
      )}

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 lg:grid-cols-3">
        <ContentCard
          href="/dashboard"
          title="Painel de Missão"
          description="Use a missão diária para transformar a Academia em ação concreta."
          Icon={LayoutDashboard}
          tone="premium"
        />
        <ContentCard
          href="/simulados"
          title="Simulados Oficiais"
          description="Valide a preparação com resultado, tempo e desempenho por categoria."
          Icon={Target}
          tone="premium"
        />
        <ContentCard
          href="/sucesso"
          title="Central de Sucesso"
          description="Resolva dúvidas operacionais sem depender de atendimento manual."
          Icon={Sparkles}
          tone="premium"
        />
      </section>

      <MobileActionBar label="Próxima ação da Academia PGM">
        <Link
          href={mobileHref}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white max-sm:w-full max-sm:px-3"
        >
          {mobileLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </MobileActionBar>
    </main>
  );
}
