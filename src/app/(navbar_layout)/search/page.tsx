import Header from "@/components/homepage/Header_Section";
import SearchWithPagination from "@/components/common/Search/SearchWithPagination";
import { notFound } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; brand?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q || "";
  const brand = params?.brand || "";
  
  // Jika tidak ada query, redirect ke homepage
  if (!query.trim()) {
    notFound();
  }
  
  return (
    <main className="pb-20">
      <Header />
      <SearchWithPagination 
        searchQuery={query}
        brandFilter={brand}
      />
    </main>
  );
}