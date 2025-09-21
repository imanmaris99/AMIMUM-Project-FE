"use client";

import React, { useEffect, useRef } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNotification } from '@/contexts/NotificationContext';

interface WishlistWithNotificationProps {
  children: React.ReactNode;
}

const WishlistWithNotification: React.FC<WishlistWithNotificationProps> = ({ children }) => {
  const { wishlistItems } = useWishlist();
  const { addNotification } = useNotification();
  const isFirstRender = useRef(true);

  // Track previous wishlist length to detect new additions
  useEffect(() => {
    const prevLength = parseInt(localStorage.getItem('wishlist_prev_length') || '0');
    const currentLength = wishlistItems.length;
    
    // Skip first render to avoid triggering on initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      localStorage.setItem('wishlist_prev_length', currentLength.toString());
      return;
    }
    
    // Only trigger notification if:
    // 1. Wishlist has items
    // 2. Length actually increased
    if (currentLength > 0 && currentLength > prevLength) {
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
