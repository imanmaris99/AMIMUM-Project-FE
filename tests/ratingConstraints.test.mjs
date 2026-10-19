import assert from "node:assert/strict";
import test from "node:test";

import { getRatingInputError, RATING_REVIEW_MAX_LENGTH } from "../src/lib/ratingConstraints.ts";

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

test("rejects ratings outside the one-to-five star range", () => {
  assert.equal(getRatingInputError(0, ""), "Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.");
  assert.equal(getRatingInputError(6, ""), "Pilih rating 1 sampai 5 bintang sebelum menyimpan ulasan.");
});
