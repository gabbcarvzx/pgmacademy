import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { DesignSystemDensity } from "./types";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  density = "standard",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  density?: DesignSystemDensity;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-caption font-semibold uppercase text-accent-gold">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cx(
            "font-semibold text-text-primary",
            density === "compact" ? "mt-2 text-heading-3" : "mt-3 text-heading-2",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cx(
              "max-w-3xl text-text-muted",
              density === "compact" ? "mt-2 text-sm leading-6" : "mt-4 text-body",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
