import assert from "node:assert/strict";

import {
  FINAL_PROMO_DEADLINE_LABEL,
  FINAL_PROMO_END_AT,
  REGULAR_OFFER,
  getActiveOffer,
  isFinalPromoActive,
} from "../src/lib/promo-config";

assert.equal(REGULAR_OFFER.priceCents, 2990);
assert.equal(FINAL_PROMO_DEADLINE_LABEL, "12/07/2026");

assert.equal(
  isFinalPromoActive(new Date("2026-07-12T23:59:59-03:00")),
  true,
);
assert.equal(
  isFinalPromoActive(new Date("2026-07-13T00:00:00-03:00")),
  false,
);
assert.equal(FINAL_PROMO_END_AT, "2026-07-12T23:59:59-03:00");

const activeOffer = getActiveOffer(new Date("2026-07-10T12:00:00-03:00"));
assert.equal(activeOffer.priceCents, 2099);
assert.equal(activeOffer.priceLabel, "R$ 20,99");
assert.equal(activeOffer.compareAtPriceLabel, "R$ 29,90");
assert.equal(activeOffer.deadlineLabel, "12/07/2026");
assert.equal(activeOffer.isPromotional, true);

const regularOffer = getActiveOffer(new Date("2026-07-13T12:00:00-03:00"));
assert.equal(regularOffer.priceCents, 2990);
assert.equal(regularOffer.priceLabel, "R$ 29,90");
assert.equal(regularOffer.compareAtPriceLabel, null);
assert.equal(regularOffer.deadlineLabel, null);
assert.equal(regularOffer.isPromotional, false);

console.log("Promo config passed");
