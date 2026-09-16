import Header from "@/components/homepage/HeaderSection";
import SearchWithPagination from "@/components/common/Search/SearchWithPagination";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; brand?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() || "";
  const brand = params?.brand?.trim() || "";

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