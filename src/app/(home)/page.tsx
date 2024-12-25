"use client";

import Header from "../components/hompage/Header_Section";
import Promo from "../components/hompage/Promo_Section";
import Category from "../components/hompage/Category_Section";
import Production from "../components/hompage/Production_Section";
import ArticleSection from "../components/hompage/Article_Section";
import { useState } from "react";
import Search from "../components/common/Search";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <div className="pb-20">
      <Header />
      <Search />
      <Promo />
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <Production selectedCategory={selectedCategory} />
      <ArticleSection />
    </div>
  );
};

export default Home;
