import axiosClient from "@/lib/axiosClient";
import {
  CartItemActPayload,
  CartItemQtyPayload,
  CartResponseType,
  TotalCartItemsResponseType,
} from "@/interfaces/cart";

export const getCart = async () => {
  try {
    const response: CartResponseType = await axiosClient.get("/cart/my-cart");
    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const getTotalCartItems = async () => {
  try {
    const response: TotalCartItemsResponseType = await axiosClient.get(
      "/cart/total-items"
    );
    return response ? response : null;
  } catch (error) {
    throw error;
  }
};

export const editCartQty = async (updatedCartItem: CartItemQtyPayload) => {
  try {
    const response = await axiosClient.put(
      `/cart/update-quantity/:cart_id`,
      updatedCartItem
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const editCartActive = async (updatedCartItem: CartItemActPayload) => {
  try {
    const response = await axiosClient.put(
      `/cart/update-activate/:cart_id`,
      updatedCartItem
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const editCartAllActive = async (isActive: { is_active: boolean }) => {
  try {
    const response = await axiosClient.put(
      "/cart/update-activate-all",
      isActive
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (cartId: { cart_id: number }) => {
  try {
    const response = await axiosClient.delete("/cart/delete/:cart_id", {
      data: cartId,
    });
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};
