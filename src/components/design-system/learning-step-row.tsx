import Link from "next/link";
import { CheckCircle2, Circle, LockKeyhole, PlayCircle } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import { ProgressBar } from "./progress-bar";
import { StatusBadge } from "./status-badge";
import type { IconComponent } from "./types";

const stepState = {
  completed: {
    label: "Concluido",
    tone: "success",
    Icon: CheckCircle2,
  },
  current: {
    label: "Agora",
    tone: "premium",
    Icon: PlayCircle,
  },
  locked: {
    label: "Premium",
    tone: "warning",
    Icon: LockKeyhole,
  },
  upcoming: {
    label: "Proximo",
    tone: "neutral",
    Icon: Circle,
  },
} as const;

export type LearningStepState = keyof typeof stepState;

export function LearningStepRow({
  title,
  description,
  state = "upcoming",
  href,
  Icon,
  progress,
  metadata,
  action,
  className,
}: {
  title: string;
  description?: string;
  state?: LearningStepState;
  href?: string;
  Icon?: IconComponent;
  progress?: number;
  metadata?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const StateIcon = Icon ?? stepState[state].Icon;
  const classNames = cx(
    "rounded-ds-16 border border-border-soft bg-surface p-4 shadow-card transition max-sm:p-3",
    href ? "hover:border-border-strong hover:bg-surface-elevated" : "",
    className,
  );

  return (
    <article className={classNames}>
      <div className="flex min-w-0 gap-4 max-sm:gap-3">
        <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-ds-16 border border-border-soft bg-background-primary text-accent-gold">
          <StateIcon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="min-w-0 break-words text-base font-semibold text-text-primary">
              {href ? (
                <Link className="transition hover:text-accent-gold" href={href}>
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>
            <StatusBadge tone={stepState[state].tone}>
              {stepState[state].label}
            </StatusBadge>
          </div>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-text-muted">
              {description}
            </p>
          ) : null}
          {typeof progress === "number" ? (
            <ProgressBar value={progress} size="sm" className="mt-4" />
          ) : null}
          {metadata ? <div className="mt-4">{metadata}</div> : null}
        </div>
      </div>
      {action ? <div className="mt-4 sm:ml-14">{action}</div> : null}
    </article>
  );
}
