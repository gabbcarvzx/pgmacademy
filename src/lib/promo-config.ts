const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const FINAL_PROMO_END_AT = "2026-07-12T23:59:59-03:00";
export const FINAL_PROMO_DEADLINE_LABEL = "12/07/2026";

type OfferConfig = {
  priceCents: number;
  compareAtPriceCents: number | null;
  headline: string;
  badgeLabel: string | null;
  ctaLabel: string;
  ctaHref: string;
};

export type ActiveOffer = OfferConfig & {
  deadlineLabel: string | null;
  priceLabel: string;
  compareAtPriceLabel: string | null;
  isPromotional: boolean;
};

export const REGULAR_OFFER: OfferConfig = {
  priceCents: 2990,
  compareAtPriceCents: null,
  headline: "Acesso Premium PGM Academy",
  badgeLabel: null,
  ctaLabel: "Ver planos",
  ctaHref: "/planos",
};

const FINAL_PROMO_OFFER: OfferConfig = {
  priceCents: 2099,
  compareAtPriceCents: REGULAR_OFFER.priceCents,
  headline: "Promocao de reta final",
  badgeLabel: "Oferta especial",
  ctaLabel: "Quero garantir meu acesso",
  ctaHref: "/planos#checkout",
};

function formatPrice(priceCents: number) {
  return priceFormatter.format(priceCents / 100).replace(/\s+/g, " ");
}

export function isFinalPromoActive(now = new Date()) {
  return now.getTime() <= new Date(FINAL_PROMO_END_AT).getTime();
}

export function getActiveOffer(now = new Date()): ActiveOffer {
  const baseOffer = isFinalPromoActive(now) ? FINAL_PROMO_OFFER : REGULAR_OFFER;

  return {
    ...baseOffer,
    deadlineLabel: isFinalPromoActive(now) ? FINAL_PROMO_DEADLINE_LABEL : null,
    priceLabel: formatPrice(baseOffer.priceCents),
    compareAtPriceLabel:
      baseOffer.compareAtPriceCents === null
        ? null
        : formatPrice(baseOffer.compareAtPriceCents),
    isPromotional: baseOffer.compareAtPriceCents !== null,
  };
}
