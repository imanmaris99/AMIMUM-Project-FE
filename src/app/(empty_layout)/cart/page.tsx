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
import { useTotalCartItems } from "@/hooks/useTotalCartItems";
import Image from "next/image";

import React, { useState } from "react";

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const {
    cart: cartResponse,
    isLoading: isCartListLoading,
    isError: isCartListError,
  } = useCart();
  const {
    totalCartItems,
    isLoading: isTotalCartItemsLoading,
    isError: isTotalCartItemsError,
  } = useTotalCartItems();

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
          cartResponse={cartResponse}
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
              {isTotalCartItemsLoading
                ? "..."
                : totalCartItems?.data.total_items}
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
