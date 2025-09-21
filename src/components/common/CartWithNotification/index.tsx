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
    
    if (currentLength > prevLength) {
      // New item was added to cart
      addNotification("cart");
    }
    
    // Update stored length
    localStorage.setItem('cart_prev_length', currentLength.toString());
  }, [cartItems.length, addNotification]);

  return <>{children}</>;
};

export default CartWithNotification;
