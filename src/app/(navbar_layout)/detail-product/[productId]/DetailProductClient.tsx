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

export default function DetailProductClient({ detailProduct, errorMessage }: DetailProductClientProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<VariantProductType | undefined>(undefined);
  
  const handleVariantChange = (variant: VariantProductType) => {
    setSelectedVariant(variant);
  };
  
  const handleBack = () => {
    router.back();
  };

  // Validate product data if available
  const isValidProduct = detailProduct && validateDetailProductData(detailProduct);
  const isError = errorMessage ? 500 : 0;

  // Show error state
  if (errorMessage && !detailProduct) {
    return (
      <div className="min-h-screen bg-white">
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

  // Show invalid data state
  if (detailProduct && !isValidProduct) {
    return (
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-white">
      {/* Unified Header */}
      <UnifiedHeader 
        type="secondary"
        title="Detail Item"
        subtitle="Informasi lengkap produk"
        showBackButton={true}
        onBack={handleBack}
      />
      
      {/* Content - Optimized layout with proper spacing */}
      <div className="px-4 py-6 pb-56">
        <div className="max-w-sm mx-auto space-y-4">
          <ProductImage detailProduct={detailProduct || undefined} />
          <TitleProduct isLoading={false} isError={isError} data={detailProduct || undefined} />
          
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700 text-sm font-medium">
                📦 Pilih varian produk untuk melihat harga dan menambahkan ke keranjang
              </p>
            </div>
          )}
          
          <ProductInformation isLoading={false} isError={isError} datavariant={selectedVariant} />
          <ProductDescription isLoading={false} isError={isError} data={detailProduct || undefined} />
        </div>
      </div>

      {/* Sticky Cart Section - Only show when variant is selected */}
      {selectedVariant && detailProduct && (
        <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30" style={{ maxWidth: '440px', margin: '0 auto' }}>
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
