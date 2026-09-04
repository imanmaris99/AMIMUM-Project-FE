import axios from "axios";
import { apiClient } from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { Transaction, TransactionItem, TransactionPaymentMethod, TransactionStatus } from "@/types/transaction";

export interface OrderListItemDto {
  id: string;
  status: string;
  total_price: number;
  shipment_id?: string;
  delivery_type: string;
  notes?: string;
  customer_name?: string;
  created_at: string;
  shipping_cost: number;
  order_item_lists: Array<{
    id: number;
    product_name: string;
    variant_product: string;
    variant_discount: number;
    quantity: number;
    price_per_item: number;
    total_price: number;
    created_at: string;
    img?: string;
    image?: string;
    product_image?: string;
    variant_image?: string;
  }>;
}

export interface OrderDetailDto extends OrderListItemDto {
  my_shipping?: {
    id: string;
    my_address?: {
      id: number;
      name: string;
      phone: string;
      address: string;
      created_at: string;
    };
    my_courier?: {
      id: number;
      courier_name: string;
      weight: number;
      service_type: string;
      cost: number;
      estimated_delivery: string;
      created_at: string;
    };
    created_at: string;
  };
}

export interface OrdersListResponse {
  status_code: number;
  message: string;
  data: OrderListItemDto[];
}

export interface OrderDetailResponse {
  status_code: number;
  message: string;
  data: OrderDetailDto;
}

interface OrderErrorResponse {
  status_code?: number;
  error?: string;
  message?: string;
  detail?:
    | string
    | {
        status_code?: number;
        error?: string;
        message?: string;
      }
    | Array<{
        msg?: string;
        message?: string;
      }>;
}

export interface CheckoutOrderRequest {
  notes?: string;
  payment_method?: string;
  subtotal?: number;
  discount_total?: number;
  final_total?: number;
}

export interface CheckoutOrderResponse {
  status_code: number;
  message: string;
  data: {
    id: string;
    status: string;
    total_price: number;
    shipment_id?: string | null;
    delivery_type: string;
    notes?: string | null;
    created_at: string;
  };
}

const getOrderErrorMessage = (
  errorData: OrderErrorResponse,
  fallbackMessage: string
) => {
  if (errorData.message) return errorData.message;
  if (typeof errorData.detail === "string") return errorData.detail;
  if (errorData.detail && !Array.isArray(errorData.detail)) {
    return errorData.detail.message || fallbackMessage;
  }
  if (Array.isArray(errorData.detail)) {
    const messages = errorData.detail
      .map((item) => item.msg || item.message)
      .filter(Boolean)
      .join(", ");
    if (messages) return messages;
  }
  return fallbackMessage;
};

const normalizeTransactionStatus = (status: string): TransactionStatus => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "pending":
      return "pending";
    case "processing":
    case "process":
    case "capture":
      return "processing";
    case "shipped":
    case "shipping":
      return "shipped";
    case "delivered":
      return "delivered";
    case "completed":
    case "settlement":
    case "paid":
      return "completed";
    case "cancelled":
    case "canceled":
    case "cancel":
    case "expire":
    case "expired":
    case "deny":
    case "failed":
      return "cancelled";
    case "refund":
      return "refund";
    default:
      return "processing";
  }
};

const formatOrderDate = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const extractPaymentMethodFromNotes = (
  notes?: string | null
): TransactionPaymentMethod | undefined => {
  const match = notes?.match(/\[PAYMENT:\s*([^\]]+)\]/i);
  const paymentMethod = match?.[1]?.trim().toLowerCase();

  if (!paymentMethod) return undefined;

  const aliases: Record<string, TransactionPaymentMethod> = {
    qris: "qris",
    cod: "cod",
    cash: "cod",
    pay_at_store: "pay_at_store",
    "pay at store": "pay_at_store",
    bca_va: "bca_va",
    mandiri_va: "mandiri_va",
    bni_va: "bni_va",
    bri_va: "bri_va",
    bsi_va: "bsi_va",
    permata_va: "permata_va",
    gopay: "gopay",
    ovo: "ovo",
    dana: "dana",
    alfamart: "alfamart",
    indomaret: "indomaret",
  };

  return aliases[paymentMethod];
};

const mapOrderItems = (
  items: OrderListItemDto["order_item_lists"]
): TransactionItem[] =>
  items.map((item) => ({
    id: item.id.toString(),
    productId: "",
    name: item.product_name,
    variantName: item.variant_product,
    quantity: item.quantity,
    price: item.price_per_item,
    image: item.img || item.image || item.variant_image || item.product_image || "/default-image.jpg",
  }));

export const mapOrderSummaryToTransaction = (
  order: OrderListItemDto
): Transaction => {
  const subtotal =
    order.order_item_lists.reduce((total, item) => total + item.total_price, 0) ||
    Math.max(order.total_price - order.shipping_cost, 0);
  const total = subtotal + (order.shipping_cost || 0);

  return {
    id: order.id,
    transactionId: order.id,
    date: formatOrderDate(order.created_at),
    status: normalizeTransactionStatus(order.status),
    amount: total,
    total,
    items: mapOrderItems(order.order_item_lists),
    createdAt: order.created_at,
    updatedAt: order.created_at,
    subtotal,
    shippingCost: order.shipping_cost || 0,
    deliveryType: order.delivery_type,
    paymentMethod: extractPaymentMethodFromNotes(order.notes),
    notes: order.notes,
    shipmentId: order.shipment_id,
  };
};

export const mapOrderDetailToTransaction = (
  order: OrderDetailDto
): Transaction => {
  const baseTransaction = mapOrderSummaryToTransaction(order);

  return {
    ...baseTransaction,
    shipmentId: baseTransaction.shipmentId || order.my_shipping?.id,
    shipmentAddress:
      order.delivery_type === "delivery" && order.my_shipping
        ? {
            recipientName: order.my_shipping.my_address?.name || order.customer_name || "-",
            phone: order.my_shipping.my_address?.phone || "-",
            address: order.my_shipping.my_address?.address || "-",
            city: "",
            postalCode: "",
            courier: order.my_shipping.my_courier?.courier_name || "-",
            service: order.my_shipping.my_courier?.service_type || "-",
            estimatedDelivery: order.my_shipping.my_courier?.estimated_delivery || "-",
          }
        : undefined,
  };
};

export const checkoutOrder = async (
  payload: CheckoutOrderRequest
): Promise<CheckoutOrderResponse> => {
  try {
    const response = await apiClient.post<CheckoutOrderResponse>(
      API_ENDPOINTS.ORDERS_CHECKOUT,
      payload
    );

    if (
      (response?.status_code === 200 || response?.status_code === 201) &&
      response.data?.id
    ) {
      return response;
    }

    throw new Error(response?.message || "Gagal membuat pesanan.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as OrderErrorResponse;
      throw new Error(
        getOrderErrorMessage(errorData, "Gagal membuat pesanan.")
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const getMyOrders = async (): Promise<OrdersListResponse> => {
  try {
    const response = await apiClient.get<OrdersListResponse>(
      API_ENDPOINTS.ORDERS_MY_ORDERS
    );

    if (response?.status_code === 200 && Array.isArray(response.data)) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil daftar pesanan.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errorData = error.response.data as OrderErrorResponse;

      if (status === 404) {
        return {
          status_code: 200,
          message: errorData.message || "Belum ada pesanan.",
          data: [],
        };
      }

      throw new Error(errorData.message || "Gagal mengambil daftar pesanan.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

export const getOrderDetail = async (
  orderId: string
): Promise<OrderDetailResponse> => {
  try {
    const response = await apiClient.get<OrderDetailResponse>(
      API_ENDPOINTS.ORDERS_DETAIL(orderId)
    );

    if (
      response?.status_code === 200 &&
      response.data &&
      typeof response.data === "object"
    ) {
      return response;
    }

    throw new Error(response?.message || "Gagal mengambil detail pesanan.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as OrderErrorResponse;
      throw new Error(errorData.message || "Gagal mengambil detail pesanan.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
