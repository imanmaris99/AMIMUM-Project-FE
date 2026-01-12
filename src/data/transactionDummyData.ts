import { Transaction, TransactionItem } from "@/types/transaction";

const transactionItems: TransactionItem[] = [
  {
    id: "item-1",
    productId: "prod-1",
    name: "El Paseo Espresso",
    quantity: 2,
    price: 25000,
    image: "/default-image.jpg"
  }
];

export const dummyTransactions: Transaction[] = [
  {
    id: "trans-1",
    transactionId: "456789351",
    date: "Sep 9, 2024, 04:30pm",
    status: "cancelled",
    amount: 50000,
    total: 50000,
    items: transactionItems,
    createdAt: "2024-09-09T16:30:00Z",
    updatedAt: "2024-09-09T16:30:00Z"
  },
  {
    id: "trans-2",
    transactionId: "456789352",
    date: "Okt 3, 2024, 02:30pm",
    status: "completed",
    amount: 75000,
    total: 75000,
    items: transactionItems,
    createdAt: "2024-10-03T14:30:00Z",
    updatedAt: "2024-10-03T14:30:00Z"
  },
  {
    id: "trans-3",
    transactionId: "456789353",
    date: "Okt 3, 2024, 02:30pm",
    status: "pending",
    amount: 100000,
    total: 100000,
    items: transactionItems,
    createdAt: "2024-10-03T14:30:00Z",
    updatedAt: "2024-10-03T14:30:00Z"
  },
  {
    id: "trans-4",
    transactionId: "456789354",
    date: "Okt 3, 2024, 02:30pm",
    status: "refund",
    amount: 125000,
    total: 125000,
    items: transactionItems,
    createdAt: "2024-10-03T14:30:00Z",
    updatedAt: "2024-10-03T14:30:00Z"
  }
];

export const dummyTransactionData = {
  transactions: dummyTransactions,
  totalTransactions: dummyTransactions.length
};
