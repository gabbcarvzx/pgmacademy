import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  CircleX,
  ListChecks,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";

import { EmptyState, MetricCard, ProgressBar, StatusBadge } from "@/components/design-system";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import {
  getSimulationResult,
  SimulationServiceError,
} from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ attemptId: string }>;
};

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
    title: `Resultado - ${attemptId}`,
  };
}

export default async function SimulationResultPage({ params }: PageProps) {
  const { attemptId } = await params;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let result;
  try {
    result = await getSimulationResult(user.id, attemptId);
  } catch (error) {
    if (error instanceof SimulationServiceError && error.status === 409) {
      redirect(`/simulados/tentativas/${attemptId}`);
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
            Resultado
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
            {result.templateTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Finalizado em{" "}
            {dateFormatter.format(new Date(result.completedAt))}. Revise seus
            erros, acertos e categorias para ajustar o próximo ciclo de estudo.
          </p>
        </div>
        <InstitutionalNotice />
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Nota",
            value: `${result.percentage}%`,
            description: `${result.score} de ${result.maxScore} pontos`,
            Icon: Trophy,
          },
          {
            title: "Acertos",
            value: String(result.correctAnswers),
            description: `${result.totalQuestions} questões no total`,
            Icon: CheckCircle2,
          },
          {
            title: "Erros",
            value: String(result.incorrectAnswers),
            description: `${result.answeredQuestions} respondidas`,
            Icon: CircleX,
          },
          {
            title: "Tempo",
            value: `${result.elapsedMinutes} min`,
            description: "Tempo gasto na tentativa oficial.",
            Icon: Clock3,
          },
        ].map((item) => (
          <MetricCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            Icon={item.Icon}
            tone={item.title === "Erros" ? "warning" : "premium"}
          />
        ))}
      </section>

      {result.isIntensive && result.preparationAssessment ? (
        <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 max-sm:p-4 sm:p-6">
            <StatusBadge
              tone={
                result.preparationAssessment.tone === "danger"
                  ? "error"
                  : result.preparationAssessment.tone
              }
              size="md"
            >
              Diagnostico de reta final
            </StatusBadge>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {result.preparationAssessment.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {result.preparationAssessment.description}
            </p>
            <p className="mt-4 text-xs leading-5 text-muted">
              Esta classificacao e uma orientacao de estudo independente. Ela
              nao representa resultado, nota de corte ou decisao oficial do
              Programa Ganhe o Mundo.
            </p>
          </article>

          <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <RotateCcw
                className="size-5 text-pgm-yellow"
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold text-white">
                Plano de recuperacao
              </h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {result.recoveryPlan.map((action) => (
                <Link
                  key={action.area}
                  href={action.href}
                  className="rounded-md border border-border-soft bg-background p-4 transition hover:border-white/35"
                >
                  <p className="text-sm font-semibold text-white">
                    {action.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {action.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pgm-yellow">
                    Abrir area recomendada
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 xl:grid-cols-3">
        <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4 sm:p-6">
          <CheckCircle2 className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            Competências fortes
          </h2>
          <div className="mt-4 grid gap-3">
            {result.strongCategories.length === 0 ? (
              <p className="text-sm leading-6 text-muted">
                Ainda não há categoria acima de 75%. Foque nas trilhas
                recomendadas antes de refazer o oficial.
              </p>
            ) : (
              result.strongCategories.map((category) => (
                <div
                  key={category.categoryId}
                  className="rounded-md border border-border-soft bg-background p-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {category.categoryName}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {category.percentage}% de aproveitamento
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4 sm:p-6">
          <Target className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            Competências fracas
          </h2>
          <div className="mt-4 grid gap-3">
            {result.weakCategories.length === 0 ? (
              <p className="text-sm leading-6 text-muted">
                Nenhuma categoria abaixo de 60%. Mantenha revisão e avance para
                treino subjetivo.
              </p>
            ) : (
              result.weakCategories.map((category) => (
                <div
                  key={category.categoryId}
                  className="rounded-md border border-red-300/35 bg-red-400/10 p-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {category.categoryName}
                  </p>
                  <p className="mt-1 text-xs text-red-200">
                    {category.percentage}% de aproveitamento
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 max-sm:p-4 sm:p-6">
          <Trophy className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            Próximos passos
          </h2>
          <ul className="mt-4 grid gap-3">
            {result.nextSteps.map((step) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-muted">
                <CheckCircle2
                  className="mt-1 size-4 shrink-0 text-pgm-yellow"
                  aria-hidden="true"
                />
                {step}
              </li>
            ))}
          </ul>
          <Link
            href="/analytics"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
          >
            Ver analytics
            <BarChart3 className="size-4" aria-hidden="true" />
          </Link>
        </article>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 max-sm:mt-4 max-sm:p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">
            Trilhas recomendadas
          </h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {result.recommendedPaths.length === 0 ? (
            <EmptyState
              title="Nenhuma trilha ativa encontrada"
              description="Assim que houver trilhas ativas, este relatório passará a recomendar conteúdo existente da plataforma."
              Icon={BookOpen}
              compact
              className="bg-background lg:col-span-3"
            />
          ) : (
            result.recommendedPaths.map((path) => (
              <Link
                key={path.id}
                href={path.href}
                className="rounded-md border border-border-soft bg-background p-4 transition hover:border-white/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {path.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {path.reason}
                    </p>
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-pgm-yellow"
                    aria-hidden="true"
                  />
                </div>
                <StatusBadge
                  tone={path.isPremium ? "premium" : "neutral"}
                  className="mt-4"
                >
                  {path.isPremium ? "Premium" : "Gratuito"}
                </StatusBadge>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 max-sm:mt-4 max-sm:p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">
            Desempenho por categoria
          </h2>
        </div>

        <div className="mt-5 grid gap-3">
          {result.byCategory.map((category) => (
            <div
              key={category.categoryId}
              className="rounded-md border border-border-soft bg-background p-4 max-sm:p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {category.categoryName}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {category.correctAnswers} acertos de{" "}
                    {category.totalQuestions}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold text-pgm-yellow">
                  {category.percentage}%
                </span>
              </div>
              <ProgressBar
                value={category.percentage}
                label={category.categoryName}
                size="sm"
                className="mt-3"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 max-sm:mt-4">
        <div className="flex items-center gap-3">
          <ListChecks className="size-5 text-pgm-yellow" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-white">
            Correção por questão
          </h2>
        </div>

        <div className="mt-5 grid gap-4">
          {result.questions.map((question, index) => {
            const selectedOption = question.options.find(
              (option) => option.isSelected,
            );
            const correctOption = question.options.find(
              (option) => option.isCorrect,
            );

            return (
              <article
                key={question.id}
                className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase text-pgm-yellow">
                      Questão {index + 1} · {question.categoryName}
                    </p>
                    <p className="mt-4 whitespace-pre-line break-words text-base leading-7 text-white">
                      {question.statement}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 rounded-md border px-3 py-2 text-sm font-semibold ${
                      question.isCorrect
                        ? "border-pgm-green/40 bg-pgm-green/10 text-pgm-green"
                        : "border-red-300/40 bg-red-400/10 text-red-200"
                    }`}
                  >
                    {question.isCorrect ? "Acerto" : "Erro"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-md border p-4 max-sm:p-3 sm:grid-cols-[40px_1fr] ${
                        option.isCorrect
                          ? "border-pgm-green/45 bg-pgm-green/10"
                          : option.isSelected
                            ? "border-red-300/45 bg-red-400/10"
                            : "border-border-soft bg-background"
                      }`}
                    >
                      <span className="flex size-9 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-white">
                        {option.label}
                      </span>
                      <span className="break-words text-sm leading-6 text-muted">
                        {option.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 rounded-md border border-border-soft bg-background p-4 max-sm:p-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted">
                      Sua resposta
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {selectedOption
                        ? `${selectedOption.label}: ${selectedOption.text}`
                        : "Não respondida"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted">
                      Correta
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {correctOption
                        ? `${correctOption.label}: ${correctOption.text}`
                        : "Gabarito indisponível"}
                    </p>
                  </div>
                </div>

                {question.explanation ? (
                  <div className="mt-4 rounded-md border border-border-soft bg-background p-4 max-sm:p-3">
                    <p className="text-xs font-semibold uppercase text-muted">
                      Explicação
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {question.explanation}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
