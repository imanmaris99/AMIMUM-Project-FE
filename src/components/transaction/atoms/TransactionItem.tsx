"use client";

import React from "react";
import { Transaction } from "@/types/transaction";
import { rupiahFormater } from "@/utils/rupiahFormater";

interface TransactionItemProps {
  transaction: Transaction;
  onViewDetails: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onViewDetails 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          text: 'Lunas',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'cancelled':
        return {
          text: 'Batal',
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          borderColor: 'border-red-200'
        };
      case 'pending':
        return {
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          borderColor: 'border-yellow-200'
        };
      case 'refund':
        return {
          text: 'Refund',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          text: 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <div className="px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
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
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <div className={`px-4 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border w-[75px] flex items-center justify-center`}>
            <span className={`text-xs font-medium ${statusConfig.textColor} whitespace-nowrap`}>
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
