"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { CartItemType, CartTotalPricesType } from "@/types/apiTypes";
import { SessionManager } from "@/lib/auth";
import {
  addCartProduct,
  CartMutationResponse,
  deleteCartProduct,
  extractVariantInfo,
  getCartTotalItems,
  getMyCartProducts,
  updateAllCartActivation,
  updateCartActivation,
  updateCartQuantity as updateCartQuantityApi,
} from "@/services/api/cart";

interface AddToCartOptions {
  skipRefresh?: boolean;
}

interface CartContextType {
  cartItems: CartItemType[];
  totalItems: number;
  totalPrices: CartTotalPricesType;
  isLoading: boolean;
  isSyncing: boolean;
  addToCart: (
    product: DetailProductType,
    variant: VariantProductType,
    options?: AddToCartOptions
  ) => Promise<CartMutationResponse>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  updateActiveStatus: (cartId: string, isActive: boolean) => Promise<void>;
  updateAllActiveStatus: (isActive: boolean) => Promise<void>;
  clearCart: () => Promise<void>;
  clearAll: () => Promise<void>;
  removeActiveItems: () => Promise<void>;
  isInCart: (productId: string, variantId: number) => boolean;
  refreshCart: () => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

const CART_METADATA_STORAGE_KEY = "cart_product_metadata_map";

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartMetadataMap = Record<
  string,
  {
    productId: string;
    variantId: number;
  }
>;

const readCartMetadata = (): CartMetadataMap => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawMap = localStorage.getItem(CART_METADATA_STORAGE_KEY);
    if (!rawMap) {
      return {};
    }

    const parsedMap = JSON.parse(rawMap);
    return parsedMap && typeof parsedMap === "object" ? parsedMap : {};
  } catch {
    return {};
  }
};

const writeCartMetadata = (metadataMap: CartMetadataMap) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CART_METADATA_STORAGE_KEY, JSON.stringify(metadataMap));
};

const createCartMetadataKey = (productName: string, variantId: number) =>
  `${productName}::${variantId}`;

const calculateActiveCartTotals = (items: CartItemType[]): CartTotalPricesType => {
  const activeItems = items.filter((item) => item.is_active !== false);
  const subtotal = activeItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    subtotal,
    shipping_cost: 0,
    total: subtotal,
    promo_total: 0,
  };
};

const countActiveCartItems = (items: CartItemType[]) =>
  items
    .filter((item) => item.is_active !== false)
    .reduce((sum, item) => sum + item.quantity, 0);

const normalizeCartItem = (
  item: {
    id: number;
    product_name: string;
    product_price: number;
    variant_info: Record<string, unknown>;
    quantity: number;
    is_active: boolean;
    created_at: string;
  },
  metadataMap: CartMetadataMap
): CartItemType => {
  const variantInfo = extractVariantInfo(item.variant_info);
  const variantId =
    typeof variantInfo.id === "number" ? variantInfo.id : 0;
  const metadata =
    metadataMap[createCartMetadataKey(item.product_name, variantId)];

  return {
    id: item.id.toString(),
    product_id: metadata?.productId || "",
    variant_id: metadata?.variantId || variantId,
    quantity: item.quantity,
    price:
      typeof variantInfo.discounted_price === "number"
        ? variantInfo.discounted_price
        : item.product_price,
    product_name: item.product_name,
    variant_name: variantInfo.variant || "",
    image: variantInfo.img || "/default-image.jpg",
    created_at: item.created_at,
    updated_at: variantInfo.updated_at || item.created_at,
    is_active: item.is_active,
  };
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrices, setTotalPrices] = useState<CartTotalPricesType>({
    subtotal: 0,
    shipping_cost: 0,
    total: 0,
    promo_total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingMutationCount, setPendingMutationCount] = useState(0);
  const isSyncing = pendingMutationCount > 0;

  const beginCartSync = useCallback(() => {
    setPendingMutationCount((count) => count + 1);

    return () => {
      setPendingMutationCount((count) => Math.max(0, count - 1));
    };
  }, []);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);

    if (!SessionManager.isAuthenticated()) {
      setCartItems([]);
      setTotalItems(0);
      setTotalPrices({
        subtotal: 0,
        shipping_cost: 0,
        total: 0,
        promo_total: 0,
      });
      setIsLoading(false);
      return;
    }

    try {
      const [cartResponse, totalResponse] = await Promise.all([
        getMyCartProducts(),
        getCartTotalItems(),
      ]);

      const metadataMap = readCartMetadata();
      const normalizedItems = cartResponse.data.map((item) =>
        normalizeCartItem(item, metadataMap)
      );

      setCartItems(normalizedItems);
      setTotalItems(totalResponse.data.total_items);
      setTotalPrices({
        subtotal: cartResponse.total_prices.all_item_active_prices,
        shipping_cost: 0,
        total: cartResponse.total_prices.total_all_active_prices,
        promo_total: cartResponse.total_prices.all_promo_active_prices,
      });
    } catch {
      // Refresh runs globally in the app shell. Do not show a red popup on
      // public pages if a background cart sync fails; action-specific cart
      // buttons still surface their own clear errors.
      setCartItems([]);
      setTotalItems(0);
      setTotalPrices({
        subtotal: 0,
        shipping_cost: 0,
        total: 0,
        promo_total: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const commitCartItems = useCallback(
    (updater: (previousItems: CartItemType[]) => CartItemType[]) => {
      setCartItems((previousItems) => {
        const nextItems = updater(previousItems);
        setTotalItems(countActiveCartItems(nextItems));
        setTotalPrices(calculateActiveCartTotals(nextItems));
        return nextItems;
      });
    },
    []
  );

  const addToCart = useCallback(
    async (
      product: DetailProductType,
      variant: VariantProductType,
      options?: AddToCartOptions
    ) => {
      if (!product?.id || !variant?.id) {
        throw new Error("Produk atau varian tidak valid.");
      }

      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk menambahkan produk ke keranjang.");
      }

      const response = await addCartProduct({
        productId: product.id,
        variantId: variant.id,
      });

      const metadataMap = readCartMetadata();
      metadataMap[createCartMetadataKey(product.name, variant.id)] = {
        productId: product.id,
        variantId: variant.id,
      };
      writeCartMetadata(metadataMap);

      if (options?.skipRefresh) {
        const cartId = response.data?.cart_id;
        const now = new Date().toISOString();
        const optimisticItem: CartItemType = {
          id: cartId?.toString() || `pending-${product.id}-${variant.id}`,
          product_id: product.id,
          variant_id: variant.id,
          quantity: Math.max(1, Number(response.data?.quantity || 1)),
          price:
            typeof variant.discounted_price === "number" && variant.discounted_price > 0
              ? variant.discounted_price
              : product.price,
          product_name: product.name,
          variant_name: variant.variant || variant.name || "",
          image: variant.img || product.primary_image_url || "/default-image.jpg",
          created_at: response.data?.added_at || now,
          updated_at: variant.updated_at || now,
          is_active: true,
        };

        commitCartItems((previousItems) => {
          const withoutTarget = previousItems.filter(
            (item) =>
              item.product_id !== optimisticItem.product_id ||
              item.variant_id !== optimisticItem.variant_id
          );

          return [...withoutTarget, optimisticItem];
        });

        return response;
      }

      await refreshCart();
      return response;
    },
    [commitCartItems, refreshCart]
  );

  const removeFromCart = useCallback(
    async (cartId: string) => {
      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk mengubah keranjang.");
      }

      await deleteCartProduct(cartId);
      await refreshCart();
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (cartId: string, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Jumlah produk tidak valid.");
      }

      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk mengubah keranjang.");
      }

      let previousSnapshot: CartItemType[] = [];
      commitCartItems((previousItems) => {
        previousSnapshot = previousItems;
        return previousItems.map((item) =>
          item.id === cartId ? { ...item, quantity } : item
        );
      });

      const finishCartSync = beginCartSync();

      try {
        await updateCartQuantityApi({
          cartId,
          quantity,
        });
      } catch (error) {
        commitCartItems(() => previousSnapshot);
        throw error;
      } finally {
        finishCartSync();
      }
    },
    [beginCartSync, commitCartItems]
  );

  const updateActiveStatus = useCallback(
    async (cartId: string, isActive: boolean) => {
      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk mengubah keranjang.");
      }

      let previousSnapshot: CartItemType[] = [];
      commitCartItems((previousItems) => {
        previousSnapshot = previousItems;
        return previousItems.map((item) =>
          item.id === cartId ? { ...item, is_active: isActive } : item
        );
      });

      const finishCartSync = beginCartSync();

      try {
        await updateCartActivation({
          cartId,
          isActive,
        });
      } catch (error) {
        commitCartItems(() => previousSnapshot);
        throw error;
      } finally {
        finishCartSync();
      }
    },
    [beginCartSync, commitCartItems]
  );

  const updateAllActiveStatus = useCallback(
    async (isActive: boolean) => {
      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk mengubah keranjang.");
      }

      let previousSnapshot: CartItemType[] = [];
      commitCartItems((previousItems) => {
        previousSnapshot = previousItems;
        return previousItems.map((item) => ({
          ...item,
          is_active: isActive,
        }));
      });

      const finishCartSync = beginCartSync();

      try {
        await updateAllCartActivation(isActive);
      } catch (error) {
        commitCartItems(() => previousSnapshot);
        throw error;
      } finally {
        finishCartSync();
      }
    },
    [beginCartSync, commitCartItems]
  );

  const clearCart = useCallback(async () => {
    if (!SessionManager.isAuthenticated()) {
      setCartItems([]);
      setTotalItems(0);
      setTotalPrices({
        subtotal: 0,
        shipping_cost: 0,
        total: 0,
        promo_total: 0,
      });
      return;
    }

    await Promise.all(cartItems.map((item) => deleteCartProduct(item.id)));
    await refreshCart();
  }, [cartItems, refreshCart]);

  const clearAll = useCallback(async () => {
    await clearCart();
  }, [clearCart]);

  const removeActiveItems = useCallback(async () => {
    if (!SessionManager.isAuthenticated()) {
      setCartItems([]);
      setTotalItems(0);
      setTotalPrices({
        subtotal: 0,
        shipping_cost: 0,
        total: 0,
        promo_total: 0,
      });
      return;
    }

    const activeItems = cartItems.filter((item) => item.is_active !== false);

    await Promise.all(activeItems.map((item) => deleteCartProduct(item.id)));
    await refreshCart();
  }, [cartItems, refreshCart]);

  const isInCart = useCallback(
    (productId: string, variantId: number) =>
      cartItems.some(
        (item) => item.product_id === productId && item.variant_id === variantId
      ),
    [cartItems]
  );

  const value: CartContextType = useMemo(
    () => ({
      cartItems,
      totalItems,
      totalPrices,
      isLoading,
      isSyncing,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateActiveStatus,
      updateAllActiveStatus,
      clearCart,
      clearAll,
      removeActiveItems,
      isInCart,
      refreshCart,
    }),
    [
      cartItems,
      totalItems,
      totalPrices,
      isLoading,
      isSyncing,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateActiveStatus,
      updateAllActiveStatus,
      clearCart,
      clearAll,
      removeActiveItems,
      isInCart,
      refreshCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
