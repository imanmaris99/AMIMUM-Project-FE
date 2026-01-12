import HomeClient from "./HomeClient";
import { fetchArticlesServer } from "@/services/api/articles";
import { fetchCategoriesServer } from "@/services/api/tag-categories";
import { GetAllBrandServer, GetAllPromoServer } from "@/services/api/brand";

export default async function Home() {
  let categories = null;
  let categoryError: string | null = null;
  
  try {
    categories = await fetchCategoriesServer();
  } catch (error) {
    categoryError = error instanceof Error ? error.message : 'Gagal mengambil data kategori';
  }

  let productions = null;
  let productionError: string | null = null;
  
  try {
    productions = await GetAllBrandServer();
  } catch (error) {
    productionError = error instanceof Error ? error.message : 'Gagal mengambil data produksi';
  }

  let promos = null;
  let promoError: string | null = null;
  
  try {
    promos = await GetAllPromoServer();
  } catch (error) {
    promoError = error instanceof Error ? error.message : 'Gagal mengambil data promo';
  }

  let articles = null;
  let articleError: string | null = null;
  
  try {
    articles = await fetchArticlesServer();
  } catch (error) {
    articleError = error instanceof Error ? error.message : 'Gagal mengambil data artikel';
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
