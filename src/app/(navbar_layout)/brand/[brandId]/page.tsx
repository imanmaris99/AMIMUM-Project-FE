import DetailBrand from "@/components/DetailBrand";
import ProductList from "@/components/DetailBrand/ProductList";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { GetBrandDetailByID } from "@/API/brand";
import { GetProductByBrandId } from "@/API/product";
import { BrandDetailResponseType, ProductType } from "@/types/detailProduct";

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  let brandDetail: BrandDetailResponseType | null = null;
  let products: ProductType[] = [];
  let errorMessage: string | null = null;
  try {
    brandDetail = await GetBrandDetailByID(Number(brandId));
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  try {
    const res = await GetProductByBrandId(Number(brandId));
    products = Array.isArray(res?.data) ? res.data : [];
  } catch {
    // error produk tidak fatal
  }
  return (
    <main className="pb-20">
      <DetailBrand brandDetail={brandDetail?.data || null} errorMessage={errorMessage} />
      <ProductList products={products} />
      <SearchProductByBrand brandId={Number(brandId)} />
    </main>
  );
}
