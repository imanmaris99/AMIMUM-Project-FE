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
    console.error('Error fetching brand detail:', error);
  }
    
  // Fetch products from API
  try {
    const allProducts = await GetProductsByProductionIdServer(productionId);
    
    // Log for debugging
    console.log('Fetched products:', allProducts.length, allProducts);
    
    // Validate products data
    const validProducts = allProducts.filter(validateProductData);
    const invalidProducts = allProducts.filter(prod => !validateProductData(prod));
    
    if (invalidProducts.length > 0) {
      console.warn(`${invalidProducts.length} invalid products found and filtered out:`, invalidProducts);
    }
    
    products = validProducts;
  } catch (error) {
    // Error fetching products is not fatal - page can still show brand detail
    console.error('Error fetching products:', error);
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
      />
      <ProductListWithPagination 
        products={products} 
        title={`Daftar Produk ${brandData?.name || "Brand"}`}
        emptyMessage="Produk brand belum tersedia."
      />
    </main>
  );
}