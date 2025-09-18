"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItemType, CartTotalPricesType } from "@/types/apiTypes";

interface CartContextType {
  cartItems: CartItemType[];
  totalPrices: CartTotalPricesType;
  addToCart: (product: any, variant?: any) => void;
  removeFromCart: (cartId: number) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  toggleActive: (cartId: number) => void;
  selectAllItems: (selected: boolean) => void;
  isInCart: (productId: string, variantId?: number) => boolean;
  getCartItemCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // Calculate total prices based on active items
  const calculateTotalPrices = (items: CartItemType[]): CartTotalPricesType => {
    const activeItems = items.filter(item => item.is_active);
    
    const allItemActivePrices = activeItems.reduce((total, item) => {
      const discountedPrice = item.variant_info.discount > 0 
        ? item.product_price * (1 - item.variant_info.discount / 100)
        : item.product_price;
      return total + (discountedPrice * item.quantity);
    }, 0);

    const allPromoActivePrices = activeItems.reduce((total, item) => {
      if (item.variant_info.discount > 0) {
        const originalPrice = item.product_price * item.quantity;
        const discountedPrice = item.product_price * (1 - item.variant_info.discount / 100) * item.quantity;
        return total + (originalPrice - discountedPrice);
      }
      return total;
    }, 0);

    return {
      all_item_active_prices: allItemActivePrices,
      all_promo_active_prices: allPromoActivePrices,
      total_all_active_prices: allItemActivePrices
    };
  };

  const totalPrices = calculateTotalPrices(cartItems);

  const addToCart = (product: any, variant?: any) => {
    try {
      const variantToUse = variant || product.all_variants?.[0];
      
      if (!variantToUse) {
        console.error("No variant available for product:", product);
        return;
      }

      if (!product.name || !product.price) {
        console.error("Invalid product data:", product);
        return;
      }

      const existingItemIndex = cartItems.findIndex(
        item => item.product_name === product.name && 
                item.variant_info.variant === variantToUse.variant
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
        console.log(`Updated quantity for ${product.name} ${variantToUse.variant}`);
      } else {
        // Add new item to cart
        const newCartItem: CartItemType = {
          id: Math.floor(Math.random() * 1000000) + 1, // Better ID generation
          product_name: product.name,
          product_price: product.price,
          variant_info: {
            id: variantToUse.id,
            variant: variantToUse.variant,
            name: variantToUse.name,
            img: variantToUse.img,
            discount: variantToUse.discount
          },
          quantity: 1,
          is_active: true,
          created_at: new Date().toISOString()
        };

        setCartItems(prev => [...prev, newCartItem]);
        console.log(`Added to cart: ${product.name} ${variantToUse.variant}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = (cartId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== cartId));
  };

  const updateQuantity = (cartId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === cartId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleActive = (cartId: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === cartId 
          ? { ...item, is_active: !item.is_active }
          : item
      )
    );
  };

  const selectAllItems = (selected: boolean) => {
    setCartItems(prev => 
      prev.map(item => ({ ...item, is_active: selected }))
    );
  };

  const isInCart = (productId: string, variantId?: number) => {
    return cartItems.some(item => 
      item.product_name === productId && 
      (!variantId || item.variant_info.id === variantId)
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value: CartContextType = {
    cartItems,
    totalPrices,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleActive,
    selectAllItems,
    isInCart,
    getCartItemCount,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
