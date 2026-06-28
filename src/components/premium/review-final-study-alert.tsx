import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";

export function ReviewFinalStudyAlert({
  href,
}: {
  href: string;
}) {
  return (
    <section className="mt-6 rounded-ds-16 border border-accent-gold/35 bg-accent-gold-soft p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-10 items-center justify-center rounded-ds-12 bg-accent-gold text-background-primary">
            <BookOpenCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase text-accent-gold">
              Revisao Final pronta
            </p>
            <p className="mt-2 text-sm leading-6 text-text-primary">
              Revise os pontos mais importantes, organize sua preparacao final e
              conecte a leitura aos simulados recomendados.
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-ds-12 border border-accent-gold/35 bg-background-primary px-4 text-sm font-semibold text-text-primary transition hover:border-accent-gold hover:text-accent-gold max-sm:w-full"
        >
          Abrir Revisao Final
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
