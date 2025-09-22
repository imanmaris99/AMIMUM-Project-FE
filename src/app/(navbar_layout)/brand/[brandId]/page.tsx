import DetailBrand from "@/components/DetailBrand";
import ProductListWithPagination from "@/components/DetailBrand/ProductListWithPagination";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { BrandDetailResponseType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import { getBrandData, getCardProductsByBrand } from "@/data/dataUtils";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { validateProductData } from "@/utils/dataValidation";
import { ErrorHandler } from "@/lib/errorHandler";

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  let brandDetail: BrandDetailResponseType | null = null;
  let products: CardProductProps[] = [];
  const errorMessage: string | null = null;
  
  // Validate brandId parameter
  if (!brandId || typeof brandId !== 'string') {
    ErrorHandler.handleError(new Error('Invalid brand ID parameter'), 'BrandPage');
    return (
      <main className="pb-20">
        <UnifiedHeader type="back" title="Brand Not Found" />
        <div className="p-4 text-center">
          <p className="text-red-500">Invalid brand ID provided</p>
        </div>
      </main>
    );
  }
  
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
  
  // Menggunakan centralized data management with validation
  const selectedBrandData = getBrandData(brandId);
  if (selectedBrandData) {
    // Validate brand data structure
    if (!selectedBrandData.id || !selectedBrandData.name) {
      ErrorHandler.handleError(new Error('Invalid brand data structure'), 'BrandPage');
    } else {
      brandDetail = {
        data: selectedBrandData
      };
    }
  } else {
    ErrorHandler.handleError(new Error(`Brand with ID ${brandId} not found`), 'BrandPage');
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
  
  // Menggunakan centralized data management with validation
  const allProducts = getCardProductsByBrand(brandId);
  
  // Validate products data
  const validProducts = allProducts.filter(validateProductData);
  const invalidProducts = allProducts.filter(prod => !validateProductData(prod));
  
  if (invalidProducts.length > 0) {
    ErrorHandler.handleError(new Error(`${invalidProducts.length} invalid products found and filtered out`), 'BrandPage');
  }
  
  products = validProducts;
  
  
  return (
    <main className="pb-20">
              <UnifiedHeader 
                type="main"
                showCart={true}
                showNotifications={true}
              />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <SearchProductByBrand brandId={Number(brandId)} brandName={brandData?.name || ""} />
      <ProductListWithPagination 
        products={products} 
        title={`Daftar Produk ${brandData?.name || "Brand"}`}
        emptyMessage="Produk brand belum tersedia."
      />
    </main>
  );
}