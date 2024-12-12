"use client";

import Header from "../components/hompage/Header_Section";
import Promo from "../components/hompage/Promo_Section";
import Category from "../components/hompage/Category_Section";
import Production from "../components/hompage/Production_Section";
import ArticleSection from "../components/hompage/Article_Section";
import { useState } from "react";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <main className="pb-20">
      <Header />
      <Promo />
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <Production selectedCategory={selectedCategory} />
      <ArticleSection />
    </main>
  );
};

export default Home;
