import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { DesignSystemTone, IconComponent } from "./types";

const toneClassName = {
  neutral: "text-text-secondary",
  premium: "text-accent-gold",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-pgm-blue",
} satisfies Record<DesignSystemTone, string>;

export function MetricCard({
  title,
  value,
  description,
  Icon,
  tone = "premium",
  trend,
  footer,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  Icon?: IconComponent;
  tone?: DesignSystemTone;
  trend?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "rounded-ds-16 border border-border-soft bg-surface p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {Icon ? (
          <Icon className={cx("size-5", toneClassName[tone])} aria-hidden="true" />
        ) : null}
        {trend}
      </div>
      <p className="mt-5 text-caption font-semibold uppercase text-text-muted">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">{value}</p>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-text-muted">{description}</p>
      ) : null}
      {footer ? <div className="mt-5">{footer}</div> : null}
    </article>
  );
}
