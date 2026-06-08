import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";
import type { DesignSystemTone } from "./types";

const toneClassName = {
  neutral: "border-border-soft bg-background-primary text-text-muted",
  premium: "border-accent-gold/45 bg-accent-gold-soft text-accent-gold",
  success: "border-success/45 bg-success/10 text-success",
  warning: "border-warning/45 bg-warning/10 text-warning",
  error: "border-error/45 bg-error/10 text-error",
  info: "border-pgm-blue/45 bg-pgm-blue/10 text-pgm-blue",
} satisfies Record<DesignSystemTone, string>;

const sizeClassName = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
} as const;

export function StatusBadge({
  children,
  tone = "neutral",
  size = "sm",
  className,
}: {
  children: ReactNode;
  tone?: DesignSystemTone;
  size?: keyof typeof sizeClassName;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex w-fit items-center rounded-ds-12 border font-semibold",
        toneClassName[tone],
        sizeClassName[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
