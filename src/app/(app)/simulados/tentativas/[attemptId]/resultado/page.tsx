import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleX,
  ListChecks,
  Trophy,
} from "lucide-react";

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
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/simulados"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Simulados
      </Link>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Resultado
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
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

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Nota",
            value: `${result.percentage}%`,
            description: `${result.score} de ${result.totalQuestions} pontos`,
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
            title: "Categorias",
            value: String(result.byCategory.length),
            description: "Desempenho agrupado por assunto.",
            Icon: BarChart3,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-border-soft bg-surface p-5"
          >
            <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium text-muted">{item.title}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Proximo passo
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Quer acesso a todos os simulados e materiais?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Use este resultado para reforçar categorias fracas, acompanhar
              analytics e continuar evoluindo com a experiência premium.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/analytics"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
            >
              Ver analytics
              <BarChart3 className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/planos"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
            >
              Quero continuar evoluindo
              <Trophy className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
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
              className="rounded-md border border-border-soft bg-background p-4"
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
              <div className="mt-3 h-2 rounded-full bg-surface">
                <div
                  className="h-2 rounded-full bg-pgm-yellow"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
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
                className="rounded-md border border-border-soft bg-surface p-5 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase text-pgm-yellow">
                      Questão {index + 1} · {question.categoryName}
                    </p>
                    <p className="mt-4 whitespace-pre-line text-base leading-7 text-white">
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
                      className={`grid grid-cols-[40px_1fr] gap-3 rounded-md border p-4 ${
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
                      <span className="text-sm leading-6 text-muted">
                        {option.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 rounded-md border border-border-soft bg-background p-4 sm:grid-cols-2">
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
                  <div className="mt-4 rounded-md border border-border-soft bg-background p-4">
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
