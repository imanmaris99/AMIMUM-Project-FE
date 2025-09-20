"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import CartFooter from "@/components/cart/CartFooter";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { totalItems } = useCart();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same style as track order */}
      <div className="flex justify-center items-center relative mt-16">
        <div className="absolute left-10">
          <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
        </div>
        <div className="text-center">
          <h1 className="text-[16px] font-semibold">Keranjangku</h1>
          <p className="text-xs text-gray-500 mt-1">{totalItems} item di keranjang</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-20">
        <div className="max-w-sm mx-auto">
          <CartList />
          {/* Cart Summary */}
          <CartSummary />
        </div>
      </div>
      
      {/* Cart Footer */}
      <CartFooter />
    </div>
  );
}