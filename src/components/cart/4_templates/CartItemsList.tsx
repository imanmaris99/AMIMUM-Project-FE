import { CartItemType } from "@/types/apiTypes";
import React from "react";
import CartItem from "../3_modules/CartItem";
import CartItemSkeleton from "../3_modules/CartItemSkeleton";

interface CartItemsListProps {
  isLoading: boolean;
  cartList: CartItemType[] | null | undefined;
  onUpdateCart: (updatedItem: CartItemType) => void;
  onRemoveItem: (id: number) => void;
}

const CartItemsList = ({
  isLoading,
  cartList,
  onUpdateCart,
  onRemoveItem,
}: CartItemsListProps) => {
  return (
    <>
      <div className="p-4 pt-[133px]">
        <ol>
          {isLoading
            ? [...Array(3)].map((_, index) => <CartItemSkeleton key={index} />)
            : cartList?.map((cartItem: CartItemType) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  onUpdateCart={onUpdateCart}
                  onRemoveItem={onRemoveItem}
                />
              ))}
        </ol>
      </div>
    </>
  );
};

export default CartItemsList;
