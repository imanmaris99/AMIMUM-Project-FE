import assert from "node:assert/strict";
import test from "node:test";

import {
  getRating403Message,
  getRating409Message,
  isRatingEndpointHandled,
} from "../src/lib/ratingApiErrors.ts";
import { RATING_PURCHASE_ELIGIBILITY_COPY } from "../src/lib/ratingConstraints.ts";

test("purchase eligibility denial is not reported as an authentication failure", () => {
  assert.equal(
    getRating403Message({ detail: { error: "Purchase Required" } }),
    RATING_PURCHASE_ELIGIBILITY_COPY
  );
});

test("other forbidden rating responses keep the authentication message", () => {
  assert.equal(
    getRating403Message({ detail: { error: "Forbidden" } }),
    "Silakan login kembali untuk mengelola rating produk."
  );
});

test("rating conflicts use create-specific copy only for duplicate create attempts", () => {
  assert.match(getRating409Message("create"), /Item pesanan ini sudah diberi rating/);
  assert.match(getRating409Message("update"), /diperbarui/);
  assert.match(getRating409Message("delete"), /dihapus/);
  assert.doesNotMatch(getRating409Message("update"), /Item pesanan ini sudah diberi rating/);
  assert.doesNotMatch(getRating409Message("delete"), /Item pesanan ini sudah diberi rating/);
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
