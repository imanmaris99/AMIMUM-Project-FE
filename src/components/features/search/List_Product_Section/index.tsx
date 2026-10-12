import CardProduct from "../CardProduct";
import { CardProductProps } from "../CardProduct/types";

const ListProductSection = ({products}: {products: CardProductProps[]}) => {
  return (
    <>
      <div className="mt-5">
        <h1 className="font-semibold font-jakarta">Produk</h1>
      </div>
      <div className="my-4 grid grid-cols-2 justify-items-stretch gap-x-3 gap-y-3">
        {products?.map((product, index) => (
          <CardProduct key={index} product={product} />
        ))}
      </div>
    </>
  );
};

export default ListProductSection;
