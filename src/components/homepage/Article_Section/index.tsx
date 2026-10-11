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
  const visibleArticles = articles || [];

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
        <section className="mx-4 mt-8 sm:mx-6" aria-label="Memuat info toko">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                Info Toko
              </p>
              <h2 className="mt-1 font-jakarta text-xl font-extrabold tracking-tight text-gray-900">
                Artikel & Pengumuman
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
      <>
        <section className="mx-4 mt-8 sm:mx-6" aria-labelledby="homepage-article-title">
          <div className="rounded-2xl border border-dashed border-emerald-100 bg-white/90 px-5 py-6 text-center font-jakarta text-sm leading-6 text-gray-600 shadow-sm">
            <p className="font-semibold text-gray-900">Info toko belum tersedia.</p>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Nanti admin bisa mengisi artikel tentang aplikasi, operasional toko, dan informasi terbaru dari dashboard.
            </p>
          </div>
        </section>
        <div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <section className="mx-4 mt-8 sm:mx-6" aria-labelledby="homepage-article-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Info Toko
            </p>
            <h2 id="homepage-article-title" className="mt-1 font-jakarta text-xl font-extrabold tracking-tight text-gray-900">
              Artikel & Pengumuman
            </h2>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Info aplikasi, operasional toko, dan update terbaru dari admin. Panduan lengkap tetap tersedia di halaman resmi.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            {visibleArticles.length} info
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
