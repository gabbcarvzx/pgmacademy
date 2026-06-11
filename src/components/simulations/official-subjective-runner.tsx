"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";

import { submitOfficialSubjectiveSimulationAction } from "@/app/(app)/simulados/actions";
import type { OfficialSubjectiveSimulationView } from "@/lib/manual-review/service";
import { validateOfficialSubjectiveAnswer } from "@/lib/simulations/official-pgm";

type OfficialSubjectiveRunnerProps = {
  view: OfficialSubjectiveSimulationView;
  errorMessage?: string | null;
};

export function OfficialSubjectiveRunner({
  view,
  errorMessage,
}: OfficialSubjectiveRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const validations = useMemo(() => {
    return new Map(
      view.questions.map((question) => [
        question.id,
        validateOfficialSubjectiveAnswer(answers[question.id] ?? ""),
      ]),
    );
  }, [answers, view.questions]);
  const allValid =
    view.canSubmit &&
    view.questions.length === view.questionCount &&
    view.questions.every((question) => validations.get(question.id)?.valid);

  function answerStatus(questionId: string) {
    const validation = validations.get(questionId);

    if (!validation || validation.count === 0) {
      return {
        label: `0/${view.minWords}-${view.maxWords}`,
        className: "text-muted",
        message: null,
      };
    }

    if (validation.count < view.minWords) {
      return {
        label: `${validation.count} palavras`,
        className: "text-pgm-yellow",
        message: `Faltam ${view.minWords - validation.count} palavra(s) para o mínimo oficial.`,
      };
    }

    if (validation.count > view.maxWords) {
      return {
        label: `${validation.count} palavras`,
        className: "text-red-200",
        message: `Remova ${validation.count - view.maxWords} palavra(s) para ficar dentro do limite oficial.`,
      };
    }

    return {
      label: `${validation.count} palavras`,
      className: "text-pgm-green",
      message: "Resposta dentro do limite oficial.",
    };
  }

  return (
    <form action={submitOfficialSubjectiveSimulationAction} className="grid gap-5 max-sm:gap-4">
      <input type="hidden" name="language" value={view.language} />

      {errorMessage ? (
        <div className="rounded-md border border-red-300/40 bg-red-400/10 p-4 max-sm:p-3">
          <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-red-200">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {errorMessage}
          </p>
        </div>
      ) : null}

      {view.blockingReason ? (
        <div className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-4 max-sm:p-3">
          <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-pgm-yellow">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {view.blockingReason}
          </p>
        </div>
      ) : null}

      {view.questions.map((question, index) => {
        const status = answerStatus(question.id);

        return (
          <article
            key={question.id}
            className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4 sm:p-6"
          >
            <input type="hidden" name="question_id" value={question.id} />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-pgm-yellow">
                  Questão subjetiva {index + 1} de {view.questionCount}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {question.title}
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">
                  {question.prompt}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 max-sm:gap-1.5 lg:justify-end">
                <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                  {question.categoryName}
                </span>
                <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                  {question.language}
                </span>
              </div>
            </div>

            <textarea
              name={`answer_${question.id}`}
              value={answers[question.id] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: event.target.value,
                }))
              }
              disabled={!view.canSubmit}
              rows={9}
              className="mt-5 min-h-[180px] w-full resize-y rounded-md border border-border-soft bg-background px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-muted/70 focus:border-pgm-yellow disabled:cursor-not-allowed disabled:opacity-60 max-sm:px-3 sm:min-h-[220px]"
              placeholder="Escreva sua resposta entre 90 e 150 palavras."
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-sm font-semibold ${status.className}`}>
                {status.label}
              </p>
              {status.message ? (
                <p className="flex items-start gap-2 text-sm leading-6 text-muted">
                  {validations.get(question.id)?.valid ? (
                    <CheckCircle2
                      className="mt-1 size-4 shrink-0 text-pgm-green"
                      aria-hidden="true"
                    />
                  ) : (
                    <AlertTriangle
                      className="mt-1 size-4 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  )}
                  {status.message}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}

      <div className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4">
        <button
          type="submit"
          disabled={!allValid}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Enviar simulado subjetivo
          <Send className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
