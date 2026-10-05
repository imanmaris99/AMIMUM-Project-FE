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

const DetailShoppingInfo = () => (
  <section className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 text-xs leading-5 text-emerald-900 shadow-[0_12px_32px_rgba(0,106,71,0.08)]" aria-label="Info belanja aman">
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
          <DetailShoppingInfo />
          
          {/* Variants Selection */}
          <ProductVariants 
            product={detailProduct || undefined} 
            variants={detailProduct?.variants_list ?? []} 
            onVariantChange={handleVariantChange}
            selectedVariant={selectedVariant}
            showQuickAdd={false}
          />
          
          {/* Variant Selection Prompt */}
          {!selectedVariant && detailProduct?.variants_list && detailProduct.variants_list.length > 0 && (
            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-3 text-center shadow-[0_12px_32px_rgba(0,106,71,0.08)] backdrop-blur">
              <p className="text-sm font-semibold text-emerald-900">
                Pilih varian untuk melihat harga dan melanjutkan pembelian.
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Tombol Keranjang/Beli Langsung muncul setelah varian dipilih.
              </p>
            </div>
          )}
          
          <ProductInformation isLoading={false} isError={isError} datavariant={selectedVariant} />
          <ProductDescription isLoading={false} isError={isError} data={detailProduct || undefined} />
        </div>
      </div>

      {/* Sticky Cart Section - Only show when variant is selected */}
      {selectedVariant && detailProduct && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 border-t border-emerald-100 bg-white/95 shadow-[0_-12px_32px_rgba(0,106,71,0.10)] backdrop-blur" style={{ maxWidth: '440px', margin: '0 auto' }}>
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
