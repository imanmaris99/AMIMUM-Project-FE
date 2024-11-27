import axiosClient from "@/lib/axiosClient";
import {
  CartItemActPayload,
  CartItemQtyPayload,
  CartResponseType,
  TotalCartItemsResponseType,
  TotalCartItemsType,
} from "@/types/apiTypes";

export const fetchCategories = async () => {
  try {
    const response = await axiosClient.get("/categories/all");
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await axiosClient.get("/user/profile");
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchPromo = async () => {
  try {
    const response = await axiosClient.get("/production/promo");
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchProduction = async () => {
  try {
    const response = await axiosClient.get("/production/all");
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchArticles = async () => {
  try {
    const response = await axiosClient.get("/articles/all");
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

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
      `/cart/update-quantity/`,
      updatedCartItem
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const editCartActive = async (updatedCartItem: CartItemActPayload) => {
  try {
    // console.log("HELLO!");
    const response = await axiosClient.put(
      `/cart/update-activate/:cart_id`,
      updatedCartItem
    );
    // console.log(response);
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const editCartAllActive = async ({
  is_active,
}: {
  is_active: boolean;
}) => {
  try {
    const response = await axiosClient.put(
      "/cart/update-activate-all",
      is_active
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};
