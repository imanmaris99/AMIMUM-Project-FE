import Header from "@/components/homepage/Header_Section";
import ProductList from "@/components/DetailBrand/ProductList";
import DetailBrand from "@/components/DetailBrand";
import { BrandDetailResponseType, ProductType } from "@/types/detailProduct";
import { getBrandForPromo, getPromoProducts } from "@/data/dataUtils";

export default async function PromoDetailPage({ params }: { params: Promise<{ promoId: string }> }) {
  const { promoId } = await params;
  let brandDetail: BrandDetailResponseType | null = null;
  let products: ProductType[] = [];
  let errorMessage: string | null = null;
  
  // API calls dinonaktifkan sementara karena server sedang down
  // try {
  //   const res = await fetch(`https://amimumprojectbe-production.up.railway.app/brand/detail/${promoId}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (!res.ok) throw new Error(`Gagal mengambil data brand: ${res.status}`);
  //   brandDetail = await res.json();
  // } catch (err) {
  //   errorMessage = err instanceof Error ? err.message : String(err);
  // }
  
  // Menggunakan centralized data management
  brandDetail = getBrandForPromo(promoId);
  
  // Mapping brand detail agar field sesuai kebutuhan komponen
  const brandData = brandDetail?.data
    ? {
        ...brandDetail.data,
        image_url: brandDetail.data.photo_url,
        description: brandDetail.data.description_list || [],
        product_count: brandDetail.data.total_product_with_promo, // Hanya produk dengan promo
      }
    : null;
    
  // API call untuk produk promo dinonaktifkan sementara
  // try {
  //   const res = await fetch(`https://amimumprojectbe-production.up.railway.app/product/discount/production/${promoId}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     products = Array.isArray(data?.data)
  //       ? data.data.map((prod: any) => ({
  //           id: prod.id,
  //           name: prod.name,
  //           price: prod.price,
  //           all_variants: prod.all_variants,
  //           created_at: prod.created_at,
  //         }))
  //       : [];
  //   }
  // } catch {
  //   // error produk tidak fatal
  // }
  
  // Menggunakan centralized data management
  products = getPromoProducts(promoId);
  
  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <ProductList products={products} />
    </div>
  );
}