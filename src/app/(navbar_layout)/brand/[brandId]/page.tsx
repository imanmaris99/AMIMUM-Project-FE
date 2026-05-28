import DetailBrand from "@/components/DetailBrand";
import ProductListWithPagination from "@/components/DetailBrand/ProductListWithPagination";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { BrandDetailType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import UnifiedHeader from "@/components/common/UnifiedHeader";

import { GetBrandDetailByIDServer } from "@/services/api/brand";
import { GetProductsByProductionIdServer } from "@/services/api/product";

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  let brandData: BrandDetailType | null = null;
  let errorMessage: string | null = null;
  let products: CardProductProps[] = [];
  
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
  
  try {
    brandData = await GetBrandDetailByIDServer(productionId);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Gagal mengambil data brand';
  }
    
  try {
    const allProducts = await GetProductsByProductionIdServer(productionId);

    products = allProducts.map((product) => {
      const variants = Array.isArray(product.all_variants) && product.all_variants.length > 0
        ? product.all_variants
        : [{
            id: 0,
            variant: "default",
            img: "/default-image.jpg",
            discount: 0,
            discounted_price: Number(product.price || 0),
            updated_at: product.created_at || new Date().toISOString(),
          }];

      return {
        ...product,
        all_variants: variants,
      };
    });
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