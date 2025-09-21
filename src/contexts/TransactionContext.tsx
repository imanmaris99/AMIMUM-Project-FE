"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Transaction, TransactionItem } from "@/types/transaction";
import { CartItemType } from "./CartContext";
import { useNotification } from "./NotificationContext";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (orderData: any, cartItems: CartItemType[]) => void;
  updateTransactionStatus: (transactionId: string, status: string) => void;
  getTransactionById: (transactionId: string) => Transaction | undefined;
  clearTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { addNotification } = useNotification();

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Add new transaction
  const addTransaction = useCallback((orderData: any, cartItems: CartItemType[]) => {
    const transactionId = `ORD-${Date.now()}`;
    const now = new Date();
    
    // Convert cart items to transaction items
    const transactionItems: TransactionItem[] = cartItems.map((item: CartItemType) => ({
      id: `item-${Date.now()}-${item.id}`,
      productId: item.product_id,
      name: item.product_name,
      quantity: item.quantity,
      price: item.variant_info.discounted_price || item.product_price,
      image: item.variant_info.img || "/default-image.jpg"
    }));

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      const itemPrice = item.variant_info.discounted_price || item.product_price;
      return total + (itemPrice * item.quantity);
    }, 0);

    // Add shipping cost if delivery
    const shippingCost = orderData.delivery_type === 'delivery' ? 15000 : 0;
    const finalAmount = totalAmount + shippingCost;

    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      transactionId: transactionId,
      date: now.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: 'pending',
      amount: finalAmount,
      total: finalAmount, // Total amount for display
      items: transactionItems,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      // Additional order data
      deliveryType: orderData.delivery_type,
      notes: orderData.notes,
      shipmentId: orderData.shipment_id,
      shipmentAddress: orderData.delivery_type === 'delivery' ? {
        address: orderData.shipment_address?.address || 'Alamat tidak tersedia',
        courier: orderData.courier_service || 'Kurir tidak tersedia'
      } : undefined
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Add notification for both tracking and transaction menus
    addNotification("tracking");
    addNotification("transaction");
    
    return newTransaction;
  }, [addNotification]);

  // Update transaction status
  const updateTransactionStatus = useCallback((transactionId: string, status: string) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.transactionId === transactionId 
          ? { 
              ...transaction, 
              status, 
              updatedAt: new Date().toISOString() 
            }
          : transaction
      )
    );
    
  }, []);

  // Get transaction by ID
  const getTransactionById = useCallback((transactionId: string) => {
    return transactions.find(transaction => transaction.transactionId === transactionId);
  }, [transactions]);

  // Clear all transactions
  const clearTransactions = useCallback(() => {
    setTransactions([]);
    localStorage.removeItem('transactions');
  }, []);


  const value: TransactionContextType = {
    transactions,
    addTransaction,
    updateTransactionStatus,
    getTransactionById,
    clearTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
