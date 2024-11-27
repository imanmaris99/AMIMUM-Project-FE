import { CartItemType, CartResponseType } from "@/types/apiTypes";
import React from "react";
import CartItem from "../3_modules/CartItem";

interface CartItemsListProps {
  isLoading: boolean;
  cartResponse: CartResponseType | null | undefined;
}

const CartItemsList = ({ isLoading, cartResponse }: CartItemsListProps) => {
  return (
    <>
      <div className="p-4 pt-[106px]">
        <ol>
          {isLoading
            ? "Loading..."
            : cartResponse?.data.map((cartItem: CartItemType) => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
        </ol>
      </div>
    </>
  );
};

export default CartItemsList;
