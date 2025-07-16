import React from "react";
import TopNavigation from "@/components/cart/2_widgets/TopNavigation";
import Heading2 from "@/components/cart/1_elements/Heading2";
import CartItemsList from "@/components/cart/4_templates/CartItemsList";
import CartSummary from "@/components/cart/3_modules/CartSummary";
import Button from "@/components/cart/1_elements/Button";
import BottomBar from "@/components/cart/2_widgets/BottomBar";
import { CartResponseType } from "@/types/apiTypes";
import CartSummarySkeleton from "../3_modules/CartSummarySkeleton";
import Spinner from "@/components/ui/Spinner";

interface CartUIProps {
  cartResponse: CartResponseType;
  errorMessage?: string | null;
}

const CartUI: React.FC<CartUIProps> = ({ cartResponse, errorMessage }) => {
  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }
  if (!cartResponse) {
    // Tambahkan fungsi dummy agar CartItemsList tidak error jika dipakai
    const noop = () => {};
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner className="mb-4" />
        <p className="text-gray-600 text-base">Memuat data keranjang...</p>
      </div>
    );
  }
  return (
    <div className="mx-auto min-x-[360px] max-w-[400px] relative">
      <TopNavigation>Keranjangku</TopNavigation>
      <CartItemsList
        isLoading={false}
        cartList={cartResponse.data}
        onUpdateCart={() => {}}
        onRemoveItem={() => {}}
      />
      <div className="h-[200px] pt-10 bg-color-[#FAFAFA] border-t-4 border-[#E6F1ED] pb-80 px-6">
        <CartSummary cartResponse={cartResponse} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white mx-auto max-w-[400px] w-full rounded-t-3xl">
        <div className="flex gap-6 items-center justify-between mt-6 shadow-2xl pt-4 pb-8 px-[30px] flex-grow">
          <Heading2 className="text-[#C4C4C4]">All Item</Heading2>
          <Button className="bg-[#00764F] text-[#E6F1ED] py-2 px-4 rounded-full">
            Checkout
          </Button>
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default CartUI;
