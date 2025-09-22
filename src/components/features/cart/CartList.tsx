"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GiShoppingCart } from "react-icons/gi";
import CartItem from "./CartItem";
import { useCart } from "@/contexts/CartContext";

const CartList: React.FC = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, updateActiveStatus, removeFromCart } = useCart();


  const handleQuantityChange = (cartId: number, quantity: number) => {
    updateQuantity(cartId, quantity);
  };

  const handleCheckChange = (cartId: number, checked: boolean) => {
    updateActiveStatus(cartId, checked);
  };

  const handleDelete = (cartId: number) => {
    removeFromCart(cartId);
  };

  const handleStartShopping = () => {
    router.push('/');
  };

  return (
    <div className="space-y-4">
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <GiShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Kosong</h3>
            <p className="text-gray-500 mb-6">Belum ada produk di keranjang belanja Anda</p>
          </div>
          <button
            onClick={handleStartShopping}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
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
