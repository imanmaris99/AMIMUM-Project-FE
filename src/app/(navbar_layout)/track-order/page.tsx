"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { TrackOrderList, DeliveryAddress, StatusOrder } from "@/components/track-order";
import { trackOrderDummyData } from "@/data/trackOrderDummyData";
import { TrackOrderItem } from "@/types/trackOrder";
import { useTransaction } from "@/contexts/TransactionContext";

const TrackOrderPage: React.FC = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [trackOrderItems, setTrackOrderItems] = useState<TrackOrderItem[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { transactions } = useTransaction();

  useEffect(() => {
    // Get productId or transactionId from URL parameters
    const productIdParam = searchParams.get("productId");
    const transactionIdParam = searchParams.get("transactionId");
    
    setProductId(productIdParam);
    setTransactionId(transactionIdParam);
    
    // Load track order items
    setTrackOrderItems(trackOrderDummyData.items);
  }, [searchParams]);

  // Get current transaction data
  useEffect(() => {
    if (transactionId) {
      const transaction = transactions.find(t => t.id === transactionId);
      setCurrentTransaction(transaction);
    }
  }, [transactionId, transactions]);

  const handleBack = () => {
    router.back();
  };

  // Get status configuration based on transaction status
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Menunggu Pembayaran',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        };
      case 'completed':
        return {
          text: 'Lunas',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'cancelled':
        return {
          text: 'Batal',
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'refund':
        return {
          text: 'Refund',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  // Get current status index for StatusOrder component
  const getCurrentStatusIndex = (status: string, deliveryType: string) => {
    switch (status) {
      case 'pending':
        return 0; // Menunggu Pembayaran - belum ada yang selesai
      case 'completed':
        // Untuk pickup: max index 2, untuk delivery: max index 3
        return deliveryType === 'pickup' ? 2 : 3;
      case 'cancelled':
        return -1; // Batal - tidak ada yang selesai
      case 'refund':
        return -1; // Refund - tidak ada yang selesai
      default:
        return 0; // Default - belum ada yang selesai
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      {/* Header - Same style as shipment with white background */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex justify-center items-center relative mt-16 py-4">
          <div className="absolute left-10">
            <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
          </div>
          <div className="text-center">
            <h1 className="text-[16px] font-semibold">Track Order</h1>
            <p className="text-xs text-gray-500 mt-1">Lacak status pesanan Anda</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8 px-4">
        {/* Transaction Info (if coming from transaction detail) */}
        {transactionId && currentTransaction && (
          <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Transaksi</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID Transaksi:</span>
                <span className="text-sm font-medium text-gray-900">{currentTransaction.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusConfig(currentTransaction.status).bgColor} ${getStatusConfig(currentTransaction.status).color}`}>
                  {getStatusConfig(currentTransaction.status).text}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Metode:</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentTransaction.deliveryType === 'delivery' ? 'Kirim ke tujuan' : 'Ambil di toko'}
                </span>
              </div>
            </div>
          </div>
        )}
        
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
          <StatusOrder 
            currentStatus={getCurrentStatusIndex(currentTransaction?.status, currentTransaction?.deliveryType)} 
            deliveryType={currentTransaction?.deliveryType}
          />
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
