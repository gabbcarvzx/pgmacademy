import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { DesignSystemDensity } from "./types";

export function AppPageHeader({
  eyebrow,
  title,
  description,
  actions,
  aside,
  density = "standard",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  density?: DesignSystemDensity;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "grid gap-6 rounded-ds-24 border border-border-soft bg-surface/70 shadow-card",
        density === "compact" ? "p-5 max-sm:p-4 sm:p-6" : "p-6 max-sm:p-4 sm:p-8",
        aside ? "lg:grid-cols-[1fr_320px] lg:items-end" : "",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-caption font-semibold uppercase text-accent-gold">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cx(
            "max-w-4xl font-semibold text-text-primary text-balance",
            density === "compact"
              ? "mt-3 text-heading-2 max-sm:text-heading-3"
              : "mt-4 text-heading-1 max-sm:text-heading-2",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cx(
              "max-w-3xl text-text-muted",
              density === "compact" ? "mt-3 text-sm leading-6" : "mt-5 text-body-large",
            )}
          >
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-6 flex flex-wrap gap-3 max-md:grid max-md:grid-cols-1 max-md:[&>*]:w-full">
            {actions}
          </div>
        ) : null}
      </div>
      {aside ? <div>{aside}</div> : null}
    </section>
  );
}
