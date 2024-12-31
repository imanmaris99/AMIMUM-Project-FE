"use client";

import { useGetProductDiscountByBrandId } from "@/hooks/useGetProductDiscountByBrandId";
import Header from "@/components/homepage/Header_Section";
import ProductList from "@/components/DetailBrand/ProductList";
import DetailBrand from "@/components/DetailBrand";
import { PulseLoader } from "react-spinners";

const PromoDetailPage = ({ params }: { params: { promoId: string } }) => {
  const { isLoading, errorMessage } = useGetProductDiscountByBrandId(
    Number(params.promoId)
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader color="hsl(var(--primary))" size={10} />
      </div>
    );

  if (errorMessage)
    return (
      <div className="pb-20">
        <Header />
        <DetailBrand brandDetailId={Number(params.promoId)} />
        <ProductList brandId={Number(params.promoId)} />
      </div>
    );

  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetailId={Number(params.promoId)} />
      <ProductList brandId={Number(params.promoId)} />
    </div>
  );
};

export default PromoDetailPage;
