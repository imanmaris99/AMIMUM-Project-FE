"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductImage from "@/components/DetailProduct/ProductImage";
import TitleProduct from "@/components/DetailProduct/TitleProduct";
import ProductVariants from "@/components/DetailProduct/ProductVariants";
import ProductInformation from "@/components/DetailProduct/ProductInformation";
import ProductDescription from "@/components/DetailProduct/ProductDescription";
import ProductPrice from "@/components/DetailProduct/ProductPrice";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { getDetailProduct } from "@/data/dataUtils";
import { validateDetailProductData } from "@/utils/dataValidation";
import UnifiedHeader from "@/components/common/UnifiedHeader";

export default function DetailProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;
  
  const [detailProduct, setDetailProduct] = useState<DetailProductType | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<VariantProductType | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        const product = getDetailProduct(productId);
        
        if (!product) {
          setErrorMessage("Produk tidak ditemukan");
          return;
        }
        
        // Validate product data before setting
        if (!validateDetailProductData(product)) {
          setErrorMessage("Data produk tidak valid");
          return;
        }
        
        setDetailProduct(product);
        
        // Don't auto-select variant - let user choose
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      loadProduct();
    }
  }, [productId]);
  
  const handleVariantChange = (variant: VariantProductType) => {
    setSelectedVariant(variant);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // isError harus number
  const isError = errorMessage ? 500 : 0;
  
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
            <ProductImage detailProduct={detailProduct} />
            <TitleProduct isLoading={isLoading} isError={isError} data={detailProduct} />
            
            {/* Variants Selection */}
            <ProductVariants 
              product={detailProduct} 
              variants={detailProduct?.variants_list ?? []} 
              onVariantChange={handleVariantChange}
              selectedVariant={selectedVariant}
              showQuickAdd={false}
            />
            
            {/* Variant Selection Prompt */}
            {!selectedVariant && !isLoading && detailProduct?.variants_list && detailProduct.variants_list.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  📦 Pilih varian produk untuk melihat harga dan menambahkan ke keranjang
                </p>
              </div>
            )}
            
            <ProductInformation isLoading={isLoading} isError={isError} datavariant={selectedVariant} />
            <ProductDescription isLoading={isLoading} isError={isError} data={detailProduct} />
          </div>
        </div>

        {/* Sticky Cart Section - Only show when variant is selected */}
        {!isLoading && selectedVariant && (
          <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30" style={{ maxWidth: '440px', margin: '0 auto' }}>
            <div className="px-4 py-3">
              <ProductPrice 
                isLoading={isLoading} 
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