import assert from "node:assert/strict";
import test from "node:test";

import { resolvePrivateRatingAccess } from "../src/lib/privateRatingAccess.ts";

const productId = "8c8877e3-1000-4f00-9000-afe1b4e2f62a";
const eligibleItem = {
  order_item_id: 14,
  order_id: "owned-order",
  order_date: "2026-10-01T00:00:00Z",
  variant_id: 2,
  variant_name: "Produk • Kemasan 10",
};
const orderDetail = {
  id: "owned-order",
  status: "completed",
  order_item_lists: [{ id: 14, product_id: productId, has_rating: false }],
};

test("allows the form only for the exact completed purchased item", () => {
  const access = resolvePrivateRatingAccess(productId, "14", [eligibleItem], orderDetail);
  assert.equal(access.kind, "available");
  assert.equal(access.orderItem, eligibleItem);
});

test("does not allow an order item absent from the authenticated eligible list", () => {
  const access = resolvePrivateRatingAccess(productId, "99", [eligibleItem], orderDetail);
  assert.equal(access.kind, "unavailable");
});

test("blocks a purchase that already has a rating", () => {
  const ratedOrder = {
    ...orderDetail,
    order_item_lists: [{ id: 14, product_id: productId, has_rating: true }],
  };
  const access = resolvePrivateRatingAccess(productId, 14, [eligibleItem], ratedOrder);
  assert.equal(access.kind, "already-rated");
});

test("fails closed when rating status is missing", () => {
  const orderWithoutRatingStatus = {
    ...orderDetail,
    order_item_lists: [{ id: 14, product_id: productId }],
  };
  const access = resolvePrivateRatingAccess(
    productId,
    14,
    [eligibleItem],
    orderWithoutRatingStatus,
  );
  assert.equal(access.kind, "unavailable");
});

test("fails closed when the order, product, status, or item identity does not match", () => {
  const invalidCases = [
    { detail: { ...orderDetail, id: "other-order" }, items: [eligibleItem] },
    { detail: { ...orderDetail, status: "processing" }, items: [eligibleItem] },
    {
      detail: { ...orderDetail, order_item_lists: [{ id: 14, product_id: "another-product", has_rating: false }] },
      items: [eligibleItem],
    },
    { detail: orderDetail, items: [] },
  ];

  for (const invalidCase of invalidCases) {
    assert.equal(
      resolvePrivateRatingAccess(productId, 14, invalidCase.items, invalidCase.detail).kind,
      "unavailable"
    );
  }
});
