import { CartItemType } from "@/types/apiTypes";
import { CourierService } from "@/types/shipment";
import { CheckoutOrderData } from "@/types/checkout";
import { TransactionPaymentMethod } from "@/types/transaction";

export interface CheckoutAddressInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  city_id?: number;
  postal_code: string;
  isDefault?: boolean;
}

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

interface CalculateCheckoutTotalsParams {
  isDirectCheckout: boolean;
  directCheckoutItem: CartItemType | null;
  totalPrices: {
    subtotal?: number;
    total?: number;
  };
  deliveryMethod: "delivery" | "pickup";
  selectedCourierCost?: number;
}

interface ValidateCheckoutFormParams {
  deliveryMethod: "delivery" | "pickup";
  selectedAddress: CheckoutAddressInfo | null;
  selectedCourierCompany: string;
  selectedCourierService: string;
  itemCount: number;
  selectedPaymentMethod: TransactionPaymentMethod | null;
}

export const normalizeAreaName = (value: string) =>
  value
    .toUpperCase()
    .replace(/^KOTA\s+/g, "")
    .replace(/^KABUPATEN\s+/g, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const calculateCheckoutTotals = ({
  isDirectCheckout,
  directCheckoutItem,
  totalPrices,
  deliveryMethod,
  selectedCourierCost,
}: CalculateCheckoutTotalsParams): CheckoutTotals => {
  const shippingCost = deliveryMethod === "delivery" ? selectedCourierCost || 0 : 0;

  if (isDirectCheckout && directCheckoutItem) {
    const subtotal = directCheckoutItem.price * directCheckoutItem.quantity;

    return {
      subtotal,
      discount: 0,
      shipping: shippingCost,
      total: subtotal + shippingCost,
    };
  }

  return {
    subtotal: totalPrices.subtotal || 0,
    discount: 0,
    shipping: shippingCost,
    total: (totalPrices.total || 0) + shippingCost,
  };
};

export const validateCheckoutForm = ({
  deliveryMethod,
  selectedAddress,
  selectedCourierCompany,
  selectedCourierService,
  itemCount,
  selectedPaymentMethod,
}: ValidateCheckoutFormParams): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (deliveryMethod === "delivery" && !selectedAddress) {
    errors.address = "Alamat pengiriman harus dipilih";
  }

  if (
    deliveryMethod === "delivery" &&
    (!selectedCourierCompany || !selectedCourierService)
  ) {
    errors.courier = "Ekspedisi dan layanan pengiriman harus dipilih";
  }

  if (itemCount === 0) {
    errors.cart = "Keranjang kosong";
  }

  if (!selectedPaymentMethod) {
    errors.payment = "Metode pembayaran harus dipilih";
  }

  return errors;
};

interface BuildCheckoutOrderDataParams {
  deliveryMethod: "delivery" | "pickup";
  selectedPaymentMethod: TransactionPaymentMethod;
  additionalNotes: string;
  selectedCourierCompany: string;
  selectedCourierService: string;
  selectedCourierData?: CourierService;
  selectedAddress: CheckoutAddressInfo | null;
}

export const buildCheckoutOrderData = ({
  deliveryMethod,
  selectedPaymentMethod,
  additionalNotes,
  selectedCourierCompany,
  selectedCourierService,
  selectedCourierData,
  selectedAddress,
}: BuildCheckoutOrderDataParams): CheckoutOrderData => ({
  delivery_type: deliveryMethod,
  payment_method: selectedPaymentMethod,
  notes: additionalNotes || (deliveryMethod === "pickup" ? "Ambil di toko" : undefined),
  shipment_id: deliveryMethod === "delivery" ? selectedCourierService : undefined,
  shipping_cost: deliveryMethod === "delivery" ? selectedCourierData?.cost || 0 : 0,
  shipment_address:
    deliveryMethod === "delivery" && selectedAddress && selectedCourierData
      ? {
          recipientName: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postal_code,
          courier: selectedCourierCompany.toUpperCase(),
          service: selectedCourierData.serviceType,
          estimatedDelivery: selectedCourierData.estimatedDelivery,
        }
      : undefined,
});
