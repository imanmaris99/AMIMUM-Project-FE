import Header from "@/components/homepage/Header_Section";
import DetailBrand from "@/components/DetailBrand";
import ProductList from "@/components/DetailBrand/ProductList";
import SearchProductByBrand from "@/components/DetailBrand/SearchProductByBrand";
import { BrandDetailResponseType, ProductType } from "@/types/detailProduct";

// Dummy data untuk brand sementara karena server sedang down
// Sesuai dengan ProductionDetailResponseDto dari API backend
const dummyBrandsData: { [key: string]: {
  id: number;
  name: string;
  photo_url: string;
  description_list: string[];
  category: string;
  total_product: number;
  total_product_with_promo: number;
  created_at: string;
} } = {
  "1": {
    id: 1,
    name: "Air Mancur",
    photo_url: "/airmancur 1.svg",
    description_list: [
      "Brand jamu tradisional terpercaya sejak 1955",
      "Menggunakan resep turun temurun yang autentik",
      "Proses produksi yang higienis dan modern",
      "Sudah bersertifikat halal dan BPOM"
    ],
    category: "Jamu",
    total_product: 6,
    total_product_with_promo: 4,
    created_at: "2024-01-01T00:00:00Z"
  },
  "2": {
    id: 2,
    name: "Aji Mujarab",
    photo_url: "/aji-mujarab 1.svg",
    description_list: [
      "Jamu herbal berkualitas tinggi dengan khasiat mujarab",
      "Menggunakan bahan-bahan pilihan terbaik",
      "Proses pengolahan tradisional yang terjaga",
      "Terpercaya untuk kesehatan keluarga"
    ],
    category: "Jamu",
    total_product: 5,
    total_product_with_promo: 3,
    created_at: "2024-01-01T00:00:00Z"
  },
  "3": {
    id: 3,
    name: "Jamu Jago",
    photo_url: "/jamu_jago 1.svg",
    description_list: [
      "Jamu tradisional dengan kualitas jago",
      "Resep warisan leluhur yang terbukti ampuh",
      "Diolah dengan teknologi modern yang higienis",
      "Membantu menjaga kesehatan dan kebugaran"
    ],
    category: "Jamu",
    total_product: 7,
    total_product_with_promo: 5,
    created_at: "2024-01-01T00:00:00Z"
  },
  "4": {
    id: 4,
    name: "Nyonya Meneer",
    photo_url: "/nyonya-meneer 1.svg",
    description_list: [
      "Brand jamu premium dengan standar internasional",
      "Menggunakan teknologi modern dan tradisional",
      "Kualitas terjamin dengan sertifikasi lengkap",
      "Solusi kesehatan alami untuk keluarga"
    ],
    category: "Jamu",
    total_product: 8,
    total_product_with_promo: 6,
    created_at: "2024-01-01T00:00:00Z"
  },
  "5": {
    id: 5,
    name: "Sabdo Palon",
    photo_url: "/sabdo-palon 1.svg",
    description_list: [
      "Jamu herbal dengan filosofi kesehatan holistik",
      "Menggabungkan kearifan lokal dan modern",
      "Proses produksi yang ramah lingkungan",
      "Mendukung gaya hidup sehat dan seimbang"
    ],
    category: "Jamu",
    total_product: 4,
    total_product_with_promo: 2,
    created_at: "2024-01-01T00:00:00Z"
  },
  "6": {
    id: 6,
    name: "Sido Muncul",
    photo_url: "/sido-muncul 1.svg",
    description_list: [
      "Pionir jamu modern dengan inovasi terdepan",
      "Menggunakan teknologi ekstraksi terbaik",
      "Kualitas konsisten dengan standar tinggi",
      "Terpercaya oleh jutaan konsumen Indonesia"
    ],
    category: "Jamu",
    total_product: 9,
    total_product_with_promo: 7,
    created_at: "2024-01-01T00:00:00Z"
  }
};

const dummyProductsByBrand: { [key: string]: ProductType[] } = {
  "1": [ // Air Mancur
    {
      id: 1,
      name: "Jamu Beras Kencur Air Mancur",
      price: 15000,
      all_variants: [
        { id: 1, name: "60ml", price: 13500, stock: 50 },
        { id: 2, name: "120ml", price: 24000, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 2,
      name: "Jamu Kunyit Asam Air Mancur",
      price: 18000,
      all_variants: [
        { id: 1, name: "60ml", price: 16200, stock: 40 },
        { id: 2, name: "120ml", price: 28800, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 3,
      name: "Jamu Temulawak Air Mancur",
      price: 20000,
      all_variants: [
        { id: 1, name: "60ml", price: 18000, stock: 35 },
        { id: 2, name: "120ml", price: 32000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 4,
      name: "Jamu Jahe Merah Air Mancur",
      price: 22000,
      all_variants: [
        { id: 1, name: "60ml", price: 19800, stock: 30 },
        { id: 2, name: "120ml", price: 35200, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 5,
      name: "Jamu Sari Kurma Air Mancur",
      price: 25000,
      all_variants: [
        { id: 1, name: "60ml", price: 22500, stock: 25 },
        { id: 2, name: "120ml", price: 40000, stock: 15 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 6,
      name: "Jamu Brotowali Air Mancur",
      price: 16000,
      all_variants: [
        { id: 1, name: "60ml", price: 14400, stock: 40 },
        { id: 2, name: "120ml", price: 25600, stock: 25 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "2": [ // Aji Mujarab
    {
      id: 7,
      name: "Jamu Galian Singset Aji Mujarab",
      price: 12000,
      all_variants: [
        { id: 1, name: "60ml", price: 10800, stock: 45 },
        { id: 2, name: "120ml", price: 19200, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 8,
      name: "Jamu Kuat Pria Aji Mujarab",
      price: 28000,
      all_variants: [
        { id: 1, name: "60ml", price: 25200, stock: 35 },
        { id: 2, name: "120ml", price: 44800, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 9,
      name: "Jamu Pegal Linu Aji Mujarab",
      price: 15000,
      all_variants: [
        { id: 1, name: "60ml", price: 13500, stock: 40 },
        { id: 2, name: "120ml", price: 24000, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 10,
      name: "Jamu Kolesterol Aji Mujarab",
      price: 20000,
      all_variants: [
        { id: 1, name: "60ml", price: 18000, stock: 30 },
        { id: 2, name: "120ml", price: 32000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 11,
      name: "Jamu Asam Urat Aji Mujarab",
      price: 18000,
      all_variants: [
        { id: 1, name: "60ml", price: 16200, stock: 35 },
        { id: 2, name: "120ml", price: 28800, stock: 25 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "3": [ // Jamu Jago
    {
      id: 12,
      name: "Jamu Beras Kencur Jamu Jago",
      price: 14000,
      all_variants: [
        { id: 1, name: "60ml", price: 12600, stock: 50 },
        { id: 2, name: "120ml", price: 22400, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 13,
      name: "Jamu Kunyit Asam Jamu Jago",
      price: 16000,
      all_variants: [
        { id: 1, name: "60ml", price: 14400, stock: 45 },
        { id: 2, name: "120ml", price: 25600, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 14,
      name: "Jamu Temulawak Jamu Jago",
      price: 18000,
      all_variants: [
        { id: 1, name: "60ml", price: 16200, stock: 40 },
        { id: 2, name: "120ml", price: 28800, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 15,
      name: "Jamu Jahe Merah Jamu Jago",
      price: 20000,
      all_variants: [
        { id: 1, name: "60ml", price: 18000, stock: 35 },
        { id: 2, name: "120ml", price: 32000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 16,
      name: "Jamu Sari Kurma Jamu Jago",
      price: 22000,
      all_variants: [
        { id: 1, name: "60ml", price: 19800, stock: 30 },
        { id: 2, name: "120ml", price: 35200, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 17,
      name: "Jamu Brotowali Jamu Jago",
      price: 15000,
      all_variants: [
        { id: 1, name: "60ml", price: 13500, stock: 40 },
        { id: 2, name: "120ml", price: 24000, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 18,
      name: "Jamu Galian Singset Jamu Jago",
      price: 13000,
      all_variants: [
        { id: 1, name: "60ml", price: 11700, stock: 45 },
        { id: 2, name: "120ml", price: 20800, stock: 30 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "4": [ // Nyonya Meneer
    {
      id: 19,
      name: "Jamu Beras Kencur Nyonya Meneer",
      price: 25000,
      all_variants: [
        { id: 1, name: "60ml", price: 22500, stock: 40 },
        { id: 2, name: "120ml", price: 40000, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 20,
      name: "Jamu Kunyit Asam Nyonya Meneer",
      price: 28000,
      all_variants: [
        { id: 1, name: "60ml", price: 25200, stock: 35 },
        { id: 2, name: "120ml", price: 44800, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 21,
      name: "Jamu Temulawak Nyonya Meneer",
      price: 30000,
      all_variants: [
        { id: 1, name: "60ml", price: 27000, stock: 30 },
        { id: 2, name: "120ml", price: 48000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 22,
      name: "Jamu Jahe Merah Nyonya Meneer",
      price: 32000,
      all_variants: [
        { id: 1, name: "60ml", price: 28800, stock: 25 },
        { id: 2, name: "120ml", price: 51200, stock: 15 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 23,
      name: "Jamu Sari Kurma Nyonya Meneer",
      price: 35000,
      all_variants: [
        { id: 1, name: "60ml", price: 31500, stock: 20 },
        { id: 2, name: "120ml", price: 56000, stock: 15 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 24,
      name: "Jamu Brotowali Nyonya Meneer",
      price: 26000,
      all_variants: [
        { id: 1, name: "60ml", price: 23400, stock: 35 },
        { id: 2, name: "120ml", price: 41600, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 25,
      name: "Jamu Galian Singset Nyonya Meneer",
      price: 24000,
      all_variants: [
        { id: 1, name: "60ml", price: 21600, stock: 40 },
        { id: 2, name: "120ml", price: 38400, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 26,
      name: "Jamu Kuat Pria Nyonya Meneer",
      price: 40000,
      all_variants: [
        { id: 1, name: "60ml", price: 36000, stock: 30 },
        { id: 2, name: "120ml", price: 64000, stock: 20 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "5": [ // Sabdo Palon
    {
      id: 27,
      name: "Jamu Beras Kencur Sabdo Palon",
      price: 18000,
      all_variants: [
        { id: 1, name: "60ml", price: 16200, stock: 40 },
        { id: 2, name: "120ml", price: 28800, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 28,
      name: "Jamu Kunyit Asam Sabdo Palon",
      price: 20000,
      all_variants: [
        { id: 1, name: "60ml", price: 18000, stock: 35 },
        { id: 2, name: "120ml", price: 32000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 29,
      name: "Jamu Temulawak Sabdo Palon",
      price: 22000,
      all_variants: [
        { id: 1, name: "60ml", price: 19800, stock: 30 },
        { id: 2, name: "120ml", price: 35200, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 30,
      name: "Jamu Jahe Merah Sabdo Palon",
      price: 24000,
      all_variants: [
        { id: 1, name: "60ml", price: 21600, stock: 25 },
        { id: 2, name: "120ml", price: 38400, stock: 15 }
      ],
      created_at: "2024-01-01"
    }
  ],
  "6": [ // Sido Muncul
    {
      id: 31,
      name: "Jamu Beras Kencur Sido Muncul",
      price: 16000,
      all_variants: [
        { id: 1, name: "60ml", price: 14400, stock: 50 },
        { id: 2, name: "120ml", price: 25600, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 32,
      name: "Jamu Kunyit Asam Sido Muncul",
      price: 18000,
      all_variants: [
        { id: 1, name: "60ml", price: 16200, stock: 45 },
        { id: 2, name: "120ml", price: 28800, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 33,
      name: "Jamu Temulawak Sido Muncul",
      price: 20000,
      all_variants: [
        { id: 1, name: "60ml", price: 18000, stock: 40 },
        { id: 2, name: "120ml", price: 32000, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 34,
      name: "Jamu Jahe Merah Sido Muncul",
      price: 22000,
      all_variants: [
        { id: 1, name: "60ml", price: 19800, stock: 35 },
        { id: 2, name: "120ml", price: 35200, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 35,
      name: "Jamu Sari Kurma Sido Muncul",
      price: 24000,
      all_variants: [
        { id: 1, name: "60ml", price: 21600, stock: 30 },
        { id: 2, name: "120ml", price: 38400, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 36,
      name: "Jamu Brotowali Sido Muncul",
      price: 17000,
      all_variants: [
        { id: 1, name: "60ml", price: 15300, stock: 40 },
        { id: 2, name: "120ml", price: 27200, stock: 25 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 37,
      name: "Jamu Galian Singset Sido Muncul",
      price: 15000,
      all_variants: [
        { id: 1, name: "60ml", price: 13500, stock: 45 },
        { id: 2, name: "120ml", price: 24000, stock: 30 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 38,
      name: "Jamu Kuat Pria Sido Muncul",
      price: 30000,
      all_variants: [
        { id: 1, name: "60ml", price: 27000, stock: 35 },
        { id: 2, name: "120ml", price: 48000, stock: 20 }
      ],
      created_at: "2024-01-01"
    },
    {
      id: 39,
      name: "Jamu Pegal Linu Sido Muncul",
      price: 19000,
      all_variants: [
        { id: 1, name: "60ml", price: 17100, stock: 40 },
        { id: 2, name: "120ml", price: 30400, stock: 25 }
      ],
      created_at: "2024-01-01"
    }
  ]
};

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  let brandDetail: BrandDetailResponseType | null = null;
  let products: ProductType[] = [];
  const errorMessage: string | null = null;
  
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
  
  // Menggunakan dummy data sementara berdasarkan brandId
  const selectedBrandData = dummyBrandsData[brandId] || dummyBrandsData["1"];
  brandDetail = {
    data: selectedBrandData
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
  
  // Menggunakan dummy data sementara berdasarkan brandId
  products = dummyProductsByBrand[brandId] || dummyProductsByBrand["1"];
  
  return (
    <main className="pb-20">
      <Header />
      <DetailBrand brandDetail={brandData} errorMessage={errorMessage} />
      <SearchProductByBrand brandId={Number(brandId)} brandName={brandData?.name || ""} />
      <ProductList products={products} />
    </main>
  );
}
