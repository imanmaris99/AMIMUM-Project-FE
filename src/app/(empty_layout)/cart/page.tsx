"use client";

import BackArrow from "@/app/components/cart/1_elements/BackArrow";
import Button from "@/app/components/cart/1_elements/Button";
import Heading1 from "@/app/components/cart/1_elements/Heading1";
import Heading2 from "@/app/components/cart/1_elements/Heading2";
import BottomBar from "@/app/components/cart/2_widgets/BottomBar";
import CartSummaryBox from "@/app/components/cart/2_widgets/CartSummaryBox";
import TopNavigation from "@/app/components/cart/2_widgets/TopNavigation";
import CartSummary from "@/app/components/cart/3_modules/CartSummary";
import CartItemsList from "@/app/components/cart/4_templates/CartItemsList";
import CartUI from "@/app/components/cart/5_pages/Cart";
import {
  recalculateCartTotals,
  toggleSelectAll,
  updateCartItem,
} from "@/helper/cart";
import { useCart } from "@/hooks/useCart";
import { editCartAllActive } from "@/services/apiService";
import { CartItemType, CartResponseType } from "@/types/apiTypes";
import Image from "next/image";

import React, { useEffect, useState } from "react";

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [cartResponse, setCartResponse] = useState<CartResponseType>({
    status_code: 0,
    message: "",
    data: [],
    total_prices: {
      all_item_active_prices: 0,
      all_promo_active_prices: 0,
      total_all_active_prices: 0,
    },
  });
  const { cart, isLoading: isCartListLoading } = useCart();

  useEffect(() => {
    if (cart) {
      const totals = recalculateCartTotals(cart.data);
      setCartResponse({ ...cart, total_prices: totals });
    }
  }, [cart]);

  const handleUpdateCart = (updatedItem: CartItemType) => {
    setCartResponse((prev) => {
      const updatedCartData = updateCartItem(prev.data, updatedItem);
      return {
        ...prev,
        data: updatedCartData,
        total_prices: recalculateCartTotals(updatedCartData),
      };
    });
  };

  const handleToggleAllActivation = async () => {
    const newSelectAll = !selectAll;
    try {
      await editCartAllActive({ is_active: newSelectAll });
      const updatedCartList = toggleSelectAll(cartResponse.data, newSelectAll);
      const newTotals = recalculateCartTotals(updatedCartList);
      setCartResponse({
        ...cartResponse,
        data: updatedCartList,
        total_prices: newTotals,
      });
      setSelectAll(newSelectAll);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <CartUI
        cartResponse={cartResponse}
        isCartListLoading={isCartListLoading}
        selectAll={selectAll}
        onToggleAllActivation={handleToggleAllActivation}
        onUpdateCart={handleUpdateCart}
      />
    </>
  );
};

export default Cart;
