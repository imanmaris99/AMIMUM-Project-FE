import { AccordionExpandDefault } from "@/components";
import { useArticles } from "@/hooks/useArticles";
import { ArticleProps } from "./types";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../layout/Footer";

const ArticleSection = () => {
  const { articles, isLoading, isError } = useArticles();

  switch (isError) {
    case 404:
      return <div>Data tidak ditemukan. Silakan coba lagi nanti.</div>;
    case 409:
      return <div>Terjadi konflik data. Silakan coba lagi nanti.</div>;
    case 500:
      return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
    default:
      break;
  }

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

export default ArticleSection;
