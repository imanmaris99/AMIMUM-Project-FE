import type { CartItemType } from "../types/apiTypes";
import type { CartApiItem, CartVariantInfo } from "../services/api/cart";

const normalizeVariantInfo = (raw: Record<string, unknown>): CartVariantInfo => {
  if (!raw || typeof raw !== "object") return {};
  if ("variant" in raw || "img" in raw || "discounted_price" in raw) {
    return raw as CartVariantInfo;
  }
  const nested = Object.values(raw).find(
    (value) => value && typeof value === "object" && !Array.isArray(value),
  );
  return (nested as CartVariantInfo | undefined) || {};
};

export const buildCheckoutCartSnapshot = (
  freshItems: CartApiItem[],
  currentItems: CartItemType[],
): CartItemType[] => {
  const currentById = new Map(currentItems.map((item) => [item.id, item]));

  return freshItems
    .filter((item) => item.is_active !== false)
    .map((item) => {
      const variantInfo = normalizeVariantInfo(item.variant_info);
      const existingItem = currentById.get(item.id.toString());
      const productId = typeof item.product_id === "string" ? item.product_id.trim() : "";
      const variantId = Number.isSafeInteger(item.variant_id) && item.variant_id > 0
        ? item.variant_id
        : 0;
      const price =
        typeof variantInfo.discounted_price === "number"
          ? variantInfo.discounted_price
          : item.product_price;

      if (
        !productId ||
        !variantId ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(price) ||
        price <= 0
      ) {
        throw new Error("Keranjang belum tersinkron. Muat ulang keranjang sebelum membuat pesanan.");
      }

      return {
        id: item.id.toString(),
        product_id: productId,
        variant_id: variantId,
        quantity: item.quantity,
        price,
        product_name: item.product_name || existingItem?.product_name || "",
        variant_name: variantInfo.variant || existingItem?.variant_name || "",
        image: variantInfo.img || existingItem?.image || "/default-image.jpg",
        created_at: item.created_at || existingItem?.created_at || "",
        updated_at: variantInfo.updated_at || item.created_at || existingItem?.updated_at,
        is_active: item.is_active,
      };
    });
};
