import { AccordionExpandDefault } from "@/components";
import { ArticleProps } from "./types";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../../layout/Footer";
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
  const haystack = `${article.title} ${article.description_list.join(" ")}`.toLowerCase();
  return OPERATIONAL_ARTICLE_KEYWORDS.some((keyword) => haystack.includes(keyword));
};

const ArticleSection = ({ articles, errorMessage }: ArticleSectionProps) => {
  const visibleArticles = (articles || []).filter((article) => !isOperationalArticle(article));

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6 text-red-500 font-semibold flex justify-center items-center">
          {errorMessage}
        </div>
        <div>
          <Footer />
        </div>
      </>
    );
  }

  if (!articles) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Artikel Herbal</h6>
        </div>
        <div className="mx-6 mt-6 flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <AccordionSkeleton key={index} />
          ))}
        </div>
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
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Artikel Herbal</h6>
      </div>

      <div className="mx-6 mt-6 flex flex-col gap-2">
        {visibleArticles.map((article: ArticleProps) => (
          <AccordionExpandDefault
            key={article.display_id}
            article={article}
          />
        ))}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default React.memo(ArticleSection);
