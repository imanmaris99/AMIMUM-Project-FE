import ProductListWithPagination from "@/components/DetailBrand/ProductListWithPagination";
import DetailBrand from "@/components/DetailBrand";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import { GetBrandDetailByIDServer } from "@/services/api/brand";
import { GetProductDiscountByBrandIdServer } from "@/services/api/product";
import { BrandDetailType } from "@/types/detailProduct";

export default async function PromoDetailPage({ params }: { params: Promise<{ promoId: string }> }) {
  const { promoId } = await params;
  let brandData: BrandDetailType | null = null;
  let products: CardProductProps[] = [];
  let errorMessage: string | null = null;
  
  if (!promoId || typeof promoId !== 'string') {
    return (
      <div className="bg-transparent pb-8">
        <UnifiedHeader type="main" title="Promo tidak ditemukan" />
        <div className="p-4 text-center">
          <p className="text-red-500">Promo yang dibuka tidak valid.</p>
        </div>
      </div>
    );
  }

  const productionId = parseInt(promoId, 10);
  if (isNaN(productionId)) {
    return (
      <div className="bg-transparent pb-8">
        <UnifiedHeader type="main" title="Promo tidak ditemukan" />
        <div className="p-4 text-center">
          <p className="text-red-500">Format promo tidak valid.</p>
        </div>
      </div>
    );
  }
  
  try {
    brandData = await GetBrandDetailByIDServer(productionId);
  } catch {
    errorMessage = 'Detail promo belum bisa dimuat. Produk promo yang tersedia tetap ditampilkan jika ada.';
  }
    
  try {
    const allProducts = await GetProductDiscountByBrandIdServer(productionId);
    products = allProducts.map((product) => ({
      ...product,
      all_variants: Array.isArray(product.all_variants)
        ? product.all_variants
        : [],
    }));
  } catch {
    products = [];
  }
  
  const brandName = brandData?.name?.trim() || "Brand produk";
  const promoCount = products.length;

  return (
    <div className="min-h-screen bg-transparent pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <UnifiedHeader 
        type="main"
        title="Promo Brand"
        subtitle="Produk diskon Toko Herbal Amimum"
        showCart={true}
        showNotifications={true}
      />

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-red-50 via-white to-emerald-50 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-red-100 sm:mx-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Promo aktif</p>
        <h1 className="mt-1 text-xl font-bold leading-tight text-[#0D0E09]">Produk promo dari {brandName}</h1>
        <p className="mt-2 text-sm leading-5 text-[#6B7C73]">
          Pilih produk promo yang tersedia. Harga akhir tetap mengikuti detail produk dan checkout resmi toko.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-red-100">
            <p className="font-semibold text-red-600">Produk promo</p>
            <p className="mt-1 text-sm font-bold text-[#0D0E09]">{promoCount} item</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-emerald-100">
            <p className="font-semibold text-emerald-700">Pembayaran</p>
            <p className="mt-1 text-sm font-bold text-[#0D0E09]">Checkout resmi</p>
          </div>
        </div>
      </section>

      <DetailBrand 
        brandDetail={brandData} 
        errorMessage={errorMessage}
        promoProductCount={promoCount}
        totalProductCount={promoCount}
      />
      <ProductListWithPagination 
        products={products} 
        sectionLabel="Katalog promo"
        title={`Produk Promo ${brandName}`}
        helperText={`${promoCount} produk promo tersedia. Harga final tetap mengikuti detail produk saat checkout.`}
        emptyMessage="Produk promo belum tersedia di katalog toko. Harga final tetap mengikuti data toko saat checkout."
      />
    </div>
  );
}