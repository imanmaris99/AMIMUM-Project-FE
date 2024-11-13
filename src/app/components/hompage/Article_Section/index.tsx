import { AccordionExpandDefault } from "@/app/components";
import { useArticles } from "@/hooks/useArticles";
import { ArticleProps } from "@/types/apiTypes";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../layout/Footer";

const FAQ = () => {
  const { articles, isLoading } = useArticles();

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Artikel</h6>
      </div>

      <div className="mx-6 mt-6 flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <AccordionSkeleton key={index} />
            ))
          : articles?.map((article: ArticleProps, index: number) => (
              <AccordionExpandDefault key={index} article={article} />
            ))}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
