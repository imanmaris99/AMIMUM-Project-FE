"use client";

import React, { useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';

interface CartWithNotificationProps {
  children: React.ReactNode;
}

const CartWithNotification: React.FC<CartWithNotificationProps> = ({ children }) => {
  const { cartItems } = useCart();
  const { addNotification } = useNotification();
  const isFirstRender = useRef(true);

  // Track previous cart length to detect new additions
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const prevLength = parseInt(localStorage.getItem('cart_prev_length') || '0');
    const currentLength = cartItems.length;
    
    // Skip first render to avoid triggering on initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      localStorage.setItem('cart_prev_length', currentLength.toString());
      return;
    }
    
    // Only trigger notification if:
    // 1. Cart has items
    // 2. Length actually increased (new item added)
    // 3. Not the first render (to avoid triggering on refresh)
    if (currentLength > 0 && currentLength > prevLength) {
      // New item was added to cart
      addNotification("cart");
    }
    
    // Update stored length
    localStorage.setItem('cart_prev_length', currentLength.toString());
    
    // Clean up if cart is empty
    if (currentLength === 0) {
      localStorage.removeItem('cart_prev_length');
    }
  }, [cartItems.length, addNotification]);

  return <>{children}</>;
};

export default CartWithNotification;
