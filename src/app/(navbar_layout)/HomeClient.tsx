"use client";
import { useState } from "react";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import dynamic from "next/dynamic";
import { validateProductionData } from "@/utils/dataValidation";

const Promo = dynamic(() => import("@/components/homepage/Promo_Section"), { ssr: false });
const Category = dynamic(() => import("@/components/homepage/Category_Section"), { ssr: false });
const Production = dynamic(() => import("@/components/homepage/Production_Section"), { ssr: false });
const ArticleSection = dynamic(() => import("@/components/homepage/Article_Section"), { ssr: false });
const Search = dynamic(() => import("@/components/common/Search"), { ssr: false });

interface HomeClientProps {
  categories: unknown;
  productions: unknown;
  categoryError: string | null;
  productionError: string | null;
  promo: unknown;
  promoError: string | null;
  articles: unknown;
  articleError: string | null;
}

export default function HomeClient({
  categories,
  productions,
  categoryError,
  productionError,
  promo,
  promoError,
  articles,
  articleError
}: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Extract data from API response structure with error handling
  const categoriesData = Array.isArray(categories) ? categories : (categories?.data || []);
  const productionsData = Array.isArray(productions) ? productions : (productions?.data || []);
  const promoData = Array.isArray(promo) ? promo : (promo?.data || []);
  const articlesData = Array.isArray(articles) ? articles : (articles?.data || []);
  
  
  
  const selectedCategoryName = categoriesData.find((cat: unknown) => (cat as { id: number; name: string }).id === selectedCategory)?.name;
  const filteredProductions = selectedCategory
    ? productionsData.filter((prod: unknown) => (prod as { category: string }).category === selectedCategoryName)
    : productionsData;
    
  // Debug logging untuk filtering
    
  // Validate productions data - menggunakan validator yang tepat untuk productions
  const validProductions = filteredProductions.filter(validateProductionData);
  const invalidProductions = filteredProductions.filter(prod => !validateProductionData(prod));
  
  
  
  // Fallback: jika tidak ada valid productions, gunakan semua productions tanpa validasi
  const finalProductions = validProductions.length > 0 ? validProductions : filteredProductions;
  
    
  return (
    <div className="pb-20" suppressHydrationWarning>
        <UnifiedHeader 
          type="main"
          showCart={true}
          showNotifications={true}
        />
      <Search />
      <Promo promo={promoData} errorMessage={promoError} />
      <Category
        categories={categoriesData}
        errorMessage={categoryError}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Production productions={finalProductions} errorMessage={productionError} />
      <ArticleSection articles={articlesData} errorMessage={articleError} />
    </div>
  );
} 