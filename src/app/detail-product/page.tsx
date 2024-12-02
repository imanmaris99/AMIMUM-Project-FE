"use client";

import ProductImage from "@/app/components/detailproduct/ProductImage";
import TitleProduct from "@/app/components/detailproduct/TitleProduct";
import ProductVariants from "@/app/components/detailproduct/ProductVariants";
import ProductInformation from "@/app/components/detailproduct/ProductInformation";
import ProductDescription from "@/app/components/detailproduct/ProductDescription";
import ProductPrice from "@/app/components/detailproduct/ProductPrice";

const DetailProduct = () => {
  return (
    <main>
      <div>
        <ProductImage />
      </div>
      <div>
        <TitleProduct />
      </div>
      <div>
        <ProductVariants />
      </div>
      <div>
        <ProductInformation />
      </div>
      <div>
        <ProductDescription />
      </div>
      <div>
        <ProductPrice />
      </div>
    </main>
  );
};

export default DetailProduct;
