"use client";
import { useState } from "react";
import UnifiedHeader from "@/components/common/UnifiedHeader";
import dynamic from "next/dynamic";
import { validateProductionData } from "@/utils/dataValidation";

const Promo = dynamic(() => import("@/components/homepage/Promo_Section"), { ssr: false });
const Category = dynamic(() => import("@/components/homepage/Category_Section"), { ssr: false });
const Production = dynamic(() => import("@/components/homepage/Production_Section"), { ssr: false });
const ArticleSection = dynamic(() => import("@/components/homepage/Article_Section"), { ssr: false });
const ShoppingGuideSection = dynamic(() => import("@/components/homepage/ShoppingGuide_Section"), { ssr: false });
const CreativeCraftSection = dynamic(() => import("@/components/homepage/CreativeCraft_Section"), { ssr: false });
const Search = dynamic(() => import("@/components/common/Search"), { ssr: false });

const CREATIVE_CRAFT_CATEGORY = {
  id: -9001,
  name: "Aksesoris & Custom Craft",
};

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
  const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Extract data from API response structure with comprehensive validation
  const categoriesData = Array.isArray(categories) ? categories : [];
  const categoriesWithCreative = categoriesData.some((cat: unknown) => {
    const category = cat as { name?: string };
    return typeof category?.name === "string" && normalize(category.name) === normalize(CREATIVE_CRAFT_CATEGORY.name);
  })
    ? categoriesData
    : [...categoriesData, CREATIVE_CRAFT_CATEGORY];
  const productionsData = Array.isArray(productions) ? productions : [];
  const promoData = Array.isArray(promo) ? promo : [];
  const articlesData = Array.isArray(articles) ? articles : [];
  
  // Validate category selection
  const selectedCategoryName = selectedCategory 
    ? categoriesWithCreative.find((cat: unknown) => {
        const category = cat as { id: number; name: string };
        return category && typeof category.id === 'number' && typeof category.name === 'string' && category.id === selectedCategory;
      })?.name
    : null;
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
  const isCreativeCraftSelected =
    selectedCategoryName ? normalize(selectedCategoryName) === normalize(CREATIVE_CRAFT_CATEGORY.name) : false;
  
  
    
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#F1FAF5_0%,#FFFFFF_34%,#FFFBF1_72%,#F4FBF7_100%)] pb-[calc(7rem+env(safe-area-inset-bottom))]"
      suppressHydrationWarning
    >
      <div className="pointer-events-none absolute -right-16 top-24 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-[42rem] h-56 w-56 rounded-full bg-[#D9A441]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">
        <UnifiedHeader
          type="main"
          showCart={true}
          showNotifications={true}
        />
        <Search />
        <Promo promo={promoData} errorMessage={promoError} />
        <ShoppingGuideSection />
        <Category
          categories={categoriesWithCreative}
          errorMessage={categoryError}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {isCreativeCraftSelected && <CreativeCraftSection />}
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
