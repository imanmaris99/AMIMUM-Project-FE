import assert from "node:assert/strict";
import test from "node:test";

import {
  getCompletedOrderRatingHref,
  getRatingEligibilityProductId,
  getRatingInputError,
  RATING_NO_ELIGIBLE_PURCHASE_COPY,
  RATING_PURCHASE_ELIGIBILITY_COPY,
  RATING_REVIEW_MAX_LENGTH,
  RATING_VARIANT_SELECTION_COPY,
} from "../src/lib/ratingConstraints.ts";

test("accepts the maximum review length supported by the backend column", () => {
  assert.equal(RATING_REVIEW_MAX_LENGTH, 100);
  assert.equal(getRatingInputError(5, "x".repeat(100)), null);
});

test("rejects review text beyond the backend-supported length", () => {
  assert.equal(
    getRatingInputError(5, "x".repeat(101)),
    "Ulasan maksimal 100 karakter."
  );
});

test("rating eligibility guidance states completed order, successful payment, and purchased variant", () => {
  assert.match(RATING_PURCHASE_ELIGIBILITY_COPY, /pesanan berstatus selesai/i);
  assert.match(RATING_PURCHASE_ELIGIBILITY_COPY, /pembayaran berhasil/i);
  assert.match(RATING_VARIANT_SELECTION_COPY, /item pesanan selesai/i);
  assert.match(RATING_VARIANT_SELECTION_COPY, /varian mengikuti item/i);
  assert.match(RATING_NO_ELIGIBLE_PURCHASE_COPY, /pembayaran berhasil/i);
});

test("only completed real order items link to their product rating section", () => {
  const productId = "8c8877e3-1000-4f00-9000-afe1b4e2f62a";
  assert.equal(getRatingEligibilityProductId(` ${productId} `), productId);
  assert.equal(getRatingEligibilityProductId(null), "");
  assert.equal(
    getCompletedOrderRatingHref("completed", productId, 14),
    `/detail-product/${productId}?orderItemId=14#product-ratings`
  );
  assert.equal(getCompletedOrderRatingHref("processing", productId, 14), null);
  assert.equal(getCompletedOrderRatingHref("completed", "", 14), null);
  assert.equal(getCompletedOrderRatingHref("completed", productId, null), null);
  assert.equal(getCompletedOrderRatingHref("completed", productId, 0), null);
  assert.equal(getCompletedOrderRatingHref("completed", productId, 14, true), null);
});

test("rejects ratings outside the one-to-five star range", () => {
  assert.equal(getRatingInputError(0, ""), "Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.");
  assert.equal(getRatingInputError(6, ""), "Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.");
});
