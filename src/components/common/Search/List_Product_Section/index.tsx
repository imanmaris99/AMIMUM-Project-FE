import CardProduct from "../CardProduct";
import { CardProductProps } from "../CardProduct/types";

const ListProductSection = ({products}: {products: CardProductProps[]}) => {
  return (
    <>
      <div className="mt-6">
        <h1 className="font-semibold font-jakarta">Produk</h1>
      </div>
      <div className="my-6 grid grid-cols-2 justify-items-center gap-y-4">
        {products?.map((product, index) => (
          <CardProduct key={index} product={product} />
        ))}
      </div>
    </>
  );
};

export default ListProductSection;
