import React from "react";
import Image from "next/image";
import EmptyCheckBox from "../1_elements/EmptyCheckBox";
import Button from "../1_elements/Button";
import Heading3 from "../1_elements/Heading3";

const CartItemSkeleton = () => {
  return (
    <li className="flex py-2 items-center">
      <div className="w-[53px] flex items-center justify-center">
        <EmptyCheckBox />
      </div>
      <div className="w-[100px]">
        <div className="w-[100px] h-[100px] rounded animate-pulse flex items-center justify-center">
          <div className="w-16 h-[88px] bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col flex-grow pr-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-[14px] w-24 bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-20 bg-gray-200 animate-pulse mb-3"></div>
          </div>
          <Image
            src={"/cart/trash.svg"}
            alt=""
            width={16}
            height={20}
            className="mr-3 pb-2"
          />
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="h-4 w-16 bg-gray-300 animate-pulse"></div>
          <div className="flex items-center mr-0">
            <Button className="text-[#C4C4C4] w-5 h-5 flex items-center justify-center pb-0 border">
              -
            </Button>

            <Heading3 className="pt-0.5 w-[26px] h-5 text-center border">
              0
            </Heading3>

            <Button className="text-[#C4C4C4] w-5 h-5 flex items-center justify-center pb-0.5 border">
              +
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItemSkeleton;
