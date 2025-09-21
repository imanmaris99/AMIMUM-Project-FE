import DetailBrand from "@/components/DetailBrand";
import ProductList from "@/components/DetailBrand/ProductList";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { BrandDetailResponseType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import { getBrandData, getCardProductsByBrand } from "@/data/dataUtils";
import UnifiedHeader from "@/components/common/UnifiedHeader";

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  let brandDetail: BrandDetailResponseType | null = null;
  let products: CardProductProps[] = [];
  const errorMessage: string | null = null;
  
  // API calls dinonaktifkan sementara karena server sedang down
  // try {
  //   const res = await fetch(`https://amimumprojectbe-production.up.railway.app/brand/detail/${brandId}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (!res.ok) throw new Error(`Gagal mengambil data brand: ${res.status}`);
  //   brandDetail = await res.json();
  // } catch (err) {
  //   errorMessage = err instanceof Error ? err.message : String(err);
  // }
  
  // Menggunakan centralized data management
  const selectedBrandData = getBrandData(brandId);
  if (selectedBrandData) {
    brandDetail = {
      data: selectedBrandData
    };
  }
  
  // Mapping brand detail agar field sesuai kebutuhan komponen
  const brandData = brandDetail?.data
    ? {
        ...brandDetail.data,
        // Tidak perlu mapping karena sudah sesuai dengan backend DTO
      }
    : null;
    
  // API call untuk produk dinonaktifkan sementara
  // try {
  //   const res = await fetch(`https://amimumprojectbe-production.up.railway.app/product/production/${brandId}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     products = Array.isArray(data?.data) ? data.data : [];
  //   }
  // } catch {
  //   // error produk tidak fatal
  // }
  
  // Menggunakan centralized data management
  products = getCardProductsByBrand(brandId);
  
  return (
    <main className="pb-20">
              <UnifiedHeader 
                type="main"
                showCart={true}
                showNotifications={true}
              />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <SearchProductByBrand brandId={Number(brandId)} brandName={brandData?.name || ""} />
      <ProductList products={products} />
    </main>
  );
}