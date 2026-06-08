import { cx } from "@/lib/design-system/utils";
import type { DesignSystemTone } from "./types";

const fillClassName = {
  neutral: "bg-text-secondary",
  premium: "bg-accent-gold",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-pgm-blue",
} satisfies Record<DesignSystemTone, string>;

const sizeClassName = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
} as const;

function clampPercentage(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

export function ProgressBar({
  value,
  label,
  tone = "premium",
  size = "md",
  showValue = false,
  className,
}: {
  value: number;
  label?: string;
  tone?: DesignSystemTone;
  size?: keyof typeof sizeClassName;
  showValue?: boolean;
  className?: string;
}) {
  const normalizedValue = clampPercentage(value);

  return (
    <div className={className}>
      {label || showValue ? (
        <div className="mb-2 flex items-center justify-between gap-3 text-caption">
          {label ? (
            <span className="font-medium text-text-secondary">{label}</span>
          ) : (
            <span aria-hidden="true" />
          )}
          {showValue ? (
            <span className="font-mono font-semibold text-text-primary">
              {normalizedValue}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className={cx(
          "overflow-hidden rounded-full bg-background-primary",
          sizeClassName[size],
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalizedValue}
        aria-label={label ?? "Progresso"}
      >
        <div
          className={cx(
            "h-full rounded-full transition-all duration-300",
            fillClassName[tone],
          )}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
