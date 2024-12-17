import React from "react";
import TopNavigation from "@/components/cart/2_widgets/TopNavigation";
import Heading2 from "@/components/cart/1_elements/Heading2";
import CartItemsList from "@/components/cart/4_templates/CartItemsList";
import CartSummary from "@/components/cart/3_modules/CartSummary";
import Button from "@/components/cart/1_elements/Button";
import BottomBar from "@/components/cart/2_widgets/BottomBar";
import { CartResponseType, CartItemType } from "@/types/apiTypes";
import CartSummarySkeleton from "../3_modules/CartSummarySkeleton";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CartUIProps {
  cartResponse: CartResponseType;
  isCartListLoading: boolean;
  selectAll: boolean;
  onToggleAllActivation: (checked: boolean) => void;
  onUpdateCart: (updatedItem: CartItemType) => void;
  onRemoveItem: (id: number) => void;
}

const CartUI: React.FC<CartUIProps> = ({
  cartResponse,
  isCartListLoading,
  selectAll,
  onToggleAllActivation,
  onUpdateCart,
  onRemoveItem,
}) => {
  const router = useRouter();
  return (
    <div className="mx-auto min-x-[360px] max-w-[400px] relative">
      <TopNavigation>Keranjangku</TopNavigation>

      <CartItemsList
        isLoading={isCartListLoading}
        cartList={cartResponse.data}
        onUpdateCart={onUpdateCart}
        onRemoveItem={onRemoveItem}
      />

      <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] pb-80 px-6">
        {isCartListLoading ? (
          <CartSummarySkeleton />
        ) : (
          <CartSummary cartResponse={cartResponse} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white mx-auto max-w-[400px] w-full rounded-t-3xl">
        <div className="flex gap-6 items-center justify-between mt-6 shadow-2xl pt-4 pb-8 px-[30px] flex-grow">
          <div className="flex items-center gap-2">
            
            <Checkbox
              checked={selectAll}
              onCheckedChange={onToggleAllActivation}
              disabled={isCartListLoading}
              className={cn(
                "h-5 w-5 border-2",
                "bg-white",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "cursor-pointer",
                "border-black",
                "data-[state=checked]:bg-white data-[state=checked]:border-primary",
                "data-[state=checked]:text-primary",
                isCartListLoading && "border-gray-300 data-[state=checked]:border-gray-300 data-[state=checked]:text-gray-300 cursor-not-allowed"
              )}
            />
            <Heading2 className="text-[#C4C4C4]">All Item</Heading2>
          </div>
          {isCartListLoading ? (
            <Button
              disabled={true}
              className="bg-gray-400 text-[#E6F1ED] py-2 px-4 rounded-full"
            >
              Checkout (...)
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/order")}
              className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full"
            >
              Checkout (
              {cartResponse.data.filter((item) => item.is_active).length})
            </Button>
          )}
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default CartUI;
