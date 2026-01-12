import { CartItemType } from "@/types/apiTypes";

export const recalculateCartTotals = (cartList: CartItemType[]) => {
  const subtotal = cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping_cost = 15000;
  const total = subtotal + shipping_cost;

  return {
    subtotal,
    shipping_cost,
    total,
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

export const removeCartItem = (
  cartItems: CartItemType[],
  cartItemId: string
): CartItemType[] => {
  return cartItems.filter((item) => item.id !== cartItemId);
};
