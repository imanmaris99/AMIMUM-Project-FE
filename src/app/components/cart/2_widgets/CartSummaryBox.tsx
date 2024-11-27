import React, { ReactNode } from "react";

interface CartSummaryBoxProps {
  children: ReactNode;
}

const CartSummaryBox = ({ children }: CartSummaryBoxProps) => {
  return (
    <>
      <div className="h-[160px] bg-white shadow-2xl rounded-3xl p-6">
        {children}
      </div>
    </>
  );
};

export default CartSummaryBox;
