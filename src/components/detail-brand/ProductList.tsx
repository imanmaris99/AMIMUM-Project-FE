import ListProductSection from "@/components/common/Search/List_Product_Section";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

interface ProductListProps {
  products: CardProductProps[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="mt-4 mx-6">
      <h6 className="font-semibold font-jakarta">Daftar Produk Brand</h6>
      {products && products.length > 0 ? (
        <ListProductSection products={products} />
      ) : (
        <div className="text-gray-500">Produk belum tersedia.</div>
      )}
    </div>
  );
};
export default ProductList;