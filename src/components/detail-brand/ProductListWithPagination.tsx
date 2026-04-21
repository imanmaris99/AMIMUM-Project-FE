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
  emptyMessage = "Produk belum tersedia."
}: ProductListWithPaginationProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<CardProductProps[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10; // Sama dengan search page
  
  // Load initial data
  useEffect(() => {
    setDisplayedProducts(products.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [products]);

  const hasMore = displayedProducts.length < products.length;
  const totalLoaded = displayedProducts.length;
  const totalAvailable = products.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = products.slice(0, endIndex);
      
      setDisplayedProducts(newProducts);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <div className="mt-4 mx-6">
      <h6 className="font-semibold font-jakarta mb-4">{title}</h6>
      {products && products.length > 0 ? (
        <>
          <ListProductSection products={displayedProducts} />
          
          {/* Load More Button */}
          <LoadMoreButton
            isLoading={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            totalLoaded={totalLoaded}
            totalAvailable={totalAvailable}
          />
        </>
      ) : (
        <div className="text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
};

export default ProductListWithPagination;
