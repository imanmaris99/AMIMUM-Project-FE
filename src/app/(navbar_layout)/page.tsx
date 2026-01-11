import HomeClient from "./HomeClient";
import { getHomepageData } from "@/data/dataUtils";
import { fetchArticlesServer } from "@/services/api/articles";
import { fetchCategoriesServer } from "@/services/api/tag-categories";

// Menggunakan centralized data management untuk productions dan promo
const homepageData = getHomepageData();

export default async function Home() {
  // Fetch categories from API
  let categories = null;
  let categoryError: string | null = null;
  
  try {
    categories = await fetchCategoriesServer();
  } catch (error) {
    categoryError = error instanceof Error ? error.message : 'Gagal mengambil data kategori';
    // Log error for debugging
    console.error('Error fetching categories:', error);
  }

  // Fetch articles from API
  let articles = null;
  let articleError: string | null = null;
  
  try {
    articles = await fetchArticlesServer();
  } catch (error) {
    articleError = error instanceof Error ? error.message : 'Gagal mengambil data artikel';
    // Log error for debugging
    console.error('Error fetching articles:', error);
  }

  return (
    <HomeClient
      categories={categories}
      productions={homepageData.productions.data}
      categoryError={categoryError}
      productionError={null}
      promo={homepageData.promo.data}
      promoError={null}
      articles={articles}
      articleError={articleError}
    />
  );
}
