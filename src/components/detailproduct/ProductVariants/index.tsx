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

const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

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

  const groupedVariants = productVariants.reduce<Array<{ optionName: string; items: VariantProductType[] }>>(
    (groups, variant) => {
      const optionName = variant.name?.trim() || "Pilihan varian";
      const existingGroup = groups.find((group) => group.optionName === optionName);

      if (existingGroup) {
        existingGroup.items.push(variant);
      } else {
        groups.push({ optionName, items: [variant] });
      }

      return groups;
    },
    []
  );

  const handleVariantSelect = (variant: VariantProductType) => {
    onVariantChange?.(variant);
  };

  return (
    <div className="rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-[#294D42]">Pilihan produk</p>
          <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
            Pilih opsi produk sesuai kebutuhan. Detail tipe/desain dan harga mengikuti pilihan di bawah.
          </p>
        </div>

        {productVariants.length === 0 ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Varian produk belum tersedia di katalog. Silakan hubungi admin toko sebelum membeli.
          </div>
        ) : (
          <div className="space-y-4">
            {groupedVariants.map((group) => (
              <section key={group.optionName} className="space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#F7FBF8] px-3 py-2 ring-1 ring-[#E6F2EC]">
                  <div>
                    <h3 className="text-sm font-bold text-[#294D42]">{group.optionName}</h3>
                    <p className="text-[11px] leading-4 text-[#6B7C73]">
                      {group.items.length > 1
                        ? `${group.items.length} tipe/desain tersedia`
                        : "1 tipe/desain tersedia"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#3F715F] shadow-sm">
                    {group.optionName.toLowerCase().includes("lampu") ? "Opsi lampu" : "Opsi produk"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {group.items.map((variant) => {
                    const hasDiscount = Boolean(variant.discount && variant.discount > 0);
                    const discountedPrice = Number(variant.discounted_price || product?.price || 0);
                    const hasValidPrice = Number.isFinite(discountedPrice) && discountedPrice > 0;
                    const originalPrice = hasDiscount && hasValidPrice
                      ? Math.round(discountedPrice / (1 - variant.discount / 100))
                      : discountedPrice;
                    const isSelected = propSelectedVariant?.id === variant.id;
                    const isInCart = product ? checkIsInCart(product.id, variant.id) : false;
                    const typeLabel = variant.variant?.trim() || variant.name?.trim() || "Tipe produk";
                    const variantImage = variant.img || productCatalogImage;
                    const hasVariantPhoto = Boolean(variant.img);

                    return (
                      <label
                        key={variant.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all duration-200 sm:p-4 ${
                          isSelected
                            ? "border-2 border-[#2F6F5A] bg-[#F3FAF6] shadow-[0_6px_18px_rgba(47,111,90,0.14)]"
                            : "border border-[#EEF4F0] bg-white/85 hover:border-[#DCEDE5] hover:bg-[#F8FCFA]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="variant"
                          value={`${group.optionName}-${typeLabel}`}
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
                            {hasVariantPhoto ? "Foto tipe" : "Foto produk"}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className={`block text-sm font-semibold leading-5 ${isSelected ? "text-primary" : "text-gray-800"}`}>
                                {typeLabel}
                              </span>
                              <span className="block text-[11px] leading-4 text-[#6B7C73]">
                                {group.optionName}
                              </span>
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
                                    {formatCurrency(Math.round(discountedPrice))}
                                  </span>
                                  <span className="rounded bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-600">
                                    -{variant.discount}%
                                  </span>
                                </div>
                                <div className="text-gray-400 line-through">
                                  {formatCurrency(originalPrice)}
                                </div>
                              </div>
                            ) : (
                              <div className="font-medium text-gray-600">
                                {formatCurrency(discountedPrice)}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
        <hr className="mt-4 border-gray-100" />
      </div>
    </div>
  );
};

export default ProductVariants;
