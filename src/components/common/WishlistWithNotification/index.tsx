"use client";

import React, { useEffect } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNotification } from '@/contexts/NotificationContext';

interface WishlistWithNotificationProps {
  children: React.ReactNode;
}

const WishlistWithNotification: React.FC<WishlistWithNotificationProps> = ({ children }) => {
  const { wishlistItems } = useWishlist();
  const { addNotification } = useNotification();

  // Track previous wishlist length to detect new additions
  useEffect(() => {
    // Skip if wishlistItems is still loading (empty array on initial load)
    if (wishlistItems.length === 0) {
      return;
    }

    const prevLength = parseInt(localStorage.getItem('wishlist_prev_length') || '0');
    const currentLength = wishlistItems.length;
    
    // Only trigger notification if:
    // 1. Wishlist has items
    // 2. Length actually increased (not just initial load)
    // 3. Previous length was not 0 (to avoid triggering on first load)
    if (currentLength > 0 && currentLength > prevLength && prevLength > 0) {
      // New item was added
      addNotification("wishlist");
    }
    
    // Update stored length
    localStorage.setItem('wishlist_prev_length', currentLength.toString());
    
    // Clean up if wishlist is empty
    if (currentLength === 0) {
      localStorage.removeItem('wishlist_prev_length');
    }
  }, [wishlistItems.length, addNotification]);

  return <>{children}</>;
};

export default WishlistWithNotification;
