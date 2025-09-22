import React from "react";

const ProductionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg h-36 flex flex-col items-center justify-center w-24 shadow-md animate-pulse">
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex flex-col justify-center items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      </div>

      <div className="flex flex-col justify-center items-center mt-2 gap-1">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ProductionCardSkeleton;
