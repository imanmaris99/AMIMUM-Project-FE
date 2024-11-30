"use client";

import Header from "../components/hompage/Header_Section";
import Promo from "../components/hompage/Promo_Section";
import Category from "../components/hompage/Category_Section";
import Production from "../components/hompage/Production_Section";
import ArticleSection from "../components/hompage/Article_Section";
// import ListProductSection from "../components/hompage/List_Product_Section";

const Home = () => {

  return (
    <main className="pb-20">
      <Header />
      <Promo />
      <Category />
      {/* <ListProductSection /> */}
      <Production />
      <ArticleSection />
    </main>
  );
};

export default Home;
