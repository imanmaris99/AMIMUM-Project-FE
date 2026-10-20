"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
import ProductRatingSection from "@/components/rating/ProductRatingSection";
import CardProduct from "@/components/common/Search/CardProduct";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import type { AllProductInfoType } from "@/types/apiTypes";
import { validateDetailProductData } from "@/utils/dataValidation";
import UnifiedHeader from "@/components/common/UnifiedHeader";

interface DetailProductClientProps {
  detailProduct: DetailProductType | null;
  errorMessage: string | null;
  relatedProducts?: AllProductInfoType[];
}


const formatStockLabel = (stock?: number) => {
  if (typeof stock !== "number") return "Stok mengikuti pilihan varian";
  if (stock <= 0) return "Stok habis / perlu konfirmasi admin";
  if (stock <= 5) return `Stok terbatas: ${stock}`;
  return `Stok tersedia: ${stock}`;
};

const DetailMarketplaceInfo = ({
  detailProduct,
  selectedVariant,
}: {
  detailProduct?: DetailProductType | null;
  selectedVariant?: VariantProductType;
}) => {
  const totalVariants = detailProduct?.variants_list?.length ?? 0;
  const totalStock = detailProduct?.variants_list?.reduce((sum, variant) => sum + (typeof variant.stock === "number" ? Math.max(variant.stock, 0) : 0), 0) ?? 0;
  const rating = "Lihat ulasan terverifikasi";

  return (
    <section className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50" aria-label="Ringkasan marketplace produk">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Info belanja</p>
          <h2 className="mt-1 text-base font-bold text-[#0D0E09]">Aman sebelum checkout</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Produk toko</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Varian</p>
          <p className="mt-1 font-semibold text-[#0D0E09]">{totalVariants ? `${totalVariants} pilihan` : "Belum tersedia"}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Stok</p>
          <p className="mt-1 font-semibold text-[#0D0E09]">{selectedVariant ? formatStockLabel(selectedVariant.stock) : totalStock > 0 ? `${totalStock} total` : "Pilih varian"}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Rating</p>
          <a href="#product-ratings" className="mt-1 inline-block font-semibold text-emerald-800 underline-offset-2 hover:underline">{rating}</a>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Brand</p>
          <p className="mt-1 break-words font-semibold text-[#0D0E09]">{detailProduct?.company || "Toko Herbal Amimum"}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs leading-relaxed text-emerald-900">
        <p className="rounded-2xl bg-white/80 px-3 py-2">✓ Harga dan stok mengikuti varian yang dipilih.</p>
        <p className="rounded-2xl bg-white/80 px-3 py-2">✓ Checkout memakai metode pembayaran resmi toko.</p>
        <p className="rounded-2xl bg-white/80 px-3 py-2">✓ Status pesanan bisa dipantau setelah checkout.</p>
      </div>
    </section>
  );
};

const DetailShoppingInfo = () => (
  <section className="rounded-3xl bg-emerald-50/80 p-4 text-xs leading-5 text-emerald-900 shadow-[0_8px_22px_rgba(15,23,42,0.08)]" aria-label="Info belanja aman">
    <p className="font-bold">Belanja aman di Toko Herbal Amimum</p>
    <div className="mt-2 grid gap-2">
      <p>• Pilih varian dan cek harga sebelum menekan tombol beli.</p>
      <p>• Pembayaran mengikuti metode resmi yang tampil saat checkout.</p>
      <p>• Pickup tidak memakai resi; jasa kirim menampilkan resi setelah admin input.</p>
    </div>
  </section>
);

const RelatedProductsSection = ({
  products,
  brandName,
}: {
  products: AllProductInfoType[];
  brandName?: string;
}) => {
  if (!products.length) {
    return null;
  }

  return (
    <section className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50" aria-label="Produk lain dari brand ini">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Produk terkait</p>
          <h2 className="mt-1 text-base font-bold text-[#0D0E09]">Produk lain dari brand ini</h2>
          <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
            {brandName
              ? `Pilihan lain dari ${brandName} yang masih tersedia di katalog toko.`
              : "Pilihan produk lain yang masih tersedia di katalog toko."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          {products.length} produk
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <CardProduct key={product.id} product={product} imageLoading="eager" />
        ))}
      </div>
    </section>
  );
};

export default function DetailProductClient({ detailProduct, errorMessage, relatedProducts = [] }: DetailProductClientProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<VariantProductType | undefined>(undefined);
  
  const handleVariantChange = (variant: VariantProductType) => {
    setSelectedVariant(variant);
  };
  
  const handleBack = () => {
    router.back();
  };

  const isValidProduct = detailProduct && validateDetailProductData(detailProduct);
  const isError = errorMessage ? 500 : 0;

  if (errorMessage && !detailProduct) {
    return (
      <div className="min-h-screen bg-transparent">
        <UnifiedHeader 
          type="secondary"
          title="Detail Item"
          subtitle="Informasi lengkap produk"
          showBackButton={true}
          onBack={handleBack}
        />
        <div className="px-4 py-6 text-center">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (detailProduct && !isValidProduct) {
    return (
      <div className="min-h-screen bg-transparent">
        <UnifiedHeader 
          type="secondary"
          title="Detail Item"
          subtitle="Informasi lengkap produk"
          showBackButton={true}
          onBack={handleBack}
        />
        <div className="px-4 py-6 text-center">
          <p className="text-red-500">Data produk tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Unified Header */}
      <UnifiedHeader 
        type="secondary"
        title="Detail Item"
        subtitle="Informasi lengkap produk"
        showBackButton={true}
        onBack={handleBack}
      />
      
      {/* Content - Optimized layout with proper spacing */}
      <div className={`px-4 py-5 ${selectedVariant ? "pb-56" : "pb-36"}`}>
        <div className="max-w-sm mx-auto space-y-4">
          <ProductImage 
            detailProduct={detailProduct || undefined}
            selectedVariantImg={selectedVariant?.img}
          />
          <TitleProduct isLoading={false} isError={isError} data={detailProduct || undefined} />
          <DetailMarketplaceInfo detailProduct={detailProduct} selectedVariant={selectedVariant} />
          <DetailShoppingInfo />
          
          {/* Variants Selection */}
          <ProductVariants 
            product={detailProduct || undefined} 
            variants={detailProduct?.variants_list ?? []} 
            onVariantChange={handleVariantChange}
            selectedVariant={selectedVariant}
            showQuickAdd={false}
          />
          
          {/* Variant Guidance */}
          {!selectedVariant && detailProduct?.variants_list && detailProduct.variants_list.length > 0 && (
            <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-[#2F6F5A] p-4 text-white shadow-[0_10px_24px_rgba(47,111,90,0.20)]">
              <p className="text-sm font-bold leading-6">
                Pilih varian untuk lanjut belanja
              </p>
              <p className="mt-1 text-xs leading-5 text-white/90">
                Setelah varian dipilih, harga final, stok, tombol Keranjang, dan Beli Langsung akan muncul di bawah layar.
              </p>
            </div>
          )}
          
          {selectedVariant && (
            <ProductInformation isLoading={false} isError={isError} datavariant={selectedVariant} />
          )}
          <ProductDescription isLoading={false} isError={isError} data={detailProduct || undefined} />
          {detailProduct && (
            <ProductRatingSection
              key={detailProduct.id}
              productId={detailProduct.id}
            />
          )}
          <RelatedProductsSection products={relatedProducts} brandName={detailProduct?.company} />
        </div>
      </div>

      {/* Sticky Cart Section - Only show when variant is selected */}
      {selectedVariant && detailProduct && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 border-t border-gray-100 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur" style={{ maxWidth: '440px', margin: '0 auto' }}>
          <div className="px-4 py-3">
            <ProductPrice 
              isLoading={false} 
              isError={isError} 
              data={detailProduct} 
              datavariant={selectedVariant}
              isSticky={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
