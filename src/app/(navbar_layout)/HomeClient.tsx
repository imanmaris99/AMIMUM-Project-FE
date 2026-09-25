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
    
  const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, ' ');

  const filteredProductions = selectedCategory && selectedCategoryName
    ? productionsData.filter((prod: unknown) => {
        const production = prod as { category: string };
        if (!production || typeof production.category !== 'string') return false;

        const selected = normalize(selectedCategoryName);
        const current = normalize(production.category);

        // exact match first
        if (current === selected) return true;

        // fallback: tolerate minor label differences between category master and production payload
        return current.includes(selected) || selected.includes(current);
      })
    : productionsData;
    
  // Validate productions data with comprehensive error handling
  const validProductions = filteredProductions.filter(validateProductionData);
  const finalProductions = validProductions.length > 0 ? validProductions : [];
  
  
    
  return (
    <div
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F1FAF5_0%,#FFFFFF_34%,#FFFBF1_72%,#F4FBF7_100%)] pb-20"
      suppressHydrationWarning
    >
      <div className="pointer-events-none absolute -right-16 top-24 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-[42rem] h-56 w-56 rounded-full bg-[#D9A441]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">
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
        <Production
          productions={finalProductions}
          errorMessage={productionError}
          selectedCategoryName={selectedCategoryName}
        />
        <ArticleSection articles={articlesData} errorMessage={articleError} />
      </div>
    </div>
  );
}
