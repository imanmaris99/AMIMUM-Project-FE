import { CartItemType } from "@/types/apiTypes";
import React from "react";
import CheckedBox from "../1_elements/CheckedBox";
import EmptyCheckBox from "../1_elements/EmptyCheckBox";
import { editCartActive } from "@/services/apiService";

interface CheckBoxProps {
  cartItem: CartItemType;
  onChange: (isChecked: boolean) => void;
}

const CheckBox = ({ cartItem, onChange }: CheckBoxProps) => {
  // const [isLoading, setIsLoading] = useState(false);

  async function handleToggleActivation() {
    // setIsLoading(true);
    const newIsActive = !cartItem.is_active;
    const updatedCartAct = {
      cart: {
        cart_id: cartItem.id,
      },
      activate_update: {
        is_active: newIsActive,
      },
    };

    try {
      onChange(newIsActive);
      await editCartActive(updatedCartAct);
    } catch (error) {
      throw error;
    } finally {
      // setIsLoading(false);
    }
  }

  return (
    <>
      <div className="w-[53px] flex items-center justify-center">
        {/* {isLoading ? (
          "..."
        ) :  */}
        {cartItem.is_active === true ? (
          <CheckedBox onClick={handleToggleActivation} />
        ) : (
          <EmptyCheckBox onClick={handleToggleActivation} />
        )}
      </div>
    </>
  );
};

export default CheckBox;
