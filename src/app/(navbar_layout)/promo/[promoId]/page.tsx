import ProductListWithPagination from "@/components/DetailBrand/ProductListWithPagination";
import DetailBrand from "@/components/DetailBrand";
// import { BrandDetailResponseType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import { getBrandForPromo, getPromoProducts } from "@/data/dataUtils";
import UnifiedHeader from "@/components/common/UnifiedHeader";

export default async function PromoDetailPage({ params }: { params: Promise<{ promoId: string }> }) {
  const { promoId } = await params;
  // let brandDetail: BrandDetailResponseType | null = null;
  let products: CardProductProps[] = [];
  const errorMessage: string | null = null;
  
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
  const brandDataFromAPI = getBrandForPromo(promoId);
  // brandDetail = brandDataFromAPI ? {
  //   status_code: 200,
  //   message: "Success",
  //   data: {
  //     ...brandDataFromAPI.data,
  //     description_list: [...brandDataFromAPI.data.description_list]
  //   }
  // } : null;
  
  // Mapping brand detail agar field sesuai kebutuhan komponen
  // const _brandData = brandDetail?.data
  //   ? {
  //       ...brandDetail.data,
  //       // Tidak perlu mapping karena sudah sesuai dengan backend DTO
  //     }
  //   : null;
    
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
              <UnifiedHeader 
                type="main"
                showCart={true}
                showNotifications={true}
              />
      <DetailBrand 
        brandDetail={brandDataFromAPI ? {
          id: brandDataFromAPI.data.id,
          name: brandDataFromAPI.data.name,
          photo_url: brandDataFromAPI.data.photo_url,
          description_list: [...brandDataFromAPI.data.description_list],
          total_product: brandDataFromAPI.data.total_product,
          created_at: brandDataFromAPI.data.created_at,
          category: "Jamu", // Default category
          total_product_with_promo: products.length
        } : null} 
        errorMessage={errorMessage} 
        promoProductCount={products.length}
      />
      <ProductListWithPagination 
        products={products} 
        title={`Produk Promo ${brandDataFromAPI?.data?.name || "Brand"}`}
        emptyMessage="Produk promo belum tersedia."
      />
    </div>
  );
}