import { CheckCircle2, LockKeyhole, Radar, Sparkles } from "lucide-react";

import { approvalSteps, eligibilitySignals } from "@/lib/site-config";

export function HeroVisual() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-none border border-border-soft bg-surface-elevated p-4 shadow-2xl shadow-black/30 sm:p-6 lg:min-h-[620px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(8,102,216,0.44),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(255,210,60,0.22),transparent_24%),radial-gradient(circle_at_70%_78%,rgba(8,166,90,0.28),transparent_32%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
            <Radar className="size-4 text-pgm-green" aria-hidden="true" />
            PGM 2026
          </div>
          <div className="flex items-center gap-2 rounded-md bg-pgm-red px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Premium
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {eligibilitySignals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-md border border-white/10 bg-background/65 p-4 backdrop-blur"
            >
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {signal.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {signal.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {signal.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="size-4 text-pgm-yellow" aria-hidden="true" />
            Plano de aprovação
          </div>
          <div className="mt-5 grid gap-3">
            {approvalSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-center justify-between rounded-md border border-white/10 bg-background/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-md bg-white text-sm font-semibold text-background">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-white">{step}</span>
                </div>
                {index === 0 ? (
                  <CheckCircle2
                    className="size-5 text-pgm-green"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="size-2 rounded-full bg-white/25" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
