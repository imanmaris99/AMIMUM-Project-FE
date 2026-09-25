"use client";

import React, { useEffect } from "react";
import { useNotification } from "@/contexts/NotificationContext";

interface CartWithNotificationProps {
  children: React.ReactNode;
}

const CartWithNotification: React.FC<CartWithNotificationProps> = ({ children }) => {
  const { resetNotification } = useNotification();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem("cart_prev_length");
    resetNotification("cart");
  }, [resetNotification]);

  return <>{children}</>;
};

export default CartWithNotification;
