import assert from "node:assert/strict";
import test from "node:test";

import { getRating403Message } from "../src/lib/ratingApiErrors.ts";

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
