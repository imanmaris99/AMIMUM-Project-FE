import assert from "node:assert/strict";
import test from "node:test";
import { RequestGeneration } from "../src/lib/ratingRequestGeneration.ts";

test("invalidates pending review-page responses after query changes", () => {
  const requests = new RequestGeneration();
  const initialPage = requests.begin();
  const staleLoadMore = requests.current();

  const changedFilter = requests.begin();

  assert.equal(requests.isCurrent(initialPage), false);
  assert.equal(requests.isCurrent(staleLoadMore), false);
  assert.equal(requests.isCurrent(changedFilter), true);
});

test("invalidates pending review requests when the component scope changes", () => {
  const requests = new RequestGeneration();
  const pendingRequest = requests.begin();

  requests.begin();

  assert.equal(requests.isCurrent(pendingRequest), false);
});
