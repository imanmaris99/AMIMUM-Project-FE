import assert from "node:assert/strict";
import test from "node:test";

import {
  getInitialTransactionStatus,
  getPaymentMethodGroups,
  getPaymentMethodLabel,
  isManualBankTransferPaymentMethod,
  isManualQrisPaymentMethod,
  isMidtransOnlinePaymentMethod,
  requiresPendingPayment,
} from "../src/lib/paymentMethods.ts";

test("delivery checkout offers only online/manual payment methods, never in-store payment or product COD", () => {
  const ids = getPaymentMethodGroups("delivery").flatMap((group) =>
    group.methods.map((method) => method.id)
  );

  assert.deepEqual(new Set(ids), new Set(["qris_manual", "transfer", "qris"]));
  assert.equal(ids.includes("pay_at_store"), false);
  assert.equal(ids.includes("cod"), false);
});

test("pickup checkout alone offers payment at the store", () => {
  const pickupMethods = getPaymentMethodGroups("pickup").flatMap((group) => group.methods);
  const deliveryIds = getPaymentMethodGroups("delivery").flatMap((group) =>
    group.methods.map((method) => method.id)
  );

  assert.equal(pickupMethods.some((method) => method.id === "pay_at_store"), true);
  assert.equal(
    pickupMethods.find((method) => method.id === "pay_at_store")?.description.includes("Khusus pesanan pickup"),
    true
  );
  assert.equal(deliveryIds.includes("pay_at_store"), false);
});

test("online and manual payments begin pending while pickup payment begins processing", () => {
  for (const method of ["qris_manual", "transfer", "qris"]) {
    assert.equal(requiresPendingPayment(method), true, method);
    assert.equal(getInitialTransactionStatus(method), "pending", method);
  }

  for (const method of ["pay_at_store", "cod"]) {
    assert.equal(requiresPendingPayment(method), false, method);
    assert.equal(getInitialTransactionStatus(method), "processing", method);
  }
});

test("COD wording identifies only shipping due on arrival", () => {
  assert.equal(getPaymentMethodLabel("cod"), "Ongkir dibayar saat paket tiba");
});

test("manual and Midtrans payment methods are classified distinctly", () => {
  assert.equal(isManualQrisPaymentMethod("qris_manual"), true);
  assert.equal(isManualBankTransferPaymentMethod("transfer"), true);
  assert.equal(isMidtransOnlinePaymentMethod("qris"), true);
  assert.equal(isMidtransOnlinePaymentMethod("qris_manual"), false);
});
