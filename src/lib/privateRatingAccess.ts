export interface PrivateRatingEligibleOrderItem {
  order_item_id: number;
  order_id: string;
  order_date: string;
  variant_id: number | null;
  variant_name: string;
}

export interface PrivateRatingOrderDetail {
  id: string;
  status: string;
  order_item_lists: Array<{
    id: number;
    product_id?: string | null;
    has_rating?: boolean;
  }>;
}

export type PrivateRatingAccess =
  | { kind: "available"; orderItem: PrivateRatingEligibleOrderItem }
  | { kind: "already-rated" }
  | { kind: "unavailable" };

export const resolvePrivateRatingAccess = (
  productId: string,
  orderItemId: string | number,
  eligibleOrderItems: PrivateRatingEligibleOrderItem[],
  orderDetail: PrivateRatingOrderDetail | null | undefined,
): PrivateRatingAccess => {
  const normalizedProductId = productId.trim().toLowerCase();
  const normalizedOrderItemId = Number(orderItemId);
  if (
    !normalizedProductId ||
    !Number.isSafeInteger(normalizedOrderItemId) ||
    normalizedOrderItemId <= 0 ||
    !orderDetail ||
    orderDetail.status.trim().toLowerCase() !== "completed"
  ) {
    return { kind: "unavailable" };
  }

  const eligibleOrderItem = eligibleOrderItems.find(
    (item) => item.order_item_id === normalizedOrderItemId,
  );
  if (!eligibleOrderItem || eligibleOrderItem.order_id !== orderDetail.id) {
    return { kind: "unavailable" };
  }

  const purchasedItem = orderDetail.order_item_lists.find(
    (item) => item.id === normalizedOrderItemId,
  );
  if (
    !purchasedItem ||
    purchasedItem.product_id?.trim().toLowerCase() !== normalizedProductId
  ) {
    return { kind: "unavailable" };
  }

  if (purchasedItem.has_rating === true) {
    return { kind: "already-rated" };
  }

  if (purchasedItem.has_rating !== false) {
    return { kind: "unavailable" };
  }

  return { kind: "available", orderItem: eligibleOrderItem };
};
