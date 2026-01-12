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
        <div className="mx-6 mt-6 text-red-500 font-semibold flex justify-center items-center">
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
        {!articles
          ? Array.from({ length: 4 }, (_, index) => (
              <AccordionSkeleton key={index} />
            ))
          : articles.map((article: ArticleProps) => (
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
