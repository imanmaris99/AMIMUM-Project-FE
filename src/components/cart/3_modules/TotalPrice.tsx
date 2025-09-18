"use client";

import React from "react";
import { CartTotalPricesType } from "@/types/apiTypes";

interface TotalPriceProps {
  totalPrices: CartTotalPricesType;
  className?: string;
}

const TotalPrice: React.FC<TotalPriceProps> = ({ totalPrices, className = "" }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="space-y-6">
          {/* Product Items Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm font-medium">Items</span>
              <span className="text-[#001F14] text-sm font-medium">
                Rp {totalPrices.all_item_active_prices.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-full h-px bg-gray-200"></div>
          </div>

          {/* Discount Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm font-medium">Discounts</span>
              <span className="text-[#001F14] text-sm font-medium">
                -Rp {totalPrices.all_promo_active_prices.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-full h-px bg-gray-200"></div>
          </div>

          {/* Total Section */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Total</span>
            <span className="text-[#001F14] text-sm font-medium">
              Rp {totalPrices.total_all_active_prices.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalPrice;
