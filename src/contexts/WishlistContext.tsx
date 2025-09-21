"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '@/types/wishlist';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  clearAll: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: any) => void;
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
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: any) => {
    try {
      if (!product.id || !product.name) {
        console.error("Invalid product data for wishlist:", product);
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
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = (productId: string) => {
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

  const toggleWishlist = (product: any) => {
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
