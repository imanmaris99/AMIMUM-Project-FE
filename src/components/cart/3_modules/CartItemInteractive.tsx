"use client";

import React from "react";
import { CartItemType } from "@/types/apiTypes";
import { useCart } from "@/contexts/CartContext";

interface CartItemInteractiveProps {
  cartItem: CartItemType;
}

const CartItemInteractive: React.FC<CartItemInteractiveProps> = ({ cartItem }) => {
  const { updateQuantity, toggleActive, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartItem.id);
    } else {
      updateQuantity(cartItem.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(cartItem.quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(cartItem.quantity - 1);
  };

  const handleToggleActive = () => {
    toggleActive(cartItem.id);
  };

  const handleRemove = () => {
    removeFromCart(cartItem.id);
  };

  const hasDiscount = cartItem.variant_info.discount > 0;
  const discountedPrice = hasDiscount 
    ? cartItem.product_price * (1 - cartItem.variant_info.discount / 100)
    : cartItem.product_price;

  return (
    <div className="border p-4 mb-4 rounded-lg">
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <input 
          type="checkbox" 
          checked={cartItem.is_active}
          onChange={handleToggleActive}
          className="w-4 h-4 text-[#00764F] focus:ring-[#00764F] border-gray-300 rounded"
        />
        
        {/* Product Image */}
        <img 
          src={cartItem.variant_info.img} 
          alt={cartItem.product_name}
          className="w-16 h-16 object-cover rounded"
        />
        
        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{cartItem.product_name}</h3>
          <p className="text-xs text-gray-500">Variant: {cartItem.variant_info.variant}</p>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={handleDecrement}
              className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-sm">{cartItem.quantity}</span>
            <button 
              onClick={handleIncrement}
              className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Price and Actions */}
        <div className="text-right">
          {/* Price Display */}
          <div className="space-y-1">
            {hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-red-500">
                    Rp {Math.round(discountedPrice * cartItem.quantity).toLocaleString('id-ID')}
                  </p>
                  <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-[10px] font-bold">
                    -{cartItem.variant_info.discount}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-through">
                  Rp {(cartItem.product_price * cartItem.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-[#001F14]">
                Rp {(cartItem.product_price * cartItem.quantity).toLocaleString('id-ID')}
              </p>
            )}
          </div>
          
          {/* Remove Button */}
          <button 
            onClick={handleRemove}
            className="text-red-500 text-xs mt-2 hover:text-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemInteractive;
