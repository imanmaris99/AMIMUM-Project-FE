"use Client";

import { CartItemType } from "@/types/apiTypes";
import React, { useState } from "react";
import CheckedBox from "../1_elements/CheckedBox";
import EmptyCheckBox from "../1_elements/EmptyCheckBox";
import { editCartActive } from "@/services/apiService";

interface CheckBoxProps {
  cartItem: CartItemType;
}

const CheckBox = ({ cartItem }: CheckBoxProps) => {
  const [isActive, setIsActive] = useState(cartItem.is_active);

  async function handleToggleActivation() {
    const state = !isActive;
    const updatedCartAct = {
      cart: {
        cart_id: cartItem.id,
      },
      activate_update: {
        is_active: state,
      },
    };

    try {
      await editCartActive(updatedCartAct);
      setIsActive(state);
    } catch (error) {
      throw error;
    }
  }

  return (
    <>
      <div className="w-[53px] flex items-center justify-center">
        {isActive === true ? (
          <CheckedBox onClick={handleToggleActivation} />
        ) : (
          <EmptyCheckBox onClick={handleToggleActivation} />
        )}
      </div>
    </>
  );
};

export default CheckBox;
