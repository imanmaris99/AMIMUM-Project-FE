import assert from "node:assert/strict";
import test from "node:test";

import { findLatestRecentPendingOrder } from "../src/lib/paymentRecovery.ts";

test("payment recovery chooses the newest matching pending order regardless of API order", () => {
  const orders = [
    {
      id: "older-order",
      status: "pending",
      created_at: "2026-10-21T09:00:00Z",
      notes: "[PAYMENT: qris]",
    },
    {
      id: "newer-order",
      status: "pending",
      created_at: "2026-10-21T09:20:00Z",
      notes: "[PAYMENT: qris]",
    },
  ];

  const result = findLatestRecentPendingOrder(
    orders,
    "qris",
    new Date("2026-10-21T09:25:00Z").getTime()
  );

  assert.equal(result?.id, "newer-order");
});
