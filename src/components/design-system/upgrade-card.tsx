import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { cx } from "@/lib/design-system/utils";

export function UpgradeCard({
  eyebrow = "Premium",
  title,
  description,
  benefits,
  href = "/planos",
  ctaLabel = "Ver planos",
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  benefits: string[];
  href?: string;
  ctaLabel?: string;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "relative overflow-hidden rounded-ds-24 border border-accent-gold/40 bg-surface-elevated p-6 shadow-premium",
        "max-sm:p-5",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent" />
      <div className="flex items-center gap-3 text-accent-gold">
        <Sparkles className="size-5" aria-hidden="true" />
        <p className="text-caption font-semibold uppercase">{eyebrow}</p>
      </div>
      <h2 className="mt-5 text-heading-3 font-semibold text-text-primary max-sm:text-xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-text-muted">{description}</p>
      <ul className="mt-5 grid gap-3 text-sm text-text-secondary">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-gold" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
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
