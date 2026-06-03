import { reviewManualAttemptAction } from "@/app/(app)/admin/correcoes/actions";
import {
  FieldLabel,
  inputClassName,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import type { ManualReviewQueueItem } from "@/lib/manual-review/service";

export function CorrectionForm({
  item,
  returnTo,
}: {
  item: ManualReviewQueueItem;
  returnTo: string;
}) {
  return (
    <form action={reviewManualAttemptAction} className="grid gap-3">
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="kind" value={item.kind} />
      <input type="hidden" name="attempt_id" value={item.id} />

      <div className="grid gap-3 sm:grid-cols-[100px_100px_1fr]">
        <div className="grid gap-2">
          <FieldLabel htmlFor={`score-${item.id}`}>Nota</FieldLabel>
          <input
            id={`score-${item.id}`}
            name="score"
            type="number"
            step="0.1"
            min={0}
            defaultValue={item.score ?? ""}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor={`max-${item.id}`}>Max</FieldLabel>
          <input
            id={`max-${item.id}`}
            name="max_score"
            type="number"
            step="0.1"
            min={1}
            defaultValue={item.maxScore}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor={`status-${item.id}`}>Status</FieldLabel>
          <select
            id={`status-${item.id}`}
            name="status"
            defaultValue={item.status === "pending" ? "returned" : item.status}
            className={inputClassName}
          >
            <option value="returned">Devolver ao aluno</option>
            <option value="reviewed">Marcar como corrigida</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor={`feedback-${item.id}`}>Feedback</FieldLabel>
        <textarea
          id={`feedback-${item.id}`}
          name="feedback"
          required
          defaultValue={item.feedback ?? ""}
          className={textAreaClassName}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar correção
      </button>
    </form>
  );
}
