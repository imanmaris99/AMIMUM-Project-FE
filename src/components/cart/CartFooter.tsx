'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import rupiahFormater from '@/utils/rupiahFormater';

interface CartFooterProps {
  onCheckout?: () => void;
}

export default function CartFooter({ onCheckout }: CartFooterProps) {
  const router = useRouter();
  const { cartItems, totalPrices, updateActiveStatus } = useCart();

  // Calculate totals
  const subtotal = totalPrices.all_item_active_prices;
  const total = totalPrices.total_all_active_prices;
  const allItemsSelected = cartItems.length > 0 && cartItems.every(item => item.is_active);
  const someItemsSelected = cartItems.some(item => item.is_active);

  const handleSelectAll = useCallback(() => {
    if (cartItems.length === 0) return;
    
    // Toggle all items - if all selected, deselect all; if not all selected, select all
    const newStatus = !allItemsSelected;
    
    // Batch update all items at once to prevent multiple re-renders
    cartItems.forEach(item => {
      updateActiveStatus(item.id, newStatus);
    });
  }, [cartItems, allItemsSelected, updateActiveStatus]);

  const handleCheckout = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu untuk melanjutkan checkout');
      router.push('/login');
      return;
    }
    
    if (onCheckout) {
      onCheckout();
    } else {
      // Redirect to order-1 page
      router.push('/order-1');
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-200 z-50" style={{ maxWidth: '440px', width: '100%' }}>
      {/* Main Footer Content */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Select All Section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSelectAll}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                allItemsSelected
                  ? 'border-primary bg-primary'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {allItemsSelected && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span className="text-gray-600 text-sm">All Item</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || total === 0}
            className="bg-primary text-white px-6 py-3 rounded-full font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Checkout ({rupiahFormater(total)})
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  );
}
