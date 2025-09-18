"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { getDetailProduct } from "@/data/dataUtils";
import { validateDetailProductData } from "@/utils/dataValidation";

export default function DetailProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  
  const [detailProduct, setDetailProduct] = useState<DetailProductType | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<VariantProductType | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        console.log(`Loading product with ID: ${productId}`);
        const product = getDetailProduct(productId);
        
        if (!product) {
          console.warn(`Product with ID ${productId} not found`);
          setErrorMessage("Produk tidak ditemukan");
          return;
        }
        
        // Validate product data before setting
        if (!validateDetailProductData(product)) {
          console.error(`Invalid product data for ID ${productId}:`, product);
          setErrorMessage("Data produk tidak valid");
          return;
        }
        
        console.log(`Product loaded successfully: ${product.name}`);
        setDetailProduct(product);
        
        // Set default selected variant to first variant
        if (product.variants_list && product.variants_list.length > 0) {
          setSelectedVariant(product.variants_list[0]);
          console.log(`✅ Default variant selected: ${product.variants_list[0].variant}`);
          console.log("🎯 Selected variant data:", product.variants_list[0]);
        } else {
          console.warn("❌ No variants available for product");
        }
      } catch (err) {
        console.error(`Error loading product ${productId}:`, err);
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
    console.log("🎯 DetailProduct: Variant changed to:", variant);
    console.log("🎯 DetailProduct: Variant ID:", variant.id);
    console.log("🎯 DetailProduct: Variant name:", variant.name);
    setSelectedVariant(variant);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // isError harus number
  const isError = errorMessage ? 500 : 0;
  
  return (
    <div className="min-h-screen bg-white">
        {/* Header - Same style as track order with white background */}
        <div className="flex justify-center items-center relative mt-16">
          <div className="absolute left-10">
            <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
          </div>
          <div className="text-center">
            <h1 className="text-[16px] font-semibold">Detail Item</h1>
            <p className="text-xs text-gray-500 mt-1">Informasi lengkap produk</p>
          </div>
        </div>
        
        {/* Content - Same structure as other pages */}
        <div className="px-4 py-6 pb-6">
          <div className="max-w-sm mx-auto space-y-4">
            <ProductImage detailProduct={detailProduct} />
            <TitleProduct isLoading={isLoading} isError={isError} data={detailProduct} />
            <ProductVariants 
              product={detailProduct} 
              variants={detailProduct?.variants_list ?? []} 
              onVariantChange={handleVariantChange}
            />
            <ProductInformation isLoading={isLoading} isError={isError} datavariant={selectedVariant} />
            <ProductDescription isLoading={isLoading} isError={isError} data={detailProduct} />
            <ProductPrice 
              isLoading={isLoading} 
              isError={isError} 
              data={detailProduct} 
              datavariant={selectedVariant} 
            />
          </div>
        </div>
      </div>
  );
}