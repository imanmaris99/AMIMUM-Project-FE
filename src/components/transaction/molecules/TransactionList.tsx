"use client";

import React from "react";
import TransactionItem from "../atoms/TransactionItem";
import { Transaction } from "@/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (id: string) => void;
  onTrackOrder?: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails,
  onTrackOrder,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl bg-white/95 p-6 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/70">
          <svg
            className="h-8 w-8 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-[#0D0E09]">
          Belum Ada Transaksi
        </h3>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#6B7C73]">
          Riwayat transaksi server akan muncul setelah pesanan berhasil dibuat dari checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50"
        >
          <TransactionItem
            transaction={transaction}
            onViewDetails={onViewDetails}
            onTrackOrder={onTrackOrder}
          />
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
