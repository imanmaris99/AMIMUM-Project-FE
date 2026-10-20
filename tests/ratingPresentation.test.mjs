import assert from "node:assert/strict";
import test from "node:test";

import { deriveCompleteRatingPage, getRatingListContentState } from "../src/lib/ratingPresentation.ts";

const page = {
  status_code: 200,
  message: "ok",
  summary: {
    avg_rating: 4,
    total_rater: 3,
    rating_distribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 },
  },
  data: [
    { id: 1, rate: 3, created_at: "2026-10-19T09:00:00Z" },
    { id: 2, rate: 5, created_at: "2026-10-20T09:00:00Z" },
    { id: 3, rate: 4, created_at: "2026-10-18T09:00:00Z" },
  ],
  skip: 0,
  limit: 10,
  has_more: false,
};

test("complete rating pages filter and sort locally without changing the summary", () => {
  const sortedResult = deriveCompleteRatingPage(page, null, "highest");
  const filteredResult = deriveCompleteRatingPage(page, 5, "recent");

  assert.deepEqual(sortedResult?.data.map((review) => review.id), [2, 3, 1]);
  assert.deepEqual(filteredResult?.data.map((review) => review.id), [2]);
  assert.deepEqual(filteredResult?.summary, page.summary);
  assert.deepEqual(page.data.map((review) => review.id), [1, 2, 3]);
});

test("incomplete rating pages require server filtering to preserve pagination correctness", () => {
  const result = deriveCompleteRatingPage({ ...page, has_more: true }, 5, "recent");

  assert.equal(result, null);
});

test("a failed filter request hides the previous review list behind an error state", () => {
  assert.equal(getRatingListContentState(false, "request failed"), "error");
});
