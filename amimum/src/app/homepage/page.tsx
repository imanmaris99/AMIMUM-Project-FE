import { SlMagnifier } from "react-icons/sl";
import CardProduct from "@/components/CardProduct";
import CardProduction from "@/components/CardProduction";

const Homepage = () => {

  const data = [
    { name: "Aji Mancur", isFeatured: true },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Sabdo Palon", isFeatured: false },
    { name: "Jamu Jago", isFeatured: false },
    { name: "Sido Muncul", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Milagros", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Jamu Jago", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Sabdo Palon", isFeatured: false },
    { name: "Jamu Jago", isFeatured: false },
    { name: "Sido Muncul", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Milagros", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mancur", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Jamu Jago", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
    { name: "Aji Mujarab", isFeatured: false },
  ];

  return (
    <div className="bg-tea py-14 px-5 h-auto">
      {/* header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-fern">SELAMAT DATANG</h1>
        <h2 className="text-2xl font-semibold text-fern">Nama User!</h2>
        <h3 className="text-xl font-semibold text-fern">
          Cari produk herbal apa?
        </h3>
      </div>

      {/* search */}
      <div className="mt-5 flex gap-4">
        <div className="relative">
          <SlMagnifier className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Cari barangmu disini..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
          />
        </div>
        <button className="bg-fern text-white py-2 px-4 rounded-md w-20 font-bold">
          Cari
        </button>
      </div>

      {/* wrapper kategori, produksi oleh, produk */}
      <div className="flex flex-col gap-6 h-[29rem] overflow-y-auto mt-6">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-lg font-semibold">Kategori</h3>
          </div>

          {/* kategori */}
          <div>
            <ul className="flex gap-2 overflow-x-auto items-center">
              <li className="min-w-max bg-fern text-white px-4 py-1 rounded-md">
                Jamu Pabrik
              </li>
              <li className="min-w-max bg-transparent text-fern px-4 py-1 rounded-md">
                Jamu Herbal
              </li>
              <li className="min-w-max bg-transparent text-fern px-4 py-1 rounded-md">
                Empon-empon
              </li>
              <li className="min-w-max bg-transparent text-fern px-4 py-1 rounded-md">
                Sembako
              </li>
              <li className="min-w-max bg-transparent text-black px-4 py-1 rounded-md">
                Kategori Lainnya
              </li>
            </ul>
          </div>

          {/* produksi oleh */}
          <div>
            <div>
              <h3 className="text-lg font-semibold">Produksi oleh</h3>
            </div>

            <div className="mt-2 h-28 overflow-y-auto">
              <ul className="grid grid-cols-3 gap-2">
                {data.map((item, index) => (
                  <CardProduction
                    key={index}
                    name={item.name}
                    isFeatured={item.isFeatured}
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* produk */}
          <div>
            <div>
              <h3 className="text-lg font-semibold">Produk</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
              <CardProduct />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
