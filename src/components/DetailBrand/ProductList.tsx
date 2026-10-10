import ListProductSection from "@/components/common/Search/List_Product_Section";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

interface ProductListProps {
  products: CardProductProps[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <section className="mx-4 mt-4 sm:mx-6">
      <div className="mb-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Katalog brand</p>
        <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">Daftar Produk Brand</h2>
      </div>
      {products && products.length > 0 ? (
        <ListProductSection products={products} />
      ) : (
        <div className="rounded-3xl border border-dashed border-emerald-100 bg-white/95 p-5 text-sm leading-5 text-[#6B7C73] shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          Produk brand belum tersedia di katalog toko.
        </div>
      )}
    </section>
  );
};

export default ProductList;
