"use client";
import { useDetailProduct } from "@/app/hooks/useDetailProduct";
import ProductImage from "@/app/components/detailproduct/ProductImage";
import TitleProduct from "@/app/components/detailproduct/TitleProduct";
import ProductVariants from "@/app/components/detailproduct/ProductVariants";
import ProductInformation from "@/app/components/detailproduct/ProductInformation";
import ProductDescription from "@/app/components/detailproduct/ProductDescription";
import ProductPrice from "@/app/components/detailproduct/ProductPrice";

const DetailProduct = ({ params }: { params: { productId: string } }) => {
  const { detailProduct, isLoading, isError } = useDetailProduct(
    params.productId
  );
  return (
    <main className="pb-20">
      <ProductImage productId={params.productId} />
      <TitleProduct
        isLoading={isLoading}
        isError={isError}
        data={detailProduct}
      />
      <ProductVariants />
      <ProductInformation
        isLoading={isLoading}
        isError={isError}
        datavariant={detailProduct?.variants_list[0]}
      />
      <ProductDescription
        isLoading={isLoading}
        isError={isError}
        data={detailProduct}
      />
      <ProductPrice
        isLoading={isLoading}
        isError={isError}
        data={detailProduct}
        datavariant={detailProduct?.variants_list[0]}
      />
    </main>
  );
};

export default DetailProduct;
