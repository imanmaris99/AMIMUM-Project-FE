import React from "react";
import { ProductionCard } from "@/components";
import { ProductionProps } from "@/onents/hompage/Production_Section/types";

const ProductionList = ({ productions, visibleItems }: { productions: ProductionProps[] | undefined; visibleItems: number }) => (
  <>
    {productions?.slice(0, visibleItems).map((production, index) => (
      <ProductionCard key={index} production={production} />
    ))}
  </>
);

export default ProductionList;
