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
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Ringkasan belanja</p>
              <h2 className="mt-1 text-base font-bold text-[#0D0E09]">Produk dipilih</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              Checkout resmi
            </span>
          </div>
          <div className="space-y-5">
            {hasCartItems && !hasSelectedItems && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2">
                <p className="text-xs text-yellow-700">
                  Pilih minimal satu produk untuk melanjutkan checkout.
                </p>
              </div>
            )}

            {hasSelectedItems && (
              <div className="rounded-2xl bg-[#EAF5EF] px-3 py-2">
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
            <div className="rounded-2xl bg-gray-50/90 px-3 py-2 text-xs leading-5 text-[#6B7C73]">
              Ongkir dan metode pembayaran dihitung di halaman checkout. Produk yang tidak dicentang tidak ikut diproses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
