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
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500 text-center">
          Belum ada item untuk dilacak
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="shadow-md border-0 rounded-lg">
          <TrackOrderItem
            item={item}
          />
        </div>
      ))}
    </div>
  );
};

export default TrackOrderList;
