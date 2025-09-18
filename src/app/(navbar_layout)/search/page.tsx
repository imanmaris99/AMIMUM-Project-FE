import ListProductSection from "@/components/common/Search/List_Product_Section";
import Header from "@/components/homepage/Header_Section";
import Search from "@/components/common/Search";
// import { SearchGetProduct } from "@/API/product";
import { notFound } from "next/navigation";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

interface SearchPageProps {
  searchParams: { q?: string; brand?: string };
}

// Dummy data untuk search sementara karena server sedang down
// Data ini konsisten dengan data di search dropdown dan detail product page
const dummySearchProducts: CardProductProps[] = [
  {
    id: "1",
    name: "Jamu Beras Kencur Air Mancur",
    price: 15000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 15000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Jamu Kunyit Asam Air Mancur",
    price: 18000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 18000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 32000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Jamu Galian Singset Aji Mujarab",
    price: 12000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 12000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 22000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Jamu Beras Kencur Jamu Jago",
    price: 14000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 14000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 26000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "5",
    name: "Jamu Beras Kencur Nyonya Meneer",
    price: 25000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 25000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 45000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "6",
    name: "Jamu Beras Kencur Sabdo Palon",
    price: 18000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 18000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 32000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "7",
    name: "Jamu Beras Kencur Sido Muncul",
    price: 16000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 16000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "8",
    name: "Jamu Kunyit Asam Sido Muncul",
    price: 17000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 17000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 30000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "9",
    name: "Jamu Galian Singset Sido Muncul",
    price: 19000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 19000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 35000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "10",
    name: "Jamu Temulawak Sido Muncul",
    price: 20000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 20000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 36000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "11",
    name: "Jamu Beras Kencur Aji Mujarab",
    price: 13000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 13000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 24000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "12",
    name: "Jamu Kunyit Asam Jamu Jago",
    price: 15000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 15000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 27000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "13",
    name: "Jamu Galian Singset Jamu Jago",
    price: 16000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 16000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "14",
    name: "Jamu Temulawak Jamu Jago",
    price: 17000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 17000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 30000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "15",
    name: "Jamu Kunyit Asam Nyonya Meneer",
    price: 26000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 26000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 48000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "16",
    name: "Jamu Galian Singset Nyonya Meneer",
    price: 27000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 27000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 50000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "17",
    name: "Jamu Temulawak Nyonya Meneer",
    price: 28000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 28000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 52000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "18",
    name: "Jamu Kunyit Asam Sabdo Palon",
    price: 19000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 19000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 35000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "19",
    name: "Jamu Galian Singset Sabdo Palon",
    price: 20000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 20000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 36000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "20",
    name: "Jamu Temulawak Sabdo Palon",
    price: 21000,
    all_variants: [
      { id: 1, variant: "60ml", img: "/default-image.jpg", discount: 0, discounted_price: 21000, updated_at: "2024-01-01T00:00:00Z" },
      { id: 2, variant: "120ml", img: "/default-image.jpg", discount: 0, discounted_price: 38000, updated_at: "2024-01-01T00:00:00Z" }
    ],
    created_at: "2024-01-01T00:00:00Z"
  }
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || "";
  const brand = searchParams?.brand || "";
  let products: CardProductProps[] = [];
  const errorMessage: string | null = null;
  
  if (!query) {
    return notFound();
  }

  // API call dinonaktifkan sementara karena server sedang down
  // let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // try {
  //   const res = await fetch(`${baseUrl}/api/product/search?name=${encodeURIComponent(query)}`);
  //   if (!res.ok) throw new Error("Gagal mengambil data produk.");
  //   const data = await res.json();
  //   products = Array.isArray(data?.data)
  //     ? data.data.map((prod: any) => ({
  //         id: prod.id,
  //         name: prod.name,
  //         price: prod.price,
  //         all_variants: prod.all_variants || [],
  //         created_at: prod.created_at || "",
  //       }))
  //     : [];
  // } catch (err) {
  //   errorMessage = err instanceof Error ? err.message : String(err);
  // }

  // Menggunakan dummy data sementara
  products = dummySearchProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  // Filter berdasarkan brand jika ada
  if (brand) {
    // Untuk demo, kita akan filter berdasarkan brand name yang mengandung kata kunci
    // Dalam implementasi real, ini akan menggunakan brandId dari database
    products = products.filter(product => {
      // Simulasi filter brand - dalam real app akan menggunakan brandId
      const brandKeywords = brand.toLowerCase().split(' ');
      return brandKeywords.some(keyword => 
        product.name.toLowerCase().includes(keyword) ||
        product.name.toLowerCase().includes('organik') ||
        product.name.toLowerCase().includes('premium')
      );
    });
  }

  return (
    <div className="pb-20">
      <Header />
      <Search />
      <p className="mt-4 mx-6">
        Hasil pencarian untuk kata kunci <span className="font-bold">&quot;{query}&quot;</span>
        {brand && (
          <span> dari brand <span className="font-bold text-[#006A47]">&quot;{brand}&quot;</span></span>
        )}
      </p>
      {errorMessage ? (
        <p className="text-gray-500 text-center mt-4">{errorMessage}</p>
      ) : products.length > 0 ? (
        <div className="mx-6">
          <ListProductSection products={products} />
        </div>
      ) : (
        <p className="text-gray-600">Tidak ada produk ditemukan untuk &quot;{query}&quot;</p>
      )}
    </div>
  );
}
