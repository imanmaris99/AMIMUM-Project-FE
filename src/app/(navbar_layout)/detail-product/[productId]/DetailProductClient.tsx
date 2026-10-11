"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { validateDetailProductData } from "@/utils/dataValidation";
import UnifiedHeader from "@/components/common/UnifiedHeader";

interface DetailProductClientProps {
  detailProduct: DetailProductType | null;
  errorMessage: string | null;
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
  const rating = typeof detailProduct?.avg_rating === "number" && detailProduct.avg_rating > 0
    ? `${detailProduct.avg_rating.toFixed(1)} / 5`
    : "Belum ada rating";

  return (
    <section className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50" aria-label="Ringkasan marketplace produk">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Info marketplace</p>
          <h2 className="mt-1 text-base font-bold text-[#0D0E09]">Cek sebelum checkout</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Produk toko</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Varian</p>
          <p className="mt-1 font-semibold text-[#0D0E09]">{totalVariants || "Belum tersedia"}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Stok katalog</p>
          <p className="mt-1 font-semibold text-[#0D0E09]">{selectedVariant ? formatStockLabel(selectedVariant.stock) : totalStock > 0 ? `${totalStock} total` : "Pilih varian"}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Rating</p>
          <p className="mt-1 font-semibold text-[#0D0E09]">{rating}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50/70 px-3 py-2">
          <p className="text-[#6B7C73]">Produksi/brand</p>
          <p className="mt-1 break-words font-semibold text-[#0D0E09]">{detailProduct?.company || "Toko Herbal Amimum"}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs leading-relaxed text-emerald-900">
        <p className="rounded-2xl bg-white/80 px-3 py-2">✅ Produk dicek dari katalog toko sebelum checkout.</p>
        <p className="rounded-2xl bg-white/80 px-3 py-2">✅ Bisa pilih pickup atau pengiriman sesuai alamat dan kurir tersedia.</p>
        <p className="rounded-2xl bg-white/80 px-3 py-2">✅ Status pesanan bisa dipantau dari halaman transaksi/tracking.</p>
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

export default function DetailProductClient({ detailProduct, errorMessage }: DetailProductClientProps) {
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
            <div className="rounded-3xl bg-white/90 p-4 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-sm font-semibold leading-6 text-emerald-900">
                Pilih varian untuk melihat harga, stok, dan masa berlaku produk.
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-700/90">
                Tombol Keranjang/Beli Langsung akan muncul setelah varian dipilih.
              </p>
            </div>
          )}
          
          {selectedVariant && (
            <ProductInformation isLoading={false} isError={isError} datavariant={selectedVariant} />
          )}
          <ProductDescription isLoading={false} isError={isError} data={detailProduct || undefined} />
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
