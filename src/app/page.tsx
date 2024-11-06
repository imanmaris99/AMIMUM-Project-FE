"use client";

import Header from "./components/Homepage/Header";
import Promo from "./components/Homepage/Promo";
import Category from "./components/Homepage/Category";
import Production from "./components/Homepage/Production";
import FAQ from "./components/Homepage/FAQ";

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
