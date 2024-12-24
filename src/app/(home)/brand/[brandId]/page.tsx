"use client";

import { useProductByBrandId } from "@/app/hooks/useProductByBrandId";
import { PulseLoader } from "react-spinners";
import ListProductSection from "@/app/components/common/Search/List_Product_Section";
import Header from "@/app/components/hompage/Header_Section";
import { ProductByBrandIdProps } from "./types";

const BrandPage = ({ params }: { params: { brandId: string } }) => {
  const { productByBrandId, isError, isLoading, errorMessage } = useProductByBrandId(Number(params.brandId));

  return (
    <div className="pb-20">
      <Header />
      {productByBrandId?.map((product: ProductByBrandIdProps) => (
        <p key={product.id} className="mt-4 mx-6">Produk dari merek <span className="font-bold">&quot;{product.brand_info.name}&quot;</span></p>
      ))}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <PulseLoader color="hsl(var(--primary))" size={10} />
        </div>
      ) : isError ? (
        <p className="text-gray-500 text-center mt-4">{errorMessage}</p>
      ) : productByBrandId && productByBrandId.length > 0 ? (
        <div className="mx-6">
          <ListProductSection products={productByBrandId} />
        </div>
      ) : (
        <p className="text-gray-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default BrandPage; 