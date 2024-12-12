import { AccordionExpandDefault } from "@/app/components";
import { useArticles } from "@/app/hooks/useArticles";
import { ArticleProps } from "./types";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../layout/Footer";

const ArticleSection = () => {
  const { articles, isLoading, isError, errorMessage } = useArticles();

  if (isError) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Artikel</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold">
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
        {isLoading
          ? Array.from({ length: articles?.length || 4 }, (_, index) => (
              <AccordionSkeleton key={index} />
            ))
          : articles?.map((article: ArticleProps) => (
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

export default ArticleSection;
