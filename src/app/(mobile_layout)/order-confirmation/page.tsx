"use client";

import React from "react";
import OrderConfirmation from "@/components/order/OrderConfirmation";
import LoginProtection from "@/components/common/LoginProtection";

export default function OrderConfirmationPage() {
  return (
    <LoginProtection useModal={true} feature="general">
      <OrderConfirmation />
    </LoginProtection>
  );
}
