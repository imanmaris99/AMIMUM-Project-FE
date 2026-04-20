"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { WishlistItem } from '@/types/wishlist';
import { validateWishlistItemData } from '@/utils/dataValidation';
import { ErrorHandler } from '@/lib/errorHandler';
import { SessionManager } from '@/lib/auth';
import {
  addWishlistProduct,
  deleteWishlistProduct,
  getMyWishlistProducts,
} from '@/services/api/wishlist';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (wishlistIdOrProductId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItem) => Promise<void>;
  refreshWishlist: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const PRODUCT_ID_CACHE_KEY = 'wishlist_product_id_map';

  const getProductIdCache = useCallback((): Record<string, string> => {
    try {
      const stored = localStorage.getItem(PRODUCT_ID_CACHE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  const saveProductIdCache = useCallback((cache: Record<string, string>) => {
    localStorage.setItem(PRODUCT_ID_CACHE_KEY, JSON.stringify(cache));
  }, []);

  const mapApiWishlistToItem = useCallback((
    item: Awaited<ReturnType<typeof getMyWishlistProducts>>["data"][number]
  ): WishlistItem => {
    const primaryVariant = item.product_variant?.[0];
    const productIdCache = getProductIdCache();
    return {
      id: item.id.toString(),
      wishlistId: item.id,
      productId: productIdCache[item.id.toString()],
      name: item.product_name,
      variant: primaryVariant?.variant || 'Varian tidak tersedia',
      quantity: 1,
      price: primaryVariant?.discounted_price || 0,
      image: primaryVariant?.img || "/default-image.jpg",
      addedAt: item.created_at,
      originalPrice: primaryVariant?.discount && primaryVariant.discount > 0
        ? Math.round(primaryVariant.discounted_price / (1 - primaryVariant.discount / 100))
        : primaryVariant?.discounted_price || 0,
      discount: primaryVariant?.discount || 0,
    };
  }, [getProductIdCache]);

  const refreshWishlist = useCallback(async () => {
    if (!SessionManager.isAuthenticated()) {
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getMyWishlistProducts();
      const mappedItems = response.data.map(mapApiWishlistToItem);
      setWishlistItems(mappedItems.filter((item) => validateWishlistItemData(item)));
    } catch (error) {
      ErrorHandler.handleError(error, 'WishlistLoad');
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [mapApiWishlistToItem]);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const addToWishlist = async (product: WishlistItem) => {
    try {
      if (!product || !product.productId) {
        ErrorHandler.handleError(new Error('Product ID is required'), 'WishlistAdd');
        return;
      }

      if (!SessionManager.isAuthenticated()) {
        throw new Error('Login diperlukan untuk menambahkan wishlist.');
      }

      if (!validateWishlistItemData(product)) {
        ErrorHandler.handleError(new Error('Invalid wishlist item data structure'), 'WishlistAdd');
        return;
      }

      const response = await addWishlistProduct(product.productId);
      const wishlistId = response.data.id;

      if (wishlistId !== undefined) {
        const cache = getProductIdCache();
        cache[wishlistId.toString()] = product.productId;
        saveProductIdCache(cache);
      }

      await refreshWishlist();
    } catch (error) {
      ErrorHandler.handleError(error, 'WishlistAdd');
      throw error;
    }
  };

  const removeFromWishlist = async (wishlistIdOrProductId: string) => {
    if (!wishlistIdOrProductId || typeof wishlistIdOrProductId !== 'string') {
      ErrorHandler.handleError(new Error('Invalid wishlist identifier'), 'WishlistRemove');
      return;
    }

    try {
      if (!SessionManager.isAuthenticated()) {
        throw new Error('Login diperlukan untuk mengubah wishlist.');
      }

      const targetItem = wishlistItems.find(
        (item) =>
          item.id === wishlistIdOrProductId ||
          item.productId === wishlistIdOrProductId
      );

      if (!targetItem?.wishlistId) {
        throw new Error(
          'Wishlist ID tidak tersedia dari backend. Item ini tidak dapat dihapus dengan aman.'
        );
      }

      await deleteWishlistProduct(targetItem.wishlistId);
      const cache = getProductIdCache();
      delete cache[targetItem.wishlistId.toString()];
      saveProductIdCache(cache);
      await refreshWishlist();
    } catch (error) {
      ErrorHandler.handleError(error, 'WishlistRemove');
      throw error;
    }
  };

  const clearAll = async () => {
    if (!SessionManager.isAuthenticated()) {
      setWishlistItems([]);
      saveProductIdCache({});
      return;
    }

    for (const item of wishlistItems) {
      if (item.wishlistId) {
        await deleteWishlistProduct(item.wishlistId);
      }
    }

    saveProductIdCache({});
    await refreshWishlist();
  };

  const isInWishlist = (productId: string, variantId?: number) => {
    if (!productId) {
      return false;
    }

    if (variantId) {
      return wishlistItems.some(
        (item) =>
          item.productId === productId && item.id.includes(`-${variantId}`)
      );
    }

    return wishlistItems.some((item) => item.productId === productId);
  };

  const toggleWishlist = async (product: WishlistItem) => {
    if (!product || !product.productId) {
      ErrorHandler.handleError(new Error('Invalid product for wishlist toggle'), 'WishlistToggle');
      return;
    }
    
    if (isInWishlist(product.productId)) {
      await removeFromWishlist(product.productId);
    } else {
      await addToWishlist(product);
    }
  };

  const value: WishlistContextType = {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearAll,
    isInWishlist,
    toggleWishlist,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
