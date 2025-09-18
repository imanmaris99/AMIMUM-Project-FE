import Header from "@/components/homepage/Header_Section";
import ProductList from "@/components/DetailBrand/ProductList";
import DetailBrand from "@/components/DetailBrand";
import { BrandDetailResponseType, ProductType } from "@/types/detailProduct";

// Dummy data untuk promo sementara karena server sedang down
const dummyPromoData = {
  id: 1,
  name: "Promo Herbal Spesial",
  photo_url: "/default-image.jpg",
  description_list: [
    "Promo terbatas untuk produk herbal berkualitas",
    "Diskon hingga 25% untuk pembelian minimal 2 item",
    "Gratis ongkir untuk pembelian di atas Rp 100.000",
    "Promo berlaku hingga akhir bulan"
  ],
  total_product: 12,
  total_product_with_promo: 8
};

const dummyPromoProducts: ProductType[] = [
  {
    id: 1,
    name: "Jahe Merah Organik - DISKON 20%",
    price: 20000, // harga setelah diskon
    all_variants: [
      { id: 1, name: "100gr", price: 20000, stock: 50 },
      { id: 2, name: "250gr", price: 40000, stock: 30 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Kunyit Bubuk Premium - DISKON 15%",
    price: 15300, // harga setelah diskon
    all_variants: [
      { id: 1, name: "50gr", price: 15300, stock: 40 },
      { id: 2, name: "100gr", price: 27200, stock: 25 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: 3,
    name: "Temulawak Kering - DISKON 25%",
    price: 16500, // harga setelah diskon
    all_variants: [
      { id: 1, name: "100gr", price: 16500, stock: 35 },
      { id: 2, name: "250gr", price: 33750, stock: 15 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: 4,
    name: "Teh Hijau Daun - DISKON 10%",
    price: 13500, // harga setelah diskon
    all_variants: [
      { id: 1, name: "25gr", price: 13500, stock: 60 },
      { id: 2, name: "50gr", price: 25200, stock: 40 }
    ],
    created_at: "2024-01-01"
  }
];

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
  
  // Menggunakan dummy data sementara
  brandDetail = {
    data: dummyPromoData
  };
  
  // Mapping brand detail agar field sesuai kebutuhan komponen
  const brandData = brandDetail?.data
    ? {
        ...brandDetail.data,
        image_url: brandDetail.data.photo_url,
        description: brandDetail.data.description_list || [],
        product_count: brandDetail.data.total_product_with_promo ?? brandDetail.data.total_product,
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
  
  // Menggunakan dummy data sementara
  products = dummyPromoProducts;
  
  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <ProductList products={products} />
    </div>
  );
}
