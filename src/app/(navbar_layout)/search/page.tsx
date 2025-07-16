import ListProductSection from "@/components/common/Search/List_Product_Section";
import Header from "@/components/homepage/Header_Section";
import Search from "@/components/common/Search";
import { SearchGetProduct } from "@/API/product";
import { notFound } from "next/navigation";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || "";
  let products: CardProductProps[] = [];
  let errorMessage: string | null = null;
  if (!query) {
    return notFound();
  }
  // Gunakan URL absolut untuk fetch di server component
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/product/search?name=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Gagal mengambil data produk.");
    const data = await res.json();
    products = Array.isArray(data?.data)
      ? data.data.map((prod: any) => ({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          all_variants: prod.all_variants || [],
          created_at: prod.created_at || "",
        }))
      : [];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }
  return (
    <div className="pb-20">
      <Header />
      <Search />
      <p className="mt-4 mx-6">
        Hasil pencarian untuk kata kunci <span className="font-bold">&quot;{query}&quot;</span>
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
