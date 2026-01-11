import HomeClient from "./HomeClient";
import { getHomepageData } from "@/data/dataUtils";
import { fetchArticlesServer } from "@/services/api/articles";

// Menggunakan centralized data management untuk categories, productions, dan promo
const homepageData = getHomepageData();

export default async function Home() {
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
      categories={homepageData.categories.data}
      productions={homepageData.productions.data}
      categoryError={null}
      productionError={null}
      promo={homepageData.promo.data}
      promoError={null}
      articles={articles}
      articleError={articleError}
    />
  );
}
