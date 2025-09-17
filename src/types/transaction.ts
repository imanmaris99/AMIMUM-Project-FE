export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'refund';

export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  status: TransactionStatus;
  amount: number;
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface TransactionData {
  transactions: Transaction[];
  totalTransactions: number;
}

export interface TransactionFormData {
  productId: string;
  quantity: number;
}
