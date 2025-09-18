"use client";

import React, { useState } from "react";
import CartItem from "./CartItem";

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

interface CartListProps {
  items?: CartItemData[];
  onItemsChange?: (items: CartItemData[]) => void;
}

const CartList: React.FC<CartListProps> = ({ 
  items = [], 
  onItemsChange 
}) => {
  const [cartItems, setCartItems] = useState<CartItemData[]>(items);

  // Default items jika tidak ada data
  const defaultItems: CartItemData[] = [
    {
      id: "1",
      name: "Buyung Upik",
      variant: "Anggur",
      unit: "1 dus",
      price: 17500,
      image: "/buyungupik_agr-1.svg",
      quantity: 3,
      checked: true,
    }
  ];

  const currentItems = cartItems.length > 0 ? cartItems : defaultItems;

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedItems = currentItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const handleCheckChange = (id: string, checked: boolean) => {
    const updatedItems = currentItems.map(item =>
      item.id === id ? { ...item, checked } : item
    );
    setCartItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const handleDelete = (id: string) => {
    const updatedItems = currentItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const totalItems = currentItems.length;
  const checkedItems = currentItems.filter(item => item.checked).length;

  return (
    <div className="space-y-4">
      {currentItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Keranjang kosong</p>
          <p className="text-sm text-gray-400">Tambahkan produk untuk memulai belanja</p>
        </div>
      ) : (
        currentItems.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            variant={item.variant}
            unit={item.unit}
            price={item.price}
            image={item.image}
            initialQuantity={item.quantity}
            initialChecked={item.checked}
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
