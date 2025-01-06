import { BrandFilteredLoader } from "@/types/apiTypes";

const getFilteredProductions = (brandFilteredLoader: BrandFilteredLoader) => {
  return brandFilteredLoader.data;
};

export default getFilteredProductions;
