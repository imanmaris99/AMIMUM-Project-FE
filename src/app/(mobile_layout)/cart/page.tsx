"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import CartList from "@/components/cart/CartList";

interface CartItemData {
  id: string;
  name: string;
  variant: string;
  unit: string;
  price: number;
  image: string;
  quantity: number;
  checked: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);

  const handleBack = () => {
    router.back();
  };

  const handleItemsChange = (items: CartItemData[]) => {
    setCartItems(items);
  };

  const totalItems = cartItems.length;
  const checkedItems = cartItems.filter(item => item.checked).length;

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
          <CartList 
            items={cartItems}
            onItemsChange={handleItemsChange}
          />
        </div>
      </div>
    </div>
  );
}