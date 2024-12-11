"use client";

import { useSearchParams } from "next/navigation";
import { useSearchProduct } from "../../hooks/useSearchProduct";
import { PulseLoader } from "react-spinners";
import ListProductSection from "@/app/components/common/Search/List_Product_Section";
import Header from "@/app/components/hompage/Header_Section";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q" || "");
  const { products, isError, isLoading } = useSearchProduct(query || "");

  return (
    <main>
      <div>
        <div>
          <Header />
        </div>
        <p className="mt-4 mx-6">Hasil pencarian untuk kata kunci <span className="font-bold">"{query}"</span></p>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <PulseLoader color="hsl(var(--primary))" size={10} />
          </div>
        ) : isError ? (
          <p className="text-red-500">{isError}</p>
        ) : products?.length > 0 ? (
          <div className="mx-6">
            <ListProductSection products={products} />
          </div>
        ) : (
          <p className="text-gray-600">
            Tidak ada produk ditemukan untuk "{query}"
          </p>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
