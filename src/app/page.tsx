"use client";

import Header from "./components/hompage/Header_Section";
import Promo from "./components/hompage/Promo_Section";
import Category from "./components/hompage/Category_Section";
import Production from "./components/hompage/Production_Section";
import FAQ from "./components/hompage/FAQ_Section";

const Home = () => {

  return (
    <main className="pb-20">
      <Header />
      <Promo />
      <Category />
      <Production />
      <FAQ />
    </main>
  );
};

export default Home;
