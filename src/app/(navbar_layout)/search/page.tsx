import UnifiedHeader from "@/components/common/UnifiedHeader";
import SearchPageBox from "@/components/common/Search/SearchPageBox";
import SearchWithPagination from "@/components/common/Search/SearchWithPagination";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; brand?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() || "";
  const brand = params?.brand?.trim() || "";

  return (
    <main className="min-h-screen bg-transparent pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <UnifiedHeader
        type="main"
        title="Cari Produk"
        subtitle="Katalog Toko Herbal Amimum"
        showSearch={false}
        showCart={true}
        showNotifications={true}
      />
      <SearchPageBox initialQuery={query} />
      <SearchWithPagination
        searchQuery={query}
        brandFilter={brand}
      />
    </main>
  );
}
