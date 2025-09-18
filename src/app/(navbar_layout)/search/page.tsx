import Header from "@/components/homepage/Header_Section";
import Search from "@/components/common/Search";
// import { SearchGetProduct } from "@/API/product";
import { notFound } from "next/navigation";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import { searchProducts } from "@/data/dataUtils";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; brand?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q || "";
  const brand = params?.brand || "";
  let products: CardProductProps[] = [];
  const errorMessage: string | null = null;
  
  // API call dinonaktifkan sementara karena server sedang down
  // try {
  //   const res = await SearchGetProduct(query, brand);
  //   if (res?.data) {
  //     products = res.data;
  //   }
  // } catch (err) {
  //   errorMessage = err instanceof Error ? err.message : String(err);
  // }
  
  // Menggunakan centralized data management
  products = searchProducts(query, brand);
  
  // Jika tidak ada query, redirect ke homepage
  if (!query.trim()) {
    notFound();
  }
  
  return (
    <main className="pb-20">
      <Header />
      <Search 
        searchQuery={query}
        searchResults={products}
        errorMessage={errorMessage}
        brandFilter={brand}
      />
    </main>
  );
}