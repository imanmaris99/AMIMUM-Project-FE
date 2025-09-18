"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
import DetailProductHeader from "@/components/detailproduct/DetailProductHeader";
import { DetailProductType, VariantProductType } from "@/types/detailProduct";
import { getDetailProduct } from "@/data/dataUtils";

export default function DetailProduct() {
  const params = useParams();
  const productId = params.productId as string;
  
  const [detailProduct, setDetailProduct] = useState<DetailProductType | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<VariantProductType | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const product = getDetailProduct(productId);
        
        if (!product) {
          setErrorMessage("Produk tidak ditemukan");
          return;
        }
        
        setDetailProduct(product);
        // Set default selected variant to first variant
        if (product.variants_list && product.variants_list.length > 0) {
          setSelectedVariant(product.variants_list[0]);
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [productId]);
  
  const handleVariantChange = (variant: VariantProductType) => {
    setSelectedVariant(variant);
  };
  
  // isError harus number
  const isError = errorMessage ? 500 : 0;
  
  return (
    <div className="flex flex-col justify-between min-h-screen bg-white">
      {/* Header */}
      <DetailProductHeader title="Detail Item" />
      
      {/* Content */}
      <main className="pb-20 mt-20">
        <ProductImage detailProduct={detailProduct} />
        <TitleProduct isLoading={isLoading} isError={isError} data={detailProduct} />
        <ProductVariants 
          product={detailProduct} 
          variants={detailProduct?.variants_list ?? []} 
          onVariantChange={handleVariantChange}
        />
        <ProductInformation isLoading={isLoading} isError={isError} datavariant={selectedVariant} />
        <ProductDescription isLoading={isLoading} isError={isError} data={detailProduct} />
        <ProductPrice isLoading={isLoading} isError={isError} data={detailProduct} datavariant={selectedVariant} />
      </main>
    </div>
  );
}