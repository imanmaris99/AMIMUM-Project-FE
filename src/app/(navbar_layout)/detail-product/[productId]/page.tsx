"use client";
import { useDetailProduct } from "@/hooks/useDetailProduct";
import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";

const DetailProduct = ({ params }: { params: { productId: string } }) => {
  const { detailProduct, isLoading, isError } = useDetailProduct(params.productId);
  return (
    <main className="pb-20">
      <ProductImage productId={params.productId} />
      <TitleProduct isLoading={isLoading} isError={isError} data={detailProduct} />
      <ProductVariants />
      <ProductInformation isLoading={isLoading} isError={isError} datavariant={detailProduct?.variants_list[0]} />
      <ProductDescription isLoading={isLoading} isError={isError} data={detailProduct} />
      <ProductPrice isLoading={isLoading} isError={isError} data={detailProduct} datavariant={detailProduct?.variants_list[0]} />
    </main>
  );
};

export default DetailProduct;
