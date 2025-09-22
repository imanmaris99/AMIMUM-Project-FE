"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { debounce } from "@/lib/performance";
import { ErrorHandler } from "@/lib/errorHandler";
import { validateDetailProductData, validateVariantData, validateCartItemData } from "@/utils/dataValidation";

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
        if (Array.isArray(parsedCart)) {
          // Fix and validate each cart item before loading
          const fixedCartItems = parsedCart.map(item => {
            // Fix missing discounted_price field
            if (item.variant_info && typeof item.variant_info.discounted_price !== 'number') {
              const discount = item.variant_info.discount || 0;
              const discountedPrice = discount > 0 
                ? Math.round(item.product_price * (1 - discount / 100))
                : item.product_price;
              
              item.variant_info.discounted_price = discountedPrice;
              console.log(`Fixed cart item ${item.product_name}: calculated discounted_price = ${discountedPrice}`);
            }
            return item;
          });
          
          // Validate each fixed cart item
          const validCartItems = fixedCartItems.filter(item => validateCartItemData(item));
          if (validCartItems.length !== parsedCart.length) {
            ErrorHandler.handleError(new Error('Some cart items are invalid and were removed'), 'CartLoad');
          }
          setCartItems(validCartItems);
        }
      } catch (error) {
        ErrorHandler.handleError(error, 'CartLoad');
        // Clear corrupted cart data
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Debounced save to localStorage to prevent excessive writes
  const debouncedSave = useMemo(
    () => debounce((items: CartItemType[]) => {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        ErrorHandler.handleError(error, 'CartSave');
      }
    }, 300),
    []
  );

  // Save cart to localStorage whenever it changes (including when empty)
  useEffect(() => {
    debouncedSave(cartItems);
  }, [cartItems, debouncedSave]);

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
    // Comprehensive data validation
    if (!product || !variant) {
      ErrorHandler.handleError(new Error('Product or variant is required'), 'CartAdd');
      return;
    }

    // Validate product data structure
    if (!validateDetailProductData(product)) {
      ErrorHandler.handleError(new Error('Invalid product data structure'), 'CartAdd');
      return;
    }

    // Validate variant data structure
    if (!validateVariantData(variant)) {
      ErrorHandler.handleError(new Error('Invalid variant data structure'), 'CartAdd');
      return;
    }

    // Validate required fields
    if (!product.id || !variant.id) {
      ErrorHandler.handleError(new Error('Product ID or variant ID is missing'), 'CartAdd');
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
        const productPrice = product.price || 0;
        const discount = variant.discount || 0;
        const discountedPrice = variant.discounted_price || 
          (discount > 0 ? Math.round(productPrice * (1 - discount / 100)) : productPrice);
        
        const newCartItem: CartItemType = {
          id: generateCartId(),
          product_id: product.id,
          product_name: product.name,
          product_price: productPrice,
          variant_id: variant.id,
          variant_info: {
            id: variant.id,
            variant: variant.variant || "",
            name: variant.name || "",
            img: variant.img || "",
            discount: discount,
            discounted_price: discountedPrice,
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
      // Immediately save to localStorage when removing items
      try {
        localStorage.setItem('cart', JSON.stringify(updatedItems));
      } catch (error) {
        ErrorHandler.handleError(error, 'CartRemove');
      }
      return updatedItems;
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((cartId: number, quantity: number) => {
    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
      ErrorHandler.handleError(new Error('Invalid quantity: must be between 1 and 999'), 'CartUpdate');
      return;
    }
    
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
    // Immediately clear localStorage
    try {
      localStorage.removeItem('cart');
    } catch (error) {
      ErrorHandler.handleError(error, 'CartClear');
    }
  }, []);

  // Clear all items (alias for clearCart)
  const clearAll = useCallback(() => {
    setCartItems([]);
    // Immediately clear localStorage
    try {
      localStorage.removeItem('cart');
    } catch (error) {
      ErrorHandler.handleError(error, 'CartClearAll');
    }
  }, []);

  // Remove only active items from cart (for checkout)
  const removeActiveItems = useCallback(() => {
    setCartItems(prevItems => prevItems.filter(item => !item.is_active));
  }, []);

  // Check if item is in cart
  const isInCart = useCallback((productId: string, variantId: number) => {
    return cartItems.some(item => item.product_id === productId && item.variant_id === variantId);
  }, [cartItems]);

  // Memoized calculations to prevent unnecessary re-renders
  const totalItems = useMemo(() => cartItems.length, [cartItems.length]);
  const totalPrices = useMemo(() => calculateTotalPrices(cartItems), [cartItems]);

  // Memoized context value to prevent unnecessary re-renders
  const value: CartContextType = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
