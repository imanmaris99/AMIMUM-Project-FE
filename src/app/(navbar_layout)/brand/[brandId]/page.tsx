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
        <UnifiedHeader type="main" title="Brand tidak ditemukan" />
        <div className="p-4 text-center">
          <p className="text-red-500">Brand yang dibuka tidak valid.</p>
        </div>
      </main>
    );
  }

  const productionId = parseInt(brandId, 10);
  if (isNaN(productionId)) {
    return (
      <main className="pb-20">
        <UnifiedHeader type="main" title="Brand tidak ditemukan" />
        <div className="p-4 text-center">
          <p className="text-red-500">Format brand tidak valid.</p>
        </div>
      </main>
    );
  }
  
  try {
    brandData = await GetBrandDetailByIDServer(productionId);
  } catch {
    errorMessage = 'Detail brand belum bisa dimuat. Produk yang tersedia tetap ditampilkan jika ada.';
  }
    
  try {
    const allProducts = await GetProductsByProductionIdServer(productionId);

    products = allProducts.map((product) => ({
      ...product,
      all_variants: Array.isArray(product.all_variants)
        ? product.all_variants
        : [],
    }));
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
        totalProductCount={products.length}
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
        title={`Daftar Produk ${brandData?.name || "Brand produk"}`}
        emptyMessage="Produk brand ini belum tersedia di katalog toko."
      />
    </main>
  );
}