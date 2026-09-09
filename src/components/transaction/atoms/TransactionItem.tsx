"use client";

import React from "react";
import { Transaction } from "@/types/transaction";
import { getCustomerStatusConfig } from "@/lib/transactionStatus";

interface TransactionItemProps {
  transaction: Transaction;
  onViewDetails: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onViewDetails 
}) => {
  const statusConfig = getCustomerStatusConfig(
    transaction.status,
    transaction.paymentMethod
  );

  return (
    <div 
      className="px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onViewDetails(transaction.id)}
    >
      <div className="flex items-center gap-4">
        {/* Check Icon */}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-gray-800" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-800">
              Id: {transaction.transactionId}
            </p>
            <p className="text-xs text-gray-500">
              {transaction.date}
            </p>
            <p className="text-xs text-gray-600">
              {transaction.deliveryType === 'delivery'
                ? `${transaction.shipmentAddress?.courier || 'Kurir'} ${transaction.shipmentAddress?.service || ''}`.trim()
                : 'Ambil di toko'}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(transaction.total)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <div className={`px-3 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border min-w-[92px] max-w-[128px] flex items-center justify-center text-center`}>
            <span className={`text-[11px] leading-tight font-medium ${statusConfig.textColor}`}>
              {statusConfig.text}
            </span>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onViewDetails(transaction.id)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg 
              className="w-5 h-5 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
