"use client";

import { useState } from "react";

import {
  submitPsychosocialAnswerAction,
  submitSubjectiveAnswerAction,
} from "@/app/(app)/manual-review-actions";
import type { ManualReviewKind } from "@/lib/manual-review/service";

export function AnswerForm({
  kind,
  questionId,
}: {
  kind: ManualReviewKind;
  questionId: string;
}) {
  const [answer, setAnswer] = useState("");
  const action =
    kind === "subjective"
      ? submitSubjectiveAnswerAction
      : submitPsychosocialAnswerAction;

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="question_id" value={questionId} />
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-white" htmlFor="answer_text">
          Sua resposta
        </label>
        <textarea
          id="answer_text"
          name="answer_text"
          required
          minLength={20}
          maxLength={12000}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="min-h-72 w-full resize-y rounded-md border border-border-soft bg-background px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow"
          placeholder="Escreva uma resposta clara, com exemplo concreto e fechamento responsável."
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {answer.length}/12000 caracteres. Revise antes de enviar; a resposta
          não poder? ser editada depois.
        </p>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
        >
          Enviar para correção
        </button>
      </div>
    </form>
  );
}
