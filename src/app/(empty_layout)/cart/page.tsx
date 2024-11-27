"use client";

import BackArrow from "@/app/components/cart/1_elements/BackArrow";
import Heading1 from "@/app/components/cart/1_elements/Heading1";
import TopNavigation from "@/app/components/cart/2_widgets/TopNavigation";
import CartItem from "@/app/components/cart/3_modules/CartItem";
import { useCart } from "@/hooks/useCart";
import { CartItemType } from "@/types/apiTypes";
import Image from "next/image";

import React from "react";

const Cart = () => {
  const { cart: cartResponse, isLoading, isError } = useCart();

  return (
    <>
      <div className="mx-auto min-x-[360px] max-w-[400px] relative">
        <TopNavigation>
          <BackArrow />
          <Heading1>Keranjangku</Heading1>
          <div className="w-1/3"></div>
        </TopNavigation>

        <div className="p-4 pt-[106px]">
          <ol>
            {isLoading
              ? "Loading..."
              : cartResponse?.data.map((cartItem: CartItemType) => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))}
          </ol>
        </div>
        <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] pb-80 px-6">
          {isLoading ? (
            <div className="h-[160px] bg-white shadow-2xl rounded-3xl p-6 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <div className="h-[160px] bg-white shadow-2xl rounded-3xl p-6">
              <div className="flex justify-between items-center border-b-2 border-[#F2F2F2] py-1">
                <Heading1 className="text-[#999999]">Items</Heading1>
                <Heading1>
                  Rp {cartResponse?.total_prices.all_item_active_prices}
                </Heading1>
              </div>
              <div className="flex justify-between items-center border-b-2 border-[#F2F2F2] py-1">
                <Heading1 className="text-[#999999]">Discounts</Heading1>
                <Heading1>
                  -Rp {cartResponse?.total_prices.all_promo_active_prices}
                </Heading1>
              </div>
              <div className="flex justify-between items-center py-5">
                <Heading1 className="text-[#999999] font-bold">Total</Heading1>
                <Heading1 className="font-bold">
                  Rp {cartResponse?.total_prices.total_all_active_prices}
                </Heading1>
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white mx-auto max-w-[400px] rounded-t-3xl">
          <div className="flex gap-6 items-center justify-between mt-6 shadow-2xl py-4 px-[30px] flex-grow">
            <div className="flex items-center gap-2">
              <Image src={"/cart/checkbox.svg"} alt="" width={24} height={24} />
              <h3 className="text-sm text-[#C4C4C4]">All Item</h3>
            </div>
            <button className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full">
              Checkout (3)
            </button>
          </div>
          <div className="h-5 bg-white flex justify-center">
            <Image src={"/cart/taskbar.svg"} alt="" width={134} height={5} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
