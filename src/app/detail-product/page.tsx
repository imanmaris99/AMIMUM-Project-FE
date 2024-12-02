"use client";

import ProductImage from "@/app/components/detailproduct/ProductImage";
import TitleProduct from "@/app/components/detailproduct/TitleProduct";
import ProductVariants from "@/app/components/detailproduct/ProductVariants";
import ProductInformation from "@/app/components/detailproduct/ProductInformation";
import ProductDescription from "@/app/components/detailproduct/ProductDescription";
import ProductPrice from "@/app/components/detailproduct/ProductPrice";

const DetailProduct = () => {
  return (
    <main className="pb-20">
      <ProductImage />
      <TitleProduct />
      <ProductVariants />
      <ProductInformation />
      <ProductDescription />
      <ProductPrice />
    </main>
  );
};

export default DetailProduct;
