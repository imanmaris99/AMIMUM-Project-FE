import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const productCard = readFileSync(
  new URL("../src/components/common/Search/CardProduct/index.tsx", import.meta.url),
  "utf8",
);
const promoCard = readFileSync(
  new URL("../src/components/homepage/PromoCard/index.tsx", import.meta.url),
  "utf8",
);

test("catalog product card exposes product navigation as a keyboard-operable link", () => {
  assert.match(productCard, /<Link\b/);
  assert.match(productCard, /href=\{`\/detail-product\/\$\{encodeURIComponent\(product\.id\)\}`\}/);
  assert.match(productCard, /focus-visible:ring/);
  assert.doesNotMatch(productCard, /onClick=\{\(\) => product\.id && handleSelectProduct\(product\.id\)\}/);
});

test("homepage promo card exposes promo navigation as a keyboard-operable link", () => {
  assert.match(promoCard, /<Link\b/);
  assert.match(promoCard, /href=\{`\/promo\/\$\{promo\.id\}`\}/);
  assert.match(promoCard, /focus-visible:ring/);
  assert.doesNotMatch(promoCard, /onClick=\{handleCardClick\}/);
});
