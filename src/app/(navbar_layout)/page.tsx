import HomeClient from "./HomeClient";
import { fetchArticlesServer } from "@/services/api/articles";
import { fetchCategoriesServer } from "@/services/api/tag-categories";
import { GetAllBrandServer, GetAllPromoServer } from "@/services/api/brand";

export default async function Home() {
  let categories = null;
  let categoryError: string | null = null;
  
  try {
    categories = await fetchCategoriesServer();
  } catch {
    categoryError = 'Kategori belum bisa dimuat. Produk tetap bisa dilihat dari katalog yang tersedia.';
  }

  let productions = null;
  let productionError: string | null = null;
  
  try {
    productions = await GetAllBrandServer();
  } catch {
    productionError = 'Katalog produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.';
  }

  let promos = null;
  let promoError: string | null = null;
  
  try {
    promos = await GetAllPromoServer();
  } catch {
    promoError = 'Promo belum bisa dimuat. Harga dan promo final tetap mengikuti data toko saat checkout.';
  }

  let articles = null;
  let articleError: string | null = null;
  
  try {
    articles = await fetchArticlesServer();
  } catch {
    articleError = 'Artikel belum bisa dimuat. Silakan coba lagi nanti.';
  }

  return (
    <HomeClient
      categories={categories}
      productions={productions}
      categoryError={categoryError}
      productionError={productionError}
      promo={promos}
      promoError={promoError}
      articles={articles}
      articleError={articleError}
    />
  );
}
