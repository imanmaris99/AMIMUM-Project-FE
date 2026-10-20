import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const productRatingSection = readFileSync(
  new URL("../src/components/rating/ProductRatingSection.tsx", import.meta.url),
  "utf8",
);

test("public product rating section is read-only and contains no rating submission entry point", () => {
  assert.match(productRatingSection, /getProductRatings\(/);
  assert.doesNotMatch(productRatingSection, /<RatingForm|Tulis ulasan|createProductRating|getEligibleRatingOrderItems/);
});
