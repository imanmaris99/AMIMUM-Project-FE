"use client";

import React, { ReactNode, useState } from "react";
import Heading2 from "../1_elements/Heading2";
import Heading3 from "../1_elements/Heading3";
import Heading1 from "../1_elements/Heading1";
import { CartItemType } from "@/types/apiTypes";
import Image from "next/image";
import { deleteCartItem } from "@/services/apiService";

interface ItemSummaryProps {
  children: ReactNode;
  cartItem: CartItemType;
  onRemoveItem: (id: number) => void;
}

const ItemSummary = ({
  children,
  cartItem,
  onRemoveItem,
}: ItemSummaryProps) => {
  // const [removeIsLoading, setRemoveIsLoading] = useState(false);
  const handleRemoveItem = async () => {
    // setRemoveIsLoading(true);
    try {
      onRemoveItem(cartItem.id);
      await deleteCartItem({ cart_id: cartItem.id });
    } catch (error) {
      throw error;
    } finally {
      // setRemoveIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-grow pr-3.5">
      <div className="flex items-center justify-between">
        <div>
          <Heading2>{cartItem.product_name}</Heading2>
          <Heading3 className="text-[#C4C4C4] mb-3">
            {cartItem.variant_info.variant} • {cartItem.variant_info.name}
          </Heading3>
        </div>
        {/* {removeIsLoading ? (
          <p className="mr-3 pb-2">...</p>
        ) : ( */}
        <Image
          src={"/cart/trash.svg"}
          alt="Trash icon"
          width={17}
          height={20}
          className="mr-3 pb-2 cursor-pointer"
          onClick={handleRemoveItem}
        />
        {/* )} */}
      </div>
      <div className="flex w-full justify-between items-center">
        <Heading1>Rp {cartItem.product_price}</Heading1>
        <div className="flex items-center mr-0">{children}</div>
      </div>
    </div>
  );
};

export default ItemSummary;
