"use client";

import React from "react";
import Image from "next/image";
import { TrackOrderItem as TrackOrderItemType } from "@/types/trackOrder";
import rupiahFormater from "@/utils/rupiahFormater";

interface TrackOrderItemProps {
  item: TrackOrderItemType;
}

const TrackOrderItem: React.FC<TrackOrderItemProps> = ({ 
  item
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 border-b border-gray-200 hover:bg-gray-200 transition-colors">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-[#0D0E09] truncate -mb-1">
          {item.name}
        </h3>
        
        {/* Detail Section: Variant, Size, and Qty with bullet point separators */}
        <div className="mb-3">
          <span className="text-xs text-[#C4C4C4]">
            {item.variant}
          </span>
          <span className="text-xs text-[#C4C4C4] mx-2">•</span>
          <span className="text-xs text-[#C4C4C4]">
            Size: {item.size}
          </span>
          <span className="text-xs text-[#C4C4C4] mx-2">•</span>
          <span className="text-xs text-[#C4C4C4]">
            Qty: {item.quantity}
          </span>
        </div>
        
        {/* Price */}
        <p className="text-sm font-bold text-[#001F14]">
          {rupiahFormater(item.price)}
        </p>
      </div>
    </div>
  );
};

export default TrackOrderItem;
