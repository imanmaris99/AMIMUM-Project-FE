import { CartItemType } from "@/types/apiTypes";

export const recalculateCartTotals = (cartList: CartItemType[]) => {
  const all_item_active_prices = cartList
    .filter((item) => item.is_active)
    .reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  const all_promo_active_prices = cartList
    .filter((item) => item.is_active && item.variant_info.discount)
    .reduce(
      (sum, item) =>
        sum +
        (item.variant_info.discount / 100) * item.product_price * item.quantity,
      0
    );
  const total_all_active_prices =
    all_item_active_prices - all_promo_active_prices;

  return {
    all_item_active_prices,
    all_promo_active_prices,
    total_all_active_prices,
  };
};

export const updateCartItem = (
  cartItems: CartItemType[],
  updatedItem: CartItemType
): CartItemType[] => {
  return cartItems.map((item) =>
    item.id === updatedItem.id ? { ...item, ...updatedItem } : item
  );
};

export const toggleSelectAll = (
  cartItems: CartItemType[],
  isActive: boolean
): CartItemType[] => {
  return cartItems.map((item) => ({ ...item, is_active: isActive }));
};

export const removeCartItem = (
  cartItems: CartItemType[],
  cartItemId: number
): CartItemType[] => {
  return cartItems.filter((item) => item.id !== cartItemId);
};
