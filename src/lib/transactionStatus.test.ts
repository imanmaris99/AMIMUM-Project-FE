import { describe, expect, it } from "vitest";

import {
  getCustomerOrderAlert,
  getCustomerStatusConfig,
  isFailedPaymentStatus,
  isOfflinePaymentMethod,
  isOnlinePaymentMethod,
  isSuccessfulPaymentStatus,
} from "./transactionStatus";

describe("transaction status", () => {
  it.each(["cancelled", "canceled", "failed", "expire", "expired", "cancel", "deny"])(
    "recognizes %s as a failed payment state",
    (status) => {
      expect(isFailedPaymentStatus(status)).toBe(true);
    }
  );

  it.each(["processing", "capture", "settlement", "paid", "completed"])(
    "recognizes %s as a successful payment state",
    (status) => {
      expect(isSuccessfulPaymentStatus(status)).toBe(true);
    }
  );

  it("does not classify pending as success or failure", () => {
    expect(isFailedPaymentStatus("pending")).toBe(false);
    expect(isSuccessfulPaymentStatus("pending")).toBe(false);
  });

  it("classifies COD and pay-at-store as offline", () => {
    expect(isOfflinePaymentMethod("cod")).toBe(true);
    expect(isOfflinePaymentMethod("pay_at_store")).toBe(true);
    expect(isOnlinePaymentMethod("qris")).toBe(true);
    expect(isOnlinePaymentMethod("qris_manual")).toBe(true);
  });

  it("uses a distinct pending label for manual QRIS", () => {
    expect(getCustomerStatusConfig("pending", "qris_manual").text).toBe(
      "Menunggu Konfirmasi QRIS"
    );
    expect(getCustomerStatusConfig("pending", "qris").text).toBe(
      "Menunggu Bayar"
    );
  });

  it("shows tracking information only when it is available", () => {
    expect(getCustomerOrderAlert("shipped", "JNE-123").message).toContain(
      "JNE-123"
    );
    expect(getCustomerOrderAlert("shipped").message).toContain(
      "belum tersedia"
    );
  });

  it("uses pickup-specific processing guidance", () => {
    expect(getCustomerOrderAlert("processing", undefined, "pickup").title).toBe(
      "Pesanan sedang disiapkan"
    );
  });
});
