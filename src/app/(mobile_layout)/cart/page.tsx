"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import CartList from "@/components/cart/CartList";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { totalItems } = useCart();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="flex justify-center items-center relative pt-16 pb-4">
          <div className="absolute left-4">
            <GoChevronLeft 
              className="text-3xl cursor-pointer text-gray-700 hover:text-gray-900 transition-colors" 
              onClick={handleBack} 
            />
          </div>
          <div className="text-center">
            <h1 className="text-[16px] font-semibold text-gray-900">Keranjangku</h1>
            <p className="text-xs text-gray-500 mt-1">{totalItems} item di keranjang</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        <div className="max-w-sm mx-auto">
          <CartList />
        </div>
      </div>
    </div>
  );
}