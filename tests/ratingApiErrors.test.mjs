import assert from "node:assert/strict";
import test from "node:test";

import { getRating403Message, isRatingEndpointHandled } from "../src/lib/ratingApiErrors.ts";

test("purchase eligibility denial is not reported as an authentication failure", () => {
  assert.equal(
    getRating403Message({ detail: { error: "Purchase Required" } }),
    "Rating hanya dapat diberikan setelah pesanan produk berstatus selesai."
  );
});

test("other forbidden rating responses keep the authentication message", () => {
  assert.equal(
    getRating403Message({ detail: { error: "Forbidden" } }),
    "Silakan login kembali untuk mengelola rating produk."
  );
});

test("rating API responses are handled by their customer-facing service", () => {
  for (const path of [
    "/rating/product/123",
    "/rating/my-rating-products-list",
    "/rating/edit/7",
    "/rating/delete/7",
  ]) {
    assert.equal(isRatingEndpointHandled(path), true, path);
  }

  assert.equal(isRatingEndpointHandled("/product/123"), false);
  assert.equal(isRatingEndpointHandled("/rating/unknown"), false);
});
