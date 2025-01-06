"use client";
import Header from "@/components/homepage/Header_Section";
import DetailBrand from "@/components/DetailBrand";
import ProductList from "@/components/DetailBrand/ProductList";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { useProductByBrandId } from "@/hooks/useProductByBrandId";
import { PulseLoader } from "react-spinners";

const BrandPage = ({ params }: { params: { brandId: string } }) => {
  const { isLoading, errorMessage } = useProductByBrandId(
    Number(params.brandId)
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader color="hsl(var(--primary))" size={10} />
      </div>
    );
  if (errorMessage)
    return (
      <div>
        <Header />
        <DetailBrand brandDetailId={Number(params.brandId)} />
        <ProductList brandId={Number(params.brandId)} />
      </div>
    );

  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetailId={Number(params.brandId)} />
      <SearchProductByBrand />
      <ProductList brandId={Number(params.brandId)} />
    </div>
  );
};
export default BrandPage;
