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
        "fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-background-primary/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-modal backdrop-blur md:px-4 lg:hidden",
        className,
      )}
      role="region"
      aria-label={label ?? "Acoes principais"}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-stretch justify-end gap-2 md:flex-row md:items-center md:gap-3">
        {children}
      </div>
    </div>
  );
}
