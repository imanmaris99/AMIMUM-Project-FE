'use client';

import { useCart } from '@/contexts/CartContext';
import rupiahFormater from '@/utils/rupiahFormater';

export default function CartSummary() {
  const { cartItems, totalPrices } = useCart();

  const selectedItems = cartItems.filter((item) => item.is_active !== false);
  const hasCartItems = cartItems.length > 0;
  const hasSelectedItems = selectedItems.length > 0;


  // Calculate totals
  const subtotal = totalPrices.subtotal;
  const totalDiscount = totalPrices.promo_total || 0;
  const total = totalPrices.total;

  return (
    <div className="px-4 py-4 min-h-[200px] mt-10">
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="space-y-6">
          {hasCartItems && !hasSelectedItems && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
              <p className="text-xs text-yellow-700">
                Pilih minimal satu produk untuk melanjutkan checkout.
              </p>
            </div>
          )}

          {/* Items Section - Always show */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Subtotal dipilih</span>
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
                <span className="text-gray-600 text-sm">Diskon</span>
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
