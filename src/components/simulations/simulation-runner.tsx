"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Send,
} from "lucide-react";

import {
  finishSimulationAttemptAction,
  saveSimulationAnswerAction,
} from "@/app/(app)/simulados/actions";
import type { SimulationRunnerView } from "@/lib/simulations/service";

type SimulationRunnerProps = {
  attemptId: string;
  questions: SimulationRunnerView["questions"];
};

export function SimulationRunner({
  attemptId,
  questions,
}: SimulationRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState(() => {
    return new Map(
      questions.map((question) => [question.id, question.selectedOptionId]),
    );
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const currentQuestion = questions[currentIndex] ?? null;
  const answeredCount = useMemo(
    () =>
      questions.filter((question) => Boolean(selectedOptionIds.get(question.id)))
        .length,
    [questions, selectedOptionIds],
  );
  const progressPercent =
    questions.length === 0
      ? 0
      : Math.round((answeredCount / questions.length) * 100);

  function goToQuestion(index: number) {
    setCurrentIndex(Math.min(Math.max(index, 0), questions.length - 1));
  }

  function selectOption(questionId: string, selectedOptionId: string) {
    setSelectedOptionIds((current) => {
      const next = new Map(current);
      next.set(questionId, selectedOptionId);
      return next;
    });
    setSaveError(null);

    startSaving(async () => {
      try {
        await saveSimulationAnswerAction({
          attemptId,
          questionId,
          selectedOptionId,
        });
      } catch {
        setSaveError("Não foi possível salvar está resposta. Tente novamente.");
      }
    });
  }

  if (!currentQuestion) {
    return (
      <section className="rounded-md border border-border-soft bg-surface p-5">
        <p className="text-sm font-semibold text-white">
          Nenhuma questão vinculada
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Esta tentativa não possui questões suficientes para resolução.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Questão {currentIndex + 1} de {questions.length}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                {currentQuestion.categoryName}
              </span>
              <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                {currentQuestion.language}
              </span>
              <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>
          <div className="min-w-[140px]">
            <div className="flex items-center justify-between text-xs font-semibold text-muted">
              <span>Progresso</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-background">
              <div
                className="h-2 rounded-full bg-pgm-yellow transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-white">
          {currentQuestion.statement}
        </p>

        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected =
              selectedOptionIds.get(currentQuestion.id) === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(currentQuestion.id, option.id)}
                className={`grid grid-cols-[40px_1fr] items-start gap-3 rounded-md border p-4 text-left transition ${
                  isSelected
                    ? "border-pgm-yellow bg-pgm-yellow/10"
                    : "border-border-soft bg-background hover:border-white/35"
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-md border text-sm font-semibold ${
                    isSelected
                      ? "border-pgm-yellow text-pgm-yellow"
                      : "border-border-soft text-muted"
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-sm leading-6 text-white">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex min-h-5 items-center gap-2 text-xs font-semibold text-muted">
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Salvando resposta
            </>
          ) : saveError ? (
            <span className="text-red-300">{saveError}</span>
          ) : (
            <>
              <CheckCircle2 className="size-4 text-pgm-yellow" aria-hidden="true" />
              Respostas salvas automaticamente
            </>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => goToQuestion(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Próxima
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </article>

      <aside className="grid gap-4 self-start">
        <article className="rounded-md border border-border-soft bg-surface p-5">
          <p className="text-sm font-semibold text-white">Revisão</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {answeredCount} de {questions.length} respondidas. Você pode voltar
            para qualquer questão antes de finalizar.
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6 xl:grid-cols-5">
            {questions.map((question, index) => {
              const isAnswered = Boolean(selectedOptionIds.get(question.id));
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  className={`flex h-10 items-center justify-center rounded-md border text-sm font-semibold transition ${
                    isCurrent
                      ? "border-pgm-yellow bg-pgm-yellow text-background"
                      : isAnswered
                        ? "border-pgm-yellow/50 bg-pgm-yellow/10 text-pgm-yellow"
                        : "border-border-soft bg-background text-muted hover:border-white/35"
                  }`}
                  title={`Ir para questão ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </article>

        <article className="rounded-md border border-border-soft bg-surface p-5">
          <p className="text-sm font-semibold text-white">Antes de finalizar</p>
          <ul className="mt-4 grid gap-3">
            {[
              "Confira questões sem resposta.",
              "Revise alternativas marcadas.",
              "Depois de finalizar, o gabarito será liberado.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                {index < 2 ? (
                  <Circle className="mt-1 size-4 shrink-0 text-muted" />
                ) : (
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-pgm-yellow" />
                )}
                {item}
              </li>
            ))}
          </ul>

          <form action={finishSimulationAttemptAction} className="mt-5">
            <input type="hidden" name="attemptId" value={attemptId} />
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Finalizar simulado
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </article>
      </aside>
    </section>
  );
}
