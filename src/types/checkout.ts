import { TransactionPaymentMethod, TransactionShipmentAddress } from "./transaction";

export interface CheckoutOrderData {
  delivery_type: "delivery" | "pickup";
  payment_method: TransactionPaymentMethod;
  notes?: string;
  shipment_id?: string;
  shipping_cost?: number;
  shipment_address?: TransactionShipmentAddress;
}
