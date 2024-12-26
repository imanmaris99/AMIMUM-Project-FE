"use client";
import Header from "@/components/homepage/Header_Section";
import DetailBrand from "@/components/DetailBrand";
import ProductList from "@/components/DetailBrand/ProductList";

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
