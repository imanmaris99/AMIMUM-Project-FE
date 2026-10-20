export interface PendingPaymentOrder {
  id: string;
  status?: string | null;
  created_at?: string | null;
  notes?: string | null;
}

const PAYMENT_RECOVERY_WINDOW_MS = 30 * 60 * 1000;

export const findLatestRecentPendingOrder = <T extends PendingPaymentOrder>(
  orders: T[],
  selectedPayment: string,
  now = Date.now()
): T | undefined => {
  let latestOrder: T | undefined;
  let latestCreatedAt = Number.NEGATIVE_INFINITY;

  for (const order of orders) {
    const createdAt = new Date(order.created_at || "").getTime();
    const ageMs = now - createdAt;
    const paymentToken = order.notes
      ?.match(/\[PAYMENT:\s*([^\]]+)\]/i)?.[1]
      ?.trim()
      .toLowerCase();

    if (
      order.status?.toLowerCase() !== "pending" ||
      !Number.isFinite(createdAt) ||
      ageMs > PAYMENT_RECOVERY_WINDOW_MS ||
      paymentToken !== selectedPayment
    ) {
      continue;
    }

    if (createdAt > latestCreatedAt) {
      latestOrder = order;
      latestCreatedAt = createdAt;
    }
  }

  return latestOrder;
};
