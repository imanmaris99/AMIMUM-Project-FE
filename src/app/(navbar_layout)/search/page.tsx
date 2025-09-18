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
      { id: 1, name: "100ml", price: 15000, stock: 50 },
      { id: 2, name: "200ml", price: 28000, stock: 30 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "2",
    name: "Jamu Kunyit Asam Air Mancur",
    price: 18000,
    all_variants: [
      { id: 1, name: "100ml", price: 18000, stock: 40 },
      { id: 2, name: "200ml", price: 32000, stock: 25 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "3",
    name: "Jamu Galian Singset Aji Mujarab",
    price: 12000,
    all_variants: [
      { id: 1, name: "100ml", price: 12000, stock: 35 },
      { id: 2, name: "200ml", price: 22000, stock: 15 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "4",
    name: "Jamu Beras Kencur Jamu Jago",
    price: 14000,
    all_variants: [
      { id: 1, name: "100ml", price: 14000, stock: 60 },
      { id: 2, name: "200ml", price: 26000, stock: 40 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "5",
    name: "Jamu Beras Kencur Nyonya Meneer",
    price: 25000,
    all_variants: [
      { id: 1, name: "100ml", price: 25000, stock: 30 },
      { id: 2, name: "200ml", price: 45000, stock: 20 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "6",
    name: "Jamu Beras Kencur Sabdo Palon",
    price: 18000,
    all_variants: [
      { id: 1, name: "100ml", price: 18000, stock: 45 },
      { id: 2, name: "200ml", price: 32000, stock: 25 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "7",
    name: "Jamu Beras Kencur Sido Muncul",
    price: 16000,
    all_variants: [
      { id: 1, name: "100ml", price: 16000, stock: 40 },
      { id: 2, name: "200ml", price: 28000, stock: 30 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "8",
    name: "Jamu Kunyit Asam Sido Muncul",
    price: 17000,
    all_variants: [
      { id: 1, name: "100ml", price: 17000, stock: 25 },
      { id: 2, name: "200ml", price: 30000, stock: 15 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "9",
    name: "Jamu Galian Singset Sido Muncul",
    price: 19000,
    all_variants: [
      { id: 1, name: "100ml", price: 19000, stock: 30 },
      { id: 2, name: "200ml", price: 35000, stock: 20 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "10",
    name: "Jamu Temulawak Sido Muncul",
    price: 20000,
    all_variants: [
      { id: 1, name: "100ml", price: 20000, stock: 35 },
      { id: 2, name: "200ml", price: 36000, stock: 25 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "11",
    name: "Jamu Beras Kencur Aji Mujarab",
    price: 13000,
    all_variants: [
      { id: 1, name: "100ml", price: 13000, stock: 30 },
      { id: 2, name: "200ml", price: 24000, stock: 20 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "12",
    name: "Jamu Kunyit Asam Jamu Jago",
    price: 15000,
    all_variants: [
      { id: 1, name: "100ml", price: 15000, stock: 15 },
      { id: 2, name: "200ml", price: 27000, stock: 10 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "13",
    name: "Jamu Galian Singset Jamu Jago",
    price: 16000,
    all_variants: [
      { id: 1, name: "100ml", price: 16000, stock: 40 },
      { id: 2, name: "200ml", price: 28000, stock: 25 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "14",
    name: "Jamu Temulawak Jamu Jago",
    price: 17000,
    all_variants: [
      { id: 1, name: "100ml", price: 17000, stock: 50 },
      { id: 2, name: "200ml", price: 30000, stock: 35 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "15",
    name: "Jamu Kunyit Asam Nyonya Meneer",
    price: 26000,
    all_variants: [
      { id: 1, name: "100ml", price: 26000, stock: 35 },
      { id: 2, name: "200ml", price: 48000, stock: 25 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "16",
    name: "Jamu Galian Singset Nyonya Meneer",
    price: 27000,
    all_variants: [
      { id: 1, name: "100ml", price: 27000, stock: 20 },
      { id: 2, name: "200ml", price: 50000, stock: 10 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "17",
    name: "Jamu Temulawak Nyonya Meneer",
    price: 28000,
    all_variants: [
      { id: 1, name: "100ml", price: 28000, stock: 30 },
      { id: 2, name: "200ml", price: 52000, stock: 20 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "18",
    name: "Jamu Kunyit Asam Sabdo Palon",
    price: 19000,
    all_variants: [
      { id: 1, name: "100ml", price: 19000, stock: 25 },
      { id: 2, name: "200ml", price: 35000, stock: 15 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "19",
    name: "Jamu Galian Singset Sabdo Palon",
    price: 20000,
    all_variants: [
      { id: 1, name: "100ml", price: 20000, stock: 40 },
      { id: 2, name: "200ml", price: 36000, stock: 30 }
    ],
    created_at: "2024-01-01"
  },
  {
    id: "20",
    name: "Jamu Temulawak Sabdo Palon",
    price: 21000,
    all_variants: [
      { id: 1, name: "100ml", price: 21000, stock: 25 },
      { id: 2, name: "200ml", price: 38000, stock: 15 }
    ],
    created_at: "2024-01-01"
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
