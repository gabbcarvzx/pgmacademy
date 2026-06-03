import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

export function PremiumUpgradeCard({
  description = "Este conteudo pode aproximar voce da sua vaga no intercambio. Desbloqueie o plano premium para estudar com simulados, trilhas, flashcards e feedback completo.",
  href = "/planos",
  ctaLabel = "Desbloquear acesso premium",
}: {
  description?: string;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5">
      <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold text-white">
        Conteudo premium bloqueado
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
      >
        {ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
