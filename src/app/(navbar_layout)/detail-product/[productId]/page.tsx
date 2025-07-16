import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
import { getDetailProductServer } from "@/API/detail-product";
import { DetailProductType } from "@/types/detailProduct";

export default async function DetailProduct({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  let detailProduct: DetailProductType | undefined = undefined;
  let errorMessage: string | null = null;
  try {
    const data = await getDetailProductServer(productId);
    detailProduct = data ?? undefined;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  // isError harus number
  const isError = errorMessage ? 500 : 0;
  return (
    <main className="pb-20">
      <ProductImage detailProduct={detailProduct} />
      <TitleProduct isLoading={false} isError={isError} data={detailProduct} />
      <ProductVariants variants={detailProduct?.variants_list ?? []} />
      <ProductInformation isLoading={false} isError={isError} datavariant={detailProduct?.variants_list?.[0]} />
      <ProductDescription isLoading={false} isError={isError} data={detailProduct} />
      <ProductPrice isLoading={false} isError={isError} data={detailProduct} datavariant={detailProduct?.variants_list?.[0]} />
    </main>
  );
}
