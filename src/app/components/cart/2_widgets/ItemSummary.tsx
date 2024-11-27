import React, { ReactNode } from "react";
import Heading2 from "../1_elements/Heading2";
import Heading3 from "../1_elements/Heading3";
import Heading1 from "../1_elements/Heading1";
import { CartItemType } from "@/types/apiTypes";

interface ItemSummaryProps {
  children: ReactNode;
  cartItem: CartItemType;
}

const ItemSummary = ({ children, cartItem }: ItemSummaryProps) => {
  return (
    <div className="flex flex-col flex-grow pr-3.5">
      <Heading2>{cartItem.product_name}</Heading2>
      <Heading3 className="text-[#C4C4C4] mb-3">
        {cartItem.variant_info.variant} • {cartItem.variant_info.name}
      </Heading3>
      <div className="flex w-full justify-between items-center">
        <Heading1>Rp {cartItem.product_price}</Heading1>
        <div className="flex items-center mr-0 gap-2">{children}</div>
      </div>
    </div>
  );
};

export default ItemSummary;
