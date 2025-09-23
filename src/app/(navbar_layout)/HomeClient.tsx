"use client";
import { useState } from "react";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import dynamic from "next/dynamic";
import { validateProductionData } from "@/utils/dataValidation";
import { ErrorHandler } from "@/lib/errorHandler";

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
  
  // Extract data from API response structure with comprehensive validation
  const categoriesData = Array.isArray(categories) ? categories : [];
  const productionsData = Array.isArray(productions) ? productions : [];
  const promoData = Array.isArray(promo) ? promo : [];
  const articlesData = Array.isArray(articles) ? articles : [];
  
  // Validate data arrays
  if (!Array.isArray(categoriesData)) {
    ErrorHandler.handleError(new Error('Categories data is not an array'), 'HomepageData');
  }
  if (!Array.isArray(productionsData)) {
    ErrorHandler.handleError(new Error('Productions data is not an array'), 'HomepageData');
  }
  if (!Array.isArray(promoData)) {
    ErrorHandler.handleError(new Error('Promo data is not an array'), 'HomepageData');
  }
  if (!Array.isArray(articlesData)) {
    ErrorHandler.handleError(new Error('Articles data is not an array'), 'HomepageData');
  }
  
  
  
  // Validate category selection
  const selectedCategoryName = selectedCategory 
    ? categoriesData.find((cat: unknown) => {
        const category = cat as { id: number; name: string };
        return category && typeof category.id === 'number' && typeof category.name === 'string' && category.id === selectedCategory;
      })?.name
    : null;
    
  const filteredProductions = selectedCategory && selectedCategoryName
    ? productionsData.filter((prod: unknown) => {
        const production = prod as { category: string };
        return production && typeof production.category === 'string' && production.category === selectedCategoryName;
      })
    : productionsData;
    
  // Validate productions data with comprehensive error handling
  const validProductions = filteredProductions.filter(validateProductionData);
  const invalidProductions = filteredProductions.filter((prod: any) => !validateProductionData(prod));
  
  // Log validation results
  if (invalidProductions.length > 0) {
    ErrorHandler.handleError(new Error(`${invalidProductions.length} invalid productions found and filtered out`), 'HomepageValidation');
  }
  
  // Use valid productions only, with fallback to empty array if none valid
  const finalProductions = validProductions.length > 0 ? validProductions : [];
  
  
    
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