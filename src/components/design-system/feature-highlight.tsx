import { cx } from "@/lib/design-system/utils";
import type { DesignSystemTone, IconComponent } from "./types";

const toneClassName = {
  neutral: "border-border-soft bg-surface text-text-secondary",
  premium: "border-accent-gold/35 bg-accent-gold-soft text-accent-gold",
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/10 text-warning",
  error: "border-error/35 bg-error/10 text-error",
  info: "border-pgm-blue/35 bg-pgm-blue/10 text-pgm-blue",
} satisfies Record<DesignSystemTone, string>;

export function FeatureHighlight({
  title,
  description,
  Icon,
  metric,
  tone = "premium",
  className,
}: {
  title: string;
  description: string;
  Icon?: IconComponent;
  metric?: string;
  tone?: DesignSystemTone;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "rounded-ds-16 border bg-surface p-5 shadow-card",
        toneClassName[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {Icon ? <Icon className="size-5 shrink-0" aria-hidden="true" /> : null}
        {metric ? (
          <span className="rounded-ds-12 border border-current/30 px-2 py-1 font-mono text-xs font-semibold">
            {metric}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
    </article>
  );
}
