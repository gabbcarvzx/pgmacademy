import Link from "next/link";

import type { ReviewFinalNavigationItem } from "@/lib/review-final/content";

export function ReviewFinalModuleNav({
  items,
}: {
  items: ReviewFinalNavigationItem[];
}) {
  return (
    <section className="mt-6 rounded-ds-20 border border-border-soft bg-surface/80 p-4 shadow-card backdrop-blur sm:p-5">
      <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <div>
          <p className="text-caption font-semibold uppercase text-accent-gold">
            Navegacao rapida
          </p>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Localize rapidamente o assunto que voce precisa revisar agora.
          </p>
        </div>
        <span className="rounded-ds-12 border border-border-soft px-3 py-2 font-mono text-xs font-semibold text-text-muted">
          {items.length} blocos
        </span>
      </div>

      <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex min-h-10 shrink-0 snap-start items-center rounded-ds-12 border border-border-soft bg-background-primary/60 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent-gold/40 hover:text-text-primary"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
