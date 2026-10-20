import type { TransactionItem } from "@/types/transaction";

export interface OrderItemForTransactionMapping {
  id: number;
  product_id?: string | null;
  product_name: string;
  variant_product: string;
  quantity: number;
  price_per_item: number;
  img?: string;
  image?: string;
  variant_image?: string;
  product_image?: string;
  has_rating?: boolean;
}

export const mapOrderItemToTransactionItem = (
  item: OrderItemForTransactionMapping
): TransactionItem => ({
  id: item.id.toString(),
  productId: typeof item.product_id === "string" ? item.product_id.trim() : "",
  name: item.product_name,
  variantName: item.variant_product,
  quantity: item.quantity,
  price: item.price_per_item,
  image: item.img || item.image || item.variant_image || item.product_image || "/default-image.jpg",
  hasRating: item.has_rating === true,
});
