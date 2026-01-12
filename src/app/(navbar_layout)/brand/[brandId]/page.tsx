import DetailBrand from "@/components/DetailBrand";
import ProductListWithPagination from "@/components/DetailBrand/ProductListWithPagination";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { BrandDetailType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { validateProductData } from "@/utils/dataValidation";
import { GetBrandDetailByIDServer } from "@/services/api/brand";
import { GetProductsByProductionIdServer } from "@/services/api/product";

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  let brandData: BrandDetailType | null = null;
  let errorMessage: string | null = null;
  let products: CardProductProps[] = [];
  
  // Validate brandId parameter
  if (!brandId || typeof brandId !== 'string') {
    return (
      <main className="pb-20">
        <UnifiedHeader type="main" title="Brand Not Found" />
        <div className="p-4 text-center">
          <p className="text-red-500">Invalid brand ID provided</p>
        </div>
      </main>
    );
  }

  // Parse brandId to number
  const productionId = parseInt(brandId, 10);
  if (isNaN(productionId)) {
    return (
      <main className="pb-20">
        <UnifiedHeader type="main" title="Brand Not Found" />
        <div className="p-4 text-center">
          <p className="text-red-500">Invalid brand ID format</p>
        </div>
      </main>
    );
  }
  
  // Fetch brand detail from API
  try {
    brandData = await GetBrandDetailByIDServer(productionId);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Gagal mengambil data brand';
  }
    
  // Fetch products from API
  try {
    const allProducts = await GetProductsByProductionIdServer(productionId);
    const validProducts = allProducts.filter(validateProductData);
    products = validProducts;
  } catch {
    products = [];
  }
  
  return (
    <main className="pb-20">
      <UnifiedHeader 
        type="main"
        showCart={true}
        showNotifications={true}
      />
      <DetailBrand 
        brandDetail={brandData} 
        errorMessage={errorMessage}
        promoProductCount={brandData?.total_product_with_promo}
      />
      <SearchProductByBrand 
        brandId={productionId} 
        brandName={brandData?.name || ""}
        brandData={brandData ? {
          id: brandData.id,
          name: brandData.name,
          photo_url: brandData.photo_url || undefined,
        } : null}
      />
      <ProductListWithPagination 
        products={products} 
        title={`Daftar Produk ${brandData?.name || "Brand"}`}
        emptyMessage="Produk brand belum tersedia."
      />
    </main>
  );
}