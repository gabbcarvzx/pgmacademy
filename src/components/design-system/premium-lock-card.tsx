import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { cx } from "@/lib/design-system/utils";

export function PremiumLockCard({
  title = "Conteudo premium bloqueado",
  description,
  benefits = [],
  href = "/planos",
  ctaLabel = "Desbloquear Premium",
  className,
}: {
  title?: string;
  description: string;
  benefits?: string[];
  href?: string;
  ctaLabel?: string;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "rounded-ds-20 border border-accent-gold/40 bg-accent-gold-soft p-5 shadow-premium sm:p-6",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-ds-16 border border-accent-gold/35 bg-background-primary text-accent-gold">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-heading-3 font-semibold text-text-primary">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">
        {description}
      </p>
      {benefits.length > 0 ? (
        <ul className="mt-5 grid gap-2 text-sm text-text-secondary sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-gold" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={href}
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white"
      >
        {ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
