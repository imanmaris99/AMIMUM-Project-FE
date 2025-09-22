"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '@/types/wishlist';
import { validateProductData, validateWishlistItemData } from '@/utils/dataValidation';
import { ErrorHandler } from '@/lib/errorHandler';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearAll: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          // Validate each wishlist item before loading
          const validWishlistItems = parsedWishlist.filter(item => validateWishlistItemData(item));
          if (validWishlistItems.length !== parsedWishlist.length) {
            ErrorHandler.handleError(new Error('Some wishlist items are invalid and were removed'), 'WishlistLoad');
          }
          setWishlistItems(validWishlistItems);
        }
      } catch (error) {
        ErrorHandler.handleError(error, 'WishlistLoad');
        // Clear corrupted wishlist data
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: WishlistItem) => {
    try {
      // Comprehensive data validation
      if (!product) {
        ErrorHandler.handleError(new Error('Product is required'), 'WishlistAdd');
        return;
      }

      // Validate product data structure
      if (!validateProductData(product)) {
        ErrorHandler.handleError(new Error('Invalid product data structure'), 'WishlistAdd');
        return;
      }

      // Validate required fields
      if (!product.id || !product.name) {
        ErrorHandler.handleError(new Error('Product ID or name is missing'), 'WishlistAdd');
        return;
      }

      // Get the first variant or use default variant
      const firstVariant = product.all_variants?.[0];
      const variantName = firstVariant?.variant || firstVariant?.name || "Anggur";
      
      // Create unique ID that includes variant to allow multiple variants of same product
      const variantId = firstVariant?.id || 1;
      const uniqueId = `${product.id}-${variantId}`;
      
      // Calculate pricing info
      const hasDiscount = firstVariant?.discount && firstVariant.discount > 0;
      const discountedPrice = firstVariant?.discounted_price || (hasDiscount ? product.price * (1 - firstVariant.discount / 100) : product.price);
      const finalPrice = hasDiscount ? discountedPrice : product.price;
      
      const wishlistItem: WishlistItem = {
        id: `wish-${uniqueId}`,
        productId: product.id,
        name: product.name,
        price: finalPrice,
        image: firstVariant?.img || "/buyungupik_agr-1.svg",
        variant: variantName,
        quantity: "1 dus",
        addedAt: new Date().toISOString(),
        brand: product.brand_info?.name || "Unknown Brand",
        originalPrice: hasDiscount ? product.price : undefined,
        discount: firstVariant?.discount || undefined
      };

      setWishlistItems(prev => {
        // Check if this specific variant already exists
        const exists = prev.some(item => item.id === wishlistItem.id);
        if (exists) {
          return prev;
        }
        
        return [...prev, wishlistItem];
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'WishlistAdd');
    }
  };

  const removeFromWishlist = (productId: string) => {
    // Validate product ID
    if (!productId || typeof productId !== 'string') {
      ErrorHandler.handleError(new Error('Invalid product ID'), 'WishlistRemove');
      return;
    }
    
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearAll = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (productId: string, variantId?: number) => {
    if (variantId) {
      // Check specific variant
      return wishlistItems.some(item => 
        item.productId === productId && item.id.includes(`-${variantId}`)
      );
    }
    // Check if any variant of the product exists
    return wishlistItems.some(item => item.productId === productId);
  };

  const toggleWishlist = (product: WishlistItem) => {
    // Validate product before toggle
    if (!product || !product.id) {
      ErrorHandler.handleError(new Error('Invalid product for wishlist toggle'), 'WishlistToggle');
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearAll,
    isInWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
