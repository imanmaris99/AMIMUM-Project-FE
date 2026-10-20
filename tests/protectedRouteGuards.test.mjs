import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = (relativePath) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

const savedAddresses = source("../src/app/(navbar_layout)/saved-addresses/page.tsx");
const myRatings = source("../src/app/(navbar_layout)/my-ratings/page.tsx");
const shipment = source("../src/app/(mobile_layout)/shipment/page.tsx");
const createShipment = source("../src/app/(mobile_layout)/shipment/create/page.tsx");
const editShipment = source("../src/app/(mobile_layout)/shipment/edit/page.tsx");
const orderConfirmation = source("../src/app/(mobile_layout)/order-confirmation/page.tsx");
const loginProtection = source("../src/components/common/LoginProtection.tsx");
const loginRequiredModal = source("../src/components/common/LoginRequiredModal/index.tsx");

function assertGuardBeforeCall(pageSource, callText, fromIndex = 0) {
  const guardIndex = pageSource.indexOf("if (!SessionManager.isAuthenticated())", fromIndex);
  const callIndex = pageSource.indexOf(callText, fromIndex);
  assert.notEqual(guardIndex, -1, "expected an authentication guard before protected data loading");
  assert.notEqual(callIndex, -1, `expected to find ${callText}`);
  assert.ok(guardIndex < callIndex, "anonymous page should not start a protected data request");
  return { guardIndex, callIndex };
}

test("saved-addresses and my-ratings skip protected loads for anonymous visitors", () => {
  assertGuardBeforeCall(savedAddresses, "loadAddresses();");
  assertGuardBeforeCall(myRatings, "void loadRatings();");
});

test("shipment list and forms gate each protected fetch behind the login check", () => {
  assertGuardBeforeCall(shipment, "await refreshShipments();");
  assertGuardBeforeCall(createShipment, "loadStoreAddress();");

  const first = assertGuardBeforeCall(editShipment, "loadStoreAddress();");
  assertGuardBeforeCall(editShipment, "loadShipment();", first.callIndex + 1);
});

test("protected route guards identify addresses, ratings, shipments, and order confirmation", () => {
  assert.match(loginProtection, /case 'saved-addresses':[\s\S]*?return 'Alamat Tersimpan'/);
  assert.match(loginProtection, /case 'my-ratings':[\s\S]*?return 'Rating & Ulasan Saya'/);
  assert.match(loginProtection, /case 'shipment':[\s\S]*?return 'Alamat Pengiriman'/);
  assert.match(loginProtection, /case 'order-confirmation':[\s\S]*?return 'Konfirmasi Pesanan'/);
  for (const feature of ['saved-addresses', 'my-ratings', 'shipment', 'order-confirmation']) {
    assert.ok(loginRequiredModal.includes(`'${feature}'`), `modal type should accept ${feature}`);
  }

  assert.match(savedAddresses, /feature="saved-addresses"/);
  assert.match(myRatings, /feature="my-ratings"/);
  assert.match(shipment, /feature="shipment"/);
  assert.match(createShipment, /feature="shipment"/);
  assert.match(editShipment, /feature="shipment"/);
  assert.match(orderConfirmation, /feature="order-confirmation"/);
});

test("login modal benefits match the protected customer feature", () => {
  for (const benefit of [
    "Kelola alamat tujuan tersimpan di akun Anda",
    "Lihat rating dan ulasan yang pernah Anda berikan",
    "Kelola alamat pengiriman untuk checkout delivery",
    "Lihat ringkasan konfirmasi pesanan dari akun Anda",
  ]) {
    assert.ok(loginRequiredModal.includes(benefit), `login modal should include ${benefit}`);
  }
});
