import { ProductionProps } from "@/app/components/hompage/Production_Section/types";

const getFilteredProductions = (productions: ProductionProps[] | undefined, selectedCategory: string | null) => {
  return selectedCategory
    ? productions?.filter((production) => production.category === selectedCategory)
    : productions;
};

export default getFilteredProductions; 