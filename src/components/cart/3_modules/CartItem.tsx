"use client";

import React, { useState } from "react";
import ProductImage from "../1_elements/ProductImage";
import Button from "../1_elements/Button";
import Heading3 from "../1_elements/Heading3";
import { CartItemType } from "@/interfaces/home";
import ItemSummary from "../2_widgets/ItemSummary";
import CheckBox from "../2_widgets/CheckBox";
import { editCartQty } from "@/lib/api/cart";

interface CartItemProps {
  cartItem: CartItemType;
  onUpdateCart: (updatedItem: CartItemType) => void;
  onRemoveItem: (id: number) => void;
}

const CartItem = ({ cartItem, onUpdateCart, onRemoveItem }: CartItemProps) => {
  const [quantity, setQuantity] = useState(cartItem.quantity || 1);

  async function handleDecrement() {
    if (quantity > 1) {
      try {
        const newQty = quantity - 1;
        setQuantity(newQty);
        onUpdateCart({ ...cartItem, quantity: newQty });
        await editCartQty({
          cart: {
            cart_id: cartItem.id,
          },
          quantity_update: {
            quantity: newQty,
          },
        });
      } catch (error) {
        throw error;
      }
    }
  }

  async function handleIncrement() {
    try {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onUpdateCart({ ...cartItem, quantity: newQty });
      await editCartQty({
        cart: {
          cart_id: cartItem.id,
        },
        quantity_update: {
          quantity: newQty,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  const handleCheckBoxChange = (isChecked: boolean) => {
    onUpdateCart({ ...cartItem, is_active: isChecked });
  };

  return (
    <>
      <li className="flex py-2 items-center">
        <CheckBox cartItem={cartItem} onChange={handleCheckBoxChange} />

        <ProductImage src={cartItem.variant_info.img} />

        <ItemSummary onRemoveItem={onRemoveItem} cartItem={cartItem}>
          <Button
            onClick={handleDecrement}
            className="text-[#C4C4C4] w-5 h-5 flex items-center justify-center pb-0 border"
          >
            -
          </Button>

          <Heading3 className="pt-0.5 w-[26px] h-5 text-center border">
            {quantity}
          </Heading3>

          <Button
            onClick={handleIncrement}
            className="text-[#C4C4C4] w-5 h-5 flex items-center justify-center pb-0.5 border"
          >
            +
          </Button>
        </ItemSummary>
      </li>
    </>
  );
};

export default CartItem;
