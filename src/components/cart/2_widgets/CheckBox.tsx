import { CartItemType } from "@/interfaces/cart";
import React from "react";
import { editCartActive } from "@/lib/api/cart";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckBoxProps {
  cartItem: CartItemType;
  onChange: (isChecked: boolean) => void;
}

const CheckBox = ({ cartItem, onChange }: CheckBoxProps) => {
  async function handleToggleActivation(checked: boolean) {
    const newIsActive = checked;
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
    }
  }

  return (
    <div className="w-[53px] flex items-center justify-center">
      <Checkbox
        checked={cartItem.is_active}
        onCheckedChange={handleToggleActivation}
        className={cn(
          "h-5 w-5 border-2",
          "bg-white",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "cursor-pointer",
          "border-black",
          "data-[state=checked]:bg-white data-[state=checked]:border-primary",
          "data-[state=checked]:text-primary"
        )}
      />
    </div>
  );
};

export default CheckBox;
