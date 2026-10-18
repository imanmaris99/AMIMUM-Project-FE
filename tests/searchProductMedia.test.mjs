import assert from "node:assert/strict";
import test from "node:test";
import { shouldFetchProductCatalogForSearch } from "../src/lib/productSearchMedia.ts";

test("does not fetch the full catalog for the current image-field contract with empty media", () => {
  const products = [
    { id: "with-image", primary_image_url: "https://img.example/1.webp", gallery_images: [] },
    { id: "without-image", primary_image_url: null, gallery_images: [] },
  ];

  assert.equal(shouldFetchProductCatalogForSearch(products), false);
});

test("keeps the catalog fallback for legacy search payloads without image fields", () => {
  assert.equal(shouldFetchProductCatalogForSearch([{ id: "legacy", image: null }]), true);
});

test("does not fetch for empty results and falls back for mixed legacy payloads", () => {
  assert.equal(shouldFetchProductCatalogForSearch([]), false);
  assert.equal(
    shouldFetchProductCatalogForSearch([
      { id: "current", primary_image_url: null, gallery_images: [] },
      { id: "legacy" },
    ]),
    true,
  );
});
