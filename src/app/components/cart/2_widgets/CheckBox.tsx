import { CartItemType } from "@/types/apiTypes";
import React from "react";
import CheckedBox from "../1_elements/CheckedBox";
import EmptyCheckBox from "../1_elements/EmptyCheckBox";

interface CheckBoxProps {
  cartItem: CartItemType;
}

const CheckBox = ({ cartItem }: CheckBoxProps) => {
  return (
    <>
      <div className="w-[53px] flex items-center justify-center">
        {cartItem.is_active === true ? <CheckedBox /> : <EmptyCheckBox />}
      </div>
    </>
  );
};

export default CheckBox;
