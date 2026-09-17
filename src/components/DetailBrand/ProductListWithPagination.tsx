"use client";

import { useState, useEffect } from 'react';
import ListProductSection from "@/components/common/Search/List_Product_Section";
import LoadMoreButton from "@/components/common/Search/LoadMoreButton";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

interface ProductListWithPaginationProps {
  products: CardProductProps[];
  title?: string;
  emptyMessage?: string;
}

const ProductListWithPagination = ({
  products,
  title = "Daftar Produk Brand",
  emptyMessage = "Produk brand belum tersedia di katalog toko."
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
    <div className="mt-4 mx-6">
      <h6 className="font-semibold font-jakarta mb-4">{title}</h6>
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
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-600">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default ProductListWithPagination;
