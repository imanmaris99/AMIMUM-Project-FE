import Header from "@/components/homepage/Header_Section";
import ProductList from "@/components/DetailBrand/ProductList";
import DetailBrand from "@/components/DetailBrand";
import { BrandDetailResponseType, ProductType } from "@/types/detailProduct";

// Dummy data untuk promo sementara karena server sedang down
// Sesuai dengan data promo di homepage
const dummyPromoData: { [key: string]: {
  id: number;
  name: string;
  photo_url: string;
  description_list: string[];
  total_product: number;
  total_product_with_promo: number;
  promo_special: number;
} } = {
  "1": {
    id: 1,
    name: "Air Mancur",
    photo_url: "/airmancur 1.svg",
    description_list: [
      "Promo khusus Air Mancur dengan diskon hingga 20%",
      "Produk jamu tradisional berkualitas tinggi",
      "Gratis ongkir untuk pembelian di atas Rp 100.000",
      "Promo berlaku hingga akhir bulan"
    ],
    total_product: 6,
    total_product_with_promo: 4,
    promo_special: 20
  },
  "2": {
    id: 2,
    name: "Aji Mujarab",
    photo_url: "/aji-mujarab 1.svg",
    description_list: [
      "Promo khusus Aji Mujarab dengan diskon hingga 15%",
      "Jamu herbal berkualitas tinggi dengan khasiat mujarab",
      "Gratis ongkir untuk pembelian di atas Rp 100.000",
      "Promo berlaku hingga akhir bulan"
    ],
    total_product: 5,
    total_product_with_promo: 3,
    promo_special: 15
  },
  "3": {
    id: 3,
    name: "Jamu Jago",
    photo_url: "/jamu_jago 1.svg",
    description_list: [
      "Promo khusus Jamu Jago dengan diskon hingga 25%",
      "Jamu tradisional dengan kualitas jago",
      "Gratis ongkir untuk pembelian di atas Rp 100.000",
      "Promo berlaku hingga akhir bulan"
    ],
    total_product: 7,
    total_product_with_promo: 5,
    promo_special: 25
  },
  "4": {
    id: 4,
    name: "Nyonya Meneer",
    photo_url: "/nyonya-meneer 1.svg",
    description_list: [
      "Promo khusus Nyonya Meneer dengan diskon hingga 30%",
      "Brand jamu premium dengan standar internasional",
      "Gratis ongkir untuk pembelian di atas Rp 100.000",
      "Promo berlaku hingga akhir bulan"
    ],
    total_product: 8,
    total_product_with_promo: 6,
    promo_special: 30
  },
  "5": {
    id: 5,
    name: "Sabdo Palon",
    photo_url: "/sabdo-palon 1.svg",
    description_list: [
      "Promo khusus Sabdo Palon dengan diskon hingga 18%",
      "Jamu herbal dengan filosofi kesehatan holistik",
      "Gratis ongkir untuk pembelian di atas Rp 100.000",
      "Promo berlaku hingga akhir bulan"
    ],
    total_product: 4,
    total_product_with_promo: 2,
    promo_special: 18
  },
  "6": {
    id: 6,
    name: "Sido Muncul",
    photo_url: "/sido-muncul 1.svg",
    description_list: [
      "Promo khusus Sido Muncul dengan diskon hingga 22%",
      "Pionir jamu modern dengan inovasi terdepan",
      "Gratis ongkir untuk pembelian di atas Rp 100.000",
      "Promo berlaku hingga akhir bulan"
    ],
    total_product: 9,
    total_product_with_promo: 7,
    promo_special: 22
  }
};

// Dummy data produk promo berdasarkan brandId
const dummyPromoProductsByBrand: { [key: string]: ProductType[] } = {
  "1": [ // Air Mancur - 20% discount
    {
      id: 1,
      name: "Jamu Beras Kencur Air Mancur - DISKON 20%",
      price: 12000, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 12000, stock: 50 },
        { id: 2, name: "120ml", price: 19200, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 2,
      name: "Jamu Kunyit Asam Air Mancur - DISKON 20%",
      price: 14400, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 14400, stock: 40 },
        { id: 2, name: "120ml", price: 23040, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 3,
      name: "Jamu Temulawak Air Mancur - DISKON 20%",
      price: 16000, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 16000, stock: 35 },
        { id: 2, name: "120ml", price: 25600, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 4,
      name: "Jamu Jahe Merah Air Mancur - DISKON 20%",
      price: 17600, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 17600, stock: 30 },
        { id: 2, name: "120ml", price: 28160, stock: 20 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "2": [ // Aji Mujarab - 15% discount
    {
      id: 5,
      name: "Jamu Galian Singset Aji Mujarab - DISKON 15%",
      price: 10200, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 10200, stock: 45 },
        { id: 2, name: "120ml", price: 16320, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 6,
      name: "Jamu Kuat Pria Aji Mujarab - DISKON 15%",
      price: 23800, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 23800, stock: 35 },
        { id: 2, name: "120ml", price: 38080, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 7,
      name: "Jamu Pegal Linu Aji Mujarab - DISKON 15%",
      price: 12750, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 12750, stock: 40 },
        { id: 2, name: "120ml", price: 20400, stock: 25 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "3": [ // Jamu Jago - 25% discount
    {
      id: 8,
      name: "Jamu Beras Kencur Jamu Jago - DISKON 25%",
      price: 10500, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 10500, stock: 50 },
        { id: 2, name: "120ml", price: 16800, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 9,
      name: "Jamu Kunyit Asam Jamu Jago - DISKON 25%",
      price: 12000, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 12000, stock: 45 },
        { id: 2, name: "120ml", price: 19200, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 10,
      name: "Jamu Temulawak Jamu Jago - DISKON 25%",
      price: 13500, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 13500, stock: 40 },
        { id: 2, name: "120ml", price: 21600, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 11,
      name: "Jamu Jahe Merah Jamu Jago - DISKON 25%",
      price: 15000, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 15000, stock: 35 },
        { id: 2, name: "120ml", price: 24000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 12,
      name: "Jamu Sari Kurma Jamu Jago - DISKON 25%",
      price: 16500, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 16500, stock: 30 },
        { id: 2, name: "120ml", price: 26400, stock: 20 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "4": [ // Nyonya Meneer - 30% discount
    {
      id: 13,
      name: "Jamu Beras Kencur Nyonya Meneer - DISKON 30%",
      price: 17500, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 17500, stock: 40 },
        { id: 2, name: "120ml", price: 28000, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 14,
      name: "Jamu Kunyit Asam Nyonya Meneer - DISKON 30%",
      price: 19600, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 19600, stock: 35 },
        { id: 2, name: "120ml", price: 31360, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 15,
      name: "Jamu Temulawak Nyonya Meneer - DISKON 30%",
      price: 21000, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 21000, stock: 30 },
        { id: 2, name: "120ml", price: 33600, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 16,
      name: "Jamu Jahe Merah Nyonya Meneer - DISKON 30%",
      price: 22400, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 22400, stock: 25 },
        { id: 2, name: "120ml", price: 35840, stock: 15 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 17,
      name: "Jamu Sari Kurma Nyonya Meneer - DISKON 30%",
      price: 24500, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 24500, stock: 20 },
        { id: 2, name: "120ml", price: 39200, stock: 15 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 18,
      name: "Jamu Brotowali Nyonya Meneer - DISKON 30%",
      price: 18200, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 18200, stock: 35 },
        { id: 2, name: "120ml", price: 29120, stock: 25 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "5": [ // Sabdo Palon - 18% discount
    {
      id: 19,
      name: "Jamu Beras Kencur Sabdo Palon - DISKON 18%",
      price: 14760, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 14760, stock: 40 },
        { id: 2, name: "120ml", price: 23616, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 20,
      name: "Jamu Kunyit Asam Sabdo Palon - DISKON 18%",
      price: 16400, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 16400, stock: 35 },
        { id: 2, name: "120ml", price: 26240, stock: 20 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "6": [ // Sido Muncul - 22% discount
    {
      id: 21,
      name: "Jamu Beras Kencur Sido Muncul - DISKON 22%",
      price: 12480, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 12480, stock: 50 },
        { id: 2, name: "120ml", price: 19968, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 22,
      name: "Jamu Kunyit Asam Sido Muncul - DISKON 22%",
      price: 14040, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 14040, stock: 45 },
        { id: 2, name: "120ml", price: 22464, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 23,
      name: "Jamu Temulawak Sido Muncul - DISKON 22%",
      price: 15600, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 15600, stock: 40 },
        { id: 2, name: "120ml", price: 24960, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 24,
      name: "Jamu Jahe Merah Sido Muncul - DISKON 22%",
      price: 17160, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 17160, stock: 35 },
        { id: 2, name: "120ml", price: 27456, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 25,
      name: "Jamu Sari Kurma Sido Muncul - DISKON 22%",
      price: 18720, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 18720, stock: 30 },
        { id: 2, name: "120ml", price: 29952, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 26,
      name: "Jamu Brotowali Sido Muncul - DISKON 22%",
      price: 13260, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 13260, stock: 40 },
        { id: 2, name: "120ml", price: 21216, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 27,
      name: "Jamu Galian Singset Sido Muncul - DISKON 22%",
      price: 11700, // harga setelah diskon
      all_variants: [
        { id: 1, name: "60ml", price: 11700, stock: 45 },
        { id: 2, name: "120ml", price: 18720, stock: 30 }
      ],
      created_at: "2024-01-01"
    }
  ]
};

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
  
  // Menggunakan dummy data sementara berdasarkan promoId
  const selectedPromoData = dummyPromoData[promoId] || dummyPromoData["1"];
  brandDetail = {
    data: selectedPromoData
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
  
  // Menggunakan dummy data sementara berdasarkan promoId
  products = dummyPromoProductsByBrand[promoId] || dummyPromoProductsByBrand["1"];
  
  return (
    <div className="pb-20">
      <Header />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <ProductList products={products} />
    </div>
  );
}
