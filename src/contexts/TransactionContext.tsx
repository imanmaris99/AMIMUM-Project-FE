"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Transaction, TransactionItem } from "@/types/transaction";
import { CartItemType } from "./CartContext";
import { useNotification } from "./NotificationContext";
import { validateCartItemData } from "@/utils/dataValidation";
import { ErrorHandler } from "@/lib/errorHandler";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (orderData: any, cartItems: CartItemType[]) => Transaction | null;
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
        const parsedTransactions = JSON.parse(savedTransactions);
        if (Array.isArray(parsedTransactions)) {
          // Validate transaction data structure
          const validTransactions = parsedTransactions.filter(transaction => 
            transaction && 
            typeof transaction.id === 'string' &&
            typeof transaction.transactionId === 'string' &&
            Array.isArray(transaction.items)
          );
          if (validTransactions.length !== parsedTransactions.length) {
            ErrorHandler.handleError(new Error('Some transactions are invalid and were removed'), 'TransactionLoad');
          }
          setTransactions(validTransactions);
        }
      } catch (error) {
        ErrorHandler.handleError(error, 'TransactionLoad');
        // Clear corrupted transaction data
        localStorage.removeItem('transactions');
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
    try {
      
      // Validate input data
      if (!orderData || !cartItems || !Array.isArray(cartItems)) {
        const error = new Error('Invalid order data or cart items');
        ErrorHandler.handleError(error, 'TransactionAdd');
        return null;
      }

      // Validate cart items
      const validCartItems = cartItems.filter(item => {
        try {
          const isValid = validateCartItemData(item);
          return isValid;
        } catch (validationError) {
          return false;
        }
      });
      
      if (validCartItems.length !== cartItems.length) {
        ErrorHandler.handleError(new Error('Some cart items are invalid and were removed'), 'TransactionAdd');
      }

      if (validCartItems.length === 0) {
        const error = new Error('No valid cart items to create transaction');
        ErrorHandler.handleError(error, 'TransactionAdd');
        return null;
      }

      const transactionId = `ORD-${Date.now()}`;
      const now = new Date();
      
      // Convert valid cart items to transaction items
      const transactionItems: TransactionItem[] = validCartItems.map((item: CartItemType) => ({
        id: `item-${Date.now()}-${item.id}`,
        productId: item.product_id,
        name: item.product_name,
        quantity: item.quantity,
        price: item.variant_info.discounted_price || item.product_price,
        image: item.variant_info.img || "/default-image.jpg"
      }));

      // Calculate total amount using valid cart items
      const totalAmount = validCartItems.reduce((total, item) => {
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
      
    } catch (error) {
      ErrorHandler.handleError(error, 'TransactionAdd');
      return null;
    }
  }, [addNotification]);

  // Update transaction status
  const updateTransactionStatus = useCallback((transactionId: string, status: string) => {
    // Validate inputs
    if (!transactionId || typeof transactionId !== 'string') {
      ErrorHandler.handleError(new Error('Invalid transaction ID'), 'TransactionUpdate');
      return;
    }

    if (!status || typeof status !== 'string') {
      ErrorHandler.handleError(new Error('Invalid status'), 'TransactionUpdate');
      return;
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      ErrorHandler.handleError(new Error('Invalid status value'), 'TransactionUpdate');
      return;
    }

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
    // Validate transaction ID
    if (!transactionId || typeof transactionId !== 'string') {
      ErrorHandler.handleError(new Error('Invalid transaction ID'), 'TransactionGet');
      return undefined;
    }
    
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
