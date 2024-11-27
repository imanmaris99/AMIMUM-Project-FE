"use Client";

import { CartItemType } from "@/types/apiTypes";
import React, { useState } from "react";
import CheckedBox from "../1_elements/CheckedBox";
import EmptyCheckBox from "../1_elements/EmptyCheckBox";

interface CheckBoxProps {
  cartItem: CartItemType;
}

const CheckBox = ({ cartItem }: CheckBoxProps) => {
  const [select, setSelect] = useState(true);
  return (
    <>
      <div className="w-[53px] flex items-center justify-center">
        {select === true ? (
          <CheckedBox onClick={() => setSelect((prev) => !prev)} />
        ) : (
          <EmptyCheckBox onClick={() => setSelect((prev) => !prev)} />
        )}
      </div>
    </>
  );
};

export default CheckBox;
