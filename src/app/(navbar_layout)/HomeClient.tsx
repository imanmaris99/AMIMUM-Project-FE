"use client";
import { useState } from "react";
import Header from "@/components/homepage/Header_Section";
import dynamic from "next/dynamic";

const Promo = dynamic(() => import("@/components/homepage/Promo_Section"), { ssr: false });
const Category = dynamic(() => import("@/components/homepage/Category_Section"), { ssr: false });
const Production = dynamic(() => import("@/components/homepage/Production_Section"), { ssr: false });
const ArticleSection = dynamic(() => import("@/components/homepage/Article_Section"), { ssr: false });
const Search = dynamic(() => import("@/components/common/Search"), { ssr: false });

interface HomeClientProps {
  categories: any[];
  productions: any[];
  categoryError: string | null;
  productionError: string | null;
  promo: any[];
  promoError: string | null;
  articles: any[];
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
  const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name;
  const filteredProductions = selectedCategory
    ? productions.filter((prod: any) => prod.category === selectedCategoryName)
    : productions;
  return (
    <div className="pb-20">
      <Header />
      <Search />
      <Promo promo={promo} errorMessage={promoError} />
      <Category
        categories={categories}
        errorMessage={categoryError}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Production productions={filteredProductions} errorMessage={productionError} />
      <ArticleSection articles={articles} errorMessage={articleError} />
    </div>
  );
} 