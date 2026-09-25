import { AccordionExpandDefault } from "@/components";
import { ArticleProps } from "./types";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../layout/Footer";
import React from "react";

interface ArticleSectionProps {
  articles: ArticleProps[] | null;
  errorMessage?: string | null;
}

const ArticleSection = ({ articles, errorMessage }: ArticleSectionProps) => {
  if (errorMessage) {
    return (
      <>
        <section className="mx-4 mt-8 sm:mx-6" aria-labelledby="homepage-article-title">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Edukasi Toko
            </p>
            <h2 id="homepage-article-title" className="mt-1 font-jakarta text-xl font-extrabold tracking-tight text-gray-900">
              Artikel
            </h2>
          </div>
          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-4 py-4 text-center font-jakarta text-sm leading-6 text-yellow-800 shadow-sm">
            {errorMessage}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="mx-4 mt-8 sm:mx-6" aria-labelledby="homepage-article-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Edukasi Toko
            </p>
            <h2 id="homepage-article-title" className="mt-1 font-jakarta text-xl font-extrabold tracking-tight text-gray-900">
              Artikel
            </h2>
          </div>
          {articles && articles.length > 0 && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              {articles.length} info
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {!articles ? (
            Array.from({ length: 4 }, (_, index) => (
              <AccordionSkeleton key={index} />
            ))
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-7 text-center font-jakarta text-sm leading-6 text-gray-600 shadow-sm">
              Artikel edukasi belum tersedia dari toko.
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Informasi produk tetap mengikuti data katalog dan instruksi resmi toko.
              </p>
            </div>
          ) : (
            articles.map((article: ArticleProps) => (
              <AccordionExpandDefault
                key={article.display_id}
                article={article}
              />
            ))
          )}
        </div>
      </section>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default React.memo(ArticleSection);
