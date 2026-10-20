import test from "node:test";
import assert from "node:assert/strict";
import { buildCheckoutCartSnapshot } from "../src/lib/checkoutCartSnapshot.ts";

const freshCartItem = (overrides = {}) => ({
  id: 83,
  product_id: "product-fresh",
  variant_id: 31,
  product_name: "Jahe Merah",
  product_price: 30000,
  variant_info: {
    id: 31,
    variant: "250 gram",
    img: "https://cdn.example.test/jahe.jpg",
    discounted_price: 27000,
    updated_at: "2026-10-20T12:00:00Z",
  },
  quantity: 3,
  is_active: true,
  created_at: "2026-10-20T11:00:00Z",
  ...overrides,
});

const staleLocalItem = {
  id: "83",
  product_id: "product-stale",
  variant_id: 8,
  quantity: 1,
  price: 10000,
  product_name: "Nama Lama",
  variant_name: "Varian Lama",
  image: "/old.jpg",
  created_at: "2026-10-19T11:00:00Z",
  updated_at: "2026-10-19T11:00:00Z",
  is_active: true,
};

test("builds a valid checkout snapshot for fresh server cart rows missing locally", () => {
  const [item] = buildCheckoutCartSnapshot([freshCartItem()], []);

  assert.equal(item.id, "83");
  assert.equal(item.product_id, "product-fresh");
  assert.equal(item.variant_id, 31);
  assert.equal(item.quantity, 3);
  assert.equal(item.price, 27000);
  assert.equal(item.product_name, "Jahe Merah");
  assert.equal(item.variant_name, "250 gram");
});

test("server cart snapshot overrides stale local quantity, price, and identity", () => {
  const [item] = buildCheckoutCartSnapshot([freshCartItem()], [staleLocalItem]);

  assert.equal(item.product_id, "product-fresh");
  assert.equal(item.variant_id, 31);
  assert.equal(item.quantity, 3);
  assert.equal(item.price, 27000);
  assert.equal(item.product_name, "Jahe Merah");
  assert.equal(item.image, "https://cdn.example.test/jahe.jpg");
});

test("excludes inactive server cart rows from checkout snapshot", () => {
  const items = buildCheckoutCartSnapshot([freshCartItem({ is_active: false })], []);
  assert.deepEqual(items, []);
});

test("rejects incomplete fresh server identifiers instead of reusing stale local IDs", () => {
  assert.throws(
    () => buildCheckoutCartSnapshot([freshCartItem({ product_id: "" })], [staleLocalItem]),
    /Keranjang belum tersinkron/,
  );
  assert.throws(
    () => buildCheckoutCartSnapshot([freshCartItem({ variant_id: 0 })], [staleLocalItem]),
    /Keranjang belum tersinkron/,
  );
});

test("rejects invalid quantity and price before order creation", () => {
  assert.throws(
    () => buildCheckoutCartSnapshot([freshCartItem({ quantity: 0 })], []),
    /Keranjang belum tersinkron/,
  );
  assert.throws(
    () => buildCheckoutCartSnapshot([
      freshCartItem({ variant_info: { id: 31, discounted_price: 0 }, product_price: 0 }),
    ], []),
    /Keranjang belum tersinkron/,
  );
});
