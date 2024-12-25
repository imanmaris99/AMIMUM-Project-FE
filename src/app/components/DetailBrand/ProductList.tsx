import { useProductByBrandId } from "@/app/hooks/useProductByBrandId";
import { PulseLoader } from "react-spinners";
import ListProductSection from "@/app/components/common/Search/List_Product_Section";

const ProductList = ({ brandId }: { brandId: number }) => {
  const { productByBrandId, isError, isLoading, errorMessage } =
    useProductByBrandId(brandId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <PulseLoader color="hsl(var(--primary))" size={10} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-gray-500 text-center mt-4">{errorMessage}</p>;
  }

  if (productByBrandId && productByBrandId.length > 0) {
    return (
      <div className="mx-6">
        <ListProductSection products={productByBrandId} />
      </div>
    );
  }

  return <p className="text-gray-600">{errorMessage}</p>;
};

export default ProductList;
