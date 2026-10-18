import assert from "node:assert/strict";
import test from "node:test";
import { resolveSearchProductImage, shouldFetchProductCatalogForSearch } from "../src/lib/productSearchMedia.ts";

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

test("prefers a variant image over the default placeholder", () => {
  assert.equal(
    resolveSearchProductImage(
      { primary_image_url: null, gallery_images: [], image: "/default-image.jpg" },
      ["https://img.example/variant.webp"],
    ),
    "https://img.example/variant.webp",
  );
});

test("keeps product gallery images ahead of variant images", () => {
  assert.equal(
    resolveSearchProductImage(
      {
        primary_image_url: null,
        gallery_images: [
          { url: "https://img.example/second.webp", is_primary: false, sort_order: 2 },
          { url: "https://img.example/primary.webp", is_primary: true, sort_order: 1 },
        ],
      },
      ["https://img.example/variant.webp"],
    ),
    "https://img.example/primary.webp",
  );
});

test("uses the default placeholder only when product and variant images are absent", () => {
  assert.equal(
    resolveSearchProductImage({ primary_image_url: null, gallery_images: [], image: "/default-image.jpg" }, []),
    "/default-image.jpg",
  );
});
