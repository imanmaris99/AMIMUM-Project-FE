"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GiShoppingCart } from "react-icons/gi";
import CartItem from "./CartItem";
import { useCart } from "@/contexts/CartContext";

const CartList: React.FC = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, updateActiveStatus, removeFromCart, isLoading } = useCart();


  const handleQuantityChange = async (cartId: string, quantity: number) => {
    await updateQuantity(cartId, quantity);
  };

  const handleCheckChange = async (cartId: string, checked: boolean) => {
    await updateActiveStatus(cartId, checked);
  };

  const handleDelete = async (cartId: string) => {
    await removeFromCart(cartId);
  };

  const handleStartShopping = () => {
    router.push('/');
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-14 text-center shadow-sm">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-gray-600">Memuat isi keranjang dari server...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <section className="rounded-3xl border border-emerald-100 bg-white/95 px-5 py-10 text-center shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <GiShoppingCart className="h-9 w-9 text-primary" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Keranjang belanja</p>
          <h3 className="mt-2 text-xl font-bold text-gray-950">Keranjang masih kosong</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6B7C73]">
            Pilih produk herbal dari katalog, lalu cek ulang harga dan varian di keranjang sebelum checkout resmi toko.
          </p>
          <div className="mt-4 grid gap-2 rounded-2xl bg-emerald-50/70 px-4 py-3 text-left text-xs leading-5 text-emerald-900">
            <p>✓ Harga final mengikuti data katalog saat checkout.</p>
            <p>✓ Bisa pilih produk mana yang ingin dibeli sekarang.</p>
            <p>✓ Pesanan bisa dipantau setelah checkout.</p>
          </div>
          <button
            onClick={handleStartShopping}
            className="mt-5 w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Mulai Belanja
          </button>
        </section>
      ) : (
        cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            disabled={isLoading}
            onQuantityChange={handleQuantityChange}
            onCheckChange={handleCheckChange}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default CartList;
