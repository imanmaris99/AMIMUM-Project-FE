import axiosClient from "@/lib/axiosClient";
import {
  CartItemActPayload,
  CartItemQtyPayload,
  CartResponseType,
  TotalCartItemsResponseType,
  ArticlesResponseType,
  ArticleProps,
  CategoriesResponseType,
  CategoryProps,
} from "@/types/apiTypes";
import { API_ENDPOINTS } from "@/lib/apiConfig";

export const fetchCategories = async (): Promise<CategoryProps[]> => {
  try {
    const response: CategoriesResponseType = await axiosClient.get(API_ENDPOINTS.CATEGORIES_ALL);
    
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format: data is not an array');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.USER_PROFILE);
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchPromo = async () => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTION_PROMO);
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchProduction = async () => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.PRODUCTION_ALL);
    return response.data ? response.data : response;
  } catch (error) {
    throw error;
  }
};

export const fetchArticles = async (): Promise<ArticleProps[]> => {
  try {
    const response: ArticlesResponseType = await axiosClient.get(API_ENDPOINTS.ARTICLES_ALL);
    
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format: data is not an array');
    }
    
    return response.data;
  } catch (error) {
    // Error handling is done by axiosClient interceptor
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response: CartResponseType = await axiosClient.get(API_ENDPOINTS.CART_MY_CART);
    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const getTotalCartItems = async () => {
  try {
    const response: TotalCartItemsResponseType = await axiosClient.get(
      API_ENDPOINTS.CART_TOTAL_ITEMS
    );
    return response ? response : null;
  } catch (error) {
    throw error;
  }
};

export const editCartQty = async (updatedCartItem: CartItemQtyPayload) => {
  try {
    // Extract cart_item_id from payload for URL
    const cartId = updatedCartItem.cart_item_id;
    const response = await axiosClient.put(
      API_ENDPOINTS.CART_UPDATE_QUANTITY(cartId),
      updatedCartItem
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const editCartActive = async (updatedCartItem: CartItemActPayload) => {
  try {
    // but the endpoint might need it. Adjust based on your backend API.
    // If backend expects cart_id in URL, you may need to add it to the payload type.
    // For now, using empty string as placeholder - update this based on your API requirements
    const response = await axiosClient.put(
      API_ENDPOINTS.CART_UPDATE_ACTIVATE(''),
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
      API_ENDPOINTS.CART_UPDATE_ACTIVATE_ALL,
      isActive
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const deleteCartItem = async (cartId: { cart_id: number }) => {
  try {
    const response = await axiosClient.delete(
      API_ENDPOINTS.CART_DELETE(String(cartId.cart_id)),
      {
        data: cartId,
      }
    );
    return response ? response.data : null;
  } catch (error) {
    throw error;
  }
};
