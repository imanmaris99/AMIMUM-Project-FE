"use client";

import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';

interface CartWithNotificationProps {
  children: React.ReactNode;
}

const CartWithNotification: React.FC<CartWithNotificationProps> = ({ children }) => {
  const { cartItems } = useCart();
  const { addNotification } = useNotification();

  // Track previous cart length to detect new additions
  useEffect(() => {
    const prevLength = parseInt(localStorage.getItem('cart_prev_length') || '0');
    const currentLength = cartItems.length;
    
    // Only trigger notification if cart actually has items and length increased
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
