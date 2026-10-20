import assert from "node:assert/strict";
import test from "node:test";

import { mapOrderItemToTransactionItem } from "../src/lib/orderItemMapping.ts";
import { getCompletedOrderRatingHref } from "../src/lib/ratingConstraints.ts";

test("order item mapping preserves the product ID needed for verified-purchase rating entry", () => {
  const productId = "8c8877e3-1000-4f00-9000-afe1b4e2f62a";
  const mapped = mapOrderItemToTransactionItem({
    id: 12,
    product_id: ` ${productId} `,
    product_name: "Produk Uji",
    variant_product: "Type 02",
    quantity: 2,
    price_per_item: 12500,
    img: "/product.webp",
    has_rating: true,
  });

  assert.equal(mapped.productId, productId);
  assert.equal(mapped.hasRating, true);
  assert.equal(mapped.name, "Produk Uji");
  assert.equal(mapped.variantName, "Type 02");
  assert.equal(mapped.image, "/product.webp");
});

test("order item mapping safely leaves missing product IDs empty", () => {
  const mapped = mapOrderItemToTransactionItem({
    id: 13,
    product_id: null,
    product_name: "Produk lama",
    variant_product: "",
    quantity: 1,
    price_per_item: 5000,
  });

  assert.equal(mapped.productId, "");
  assert.equal(mapped.image, "/default-image.jpg");
});

test("completed order item links to the private review page", () => {
  const mapped = mapOrderItemToTransactionItem({
    id: 14,
    product_id: "product-abc",
    product_name: "Produk Uji",
    variant_product: "Type 01",
    quantity: 1,
    price_per_item: 10000,
  });

  assert.equal(
    getCompletedOrderRatingHref("completed", mapped.productId, mapped.id),
    "/write-review/product-abc/14"
  );
});
