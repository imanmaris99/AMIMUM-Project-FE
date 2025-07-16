import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
import { getDetailProduct } from "@/API/detail-product";
import { DetailProductType } from "@/types/detailProduct";

export default async function DetailProduct({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  let detailProduct: DetailProductType | null = null;
  let errorMessage: string | null = null;
  try {
    detailProduct = await getDetailProduct(productId);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  return (
    <main className="pb-20">
      <ProductImage detailProduct={detailProduct} />
      <TitleProduct isLoading={false} isError={errorMessage ? errorMessage : 0} data={detailProduct} />
      <ProductVariants variants={detailProduct?.variants_list || []} />
      <ProductInformation isLoading={false} isError={errorMessage ? errorMessage : 0} datavariant={detailProduct?.variants_list?.[0]} />
      <ProductDescription isLoading={false} isError={errorMessage ? errorMessage : 0} data={detailProduct} />
      <ProductPrice isLoading={false} isError={errorMessage ? errorMessage : 0} data={detailProduct} datavariant={detailProduct?.variants_list?.[0]} />
    </main>
  );
}
