import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Target } from "lucide-react";

import { StatusBadge } from "@/components/design-system";

export function ReviewFinalPromoBanner({
  href,
  premiumLocked = false,
}: {
  href: string;
  premiumLocked?: boolean;
}) {
  return (
    <section className="rounded-ds-20 border border-accent-gold/40 bg-[radial-gradient(circle_at_top_left,rgba(245,197,24,0.22),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-premium max-sm:p-4 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="premium">Revisao Final PGM liberada</StatusBadge>
            <StatusBadge tone={premiumLocked ? "warning" : "success"}>
              {premiumLocked ? "Premium" : "Acesso ativo"}
            </StatusBadge>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-text-primary sm:text-3xl">
            Ultimo passo antes da prova
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
            Tudo o que voce precisa revisar antes da prova em um so lugar.
            Organize sua preparacao final, revise os pontos mais importantes,
            evite erros comuns e chegue mais confiante no dia da prova.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary/70 px-3 py-2 text-sm font-semibold text-text-primary">
              <Target className="size-4 text-accent-gold" aria-hidden="true" />
              Assuntos prioritarios
            </span>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary/70 px-3 py-2 text-sm font-semibold text-text-primary">
              <Sparkles className="size-4 text-accent-gold" aria-hidden="true" />
              Dicas estrategicas
            </span>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary/70 px-3 py-2 text-sm font-semibold text-text-primary">
              <ShieldCheck className="size-4 text-accent-gold" aria-hidden="true" />
              Checklist final
            </span>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white max-sm:w-full"
        >
          Acessar Revisao Final
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
