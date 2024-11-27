"use client";

import React, { useState } from "react";
import ProductImage from "../1_elements/ProductImage";
import Button from "../1_elements/Button";
import Heading3 from "../1_elements/Heading3";
import { CartItemType } from "@/types/apiTypes";
import ItemSummary from "../2_widgets/ItemSummary";
import CheckBox from "../2_widgets/CheckBox";

interface CartItemProps {
  cartItem: CartItemType;
}

const CartItem = ({ cartItem }: CartItemProps) => {
  const [quantity, setQuantity] = useState(1);

  function handleDecrement() {
    if (quantity >= 2) setQuantity((prev) => prev - 1);
  }

  function handleIncrement() {
    setQuantity((prev) => prev + 1);
  }
  return (
    <>
      <li className="flex py-2 items-center">
        <CheckBox cartItem={cartItem} />

        <ProductImage src={cartItem.variant_info.img} />

        <ItemSummary cartItem={cartItem}>
          <Button onClick={handleDecrement} className="text-[#C4C4C4]">
            -
          </Button>

          <Heading3 className="pt-0.5">{quantity}</Heading3>

          <Button onClick={handleIncrement} className="text-[#C4C4C4]">
            +
          </Button>
        </ItemSummary>
      </li>
    </>
  );
};

export default CartItem;
