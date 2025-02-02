"use client";

import { useSearchParams } from "next/navigation";
import { useSearchProduct } from "../../../hooks/useSearchProduct";
import { PulseLoader } from "react-spinners";
import ListProductSection from "@/components/common/Search/List_Product_Section";
import Header from "@/components/homepage/Header_Section";
import Search from "@/components/common/Search";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const { products, isError, isLoading, errorMessage } = useSearchProduct(query);

  return (
    <div className="pb-20">
      <Header />
      <Search />
      <p className="mt-4 mx-6">
        Hasil pencarian untuk kata kunci <span className="font-bold">&quot;{query}&quot;</span>
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <PulseLoader color="hsl(var(--primary))" size={10} />
        </div>
      ) : isError ? (
        <p className="text-gray-500 text-center mt-4">{errorMessage}</p>
      ) : products && products.length > 0 ? (
        <div className="mx-6">
          <ListProductSection products={products} />
        </div>
      ) : (
        <p className="text-gray-600">Tidak ada produk ditemukan untuk &quot;{query}&quot;</p>
      )}
    </div>
  );
};

export default SearchPage;
