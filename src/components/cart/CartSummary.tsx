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
  const totalDiscount = hasSelectedItems ? totalPrices.promo_total || 0 : 0;
  const total = hasSelectedItems ? Math.max(0, subtotal - totalDiscount) : 0;

  return (
    <div className="px-1 py-3 mt-4">
      <div className="max-w-sm mx-auto">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
          <div className="space-y-6">
            {hasCartItems && !hasSelectedItems && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2">
                <p className="text-xs text-yellow-700">
                  Pilih minimal satu produk untuk melanjutkan checkout.
                </p>
              </div>
            )}

            {hasSelectedItems && (
              <div className="rounded-2xl bg-[#E6F2F0] px-3 py-2">
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
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-[#6B7C73]">Subtotal dipilih</span>
                <span className="text-sm font-semibold text-[#0D0E09]">
                  {rupiahFormater(subtotal)}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
            </div>

            {totalDiscount > 0 && (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-[#6B7C73]">Diskon</span>
                  <span className="text-sm font-semibold text-red-500">
                    -{rupiahFormater(totalDiscount)}
                  </span>
                </div>
                <div className="h-px bg-gray-200"></div>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-[#6B7C73] font-medium">Total dipilih</span>
              <span className="text-base font-bold text-primary">
                {rupiahFormater(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
