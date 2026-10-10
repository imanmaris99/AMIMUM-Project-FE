"use client";

import { useState, useEffect } from 'react';
import ListProductSection from "@/components/common/Search/List_Product_Section";
import LoadMoreButton from "@/components/common/Search/LoadMoreButton";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

interface ProductListWithPaginationProps {
  products: CardProductProps[];
  title?: string;
  emptyMessage?: string;
  sectionLabel?: string;
  helperText?: string;
}

const ProductListWithPagination = ({
  products,
  title = "Daftar Produk Brand",
  emptyMessage = "Produk brand belum tersedia di katalog toko.",
  sectionLabel = "Katalog brand",
  helperText,
}: ProductListWithPaginationProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<CardProductProps[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setDisplayedProducts(products.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setIsLoadingMore(false);
  }, [products]);

  const hasMore = displayedProducts.length < products.length;
  const totalLoaded = displayedProducts.length;
  const totalAvailable = products.length;

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const endIndex = nextPage * ITEMS_PER_PAGE;
    setDisplayedProducts(products.slice(0, endIndex));
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <section className="mx-4 mt-4 sm:mx-6">
      <div className="mb-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{sectionLabel}</p>
        <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-[#6B7C73]">
          {products.length > 0 ? (helperText || `${totalAvailable} produk tersedia. Harga final mengikuti detail produk saat checkout.`) : emptyMessage}
        </p>
      </div>
      {products && products.length > 0 ? (
        <>
          <ListProductSection products={displayedProducts} />
          <LoadMoreButton
            isLoading={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            totalLoaded={totalLoaded}
            totalAvailable={totalAvailable}
          />
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-emerald-100 bg-white/95 p-5 text-sm leading-5 text-[#6B7C73] shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          {emptyMessage}
        </div>
      )}
    </section>
  );
};

export default ProductListWithPagination;
