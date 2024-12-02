"use client";

import CartUI from "@/app/components/cart/5_pages/CartUI";
import {
  recalculateCartTotals,
  removeCartItem,
  toggleSelectAll,
  updateCartItem,
} from "@/helper/cart";
import { useCart } from "@/hooks/useCart";
import { editCartAllActive } from "@/services/apiService";
import { CartItemType, CartResponseType } from "@/types/apiTypes";

import React, { useEffect, useState } from "react";

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  // const [isSelectAllLoading, setIsSelectAllLoading] = useState(false);
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
    // setIsSelectAllLoading(true);
    const newSelectAll = !selectAll;
    try {
      const updatedCartList = toggleSelectAll(cartResponse.data, newSelectAll);
      const newTotals = recalculateCartTotals(updatedCartList);
      setCartResponse({
        ...cartResponse,
        data: updatedCartList,
        total_prices: newTotals,
      });
      setSelectAll(newSelectAll);
      await editCartAllActive({ is_active: newSelectAll });
    } catch (error) {
      throw error;
    } finally {
      // setIsSelectAllLoading(false);
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartResponse((prev) => {
      const updatedCartData = removeCartItem(prev.data, id);
      return {
        ...prev,
        data: updatedCartData,
        total_prices: recalculateCartTotals(updatedCartData),
      };
    });
  };

  return (
    <>
      <CartUI
        cartResponse={cartResponse}
        isCartListLoading={isCartListLoading}
        selectAll={selectAll}
        onToggleAllActivation={handleToggleAllActivation}
        onUpdateCart={handleUpdateCart}
        // isSelectAllLoading={isSelectAllLoading}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
};

export default Cart;
