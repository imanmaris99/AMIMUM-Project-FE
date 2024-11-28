import React from "react";
import TopNavigation from "@/app/components/cart/2_widgets/TopNavigation";
import BackArrow from "@/app/components/cart/1_elements/BackArrow";
import Heading1 from "@/app/components/cart/1_elements/Heading1";
import Heading2 from "@/app/components/cart/1_elements/Heading2";
import CartItemsList from "@/app/components/cart/4_templates/CartItemsList";
import CartSummaryBox from "@/app/components/cart/2_widgets/CartSummaryBox";
import CartSummary from "@/app/components/cart/3_modules/CartSummary";
import Button from "@/app/components/cart/1_elements/Button";
import BottomBar from "@/app/components/cart/2_widgets/BottomBar";
import Image from "next/image";
import { CartResponseType, CartItemType } from "@/types/apiTypes";

interface CartUIProps {
  cartResponse: CartResponseType;
  isCartListLoading: boolean;
  selectAll: boolean;
  onToggleAllActivation: () => void;
  onUpdateCart: (updatedItem: CartItemType) => void;
  isSelectAllLoading: boolean;
  onRemoveItem: (id: number) => void;
}

const CartUI: React.FC<CartUIProps> = ({
  cartResponse,
  isCartListLoading,
  selectAll,
  onToggleAllActivation,
  onUpdateCart,
  isSelectAllLoading,
  onRemoveItem,
}) => {
  return (
    <div className="mx-auto min-x-[360px] max-w-[400px] relative">
      <TopNavigation>
        <BackArrow />
        <Heading1>Keranjangku</Heading1>
        <div className="w-1/3"></div>
      </TopNavigation>

      <CartItemsList
        isLoading={isCartListLoading}
        cartList={cartResponse.data}
        onUpdateCart={onUpdateCart}
        onRemoveItem={onRemoveItem}
      />

      <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] pb-80 px-6">
        {isCartListLoading ? (
          <CartSummaryBox className="flex items-center justify-center">
            Loading...
          </CartSummaryBox>
        ) : (
          <CartSummary cartResponse={cartResponse} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white mx-auto max-w-[400px] rounded-t-3xl">
        <div className="flex gap-6 items-center justify-between mt-6 shadow-2xl pt-4 pb-8 px-[30px] flex-grow">
          <div className="flex items-center gap-2">
            {isSelectAllLoading ? (
              "..."
            ) : (
              <Image
                src={selectAll ? "/cart/checkedbox.svg" : "/cart/checkbox.svg"}
                alt="Select All"
                width={24}
                height={24}
                onClick={onToggleAllActivation}
                className="cursor-pointer"
              />
            )}
            <Heading2 className="text-[#C4C4C4]">All Item</Heading2>
          </div>
          <Button className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full">
            Checkout (
            {isCartListLoading
              ? "..."
              : cartResponse.data.filter((item) => item.is_active).length}
            )
          </Button>
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default CartUI;
