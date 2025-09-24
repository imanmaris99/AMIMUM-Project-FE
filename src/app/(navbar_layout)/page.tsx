import HomeClient from "./HomeClient";
import { getHomepageData } from "@/data/dataUtils";

// Menggunakan centralized data management
const homepageData = getHomepageData();

export default async function Home() {
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
