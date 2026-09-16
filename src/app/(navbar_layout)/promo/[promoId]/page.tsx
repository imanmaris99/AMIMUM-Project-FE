import ProductListWithPagination from "@/components/DetailBrand/ProductListWithPagination";
import DetailBrand from "@/components/DetailBrand";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { GetBrandDetailByIDServer } from "@/services/api/brand";
import { GetProductDiscountByBrandIdServer } from "@/services/api/product";
import { validateProductData } from "@/utils/dataValidation";
import { BrandDetailType } from "@/types/detailProduct";

export default async function PromoDetailPage({ params }: { params: Promise<{ promoId: string }> }) {
  const { promoId } = await params;
  let brandData: BrandDetailType | null = null;
  let products: CardProductProps[] = [];
  let errorMessage: string | null = null;
  
  if (!promoId || typeof promoId !== 'string') {
    return (
      <main className="pb-20">
        <UnifiedHeader type="main" title="Promo tidak ditemukan" />
        <div className="p-4 text-center">
          <p className="text-red-500">Promo yang dibuka tidak valid.</p>
        </div>
      </main>
    );
  }

  const productionId = parseInt(promoId, 10);
  if (isNaN(productionId)) {
    return (
      <main className="pb-20">
        <UnifiedHeader type="main" title="Promo tidak ditemukan" />
        <div className="p-4 text-center">
          <p className="text-red-500">Format promo tidak valid.</p>
        </div>
      </main>
    );
  }
  
  try {
    brandData = await GetBrandDetailByIDServer(productionId);
  } catch {
    errorMessage = 'Detail promo belum bisa dimuat. Produk promo yang tersedia tetap ditampilkan jika ada.';
  }
    
  try {
    const allProducts = await GetProductDiscountByBrandIdServer(productionId);
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
        promoProductCount={products.length}
      />
      <ProductListWithPagination 
        products={products} 
        title={`Produk Promo ${brandData?.name || "Brand"}`}
        emptyMessage="Produk promo belum tersedia di katalog toko. Harga final tetap mengikuti data toko saat checkout."
      />
    </main>
  );
}