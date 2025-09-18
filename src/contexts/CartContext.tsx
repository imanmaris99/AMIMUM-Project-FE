"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";

// Cart Item Type sesuai dengan backend DTO
export interface CartItemType {
  id: number;
  product_id: string;
  product_name: string;
  product_price: number;
  variant_id: number;
  variant_info: {
    id: number;
    variant: string;
    name: string;
    img: string;
    discount: number;
    discounted_price: number;
  };
  quantity: number;
  is_active: boolean;
  created_at: string;
}

// Cart Total Prices Type sesuai dengan backend DTO
export interface CartTotalPricesType {
  all_item_active_prices: number;
  all_promo_active_prices: number;
  total_all_active_prices: number;
}

// Cart Response Type sesuai dengan backend DTO
export interface CartResponseType {
  status_code: number;
  message: string;
  data: CartItemType[];
  total_prices: CartTotalPricesType;
}

interface CartContextType {
  cartItems: CartItemType[];
  totalItems: number;
  totalPrices: CartTotalPricesType;
  addToCart: (product: DetailProductType, variant: VariantProductType) => void;
  removeFromCart: (cartId: number) => void;
  updateQuantity: (cartId: number, quantity: number) => void;
  updateActiveStatus: (cartId: number, isActive: boolean) => void;
  clearCart: () => void;
  isInCart: (productId: string, variantId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // Generate unique cart ID
  const generateCartId = useCallback(() => {
    return Date.now() + Math.floor(Math.random() * 1000);
  }, []);

  // Calculate total prices
  const calculateTotalPrices = useCallback((items: CartItemType[]): CartTotalPricesType => {
    const activeItems = items.filter(item => item.is_active);
    
    let allItemActivePrices = 0;
    let allPromoActivePrices = 0;

    activeItems.forEach(item => {
      const itemTotal = item.product_price * item.quantity;
      allItemActivePrices += itemTotal;
      
      if (item.variant_info.discount > 0) {
        const discountedPrice = item.variant_info.discounted_price * item.quantity;
        allPromoActivePrices += discountedPrice;
      }
    });

    return {
      all_item_active_prices: allItemActivePrices,
      all_promo_active_prices: allPromoActivePrices,
      total_all_active_prices: allItemActivePrices - allPromoActivePrices,
    };
  }, []);

  // Add to cart
  const addToCart = useCallback((product: DetailProductType, variant: VariantProductType) => {
    console.log("🛒 CartContext: Adding to cart");
    console.log("📦 Product received:", product);
    console.log("🎯 Variant received:", variant);

    // Validate required data
    if (!product || !variant) {
      console.error("❌ Missing product or variant data");
      return;
    }

    if (!product.id || !variant.id) {
      console.error("❌ Missing product.id or variant.id");
      return;
    }

    setCartItems(prevItems => {
      console.log("🛒 Current cart items before add:", prevItems.length);

      const existingItemIndex = prevItems.findIndex(
        item => item.product_id === product.id && item.variant_id === variant.id
      );

      console.log("🔍 Existing item index:", existingItemIndex);

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        console.log("🔄 Updated existing item quantity:", updatedItems[existingItemIndex]);
        console.log("🛒 Updated cart items after quantity update:", updatedItems.length);
        return updatedItems;
      } else {
        // Add new item
        const newCartItem: CartItemType = {
          id: generateCartId(),
          product_id: product.id,
          product_name: product.name,
          product_price: product.price || 0,
          variant_id: variant.id,
          variant_info: {
            id: variant.id,
            variant: variant.variant || "",
            name: variant.name || "",
            img: variant.img || "",
            discount: variant.discount || 0,
            discounted_price: variant.discounted_price || 0,
          },
          quantity: 1,
          is_active: true,
          created_at: new Date().toISOString(),
        };

        console.log("🆕 New cart item created:", newCartItem);

        const updatedItems = [...prevItems, newCartItem];
        console.log("🛒 Updated cart items after add:", updatedItems.length);
        console.log("🛒 All cart items:", updatedItems);
        return updatedItems;
      }
    });
  }, [generateCartId]);

  // Remove from cart
  const removeFromCart = useCallback((cartId: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== cartId);
      console.log("🗑️ Removed item from cart:", cartId);
      return updatedItems;
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((cartId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === cartId ? { ...item, quantity } : item
      );
      console.log("📊 Updated quantity for item:", cartId, "to", quantity);
      return updatedItems;
    });
  }, []);

  // Update active status
  const updateActiveStatus = useCallback((cartId: number, isActive: boolean) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === cartId ? { ...item, is_active: isActive } : item
      );
      console.log("✅ Updated active status for item:", cartId, "to", isActive);
      return updatedItems;
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    console.log("🧹 Cart cleared");
  }, []);

  // Check if item is in cart
  const isInCart = useCallback((productId: string, variantId: number) => {
    return cartItems.some(item => item.product_id === productId && item.variant_id === variantId);
  }, [cartItems]);

  // Calculate totals
  const totalItems = cartItems.length;
  const totalPrices = calculateTotalPrices(cartItems);

  const value: CartContextType = {
    cartItems,
    totalItems,
    totalPrices,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateActiveStatus,
    clearCart,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
