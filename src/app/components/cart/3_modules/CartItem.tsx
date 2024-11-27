"use client";

import React, { useEffect, useState } from "react";
import ProductImage from "../1_elements/ProductImage";
import Button from "../1_elements/Button";
import Heading3 from "../1_elements/Heading3";
import { CartItemType } from "@/types/apiTypes";
import ItemSummary from "../2_widgets/ItemSummary";
import CheckBox from "../2_widgets/CheckBox";

interface CartItemProps {
  cartItem: CartItemType;
  onUpdateCart: (updatedItem: CartItemType) => void;
}

const CartItem = ({ cartItem, onUpdateCart }: CartItemProps) => {
  const [quantity, setQuantity] = useState(cartItem.quantity || 1);

  // useEffect(() => {
  //   onUpdateCart({ ...cartItem, quantity });
  // }, [quantity, cartItem, onUpdateCart]);

  function handleDecrement() {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onUpdateCart({ ...cartItem, quantity: newQty });
    }
  }

  function handleIncrement() {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdateCart({ ...cartItem, quantity: newQty });
  }

  const handleCheckBoxChange = (isChecked: boolean) => {
    onUpdateCart({ ...cartItem, is_active: isChecked });
  };

  return (
    <>
      <li className="flex py-2 items-center">
        <CheckBox cartItem={cartItem} onChange={handleCheckBoxChange} />

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
