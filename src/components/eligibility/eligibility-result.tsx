import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  CircleDashed,
} from "lucide-react";

import type {
  EligibilityResult,
  RequirementStatus,
} from "@/lib/eligibility/rules";

type EligibilityResultPanelProps = {
  result: EligibilityResult;
};

const statusStyle = {
  eligible: {
    label: "Elegível",
    className: "border-pgm-green/40 bg-pgm-green/12 text-pgm-green",
    Icon: CheckCircle2,
  },
  partial: {
    label: "Parcialmente elegível",
    className: "border-pgm-yellow/40 bg-pgm-yellow/12 text-pgm-yellow",
    Icon: AlertTriangle,
  },
  ineligible: {
    label: "Não elegível",
    className: "border-pgm-red/40 bg-pgm-red/12 text-pgm-red",
    Icon: CircleAlert,
  },
} satisfies Record<
  EligibilityResult["status"],
  {
    label: string;
    className: string;
    Icon: typeof CheckCircle2;
  }
>;

const requirementIcon = {
  passed: CheckCircle2,
  warning: AlertTriangle,
  failed: CircleAlert,
} satisfies Record<RequirementStatus, typeof CheckCircle2>;

const requirementColor = {
  passed: "text-pgm-green",
  warning: "text-pgm-yellow",
  failed: "text-pgm-red",
} satisfies Record<RequirementStatus, string>;

export function EligibilityResultPanel({ result }: EligibilityResultPanelProps) {
  const status = statusStyle[result.status];
  const StatusIcon = status.Icon;

  return (
    <section
      aria-live="polite"
      className="rounded-md border border-border-soft bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${status.className}`}
          >
            <StatusIcon className="size-4" aria-hidden="true" />
            {status.label}
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">
            {result.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {result.summary}
          </p>
        </div>

        <div className="rounded-md border border-border-soft bg-background px-5 py-4 text-center">
          <p className="text-xs uppercase text-muted">
            Aderência
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-white">
            {result.readinessScore}%
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {result.evaluations.map((item) => {
          const Icon = requirementIcon[item.status] ?? CircleDashed;

          return (
            <article
              key={item.key}
              className="rounded-md border border-border-soft bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 size-5 shrink-0 ${requirementColor[item.status]}`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      {item.label}
                    </h3>
                    <span className="text-sm font-medium text-muted">
                      {item.current}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.explanation}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted/80">
                    Requisito: {item.requirement}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        Este diagnóstico é uma orientação independente. A verificação oficial
        considera dados e válidações feitas pelos sistemas e instituições
        responsáveis pelo processo seletivo.
      </p>
    </section>
  );
}
