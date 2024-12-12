import React, { ReactNode } from "react";
import Heading2 from "../1_elements/Heading2";
import Heading3 from "../1_elements/Heading3";
import Heading1 from "../1_elements/Heading1";
import { CartItemType } from "@/types/apiTypes";
import { deleteCartItem } from "@/services/apiService";
import { FaRegTrashCan } from "react-icons/fa6";

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
  const handleRemoveItem = async () => {
    try {
      onRemoveItem(cartItem.id);
      await deleteCartItem({ cart_id: cartItem.id });
    } catch (error) {
      throw error;
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
        <FaRegTrashCan className="text-3xl pb-2 cursor-pointer" onClick={handleRemoveItem} />
      </div>
      <div className="flex w-full justify-between items-center">
        <Heading1>Rp {cartItem.product_price}</Heading1>
        <div className="flex items-center mr-0">{children}</div>
      </div>
    </div>
  );
};

export default ItemSummary;
