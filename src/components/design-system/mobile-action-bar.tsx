import type { ReactNode } from "react";

import { cx } from "@/lib/design-system/utils";

export function MobileActionBar({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-background-primary/95 px-4 py-3 shadow-modal backdrop-blur lg:hidden",
        className,
      )}
      role="region"
      aria-label={label ?? "Acoes principais"}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
        {children}
      </div>
    </div>
  );
}
