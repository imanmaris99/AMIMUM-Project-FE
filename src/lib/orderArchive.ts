import { Transaction } from "@/types/transaction";

export const TRACK_ORDER_ACTIVE_DAYS = 30;

const FINAL_TRACKING_STATUSES = new Set(["completed", "delivered"]);

export const isFinalTrackingStatus = (status?: string) =>
  FINAL_TRACKING_STATUSES.has((status || "").toLowerCase());

export const getDaysSinceTransactionCreated = (transaction: Transaction, now = new Date()) => {
  const createdAt = new Date(transaction.createdAt);

  if (Number.isNaN(createdAt.getTime())) {
    return 0;
  }

  return Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
};

export const isArchivedTrackingTransaction = (transaction: Transaction, now = new Date()) =>
  isFinalTrackingStatus(transaction.status) &&
  getDaysSinceTransactionCreated(transaction, now) >= TRACK_ORDER_ACTIVE_DAYS;

export const isActiveTrackingTransaction = (transaction: Transaction, now = new Date()) =>
  !isArchivedTrackingTransaction(transaction, now);
