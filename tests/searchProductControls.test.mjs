import assert from "node:assert/strict";
import test from "node:test";
import {
  filterAndSortSearchProducts,
  getSearchProductStartingPrice,
} from "../src/lib/searchProductControls.ts";

const products = [
  {
    id: "a",
    name: "Alpha",
    price: 100,
    created_at: "2024-01-01T00:00:00Z",
    brand_info: { id: 1, name: "HNI" },
    all_variants: [{ discounted_price: 100, stock: 0 }],
  },
  {
    id: "b",
    name: "Beta",
    price: 50,
    created_at: "2025-01-01T00:00:00Z",
    brand_info: { id: 2, name: "Brand A" },
    all_variants: [{ discounted_price: 40, stock: 10 }],
  },
  {
    id: "c",
    name: "Gamma",
    price: 80,
    created_at: "2026-01-01T00:00:00Z",
    brand_info: { id: 2, name: "brand a" },
    all_variants: [{ discounted_price: 80, stock: 2 }],
  },
];

test("uses the lowest current variant price for marketplace sorting", () => {
  assert.equal(getSearchProductStartingPrice(products[1]), 40);
  assert.deepEqual(
    filterAndSortSearchProducts(products, { sortOrder: "price-asc" }).map((product) => product.id),
    ["b", "c", "a"],
  );
  assert.deepEqual(
    filterAndSortSearchProducts(products, { sortOrder: "price-desc" }).map((product) => product.id),
    ["a", "c", "b"],
  );
});

test("filters by brand, price range, and available stock without mutating input", () => {
  const filtered = filterAndSortSearchProducts(products, {
    brandName: "BRAND A",
    minPrice: 50,
    maxPrice: 90,
    inStockOnly: true,
  });

  assert.deepEqual(filtered.map((product) => product.id), ["c"]);
  assert.deepEqual(products.map((product) => product.id), ["a", "b", "c"]);
});

test("sorts newest first and preserves relevance order by default", () => {
  assert.deepEqual(
    filterAndSortSearchProducts(products, { sortOrder: "newest" }).map((product) => product.id),
    ["c", "b", "a"],
  );
  assert.deepEqual(
    filterAndSortSearchProducts(products, {}).map((product) => product.id),
    ["a", "b", "c"],
  );
});
