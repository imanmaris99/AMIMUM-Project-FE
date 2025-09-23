// import { fetchArticlesServer } from "@/API/articles";
// import { GetAllPromoServer } from "@/API/brand";
// import { fetchCategoriesServer } from "@/API/tag-categories";
// import { GetAllBrandServer } from "@/API/brand";
import HomeClient from "./HomeClient";
import { getHomepageData } from "@/data/dataUtils";

// Menggunakan centralized data management
const homepageData = getHomepageData();

export default async function Home() {
  // API calls dinonaktifkan sementara karena server sedang down
  // let articles = null;
  // let articleError = null;
  // let promo = null;
  // let promoError = null;
  // let categories = null;
  // let categoryError = null;
  // let productions = null;
  // let productionError = null;
  // try {
  //   articles = await fetchArticlesServer();
  // } catch (err: unknown) {
  //   articleError = err instanceof Error ? err.message : "Gagal mengambil data artikel.";
  // }
  // try {
  //   promo = await GetAllPromoServer();
  // } catch (err: unknown) {
  //   promoError = err instanceof Error ? err.message : "Gagal mengambil data promo.";
  // }
  // try {
  //   categories = await fetchCategoriesServer();
  // } catch (err: unknown) {
  //   categoryError = err instanceof Error ? err.message : "Gagal mengambil data kategori.";
  // }
  // try {
  //   productions = await GetAllBrandServer();
  // } catch (err: unknown) {
  //   productionError = err instanceof Error ? err.message : "Gagal mengambil data brand.";
  // }
  
  return (
    <HomeClient
      categories={homepageData.categories.data}
      productions={homepageData.productions.data}
      categoryError={null}
      productionError={null}
      promo={homepageData.promo.data}
      promoError={null}
      articles={homepageData.articles.data}
      articleError={null}
    />
  );
}
