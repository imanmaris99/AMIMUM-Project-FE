"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { TrackOrderList, DeliveryAddress, StatusOrder } from "@/components/track-order";
import { trackOrderDummyData } from "@/data/trackOrderDummyData";
import { TrackOrderItem } from "@/types/trackOrder";

const TrackOrderPage: React.FC = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [trackOrderItems, setTrackOrderItems] = useState<TrackOrderItem[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get productId from URL parameters
    const productIdParam = searchParams.get("productId");
    setProductId(productIdParam);
    
    // Load track order items
    setTrackOrderItems(trackOrderDummyData.items);
  }, [searchParams]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      {/* Header - Same style as shipment */}
      <div className="flex justify-center items-center relative mt-16">
        <div className="absolute left-10">
          <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
        </div>
        <div className="text-center">
          <h1 className="text-[16px] font-semibold">Track Order</h1>
          <p className="text-xs text-gray-500 mt-1">Lacak status pesanan Anda</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8 px-4">
        {/* Track Order Items */}
        <div className="w-full max-w-sm">
          <TrackOrderList 
            items={trackOrderItems}
          />
        </div>
        
        {/* Border Separator */}
        <div className="w-full max-w-sm py-2 border-b-2 border-gray-300"></div>
        
        {/* Delivery Address */}
        <div className="w-full max-w-sm">
          <DeliveryAddress />
        </div>
        
        {/* Border Separator */}
        <div className="w-full max-w-sm py-2 border-b-2 border-gray-300"></div>
        
        {/* Status Order */}
        <div className="w-full max-w-sm">
          <StatusOrder currentStatus={1} />
        </div>
        
        {/* Product ID Info (if available) */}
        {productId && (
          <div className="bg-gray-50 p-4 rounded-lg w-full max-w-sm mt-4">
            <p className="text-gray-600 mb-2">
              Product ID: <span className="font-semibold">{productId}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Total Items: {trackOrderItems.length}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-center items-center mt-auto mb-10">
        <div className="flex justify-center items-center gap-1">
          <span className="text-xs font-bold text-black">©2025</span>
          <span className="text-xs text-gray-500">by</span>
          <span className="text-xs font-bold text-primary">Amimum Team.</span>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
