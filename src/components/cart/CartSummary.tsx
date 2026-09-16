'use client';

import { useCart } from '@/contexts/CartContext';
import rupiahFormater from '@/utils/rupiahFormater';

export default function CartSummary() {
  const { cartItems, totalPrices, isSyncing } = useCart();

  const selectedItems = cartItems.filter((item) => item.is_active !== false);
  const hasCartItems = cartItems.length > 0;
  const hasSelectedItems = selectedItems.length > 0;
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = totalPrices.promo_total || 0;
  const total = Math.max(0, subtotal - totalDiscount);

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

            {hasSelectedItems && (
              <div className="rounded-lg bg-[#E6F2F0] px-3 py-2">
                <p className="text-xs font-semibold text-primary">
                  {selectedQuantity} item dipilih untuk checkout.
                </p>
                {isSyncing && (
                  <p className="mt-1 text-xs text-primary/80">
                    Harga tampil langsung, pilihan sedang disimpan ke server.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Subtotal dipilih</span>
                <span className="text-black font-medium text-sm">
                  {rupiahFormater(subtotal)}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
            </div>

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

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm font-medium">Total dipilih</span>
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
