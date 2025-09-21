"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TrackOrderList, DeliveryAddress, StatusOrder } from "@/components/track-order";
import { trackOrderDummyData } from "@/data/trackOrderDummyData";
import { TrackOrderItem } from "@/types/trackOrder";
import { useTransaction } from "@/contexts/TransactionContext";
import UnifiedHeader from "@/components/common/UnifiedHeader";

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
    
    // If no specific transaction, show all active transactions
    if (!transactionIdParam && transactions.length > 0) {
      // Convert transactions to track order items
      const allTrackItems: TrackOrderItem[] = [];
      transactions.forEach(transaction => {
        transaction.items.forEach(item => {
          allTrackItems.push({
            id: `${transaction.id}-${item.productId}`,
            name: item.name,
            variant: 'Default',
            size: 'Standard',
            quantity: item.quantity,
            price: item.price,
            image: item.image
          });
        });
      });
      setTrackOrderItems(allTrackItems);
    } else if (transactionIdParam) {
      // Load specific transaction items
      const transaction = transactions.find(t => t.id === transactionIdParam);
      if (transaction) {
        const trackItems: TrackOrderItem[] = transaction.items.map(item => ({
          id: `${transaction.id}-${item.productId}`,
          name: item.name,
          variant: 'Default',
          size: 'Standard',
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }));
        setTrackOrderItems(trackItems);
      }
    } else {
      // No transactions available
      setTrackOrderItems([]);
    }
  }, [searchParams, transactions]);

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
    <div className="min-h-screen bg-gray-100">
      {/* Unified Header */}
      <UnifiedHeader 
        type="secondary"
        title="Track Order"
        subtitle="Lacak status pesanan Anda"
        showBackButton={true}
        onBack={handleBack}
      />

      {/* Content */}
      <div className="flex flex-col justify-center items-center gap-4 py-8 px-4">
        {/* No Transactions Message */}
        {transactions.length === 0 ? (
          <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Transaksi</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Anda belum memiliki transaksi untuk dilacak. Mulai belanja untuk melihat status pesanan di sini.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Mulai Belanja
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        {/* Only show details if there are transactions */}
        {transactions.length > 0 && (
          <>
            {/* Border Separator */}
            <div className="w-full max-w-sm py-2 border-b-2 border-gray-300"></div>
            
            {/* Delivery Address */}
            <div className="w-full max-w-sm">
              <DeliveryAddress 
                orderDate={currentTransaction?.date || new Date().toLocaleDateString('id-ID', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                paymentStatus={currentTransaction ? getStatusConfig(currentTransaction.status).text : 'Tidak ada transaksi'}
                trackingNumber={currentTransaction?.shipmentId || 'Belum tersedia'}
              />
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
          </>
        )}
        
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
