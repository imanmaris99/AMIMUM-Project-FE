import React from "react";
import CartSummaryBox from "../2_widgets/CartSummaryBox";
import Heading1 from "../1_elements/Heading1";
import { CartResponseType } from "@/interfaces/home";

interface CartSummaryProps {
  cartResponse: CartResponseType | null;
}

const CartSummary = ({ cartResponse }: CartSummaryProps) => {
  return (
    <>
      <CartSummaryBox>
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
      </CartSummaryBox>
    </>
  );
};

export default CartSummary;
