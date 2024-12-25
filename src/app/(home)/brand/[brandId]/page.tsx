"use client";

import Header from "@/app/components/hompage/Header_Section";
import DetailBrand from "@/app/components/DetailBrand";
import ProductList from "@/app/components/DetailBrand/ProductList";

const BrandPage = ({ params }: { params: { brandId: string } }) => {
  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetailId={Number(params.brandId)} />
      <ProductList brandId={Number(params.brandId)} />
    </div>
  );
};

export default BrandPage;
