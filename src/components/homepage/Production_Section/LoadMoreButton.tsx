import React from "react";
import { GoChevronDown } from "react-icons/go";

const LoadMoreButton = ({ onClick, remainingItems }: { onClick: () => void; remainingItems: number }) => (
  <div
    className="flex flex-col justify-center items-center bg-customGreen5 rounded-lg gap-4 p-2 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-center items-center bg-white rounded-full w-12 h-12">
      <GoChevronDown size={32} />
    </div>
    <div>
      <button className="text-sm">
        Muat Lainnya ({remainingItems})
      </button>
    </div>
  </div>
);

export default LoadMoreButton; 