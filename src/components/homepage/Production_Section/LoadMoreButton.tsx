import React from "react";
import { GoChevronDown } from "react-icons/go";

const LoadMoreButton = ({ onClick, remainingItems }: { onClick: () => void; remainingItems: number }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg h-36 flex flex-col items-center justify-center w-24 shadow-md cursor-pointer border border-dashed border-customGreen5 hover:bg-customGreen5/30 transition"
    tabIndex={0}
    role="button"
    aria-label={`Muat Lainnya (${remainingItems})`}
  >
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="bg-customGreen5 rounded-full w-12 h-12 flex items-center justify-center mb-1">
        <GoChevronDown size={32} className="text-customGreen1" />
      </div>
      <span className="font-jakarta text-xs font-semibold text-center text-customGreen1">Muat Lainnya</span>
      <span className="font-jakarta text-[10px] text-gray-500 text-center">({remainingItems})</span>
    </div>
  </div>
);

export default LoadMoreButton; 