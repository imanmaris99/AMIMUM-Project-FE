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
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 p-3 shadow-sm transition-colors hover:bg-emerald-50/60">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        {/* Product Name */}
        <h3 className="truncate text-sm font-semibold text-[#0D0E09]">
          {item.name}
        </h3>
        
        {/* Detail Section: Variant, Size, and Qty with bullet point separators */}
        <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5">
          <span className="text-xs text-[#7D8B84]">
            {item.variant}
          </span>
          <span className="mx-1 text-xs text-emerald-200">•</span>
          <span className="text-xs text-[#7D8B84]">
            Pengiriman: {item.size}
          </span>
          <span className="mx-1 text-xs text-emerald-200">•</span>
          <span className="text-xs text-[#7D8B84]">
            Qty: {item.quantity}
          </span>
        </div>
        
        {/* Price */}
        <p className="mt-2 text-sm font-bold text-[#001F14]">
          {rupiahFormater(item.price)}
        </p>
      </div>
    </div>
  );
};

export default TrackOrderItem;
