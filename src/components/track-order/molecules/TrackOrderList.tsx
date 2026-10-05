"use client";

import React from "react";
import TrackOrderItem from "../atoms/TrackOrderItem";
import { TrackOrderItem as TrackOrderItemType } from "@/types/trackOrder";

interface TrackOrderListProps {
  items: TrackOrderItemType[];
}

const TrackOrderList: React.FC<TrackOrderListProps> = ({ 
  items
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white/90 py-10 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <p className="text-center text-sm text-[#7D8B84]">
          Belum ada item untuk dilacak
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl">
          <TrackOrderItem
            item={item}
          />
        </div>
      ))}
    </div>
  );
};

export default TrackOrderList;
