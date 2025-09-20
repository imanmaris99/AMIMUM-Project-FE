'use client';

import { useCart } from '@/contexts/CartContext';
import rupiahFormater from '@/utils/rupiahFormater';

export default function CartSummary() {
  const { cartItems, totalPrices } = useCart();

  // Debug logging
  console.log("🛒 CartSummary: cartItems length:", cartItems.length);
  console.log("🛒 CartSummary: totalPrices:", totalPrices);

  // Calculate totals
  const subtotal = totalPrices.all_item_active_prices;
  const totalDiscount = totalPrices.all_item_active_prices - totalPrices.all_promo_active_prices;
  const total = totalPrices.total_all_active_prices;

  return (
    <div className="px-4 py-4 min-h-[200px] mt-10">
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="space-y-6">
          {/* Items Section - Always show */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Items</span>
              <span className="text-black font-medium text-sm">
                {rupiahFormater(subtotal)}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
          </div>

          {/* Discount Section - Only show if there's discount */}
          {totalDiscount > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Discounts</span>
                <span className="text-red-500 font-medium text-sm">
                  -{rupiahFormater(totalDiscount)}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
            </div>
          )}

          {/* Total Section - Always show */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Total</span>
            <span className="text-primary font-bold text-sm">
              {rupiahFormater(total)}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
