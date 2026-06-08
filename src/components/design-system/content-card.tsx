import Link from "next/link";
import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { DesignSystemTone, IconComponent } from "./types";
import { StatusBadge } from "./status-badge";

const iconClassName = {
  neutral: "text-text-secondary",
  premium: "text-accent-gold",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-pgm-blue",
} satisfies Record<DesignSystemTone, string>;

export function ContentCard({
  eyebrow,
  title,
  description,
  href,
  Icon,
  tone = "neutral",
  badge,
  metadata,
  action,
  footer,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  Icon?: IconComponent;
  tone?: DesignSystemTone;
  badge?: ReactNode;
  metadata?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const classNames = cx(
    "rounded-ds-16 border border-border-soft bg-surface p-5 shadow-card transition",
    href ? "hover:border-border-strong hover:bg-surface-elevated" : "",
    className,
  );

  return (
    <article className={classNames}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {Icon ? (
            <Icon
              className={cx("size-5 shrink-0", iconClassName[tone])}
              aria-hidden="true"
            />
          ) : null}
          {eyebrow ? (
            <p className="truncate text-caption font-semibold uppercase text-text-muted">
              {eyebrow}
            </p>
          ) : null}
        </div>
        {badge ? (
          typeof badge === "string" ? (
            <StatusBadge tone={tone}>{badge}</StatusBadge>
          ) : (
            badge
          )
        ) : null}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-text-primary">
        {href ? (
          <Link className="transition hover:text-accent-gold" href={href}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-text-muted">{description}</p>
      ) : null}
      {metadata ? <div className="mt-5">{metadata}</div> : null}
      {(action || footer) && (
        <div className="mt-6 flex flex-col gap-3 border-t border-border-soft pt-4 sm:flex-row sm:items-center sm:justify-between">
          {footer ? <div>{footer}</div> : <span aria-hidden="true" />}
          {action}
        </div>
      )}
    </article>
  );
}
