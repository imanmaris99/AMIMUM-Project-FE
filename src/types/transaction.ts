export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refund';

export type TransactionPaymentMethod =
  | 'bca_va'
  | 'mandiri_va'
  | 'bni_va'
  | 'bri_va'
  | 'bsi_va'
  | 'permata_va'
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'qris'
  | 'alfamart'
  | 'indomaret'
  | 'cod'
  | 'pay_at_store';

export interface TransactionShipmentAddress {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  courier: string;
  service: string;
  estimatedDelivery?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  status: TransactionStatus;
  amount: number;
  total: number; // Total amount for display
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  shippingCost: number;
  // Additional order data
  deliveryType?: string;
  paymentMethod?: TransactionPaymentMethod;
  notes?: string;
  shipmentId?: string;
  shipmentAddress?: TransactionShipmentAddress;
}

export interface TransactionItem {
  id: string;
  productId: string;
  name: string;
  variantName?: string;
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
