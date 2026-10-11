"use client";

import { useCart } from "@/contexts/CartContext";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";

interface ProductVariantsProps {
  product?: DetailProductType;
  variants?: VariantProductType[];
  onVariantChange?: (variant: VariantProductType) => void;
  selectedVariant?: VariantProductType;
  showQuickAdd?: boolean;
}

const ProductVariants = ({
  product,
  variants,
  onVariantChange,
  selectedVariant: propSelectedVariant,
}: ProductVariantsProps) => {
  const { isInCart: checkIsInCart } = useCart();
  const productVariants = product?.variants_list ?? variants ?? [];
  const productCatalogImage = product?.primary_image_url
    || product?.gallery_images?.find((image) => image.is_primary)?.url
    || product?.gallery_images?.[0]?.url
    || "/default-image.jpg";

  const handleVariantSelect = (variant: VariantProductType) => {
    onVariantChange?.(variant);
  };

  return (
    <div className="rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="p-4">
        <p className="mb-3 text-sm font-semibold text-[#294D42]">Varian produk :</p>
        {productVariants.length === 0 ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Varian produk belum tersedia di katalog. Silakan hubungi admin toko sebelum membeli.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {productVariants.map((variant) => {
              const hasDiscount = Boolean(variant.discount && variant.discount > 0);
              const discountedPrice = Number(variant.discounted_price || product?.price || 0);
              const hasValidPrice = Number.isFinite(discountedPrice) && discountedPrice > 0;
              const originalPrice = hasDiscount && hasValidPrice
                ? Math.round(discountedPrice / (1 - variant.discount / 100))
                : discountedPrice;
              const isSelected = propSelectedVariant?.id === variant.id;
              const isInCart = product ? checkIsInCart(product.id, variant.id) : false;
              const variantTypeLabel = variant.name && variant.variant && variant.name !== variant.variant
                ? `${variant.name} • ${variant.variant}`
                : variant.variant || variant.name || "Varian produk";
              const variantImage = variant.img || productCatalogImage;
              const hasVariantPhoto = Boolean(variant.img);

              return (
                <label
                  key={variant.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all duration-200 sm:p-4 ${
                    isSelected
                      ? "border border-[#DCEDE5] bg-[#F5FAF7] shadow-[0_4px_14px_rgba(15,23,42,0.06)]"
                      : "border border-transparent bg-white/80 hover:border-[#E6F2EC] hover:bg-[#F8FCFA]"
                  }`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={variant.variant || variant.name}
                    checked={isSelected}
                    onChange={() => handleVariantSelect(variant)}
                    className="mt-9 form-radio text-sm text-primary focus:ring-primary"
                  />

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E6F2EC] bg-[#F8FCFA] sm:h-24 sm:w-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={variantImage}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain p-1.5"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = productCatalogImage;
                      }}
                    />
                    <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-[#3F715F] shadow-sm">
                      {hasVariantPhoto ? "Foto varian" : "Foto produk"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className={`block text-sm font-semibold leading-5 ${isSelected ? "text-primary" : "text-gray-800"}`}>
                          {variantTypeLabel}
                        </span>
                        {variant.name && variant.variant && variant.name !== variant.variant && (
                          <span className="block text-[11px] leading-4 text-[#6B7C73]">
                            Tipe utama: {variant.name}
                          </span>
                        )}
                      </div>
                      {isInCart && (
                        <span className="shrink-0 rounded-full bg-[#EAF5EF] px-2 py-1 text-xs font-semibold text-[#3F715F]">
                          ✓ Di Keranjang
                        </span>
                      )}
                    </div>

                    <div className="mb-2 flex flex-wrap gap-2 text-[11px]">
                      <span className={`rounded-full px-2 py-1 font-semibold ${variant.stock > 0 ? "bg-[#EAF5EF] text-[#3F715F]" : "bg-amber-50 text-amber-700"}`}>
                        {variant.stock > 0 ? `Stok ${variant.stock}` : "Stok perlu konfirmasi"}
                      </span>
                      <span className="rounded-full bg-[#F7F9F8] px-2 py-1 font-semibold text-[#5F6F67]">
                        Exp: {variant.expiration || "Belum tersedia"}
                      </span>
                    </div>

                    <div className="text-xs">
                      {!hasValidPrice ? (
                        <div className="font-medium text-gray-500">
                          Harga varian belum tersedia
                        </div>
                      ) : hasDiscount ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-red-500">
                              {Math.round(discountedPrice).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                            </span>
                            <span className="rounded bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-600">
                              -{variant.discount}%
                            </span>
                          </div>
                          <div className="text-gray-400 line-through">
                            {originalPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                          </div>
                        </div>
                      ) : (
                        <div className="font-medium text-gray-600">
                          {discountedPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
        <hr className="mt-4 border-gray-100" />
      </div>
    </div>
  );
};

export default ProductVariants;
