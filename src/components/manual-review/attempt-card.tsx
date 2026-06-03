import { StatusBadge } from "@/components/manual-review/status-badge";
import type { ManualAttemptCard } from "@/lib/manual-review/service";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function AttemptCard({ attempt }: { attempt: ManualAttemptCard }) {
  return (
    <article className="rounded-md border border-border-soft bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pgm-yellow">
            {attempt.kind === "subjective" ? "Subjetiva" : "Psicossocial"} /{" "}
            {attempt.categoryName}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {attempt.title}
          </h2>
        </div>
        <StatusBadge status={attempt.status} />
      </div>

      <div className="mt-4 rounded-md border border-border-soft bg-background p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Resposta enviada
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white">
          {attempt.answerText}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border-soft bg-background p-3">
          <p className="text-xs text-muted">Enviada em</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {dateFormatter.format(new Date(attempt.createdAt))}
          </p>
        </div>
        <div className="rounded-md border border-border-soft bg-background p-3">
          <p className="text-xs text-muted">Nota</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {attempt.score === null
              ? "Aguardando"
              : `${attempt.score}/${attempt.maxScore}`}
          </p>
        </div>
        <div className="rounded-md border border-border-soft bg-background p-3">
          <p className="text-xs text-muted">Correcao</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {attempt.reviewedAt
              ? dateFormatter.format(new Date(attempt.reviewedAt))
              : "Pendente"}
          </p>
        </div>
      </div>

      {attempt.feedback ? (
        <div className="mt-4 rounded-md border border-pgm-green/40 bg-pgm-green/10 p-4">
          <p className="text-sm font-semibold text-white">Feedback do admin</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
            {attempt.feedback}
          </p>
        </div>
      ) : null}
    </article>
  );
}
