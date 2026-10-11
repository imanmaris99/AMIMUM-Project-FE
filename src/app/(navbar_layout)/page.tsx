import HomeClient from "./HomeClient";
import { fetchArticlesServer } from "@/services/api/articles";
import { fetchCategoriesServer } from "@/services/api/tag-categories";
import { GetAllBrandServer, GetAllPromoServer } from "@/services/api/brand";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function Home() {
  const [categoriesResult, productionsResult, promosResult, articlesResult] = await Promise.allSettled([
    fetchCategoriesServer(),
    GetAllBrandServer(),
    GetAllPromoServer(),
    fetchArticlesServer(),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const productions = productionsResult.status === "fulfilled" ? productionsResult.value : null;
  const promos = promosResult.status === "fulfilled" ? promosResult.value : null;
  const articles = articlesResult.status === "fulfilled" ? articlesResult.value : null;

  const categoryError = categoriesResult.status === "rejected"
    ? 'Kategori belum bisa dimuat. Produk tetap bisa dilihat dari katalog yang tersedia.'
    : null;
  const productionError = productionsResult.status === "rejected"
    ? 'Katalog produk belum bisa dimuat. Silakan coba lagi beberapa saat lagi.'
    : null;
  const promoError = promosResult.status === "rejected"
    ? 'Promo belum bisa dimuat. Harga dan promo final tetap mengikuti data toko saat checkout.'
    : null;
  const articleError = articlesResult.status === "rejected"
    ? 'Artikel belum bisa dimuat. Silakan coba lagi nanti.'
    : null;

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
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
    </>
  );
}
