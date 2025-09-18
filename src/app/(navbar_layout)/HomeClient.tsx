"use client";
import { useState } from "react";
import Header from "@/components/homepage/Header_Section";
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
  
  // Debug logging untuk melihat struktur data
  console.log('Raw productions data:', productions);
  console.log('Extracted productions data:', productionsData);
  
  // Log data validation status
  console.log('Homepage data validation:', {
    categories: categoriesData.length,
    productions: productionsData.length,
    promo: promoData.length,
    articles: articlesData.length
  });
  
  
  const selectedCategoryName = categoriesData.find((cat: unknown) => (cat as { id: number; name: string }).id === selectedCategory)?.name;
  const filteredProductions = selectedCategory
    ? productionsData.filter((prod: unknown) => (prod as { category: string }).category === selectedCategoryName)
    : productionsData;
    
  // Debug logging untuk filtering
  console.log('Category filtering:', {
    selectedCategory,
    selectedCategoryName,
    totalProductions: productionsData.length,
    filteredProductions: filteredProductions.length
  });
    
  // Validate productions data - menggunakan validator yang tepat untuk productions
  const validProductions = filteredProductions.filter(validateProductionData);
  const invalidProductions = filteredProductions.filter(prod => !validateProductionData(prod));
  
  console.log('Production validation:', {
    beforeValidation: filteredProductions.length,
    afterValidation: validProductions.length,
    invalidCount: invalidProductions.length
  });
  
  if (invalidProductions.length > 0) {
    console.warn('Invalid productions found:', invalidProductions);
  }
  
  // Fallback: jika tidak ada valid productions, gunakan semua productions tanpa validasi
  const finalProductions = validProductions.length > 0 ? validProductions : filteredProductions;
  
  console.log('Final productions to display:', finalProductions.length);
    
  return (
    <div className="pb-20">
      <Header />
      <Search />
      <Promo promo={promoData} errorMessage={promoError} />
      <Category
        categories={categoriesData}
        errorMessage={categoryError}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Production productions={finalProductions} errorMessage={productionError} />
      {/* Debug info untuk development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded">
          Productions: {finalProductions.length}
        </div>
      )}
      <ArticleSection articles={articlesData} errorMessage={articleError} />
    </div>
  );
} 