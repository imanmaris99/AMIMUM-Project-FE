import { AccordionExpandDefault } from "@/components";
import { ArticleProps } from "./types";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../layout/Footer";
import React from "react";

const OPERATIONAL_ARTICLE_KEYWORDS = [
  "pembayaran",
  "ongkir",
  "checkout",
  "cara belanja",
  "pengiriman",
  "pickup",
  "resi",
  "tentang aplikasi",
  "informasi toko",
  "informasi terbaru",
];

interface ArticleSectionProps {
  articles: ArticleProps[] | null;
  errorMessage?: string | null;
}

const isOperationalArticle = (article: ArticleProps) => {
  const normalizedTitle = article.title.trim().toLowerCase();
  const normalizedBody = article.description_list.join(" ").trim().toLowerCase();
  const haystack = `${normalizedTitle} ${normalizedBody}`;

  return OPERATIONAL_ARTICLE_KEYWORDS.some((keyword) => haystack.includes(keyword));
};

const ArticleSection = ({ articles, errorMessage }: ArticleSectionProps) => {
  const visibleArticles = (articles || []).filter((article) => !isOperationalArticle(article));

  if (errorMessage) {
    return (
      <>
        <section className="mx-4 mt-8 sm:mx-6" aria-labelledby="homepage-article-title">
          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-4 py-4 text-center font-jakarta text-sm leading-6 text-yellow-800 shadow-sm">
            {errorMessage}
          </div>
        </section>
        <div>
          <Footer />
        </div>
      </>
    );
  }

  if (!articles) {
    return (
      <>
        <section className="mx-4 mt-8 sm:mx-6" aria-label="Memuat edukasi produk">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                Edukasi Produk
              </p>
              <h2 className="mt-1 font-jakarta text-xl font-extrabold tracking-tight text-gray-900">
                Artikel Herbal
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <AccordionSkeleton key={index} />
            ))}
          </div>
        </section>
        <div>
          <Footer />
        </div>
      </>
    );
  }

  if (visibleArticles.length === 0) {
    return (
      <div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <section className="mx-4 mt-8 sm:mx-6" aria-labelledby="homepage-article-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Edukasi Produk
            </p>
            <h2 id="homepage-article-title" className="mt-1 font-jakarta text-xl font-extrabold tracking-tight text-gray-900">
              Artikel Herbal
            </h2>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Konten edukasi produk. Panduan belanja, pembayaran, dan pengiriman tersedia di halaman resmi terpisah.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            {visibleArticles.length} artikel
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {visibleArticles.map((article: ArticleProps) => (
            <AccordionExpandDefault
              key={article.display_id}
              article={article}
            />
          ))}
        </div>
      </section>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default React.memo(ArticleSection);
