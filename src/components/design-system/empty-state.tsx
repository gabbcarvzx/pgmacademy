import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { IconComponent } from "./types";

export function EmptyState({
  title,
  description,
  Icon,
  action,
  compact = false,
  className,
}: {
  title: string;
  description?: string;
  Icon?: IconComponent;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-ds-20 border border-border-soft bg-surface p-6 text-center shadow-card",
        compact ? "sm:p-6" : "sm:p-10",
        className,
      )}
    >
      {Icon ? (
        <div className="mx-auto flex size-12 items-center justify-center rounded-ds-16 border border-border-soft bg-background-primary text-accent-gold">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      ) : null}
      <h2 className="mt-5 text-heading-3 font-semibold text-text-primary">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}
