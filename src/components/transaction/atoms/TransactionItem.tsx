"use client";

import React from "react";
import { Transaction } from "@/types/transaction";
import {
  getCustomerStatusConfig,
  isFailedPaymentStatus,
  isPendingPaymentStatus,
} from "@/lib/transactionStatus";
import { getPaymentMethodLabel } from "@/lib/paymentMethods";

interface TransactionItemProps {
  transaction: Transaction;
  onViewDetails: (id: string) => void;
  onTrackOrder?: (id: string) => void;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const getPrimaryActionLabel = (transaction: Transaction) => {
  if (isPendingPaymentStatus(transaction.status) || isFailedPaymentStatus(transaction.status)) {
    return "Bayar sekarang";
  }

  if (transaction.deliveryType === "delivery" && ["shipped", "delivered", "completed"].includes(transaction.status)) {
    return "Lacak pengiriman";
  }

  return "Lihat detail";
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewDetails,
  onTrackOrder,
}) => {
  const statusConfig = getCustomerStatusConfig(
    transaction.status,
    transaction.paymentMethod
  );
  const firstItem = transaction.items[0];
  const remainingItems = Math.max(transaction.items.length - 1, 0);
  const trackingNumber = transaction.shipmentAddress?.trackingNumber;
  const shouldTrackDirectly =
    transaction.deliveryType === "delivery" &&
    ["shipped", "delivered", "completed"].includes(transaction.status) &&
    Boolean(onTrackOrder);
  const primaryActionLabel = getPrimaryActionLabel(transaction);

  const handlePrimaryAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (shouldTrackDirectly && onTrackOrder) {
      onTrackOrder(transaction.id);
      return;
    }

    onViewDetails(transaction.id);
  };

  const handleCardClick = () => onViewDetails(transaction.id);

  return (
    <article
      className="px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleCardClick}
      aria-label={`Transaksi ${transaction.transactionId}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {transaction.date}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-gray-900">
              {firstItem?.name || "Pesanan Amimum"}
              {remainingItems > 0 ? ` +${remainingItems} item` : ""}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              ID: {transaction.transactionId}
            </p>
          </div>

          <div
            className={`flex-shrink-0 rounded-full border px-3 py-1 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
          >
            <span className={`text-[11px] font-semibold ${statusConfig.textColor}`}>
              {statusConfig.text}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-xs">
          <div>
            <p className="text-gray-400">Total</p>
            <p className="mt-1 font-semibold text-gray-900">
              {formatRupiah(transaction.total)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Metode bayar</p>
            <p className="mt-1 font-medium text-gray-800">
              {getPaymentMethodLabel(transaction.paymentMethod)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Pengiriman</p>
            <p className="mt-1 font-medium text-gray-800">
              {transaction.deliveryType === "delivery"
                ? `${transaction.shipmentAddress?.courier || "Kurir"} ${transaction.shipmentAddress?.service || ""}`.trim()
                : "Ambil di toko"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">No. resi</p>
            <p className="mt-1 font-medium text-gray-800">
              {trackingNumber || "Belum tersedia"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {primaryActionLabel}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetails(transaction.id);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
          >
            Detail
          </button>
        </div>
      </div>
    </article>
  );
};

export default TransactionItem;
