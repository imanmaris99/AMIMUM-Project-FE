"use client";
import { useState } from "react";
import Header from "@/components/homepage/Header_Section";
import Promo from "@/components/homepage/Promo_Section";
import Category from "@/components/homepage/Category_Section";
import Production from "@/components/homepage/Production_Section";
import ArticleSection from "@/components/homepage/Article_Section";
import Search from "@/components/common/Search";

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
      <Search products={productions} />
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