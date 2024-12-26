import { ProductionProps } from "@/components/homepage/ProductionCard/types";

const getFilteredProductions = (productions: ProductionProps[] | undefined, selectedCategory: string | null) => {
  return selectedCategory ? productions?.filter((production) => production.category === selectedCategory) : productions;
};

export default getFilteredProductions;
