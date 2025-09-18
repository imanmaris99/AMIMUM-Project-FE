"use client";

import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { useCart } from "@/contexts/CartContext";

const CartList: React.FC = () => {
  const { cartItems, updateQuantity, updateActiveStatus, removeFromCart } = useCart();

  useEffect(() => {
    console.log("🛒 CartList: useEffect - Cart items changed:", cartItems.length, "items");
    console.log("🛒 CartList: useEffect - Cart items:", cartItems);
  }, [cartItems]);

  console.log("🛒 CartList: Rendering with", cartItems.length, "items");
  console.log("🛒 CartList: Cart items:", cartItems);

  const handleQuantityChange = (cartId: number, quantity: number) => {
    updateQuantity(cartId, quantity);
  };

  const handleCheckChange = (cartId: number, checked: boolean) => {
    updateActiveStatus(cartId, checked);
  };

  const handleDelete = (cartId: number) => {
    removeFromCart(cartId);
  };

  return (
    <div className="space-y-4">
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Keranjang kosong</p>
          <p className="text-sm text-gray-400">Tambahkan produk untuk memulai belanja</p>
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
