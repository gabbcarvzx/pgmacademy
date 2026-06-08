import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { DesignSystemTone, IconComponent } from "./types";

const toneClassName = {
  neutral: "border-border-soft bg-surface-elevated",
  premium: "border-accent-gold/35 bg-accent-gold-soft shadow-premium",
  success: "border-success/35 bg-success/10",
  warning: "border-warning/35 bg-warning/10",
  error: "border-error/35 bg-error/10",
  info: "border-pgm-blue/35 bg-pgm-blue/10",
} satisfies Record<DesignSystemTone, string>;

const iconClassName = {
  neutral: "text-text-secondary",
  premium: "text-accent-gold",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-pgm-blue",
} satisfies Record<DesignSystemTone, string>;

export function PrimaryActionPanel({
  eyebrow,
  title,
  description,
  Icon,
  primaryAction,
  secondaryAction,
  metadata,
  tone = "premium",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  Icon?: IconComponent;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  metadata?: ReactNode;
  tone?: DesignSystemTone;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "rounded-ds-24 border p-5 sm:p-6",
        toneClassName[tone],
        className,
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex items-center gap-3">
            {Icon ? (
              <Icon
                className={cx("size-5", iconClassName[tone])}
                aria-hidden="true"
              />
            ) : null}
            {eyebrow ? (
              <p className="text-caption font-semibold uppercase text-text-muted">
                {eyebrow}
              </p>
            ) : null}
          </div>
          <h2 className="mt-4 text-heading-3 font-semibold text-text-primary">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">
              {description}
            </p>
          ) : null}
          {metadata ? <div className="mt-5">{metadata}</div> : null}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </article>
  );
}
