import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const guard = await import("../src/lib/checkoutAddressGuard.ts").catch(() => null);
const readSource = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");
const orderPage = readSource("../src/components/order/Order1Page.tsx");
const selector = readSource("../src/components/order/AddressSelector.tsx");
const savedAddresses = readSource("../src/app/(navbar_layout)/saved-addresses/page.tsx");

test("one shared guard accepts only positive safe-integer RajaOngkir city IDs", () => {
  assert.equal(typeof guard?.hasValidRajaOngkirCityId, "function");
  assert.equal(typeof guard?.isCheckoutAddressSelectable, "function");
  for (const value of [
    undefined,
    null,
    "",
    "abc",
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    true,
  ]) {
    assert.equal(guard.hasValidRajaOngkirCityId(value), false, `reject ${String(value)}`);
    assert.equal(guard.isCheckoutAddressSelectable({ city_id: value }), false);
  }
  for (const value of [1, 501, Number.MAX_SAFE_INTEGER, "501", " 501 "]) {
    assert.equal(guard.hasValidRajaOngkirCityId(value), true, `accept ${String(value)}`);
    assert.equal(guard.isCheckoutAddressSelectable({ city_id: value }), true);
  }
});

test("checkout selector and submit flow both apply the shared city-ID guard", () => {
  assert.ok(selector.includes("isCheckoutAddressSelectable(address)"));
  assert.ok(selector.includes("if (hasValidRajaOngkirCity) {"));
  assert.ok(selector.includes("onAddressSelect(address)"));
  assert.ok(selector.includes("Belum bisa dipilih untuk checkout."));
  assert.ok(orderPage.includes("hasValidRajaOngkirCityId(selectedAddress.city_id)"));
  assert.ok(orderPage.includes("hasValidRajaOngkirCityId(selectedAddress?.city_id)"));
  assert.ok(orderPage.includes("if ("));
  assert.ok(orderPage.includes("!hasValidRajaOngkirCityId(selectedAddress.city_id)"));
  assert.ok(orderPage.includes("city_id: Number(selectedAddress.city_id)"));
});

test("pickup readiness bypasses delivery-only city ID requirements", () => {
  const readinessStart = orderPage.indexOf("const hasValidDeliverySelection =");
  const readinessEnd = orderPage.indexOf("const currentItems =", readinessStart);
  assert.ok(readinessStart >= 0 && readinessEnd > readinessStart);
  const readinessExpression = orderPage.slice(readinessStart, readinessEnd);
  assert.ok(readinessExpression.includes("deliveryMethod !== 'delivery' ||"));
  assert.ok(readinessExpression.includes("hasValidRajaOngkirCityId(selectedAddress?.city_id)"));
});

test("saved-address screen uses the same city-ID rule for checkout readiness copy", () => {
  assert.ok(savedAddresses.includes("hasValidRajaOngkirCityId(item.city_id)"));
  assert.ok(savedAddresses.includes("Perlu update lokasi RajaOngkir sebelum dipakai checkout"));
  assert.ok(savedAddresses.includes("Siap dipakai checkout"));
});
