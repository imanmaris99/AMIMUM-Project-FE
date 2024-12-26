import React from "react";
import CartSummaryBox from "../2_widgets/CartSummaryBox";
import Heading1 from "../1_elements/Heading1";

const CartSummarySkeleton = () => {
  return (
    <>
      <CartSummaryBox>
        <div className="flex justify-between items-center border-b-2 border-[#F2F2F2] py-1">
          <Heading1 className="text-[#999999]">Items</Heading1>
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center border-b-2 border-[#F2F2F2] py-1">
          <Heading1 className="text-[#999999]">Discounts</Heading1>
          <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center py-5">
          <Heading1 className="text-[#999999] font-bold">Total</Heading1>
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </CartSummaryBox>
    </>
  );
};

export default CartSummarySkeleton;
