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
import { toast } from "react-hot-toast";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { CartItemType, CartTotalPricesType } from "@/types/apiTypes";
import { SessionManager } from "@/lib/auth";
import {
  addCartProduct,
  deleteCartProduct,
  extractVariantInfo,
  getCartTotalItems,
  getMyCartProducts,
  updateAllCartActivation,
  updateCartActivation,
  updateCartQuantity as updateCartQuantityApi,
} from "@/services/api/cart";

interface CartContextType {
  cartItems: CartItemType[];
  totalItems: number;
  totalPrices: CartTotalPricesType;
  isLoading: boolean;
  addToCart: (product: DetailProductType, variant: VariantProductType) => Promise<void>;
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengambil keranjang."
      );
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

  const addToCart = useCallback(
    async (product: DetailProductType, variant: VariantProductType) => {
      if (!product?.id || !variant?.id) {
        throw new Error("Produk atau varian tidak valid.");
      }

      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk menambahkan produk ke keranjang.");
      }

      await addCartProduct({
        productId: product.id,
        variantId: variant.id,
      });

      const metadataMap = readCartMetadata();
      metadataMap[createCartMetadataKey(product.name, variant.id)] = {
        productId: product.id,
        variantId: variant.id,
      };
      writeCartMetadata(metadataMap);

      await refreshCart();
    },
    [refreshCart]
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

      await updateCartQuantityApi({
        cartId,
        quantity,
      });
      await refreshCart();
    },
    [refreshCart]
  );

  const updateActiveStatus = useCallback(
    async (cartId: string, isActive: boolean) => {
      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk mengubah keranjang.");
      }

      await updateCartActivation({
        cartId,
        isActive,
      });
      await refreshCart();
    },
    [refreshCart]
  );

  const updateAllActiveStatus = useCallback(
    async (isActive: boolean) => {
      if (!SessionManager.isAuthenticated()) {
        throw new Error("Login diperlukan untuk mengubah keranjang.");
      }

      await updateAllCartActivation(isActive);
      await refreshCart();
    },
    [refreshCart]
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
