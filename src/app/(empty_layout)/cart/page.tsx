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
import { useCart } from "@/hooks/useCart";
import { CartItemType, CartResponseType } from "@/types/apiTypes";
import Image from "next/image";

import React, { useEffect, useState } from "react";

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [cartList, setCartList] = useState<CartItemType[]>([]);
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
  const {
    cart,
    isLoading: isCartListLoading,
    isError: isCartListError,
  } = useCart();

  useEffect(() => {
    async function getCart() {
      if (cart) {
        setCartList(cart.data);
        setCartResponse(cart);
      }
    }
    getCart();
  }, [cart]);

  useEffect(() => {
    setCartList((prev) =>
      prev.map((item) => ({
        ...item,
        is_active: selectAll,
      }))
    );
    setCartResponse((prev) => ({
      ...prev,
      data: prev.data.map((item) => ({
        ...item,
        is_active: selectAll,
      })),
    }));
  }, [selectAll]);

  const handleUpdateCart = (updatedItem: CartItemType) => {
    setCartResponse((prev) => {
      const updatedData = prev.data.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
      const all_item_active_prices = updatedData
        .filter((item) => item.is_active)
        .reduce((sum, item) => sum + item.product_price * item.quantity, 0);
      const all_promo_active_prices = updatedData
        .filter((item) => item.is_active && item.variant_info.discount)
        .reduce(
          (sum, item) =>
            sum +
            (item.variant_info.discount / 100) *
              item.product_price *
              item.quantity,
          0
        );
      const total_all_active_prices =
        all_item_active_prices - all_promo_active_prices;

      return {
        ...prev,
        data: updatedData,
        total_prices: {
          all_item_active_prices,
          all_promo_active_prices,
          total_all_active_prices,
        },
      };
    });
    setCartList((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      )
    );
  };

  return (
    <>
      <div className="mx-auto min-x-[360px] max-w-[400px] relative">
        <TopNavigation>
          <BackArrow />
          <Heading1>Keranjangku</Heading1>
          <div className="w-1/3"></div>
        </TopNavigation>

        <CartItemsList
          isLoading={isCartListLoading}
          cartList={cartList}
          onUpdateCart={handleUpdateCart}
        />

        <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] pb-80 px-6">
          {isCartListLoading ? (
            <CartSummaryBox className="flex items-center justify-center">
              Loading...
            </CartSummaryBox>
          ) : (
            <>
              <CartSummary cartResponse={cartResponse} />
            </>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white mx-auto max-w-[400px] rounded-t-3xl">
          <div className="flex gap-6 items-center justify-between mt-6 shadow-2xl pt-4 pb-8 px-[30px] flex-grow">
            <div className="flex items-center gap-2">
              {selectAll ? (
                <Image
                  src={"/cart/checkedbox.svg"}
                  alt=""
                  width={24}
                  height={24}
                  onClick={() => setSelectAll((prev) => !prev)}
                  className="cursor-pointer"
                />
              ) : (
                <Image
                  src={"/cart/checkbox.svg"}
                  alt=""
                  width={24}
                  height={24}
                  onClick={() => setSelectAll((prev) => !prev)}
                  className="cursor-pointer"
                />
              )}
              <Heading2 className="text-[#C4C4C4]">All Item</Heading2>
            </div>
            <Button className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full">
              Checkout (
              {isCartListLoading
                ? "..."
                : cartList?.filter((item) => item.is_active === true).length}
              )
            </Button>
          </div>
          <BottomBar />
        </div>
      </div>
    </>
  );
};

export default Cart;
