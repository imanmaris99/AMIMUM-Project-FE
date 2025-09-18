"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { CartResponseType } from "@/types/apiTypes";
import Spinner from "@/components/ui/Spinner";
import TotalPrice from "../3_modules/TotalPrice";
import Checkout from "../3_modules/Checkout";
import CartItemInteractive from "../3_modules/CartItemInteractive";
import { useCart } from "@/contexts/CartContext";

interface CartUIProps {
  cartResponse: CartResponseType | null;
  errorMessage?: string | null;
}

const CartUI: React.FC<CartUIProps> = ({ cartResponse, errorMessage }) => {
  const { cartItems, totalPrices, selectAllItems, getCartItemCount } = useCart();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const router = useRouter();

  const handleSelectAll = (selected: boolean) => {
    setIsAllSelected(selected);
    selectAllItems(selected);
  };

  const handleCheckout = () => {
    const activeItems = cartItems.filter(item => item.is_active);
    if (activeItems.length === 0) {
      alert("Pilih minimal satu item untuk checkout");
      return;
    }
    console.log("Checkout clicked with items:", activeItems);
    // TODO: Implement actual checkout logic
  };

  const handleBack = () => {
    router.back();
  };

  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }
  if (!cartResponse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="mb-4" />
        <p className="text-gray-600 text-base">Memuat data keranjang...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same style as track order */}
      <div className="bg-white">
        <div className="flex justify-center items-center relative pt-16 pb-4">
          <div className="absolute left-4">
            <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
          </div>
          <div className="text-center">
            <h1 className="text-[16px] font-semibold">Keranjangku</h1>
            <p className="text-xs text-gray-500 mt-1">{cartItems.length} item di keranjang</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        <div className="max-w-sm mx-auto">
          <h2 className="text-lg font-semibold mb-4">Cart Items ({cartItems.length})</h2>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Keranjang kosong</p>
              <p className="text-sm text-gray-400">Tambahkan produk untuk memulai belanja</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemInteractive key={item.id} cartItem={item} />
              ))}
            </div>
          )}
          
          {/* Total Price Component */}
          {cartItems.length > 0 && (
            <div className="mt-6">
              <TotalPrice totalPrices={totalPrices} />
            </div>
          )}
        </div>
      </div>
      
      {/* Checkout Component - Fixed like ecommerce */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-sm mx-auto">
          <Checkout
            totalPrice={totalPrices.total_all_active_prices}
            onCheckout={handleCheckout}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default CartUI;
