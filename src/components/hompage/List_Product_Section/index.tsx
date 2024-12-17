import CardProduct from "../CardProduct";

const ListProductSection = () => {
  return (
    <>
      <div className="mx-6 mt-6">
        <h1 className="font-semibold font-jakarta">Produk</h1>
      </div>
      <div className="mx-6 my-6 grid grid-cols-2 justify-items-center gap-y-4">
        {[...Array(8)].map((_, index) => (
          <CardProduct key={index} />
        ))}
      </div>
    </>
  );
};

export default ListProductSection;
