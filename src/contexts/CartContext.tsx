"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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
  clearAll: () => void; // Alias for clearCart
  removeActiveItems: () => void;
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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
      } else {
        // If no discount, use original price
        allPromoActivePrices += itemTotal;
      }
    });

    return {
      all_item_active_prices: allItemActivePrices,
      all_promo_active_prices: allPromoActivePrices,
      total_all_active_prices: allPromoActivePrices, // Total after discounts
    };
  }, []);

  // Add to cart
  const addToCart = useCallback((product: DetailProductType, variant: VariantProductType) => {

    // Validate required data
    if (!product || !variant) {
      return;
    }

    if (!product.id || !variant.id) {
      return;
    }

    setCartItems(prevItems => {

      const existingItemIndex = prevItems.findIndex(
        item => item.product_id === product.id && item.variant_id === variant.id
      );


      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
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


        const updatedItems = [...prevItems, newCartItem];
        return updatedItems;
      }
    });
  }, [generateCartId]);

  // Remove from cart
  const removeFromCart = useCallback((cartId: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== cartId);
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
      return updatedItems;
    });
  }, []);

  // Update active status
  const updateActiveStatus = useCallback((cartId: number, isActive: boolean) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === cartId ? { ...item, is_active: isActive } : item
      );
      return updatedItems;
    });
  }, []);


  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Clear all items (alias for clearCart)
  const clearAll = useCallback(() => {
    setCartItems([]);
  }, []);

  // Remove only active items from cart (for checkout)
  const removeActiveItems = useCallback(() => {
    setCartItems(prevItems => prevItems.filter(item => !item.is_active));
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
    clearAll,
    removeActiveItems,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
