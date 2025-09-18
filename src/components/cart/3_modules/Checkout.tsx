"use client";

import React from "react";

interface CheckoutProps {
  totalPrice: number;
  onCheckout: () => void;
  onSelectAll: (selected: boolean) => void;
  isAllSelected: boolean;
  className?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ 
  totalPrice, 
  onCheckout, 
  onSelectAll, 
  isAllSelected,
  className = "" 
}) => {
  return (
    <div className={`bg-white ${className}`}>
      {/* Main Checkout Section */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* All Item Checkbox */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectAll(!isAllSelected)}
            className="w-6 h-6 rounded border-2 border-[#001F14] flex items-center justify-center transition-colors duration-200"
          >
            {isAllSelected && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#001F14"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span className="text-gray-600 text-sm font-medium">All Item</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="bg-[#00764F] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#005a3c] transition-colors duration-200"
        >
          Checkout ({totalPrice.toLocaleString('id-ID')})
        </button>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-[134px] h-1 bg-[#001F14] rounded-full"></div>
      </div>
    </div>
  );
};

export default Checkout;
