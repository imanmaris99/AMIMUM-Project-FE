import React, { ReactNode } from "react";

interface CartSummaryBoxProps {
  children: ReactNode;
  className?: string;
}

const CartSummaryBox = ({ children, className }: CartSummaryBoxProps) => {
  return (
    <>
      <div
        className={`${className} h-[160px] bg-white shadow-2xl rounded-3xl p-6`}
      >
        {children}
      </div>
    </>
  );
};

export default CartSummaryBox;
