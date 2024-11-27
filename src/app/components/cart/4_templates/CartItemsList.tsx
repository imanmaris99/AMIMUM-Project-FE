import { CartItemType } from "@/types/apiTypes";
import React from "react";
import CartItem from "../3_modules/CartItem";

interface CartItemsListProps {
  isLoading: boolean;
  cartList: CartItemType[] | null | undefined;
  onUpdateCart: (updatedItem: CartItemType) => void;
}

const CartItemsList = ({
  isLoading,
  cartList,
  onUpdateCart,
}: CartItemsListProps) => {
  return (
    <>
      <div className="p-4 pt-[106px]">
        <ol>
          {isLoading
            ? "Loading..."
            : cartList?.map((cartItem: CartItemType) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  onUpdateCart={onUpdateCart}
                />
              ))}
        </ol>
      </div>
    </>
  );
};

export default CartItemsList;
