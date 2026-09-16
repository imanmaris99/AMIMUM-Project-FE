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
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Artikel</h6>
        </div>
        <div className="mx-6 mt-4 rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-center font-jakarta text-sm text-yellow-800">
          {errorMessage}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Artikel</h6>
      </div>

      <div className="mx-6 mt-6 flex flex-col gap-2">
        {!articles ? (
          Array.from({ length: 4 }, (_, index) => (
            <AccordionSkeleton key={index} />
          ))
        ) : articles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-6 text-center font-jakarta text-sm text-gray-600">
            Artikel edukasi belum tersedia dari toko.
            <p className="mt-2 text-xs text-gray-500">
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

      <div>
        <Footer />
      </div>
    </>
  );
};

export default React.memo(ArticleSection);
