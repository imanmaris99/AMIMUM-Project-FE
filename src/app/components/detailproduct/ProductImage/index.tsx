"use client";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineLiveHelp } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDetailProduct } from "@/app/hooks/useDetailProduct";

interface ProductImageProps {
  productId: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ productId }) => {
  const router = useRouter();
  const { detailProduct, isLoading, isError } = useDetailProduct(productId);

  // State untuk mengatur indeks gambar saat ini
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fungsi untuk pindah ke gambar berikutnya
  const handleNextImage = () => {
    if (detailProduct?.variants_list) {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % detailProduct.variants_list.length
      );
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading images</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4 mx-auto">
      <div className="flex justify-between items-center w-full max-w-md">
        <button className="p-2" onClick={handleBackToHome}>
          <IoIosArrowBack className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Detail Item</h1>
        <button className="p-2">
          <MdOutlineLiveHelp className="h-6 w-6" />
        </button>
      </div>

      {/* Gambar Produk dengan onClick */}
      <div className="relative w-full max-w-xs mt-4 mx-auto">
        <Image
          src={
            detailProduct?.variants_list[currentIndex]?.img ||
            "/default-image.jpg"
          }
          alt={`Product image ${currentIndex + 1}`}
          width={300}
          height={300}
          className="rounded-lg shadow-xl cursor-pointer"
          style={{ objectFit: "cover" }}
          onClick={handleNextImage}
        />
      </div>
    </div>
  );
};

export default ProductImage;

// import React, { useState } from "react";
// import { IoIosArrowBack } from "react-icons/io";
// import { MdOutlineLiveHelp } from "react-icons/md";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// // Komponen untuk Carousel Indicator
// const CarouselIndicator: React.FC<{
//   total: number;
//   currentIndex: number;
// }> = ({ total, currentIndex }) => {
//   return (
//     <div className="flex space-x-2 mt-2">
//       {Array.from({ length: total }).map((_, index) => (
//         <span
//           key={index}
//           className={`w-3 h-2 rounded-full transition ${
//             index === currentIndex ? "bg-green-600" : "bg-gray-300"
//           }`}
//         />
//       ))}
//     </div>
//   );
// };

// const ProductImage = () => {
//   const router = useRouter();

//   // Array URL gambar dari folder public
//   const images = [
//     "/Jamu_BuyungUpik_Strawberry.png",
//     "/Jamu_BuyungUpik_Anggur.png",
//     "/Jamu_BuyungUpik_Cokelat.png",
//   ];

//   // State untuk mengatur indeks gambar saat ini
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Fungsi untuk pindah ke gambar berikutnya
//   const handleNextImage = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const handleBackToHome = () => {
//     router.push("/");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-4 mx-auto">
//       <div className="flex justify-between items-center w-full max-w-md">
//         <button className="p-2" onClick={handleBackToHome}>
//           <IoIosArrowBack className="h-6 w-6" />
//         </button>
//         <h1 className="text-lg font-semibold">Detail Item</h1>
//         <button className="p-2">
//           <MdOutlineLiveHelp className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Gambar Produk dengan onClick */}
//       <div className="relative w-full max-w-xs mt-4 mx-auto">
//         <Image
//           src={images[currentIndex]}
//           alt={`Product image ${currentIndex + 1}`}
//           width={300}
//           height={300}
//           className="rounded-lg shadow-xl cursor-pointer"
//           style={{ objectFit: "cover" }}
//           onClick={handleNextImage}
//         />
//       </div>

//       {/* Carousel Indicator */}
//       <CarouselIndicator total={images.length} currentIndex={currentIndex} />
//     </div>
//   );
// };

// export default ProductImage;
