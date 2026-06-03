import type { ManualReviewStatus } from "@/lib/manual-review/service";

export function StatusBadge({ status }: { status: ManualReviewStatus | null }) {
  const label =
    status === "pending"
      ? "Pendente"
      : status === "reviewed"
        ? "Corrigida"
        : status === "returned"
          ? "Feedback recebido"
          : "Nao enviada";
  const className =
    status === "pending"
      ? "border-pgm-yellow/40 bg-pgm-yellow/10 text-pgm-yellow"
      : status === "reviewed" || status === "returned"
        ? "border-pgm-green/40 bg-pgm-green/10 text-pgm-green"
        : "border-border-soft bg-background text-muted";

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}
