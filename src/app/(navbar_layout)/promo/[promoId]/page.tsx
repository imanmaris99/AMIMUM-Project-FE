import Header from "@/components/homepage/Header_Section";
import ProductList from "@/components/DetailBrand/ProductList";
import DetailBrand from "@/components/DetailBrand";
import { GetBrandDetailByIDServer } from "@/API/brand";
import { GetProductDiscountByBrandIdServer } from "@/API/product";
import { BrandDetailResponseType, ProductType } from "@/types/detailProduct";

export default async function PromoDetailPage({ params }: { params: Promise<{ promoId: string }> }) {
  const { promoId } = await params;
  let brandDetail: BrandDetailResponseType | null = null;
  let products: ProductType[] = [];
  let errorMessage: string | null = null;
  try {
    brandDetail = await GetBrandDetailByIDServer(Number(promoId));
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  // Mapping brand detail agar field sesuai kebutuhan komponen
  const brandData = brandDetail?.data
    ? {
        ...brandDetail.data,
        image_url: brandDetail.data.photo_url,
        description: brandDetail.data.description_list || [],
        product_count: brandDetail.data.total_product_with_promo ?? brandDetail.data.total_product,
      }
    : null;
  try {
    const res = await GetProductDiscountByBrandIdServer(Number(promoId));
    // Mapping produk agar sesuai dengan CardProductProps
    products = Array.isArray(res?.data)
      ? res.data.map((prod: any) => ({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          all_variants: prod.all_variants,
          created_at: prod.created_at,
        }))
      : [];
  } catch {
    // error produk tidak fatal
  }
  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <ProductList products={products} />
    </div>
  );
}
