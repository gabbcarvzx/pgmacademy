"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cx } from "@/lib/design-system/utils";

export function MobileDrawer({
  open,
  title,
  children,
  footer,
  onClose,
  className,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-background-primary/70 backdrop-blur-sm"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <aside
        className={cx(
          "absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col border-r border-border-soft bg-surface-elevated shadow-modal",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-ds-12 border border-border-soft text-text-muted transition hover:border-border-strong hover:text-text-primary"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-border-soft p-5">{footer}</div> : null}
      </aside>
    </div>
  );
}
