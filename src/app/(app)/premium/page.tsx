import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Route,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import type { AcademyModuleStatus } from "@/lib/academy/rules";
import type { AcademyDashboardData, AcademyModuleView } from "@/lib/academy/service";
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

const statusLabel = {
  not_started: "Não iniciado",
  in_progress: "Em andamento",
  completed: "Concluído",
} satisfies Record<AcademyModuleStatus, string>;

const statusStyle = {
  not_started: "border-border-soft bg-background text-muted",
  in_progress: "border-pgm-yellow/45 bg-pgm-yellow/10 text-pgm-yellow",
  completed: "border-pgm-green/45 bg-pgm-green/10 text-pgm-green",
} satisfies Record<AcademyModuleStatus, string>;

const contentTypeLabel = {
  path: "Trilha",
  material: "Material",
  flashcards: "Flashcards",
  simulation: "Simulado",
  subjective: "Subjetiva",
  psychosocial: "Psicossocial",
  onboarding: "Onboarding",
} as const;

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
  Icon: LucideIcon;
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

function StatusPill({ status }: { status: AcademyModuleStatus }) {
  return (
    <span
      className={`inline-flex rounded-md border px-3 py-1 text-xs font-semibold ${statusStyle[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

function JourneyRail({ modules }: { modules: AcademyModuleView[] }) {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Jornada oficial de estudo
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Da estratégia ao embarque
          </h2>
        </div>
        <Route className="size-6 text-pgm-yellow" aria-hidden="true" />
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <li
              key={module.id}
              className="rounded-md border border-border-soft bg-background p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-pgm-yellow text-sm font-semibold text-background">
                  {module.order}
                </span>
                <Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
              </div>
              <p className="mt-4 min-h-10 text-sm font-semibold text-white">
                {module.shortTitle}
              </p>
              <div className="mt-3">
                <ProgressBar value={module.progress.progressPercent} />
              </div>
              <p className="mt-2 font-mono text-xs font-semibold text-muted">
                {module.progress.progressPercent}%
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function NextActivityCard({ data }: { data: AcademyDashboardData }) {
  return (
    <aside className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5">
      <Target className="size-5 text-pgm-yellow" aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold uppercase text-pgm-yellow">
        Próxima atividade
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        {data.nextActivity.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        {data.nextActivity.description}
      </p>
      <Link
        href={data.nextActivity.href}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        {data.nextActivity.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}

function FreeAcademyPreview({ modules }: { modules: AcademyModuleView[] }) {
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-2">
      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <article
            key={module.id}
            className="rounded-md border border-border-soft bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
              <LockKeyhole className="size-4 text-muted" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase text-pgm-yellow">
              Módulo {module.order}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {module.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {module.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-white">
              {module.progress.totalContents} atividades guiadas
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Conteúdo completo, atividades e progresso liberados no Premium.
            </p>
          </article>
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
      className="scroll-mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-pgm-yellow text-background">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Módulo {module.order}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {module.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              {module.description}
            </p>
          </div>
        </div>
        <StatusPill status={module.progress.status} />
      </div>

      <div className="mt-5 grid gap-5 border-y border-border-soft py-5 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="text-sm font-semibold text-white">
            Por que este módulo existe
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">{module.whyItExists}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Resultado esperado</p>
          <p className="mt-2 text-sm leading-6 text-muted">{module.outcome}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">
            {module.progress.completedContents} de{" "}
            {module.progress.totalContents} atividades concluídas
          </p>
          <span className="font-mono text-sm font-semibold text-pgm-yellow">
            {module.progress.progressPercent}%
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar value={module.progress.progressPercent} />
        </div>
      </div>

      <div className="mt-5 divide-y divide-border-soft border-y border-border-soft">
        {module.contents.map((content) => (
          <Link
            key={content.id}
            href={content.href}
            className="grid gap-3 py-4 transition hover:bg-white/[0.03] lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div className="flex gap-3">
              {content.completed ? (
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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-white">
                    {content.title}
                  </p>
                  <span className="rounded-md border border-border-soft px-2 py-1 text-xs font-semibold text-muted">
                    {contentTypeLabel[content.type]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {content.description}
                </p>
                {content.sourceLabel ? (
                  <p className="mt-2 text-xs font-semibold text-pgm-green">
                    {content.sourceLabel}
                  </p>
                ) : null}
              </div>
            </div>
            <ArrowRight
              className="ml-8 size-4 text-pgm-yellow lg:ml-0"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </article>
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

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Academia PGM
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-4xl">
            A jornada premium para transformar estudo solto em preparação guiada
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Sete módulos conectam rota de aprovação, idioma, escrita,
            entrevista, vida internacional e embarque. A plataforma organiza a
            preparação de forma independente e sempre orienta a conferência no
            edital vigente e nos canais oficiais.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={data.nextActivity.href}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
            >
              {data.nextActivity.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-5 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
            >
              Ver missão
              <LayoutDashboard className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </article>

        <NextActivityCard data={data} />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Acesso"
          value={accessLabel[data.accessStatus]}
          description="Seu acesso premium é validado antes de liberar a jornada."
          Icon={LockKeyhole}
        />
        <MetricCard
          title="Módulos"
          value={`${data.overall.completedModules}/${data.overall.totalModules}`}
          description="Progresso calculado a partir de atividades reais."
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
          description="Tentativas oficiais finalizadas na plataforma."
          Icon={BookOpenCheck}
        />
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Progresso geral
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {data.overall.progressPercent}% da Academia concluída
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              O progresso reúne atividades concluídas em trilhas, materiais,
              simulados, subjetivas e onboarding para indicar o próximo passo
              com mais precisão.
            </p>
          </div>
          <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-2 font-mono text-sm font-semibold text-pgm-yellow">
            {data.overall.completedContents}/{data.overall.totalContents}
          </span>
        </div>
        <div className="mt-5">
          <ProgressBar value={data.overall.progressPercent} />
        </div>
      </section>

      {data.overall.completed ? (
        <section className="mt-6 rounded-md border border-pgm-green/35 bg-pgm-green/10 p-5 sm:p-6">
          <Trophy className="size-6 text-pgm-green" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold uppercase text-pgm-green">
            Academia concluída
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Você completou a jornada base da Academia PGM
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Continue revisando simulados, analytics e atividades da missão para
            manter consistência até as etapas oficiais.
          </p>
          <div className="mt-5 grid gap-4 border-t border-pgm-green/25 pt-5 sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Módulos concluídos
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {data.overall.completedModules}/{data.overall.totalModules}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Simulados realizados
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {data.stats.completedSimulations}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Subjetivas enviadas
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {data.stats.subjectiveSubmitted}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Progresso geral
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {data.overall.progressPercent}%
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Próxima recomendação
              </p>
              <p className="mt-2 text-sm font-semibold leading-5 text-white">
                {data.nextActivity.title}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-6">
        <JourneyRail modules={data.modules} />
      </section>

      {!data.hasPaidAccess ? (
        <>
          <section className="mt-6 rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
            <LockKeyhole className="size-6 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold uppercase text-pgm-yellow">
              Premium necessário
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Veja a estrutura completa e desbloqueie a execução guiada
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              Alunos gratuitos conseguem entender a jornada e o valor da
              Academia. O acesso aos conteúdos completos, progresso por
              atividade e recomendações de continuidade permanece exclusivo do
              Premium.
            </p>
            <Link
              href="/planos"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
            >
              Assinar Premium
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
          <FreeAcademyPreview modules={data.modules} />
        </>
      ) : (
        <section className="mt-6 grid gap-6">
          {data.modules.map((module) => (
            <AcademyModuleCard key={module.id} module={module} />
          ))}
        </section>
      )}

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <Link
          href="/dashboard"
          className="rounded-md border border-border-soft bg-surface p-5 transition hover:border-white/35"
        >
          <LayoutDashboard className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Painel de Missão
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use a missão diária para transformar a Academia em ação concreta.
          </p>
        </Link>
        <Link
          href="/simulados"
          className="rounded-md border border-border-soft bg-surface p-5 transition hover:border-white/35"
        >
          <Target className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Simulados Oficiais
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Valide a preparação com resultado, tempo e desempenho por categoria.
          </p>
        </Link>
        <Link
          href="/sucesso"
          className="rounded-md border border-border-soft bg-surface p-5 transition hover:border-white/35"
        >
          <Sparkles className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Central de Sucesso
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Resolva dúvidas operacionais sem depender de atendimento manual.
          </p>
        </Link>
      </section>
    </main>
  );
}
