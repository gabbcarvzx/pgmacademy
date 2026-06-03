import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CalendarDays,
  CheckCircle2,
  Flame,
  Gauge,
  LockKeyhole,
  Medal,
  MessageCircle,
  MessageSquareCheck,
  PenLine,
  Route,
  Target,
  Trophy,
} from "lucide-react";

import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import type {
  CategoryAnalytics,
  TimelinePoint,
} from "@/lib/analytics/service";
import { getAnalyticsDashboard } from "@/lib/analytics/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Desempenho e recomendações da PGM Academy.",
};

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function metricValue(value: number, suffix = "") {
  return `${formatNumber(value)}${suffix}`;
}

function MetricCard({
  title,
  value,
  description,
  Icon,
}: {
  title: string;
  value: string;
  description: string;
  Icon: typeof Gauge;
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

function CategoryRow({ category }: { category: CategoryAnalytics }) {
  return (
    <div className="rounded-md border border-border-soft bg-background p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {category.categoryName}
          </p>
          <p className="mt-1 text-xs text-muted">
            {category.kind === "progress"
              ? `${category.correctAnswers} de ${category.totalQuestions} itens trabalhados`
              : `${category.correctAnswers} acertos e ${category.incorrectAnswers} erros`}
          </p>
        </div>
        <span className="font-mono text-sm font-semibold text-pgm-yellow">
          {category.percentage}%
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-surface">
        <div
          className="h-2 rounded-full bg-pgm-yellow"
          style={{ width: `${category.percentage}%` }}
        />
      </div>
    </div>
  );
}

function TimelineChart({
  title,
  points,
  compact = false,
}: {
  title: string;
  points: TimelinePoint[];
  compact?: boolean;
}) {
  const visiblePoints = compact ? points.slice(-10) : points;
  const maxActivities = Math.max(
    1,
    ...visiblePoints.map((point) => point.activities),
  );

  return (
    <article className="rounded-md border border-border-soft bg-surface p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div
        className={`mt-5 grid items-end gap-2 ${
          compact ? "grid-cols-10" : "grid-cols-7"
        }`}
      >
        {visiblePoints.map((point) => {
          const height = Math.max(
            point.activities === 0
              ? 8
              : Math.round((point.activities / maxActivities) * 96),
            8,
          );

          return (
            <div key={point.dateKey} className="grid gap-2">
              <div className="flex h-28 items-end rounded-md bg-background px-1">
                <div
                  className="w-full rounded-sm bg-pgm-yellow"
                  style={{ height }}
                  title={`${point.activities} atividades`}
                />
              </div>
              <p className="truncate text-center text-[11px] font-medium text-muted">
                {point.label}
              </p>
              <p className="text-center text-[11px] font-semibold text-white">
                {point.averagePercentage === null
                  ? "--"
                  : `${point.averagePercentage}%`}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">
        Barras indicam atividades concluídas. Percentual abaixo da data indica
        média dos simulados finalizados naquele período.
      </p>
    </article>
  );
}

function LockedPremiumSection({ title }: { title: string }) {
  return (
    <section className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
      <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Esta leitura detalhada faz parte do analytics premium. Usuários
        gratuitos continuam vendo o resumo geral e podem liberar diagnóstico,
        histórico avançado e recomendações completas com upgrade.
      </p>
      <Link
        href="/planos"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
      >
        Desbloquear analytics premium
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}

export default async function AnalyticsPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getAnalyticsDashboard(user.id);
  const hasFullAnalytics = data.hasPaidAccess;
  const visibleCategories = hasFullAnalytics
    ? data.categoryPerformance
    : data.categoryPerformance.slice(0, 3);
  const visibleDiagnostics = hasFullAnalytics
    ? data.diagnostics
    : data.diagnostics.slice(0, 2);
  const visibleRecommendations = hasFullAnalytics
    ? data.recommendations
    : data.recommendations.slice(0, 1);
  const completedAchievements = data.achievements.filter(
    (achievement) => achievement.completed,
  ).length;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Analytics de aprendizagem
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Inteligencia de estudo baseada nos seus dados reais
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Diagnóstico, metas, streak, conquistas e recomendações são gerados
            por regras simples. Nenhuma IA, embedding, chatbot ou serviço pago
            é utilizado nesta etapa.
          </p>
        </div>
        {hasFullAnalytics ? (
          <InstitutionalNotice />
        ) : (
          <PremiumUpgradeCard description="A visão premium libera desempenho por categoria, evolução detalhada, diagnóstico automático e recomendações completas." />
        )}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Simulados realizados"
          value={metricValue(data.summary.completedSimulations)}
          description={`Acesso atual: ${accessLabel[data.accessStatus]}.`}
          Icon={Gauge}
        />
        <MetricCard
          title="Média geral"
          value={metricValue(data.summary.averageScore, "%")}
          description="Média das tentativas finalizadas."
          Icon={BarChart3}
        />
        <MetricCard
          title="Acertos gerais"
          value={metricValue(data.summary.overallAccuracy, "%")}
          description={`${formatNumber(data.summary.answeredQuestions)} questões respondidas.`}
          Icon={Trophy}
        />
        <MetricCard
          title="Tempo médio"
          value={metricValue(data.summary.averageSimulationMinutes, " min")}
          description="Tempo médio por simulado concluído."
          Icon={CalendarDays}
        />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Materiais concluídos"
          value={metricValue(data.summary.completedMaterials)}
          description="Conteúdos marcados como concluídos."
          Icon={BookOpenCheck}
        />
        <MetricCard
          title="Flashcards revisados"
          value={metricValue(data.summary.reviewedFlashcards)}
          description="Cards revisados pelo aluno."
          Icon={Brain}
        />
        <MetricCard
          title="Trilhas iniciadas"
          value={metricValue(data.summary.startedPaths)}
          description="Trilhas com pelo menos um item concluído."
          Icon={Route}
        />
        <MetricCard
          title="Trilhas concluídas"
          value={metricValue(data.summary.completedPaths)}
          description="Sequencias pedagogicas finalizadas."
          Icon={CheckCircle2}
        />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Subjetivas enviadas"
          value={metricValue(data.summary.subjectiveSubmitted)}
          description={`${formatNumber(data.summary.subjectiveReviewed)} corrigidas / média ${data.summary.subjectiveAverage}%.`}
          Icon={PenLine}
        />
        <MetricCard
          title="Treinos psicossociais"
          value={metricValue(data.summary.psychosocialSubmitted)}
          description={`${formatNumber(data.summary.psychosocialReviewed)} corrigidos / média ${data.summary.psychosocialAverage}%.`}
          Icon={MessageCircle}
        />
        <MetricCard
          title="Feedbacks manuais"
          value={metricValue(data.summary.manualFeedbacksReceived)}
          description="Feedbacks escritos por administradores."
          Icon={MessageSquareCheck}
        />
        <MetricCard
          title="Média manual"
          value={metricValue(
            data.summary.subjectiveReviewed + data.summary.psychosocialReviewed === 0
              ? 0
              : Number(
                  (
                    (data.summary.subjectiveAverage * data.summary.subjectiveReviewed +
                      data.summary.psychosocialAverage * data.summary.psychosocialReviewed) /
                    (data.summary.subjectiveReviewed +
                      data.summary.psychosocialReviewed)
                  ).toFixed(2),
                ),
            "%",
          )}
          description="Média ponderada das correções manuais."
          Icon={Medal}
        />
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_340px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-5 text-pgm-yellow" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white">
              Desempenho por categoria
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            {visibleCategories.length === 0 ? (
              <p className="rounded-md border border-border-soft bg-background p-4 text-sm leading-6 text-muted">
                Finalize um simulado para gerar desempenho por categoria.
              </p>
            ) : (
              visibleCategories.map((category) => (
                <CategoryRow key={category.categoryId} category={category} />
              ))
            )}
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <article className="rounded-md border border-border-soft bg-surface p-5">
            <Flame className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">
              Streak atual
            </p>
            <p className="mt-2 text-4xl font-semibold text-white">
              {data.streak.currentStreak}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Recorde pessoal: {data.streak.recordStreak} dias consecutivos.
            </p>
          </article>
          <article className="rounded-md border border-border-soft bg-surface p-5">
            <Medal className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">Conquistas</p>
            <p className="mt-2 text-4xl font-semibold text-white">
              {completedAchievements}/{data.achievements.length}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Marcos de engajamento calculados por atividade real.
            </p>
          </article>
        </aside>
      </section>

      {hasFullAnalytics ? (
        <>
          <section className="mt-6 grid gap-4 xl:grid-cols-2">
            <TimelineChart title="Últimos 7 dias" points={data.evolution.last7Days} />
            <TimelineChart
              title="Últimos 30 dias"
              points={data.evolution.last30Days}
              compact
            />
          </section>

          <section className="mt-6">
            <TimelineChart
              title="Histórico geral"
              points={data.evolution.overall.length > 0 ? data.evolution.overall : data.evolution.last7Days}
              compact
            />
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-2">
            <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Target className="size-5 text-pgm-yellow" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">
                  Metas da semana
                </h2>
              </div>
              <div className="mt-5 grid gap-3">
                {data.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="rounded-md border border-border-soft bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {goal.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted">
                          {goal.description}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-pgm-yellow">
                        {goal.progress}/{goal.target}
                      </span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-surface">
                      <div
                        className="h-2 rounded-full bg-pgm-yellow"
                        style={{ width: `${goal.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Gauge className="size-5 text-pgm-yellow" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">
                  Diagnóstico automático
                </h2>
              </div>
              <div className="mt-5 grid gap-3">
                {visibleDiagnostics.length === 0 ? (
                  <p className="rounded-md border border-border-soft bg-background p-4 text-sm leading-6 text-muted">
                    Finalize simulados para gerar diagnósticos por regras.
                  </p>
                ) : (
                  visibleDiagnostics.map((insight) => (
                    <div
                      key={insight.id}
                      className="rounded-md border border-border-soft bg-background p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {insight.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {insight.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <BookOpenCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">
                Recomendações de estudo
              </h2>
            </div>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {visibleRecommendations.length === 0 ? (
                <p className="rounded-md border border-border-soft bg-background p-4 text-sm leading-6 text-muted">
                  Recomendações aparecem quando houver categorias com margem de
                  melhoria.
                </p>
              ) : (
                visibleRecommendations.map((recommendation) => (
                  <article
                    key={recommendation.id}
                    className="rounded-md border border-border-soft bg-background p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {recommendation.categoryName}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {recommendation.reason}
                    </p>
                    <div className="mt-4 grid gap-2">
                      {recommendation.materials.map((material) => (
                        <Link
                          key={material.id}
                          href={material.canAccess ? material.href : "/planos"}
                          className="inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                        >
                          {material.title}
                          {material.isPremium ? (
                            <LockKeyhole className="size-4" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="size-4" aria-hidden="true" />
                          )}
                        </Link>
                      ))}
                      {recommendation.flashcards.map((deck) => (
                        <Link
                          key={deck.categorySlug}
                          href={deck.canAccess ? deck.href : "/planos"}
                          className="inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                        >
                          {deck.title} ({deck.totalCards})
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Medal className="size-5 text-pgm-yellow" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">
                Conquistas
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.achievements.map((achievement) => (
                <article
                  key={achievement.id}
                  className={`rounded-md border p-4 ${
                    achievement.completed
                      ? "border-pgm-green/40 bg-pgm-green/10"
                      : "border-border-soft bg-background"
                  }`}
                >
                  <CheckCircle2
                    className={`size-5 ${
                      achievement.completed ? "text-pgm-green" : "text-muted"
                    }`}
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-sm font-semibold text-white">
                    {achievement.title}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {achievement.description}
                  </p>
                  <p className="mt-3 font-mono text-xs font-semibold text-pgm-yellow">
                    {Math.min(achievement.progress, achievement.target)}/
                    {achievement.target}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <LockedPremiumSection title="Evolução temporal detalhada" />
          <LockedPremiumSection title="Diagnóstico e recomendações completas" />
        </div>
      )}
    </main>
  );
}
