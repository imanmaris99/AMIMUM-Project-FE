import { fetchArticlesServer } from "@/API/articles";
import { GetAllPromoServer } from "@/API/brand";
import { fetchCategoriesServer } from "@/API/tag-categories";
import { GetAllBrandServer } from "@/API/brand";
import HomeClient from "./HomeClient";

export default async function Home() {
  let articles = null;
  let articleError = null;
  let promo = null;
  let promoError = null;
  let categories = null;
  let categoryError = null;
  let productions = null;
  let productionError = null;
  try {
    articles = await fetchArticlesServer();
  } catch (err: unknown) {
    articleError = err instanceof Error ? err.message : "Gagal mengambil data artikel.";
  }
  try {
    promo = await GetAllPromoServer();
  } catch (err: unknown) {
    promoError = err instanceof Error ? err.message : "Gagal mengambil data promo.";
  }
  try {
    categories = await fetchCategoriesServer();
  } catch (err: unknown) {
    categoryError = err instanceof Error ? err.message : "Gagal mengambil data kategori.";
  }
  try {
    productions = await GetAllBrandServer();
  } catch (err: unknown) {
    productionError = err instanceof Error ? err.message : "Gagal mengambil data brand.";
  }
  return (
    <HomeClient
      categories={Array.isArray(categories?.data) ? categories.data : []}
      productions={Array.isArray(productions?.data) ? productions.data : []}
      categoryError={categoryError}
      productionError={productionError}
      promo={Array.isArray(promo?.data) ? promo.data : []}
      promoError={promoError}
      articles={Array.isArray(articles?.data) ? articles.data : []}
      articleError={articleError}
    />
  );
}
