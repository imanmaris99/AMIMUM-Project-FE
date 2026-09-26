import { describe, expect, it } from "vitest";

import {
  getInitialTransactionStatus,
  getPaymentMethodGroups,
  getPaymentMethodLabel,
  isManualQrisPaymentMethod,
  isMidtransSandboxPaymentMethod,
  requiresPendingPayment,
} from "./paymentMethods";

describe("payment methods", () => {
  it("only exposes delivery-compatible methods for delivery", () => {
    const methods = getPaymentMethodGroups("delivery").flatMap(
      (group) => group.methods
    );

    expect(methods.map((method) => method.id)).toEqual([
      "qris_manual",
      "qris",
      "alfamart",
      "indomaret",
      "cod",
    ]);
    expect(methods.every((method) => method.isAvailable)).toBe(true);
  });

  it("only exposes pickup-compatible methods for pickup", () => {
    const methods = getPaymentMethodGroups("pickup").flatMap(
      (group) => group.methods
    );

    expect(methods.map((method) => method.id)).toEqual([
      "qris_manual",
      "qris",
      "pay_at_store",
    ]);
  });

  it.each(["qris", "qris_manual", "alfamart", "indomaret"] as const)(
    "keeps %s pending until payment is confirmed",
    (method) => {
      expect(requiresPendingPayment(method)).toBe(true);
      expect(getInitialTransactionStatus(method)).toBe("pending");
    }
  );

  it.each(["cod", "pay_at_store"] as const)(
    "starts %s orders in processing",
    (method) => {
      expect(requiresPendingPayment(method)).toBe(false);
      expect(getInitialTransactionStatus(method)).toBe("processing");
    }
  );

  it("distinguishes manual QRIS from Midtrans sandbox", () => {
    expect(isManualQrisPaymentMethod("qris_manual")).toBe(true);
    expect(isManualQrisPaymentMethod("qris")).toBe(false);
    expect(isMidtransSandboxPaymentMethod("qris")).toBe(true);
    expect(isMidtransSandboxPaymentMethod("qris_manual")).toBe(false);
  });

  it("returns a customer-facing fallback for an absent method", () => {
    expect(getPaymentMethodLabel()).toBe("Belum dipilih");
  });
});
