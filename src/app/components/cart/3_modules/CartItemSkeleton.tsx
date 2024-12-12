import React from "react";
import { cn } from "@/lib/utils";
import Button from "../1_elements/Button";
import Heading3 from "../1_elements/Heading3";
import { Checkbox } from "@radix-ui/react-checkbox";
import { FaRegTrashCan } from "react-icons/fa6";

const CartItemSkeleton = () => {
  return (
    <li className="flex py-2 items-center">
      <div className="w-[53px] flex items-center justify-center">
      <Checkbox
        className={cn(
          "h-5 w-5 border-2",
          "bg-white",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "cursor-pointer",
          "data-[state=checked]:bg-white data-[state=checked]:border-primary",
          "data-[state=checked]:text-primary"
        )}
      />
      </div>
      <div className="w-[100px]">
        <div className="w-[100px] h-[100px] rounded animate-pulse flex items-center justify-center">
          <div className="w-16 h-[88px] bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col flex-grow pr-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-[14px] w-24 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
          </div>
          <FaRegTrashCan className="text-3xl pb-2 cursor-pointer" />
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
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
