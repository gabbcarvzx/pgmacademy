"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      id="app-mobile-navigation"
      className="fixed inset-0 z-[90] isolate overscroll-contain lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="fixed inset-0 bg-background-primary/75 backdrop-blur-sm [animation:mobile-drawer-fade-in_160ms_ease-out]"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <aside
        className={cx(
          "fixed inset-y-0 left-0 flex max-h-[100dvh] w-[min(92vw,360px)] flex-col overflow-hidden border-r border-border-soft bg-surface-elevated shadow-modal [animation:mobile-drawer-slide-in_180ms_ease-out]",
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-ds-12 border border-border-soft text-text-muted transition hover:border-border-strong hover:text-text-primary"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-4 py-4 sm:px-5">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-border-soft px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-5">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
