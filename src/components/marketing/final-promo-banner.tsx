import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { getActiveOffer } from "@/lib/promo-config";

type FinalPromoBannerProps = {
  className?: string;
};

export function FinalPromoBanner({ className = "" }: FinalPromoBannerProps) {
  const offer = getActiveOffer();

  if (!offer.isPromotional || !offer.deadlineLabel) {
    return null;
  }

  return (
    <section
      className={`border-b border-pgm-yellow/20 bg-[linear-gradient(90deg,rgba(246,201,69,0.16),rgba(8,10,15,0.94)_36%,rgba(246,201,69,0.1))] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-pgm-yellow/35 bg-background/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pgm-yellow backdrop-blur">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Promocao de reta final
            </span>
            <span className="inline-flex rounded-md border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold text-white/82">
              Ultimos dias
            </span>
          </div>

          <p className="mt-3 text-sm font-medium uppercase tracking-[0.22em] text-white/62">
            Acesso completo por apenas
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-semibold text-white sm:text-4xl">
              {offer.priceLabel}
            </span>
            <span className="pb-1 text-sm text-white/72 line-through">
              {offer.compareAtPriceLabel}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/74">
            Oferta valida somente ate {offer.deadlineLabel}. Depois disso, o
            valor pode voltar para {offer.compareAtPriceLabel}.
          </p>
        </div>

        <Link
          href={offer.ctaHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white max-sm:w-full"
        >
          Quero garantir meu acesso
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
