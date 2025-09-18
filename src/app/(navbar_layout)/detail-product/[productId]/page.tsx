import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
// import { getDetailProductServer } from "@/API/detail-product";
import { DetailProductType } from "@/types/detailProduct";

// Dummy data untuk detail product sementara karena server sedang down
const dummyProductsData: { [key: string]: DetailProductType } = {
  "1": {
    id: "1",
    name: "Jahe Merah Organik",
    info: "Jahe merah organik berkualitas tinggi yang dipanen langsung dari perkebunan terbaik. Dikeringkan secara alami tanpa bahan kimia untuk menjaga khasiat dan nutrisinya.",
    description_list: [
      "Jahe merah organik berkualitas tinggi yang dipanen langsung dari perkebunan terbaik",
      "Dikeringkan secara alami tanpa bahan kimia untuk menjaga khasiat dan nutrisinya",
      "Mengandung senyawa anti-inflamasi yang dapat membantu mengurangi peradangan",
      "Dapat membantu meredakan mual dan gangguan pencernaan",
      "Membantu meningkatkan sistem kekebalan tubuh",
      "Dapat membantu mengurangi nyeri otot dan sendi",
      "Cocok untuk dibuat minuman hangat atau campuran masakan"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 6 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 30000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.5,
    total_rater: 128,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "1",
        name: "100gr",
        img: "/default-image.jpg",
        variant: "100gr",
        expiration: "2025-12-31",
        stock: 50,
        discount: 20,
        discounted_price: 20000
      },
      {
        id: 2,
        product: "1",
        name: "250gr",
        img: "/default-image.jpg",
        variant: "250gr",
        expiration: "2025-12-31",
        stock: 30,
        discount: 15,
        discounted_price: 42500
      },
      {
        id: 3,
        product: "1",
        name: "500gr",
        img: "/default-image.jpg",
        variant: "500gr",
        expiration: "2025-12-31",
        stock: 20,
        discount: 25,
        discounted_price: 67500
      }
    ]
  },
  "2": {
    id: "2",
    name: "Kunyit Bubuk Premium",
    info: "Kunyit bubuk premium yang diolah dari kunyit segar pilihan. Mengandung kurkumin tinggi yang bermanfaat untuk kesehatan tubuh dan kecantikan kulit.",
    description_list: [
      "Kunyit bubuk premium dari kunyit segar pilihan",
      "Mengandung kurkumin tinggi yang bermanfaat untuk kesehatan",
      "Dapat membantu mengurangi peradangan dalam tubuh",
      "Membantu meningkatkan sistem pencernaan",
      "Baik untuk kesehatan kulit dan wajah",
      "Dapat membantu mencegah penuaan dini",
      "Cocok untuk campuran minuman atau masker wajah"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 8 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 25000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.3,
    total_rater: 95,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "2",
        name: "50gr",
        img: "/default-image.jpg",
        variant: "50gr",
        expiration: "2025-12-31",
        stock: 40,
        discount: 10,
        discounted_price: 22500
      },
      {
        id: 2,
        product: "2",
        name: "100gr",
        img: "/default-image.jpg",
        variant: "100gr",
        expiration: "2025-12-31",
        stock: 25,
        discount: 15,
        discounted_price: 42500
      }
    ]
  },
  "3": {
    id: "3",
    name: "Temulawak Kering",
    info: "Temulawak kering berkualitas tinggi yang diolah secara tradisional. Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati dan pencernaan.",
    description_list: [
      "Temulawak kering berkualitas tinggi",
      "Diolah secara tradisional tanpa bahan kimia",
      "Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati",
      "Dapat membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan pencernaan",
      "Dapat membantu mengurangi peradangan",
      "Cocok untuk dibuat jamu atau minuman kesehatan"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 6 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 28000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.2,
    total_rater: 87,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "3",
        name: "100gr",
        img: "/default-image.jpg",
        variant: "100gr",
        expiration: "2025-12-31",
        stock: 35,
        discount: 12,
        discounted_price: 24640
      },
      {
        id: 2,
        product: "3",
        name: "250gr",
        img: "/default-image.jpg",
        variant: "250gr",
        expiration: "2025-12-31",
        stock: 15,
        discount: 18,
        discounted_price: 57400
      }
    ]
  },
  "4": {
    id: "4",
    name: "Teh Hijau Daun",
    info: "Teh hijau daun premium yang dipetik dari perkebunan teh terbaik. Mengandung antioksidan tinggi yang bermanfaat untuk kesehatan dan kecantikan.",
    description_list: [
      "Teh hijau daun premium dari perkebunan terbaik",
      "Mengandung antioksidan tinggi yang bermanfaat untuk kesehatan",
      "Dapat membantu meningkatkan metabolisme tubuh",
      "Baik untuk kesehatan jantung dan pembuluh darah",
      "Dapat membantu mencegah penuaan dini",
      "Membantu meningkatkan konsentrasi dan fokus",
      "Cocok untuk diminum pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 20000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.4,
    total_rater: 112,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "4",
        name: "25gr",
        img: "/default-image.jpg",
        variant: "25gr",
        expiration: "2025-12-31",
        stock: 60,
        discount: 8,
        discounted_price: 18400
      },
      {
        id: 2,
        product: "4",
        name: "50gr",
        img: "/default-image.jpg",
        variant: "50gr",
        expiration: "2025-12-31",
        stock: 40,
        discount: 12,
        discounted_price: 35200
      }
    ]
  },
  "5": {
    id: "5",
    name: "Madu Murni Asli",
    info: "Madu murni asli dari lebah yang dipelihara di perkebunan organik. Mengandung enzim dan nutrisi alami yang bermanfaat untuk kesehatan tubuh.",
    description_list: [
      "Madu murni asli dari lebah yang dipelihara di perkebunan organik",
      "Mengandung enzim dan nutrisi alami yang bermanfaat untuk kesehatan",
      "Dapat membantu meningkatkan sistem kekebalan tubuh",
      "Baik untuk kesehatan tenggorokan dan pernapasan",
      "Dapat membantu meredakan batuk dan flu",
      "Membantu meningkatkan energi dan stamina",
      "Cocok untuk diminum pagi atau sebelum tidur"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 24 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 45000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.6,
    total_rater: 156,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "5",
        name: "250ml",
        img: "/default-image.jpg",
        variant: "250ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 15,
        discounted_price: 38250
      },
      {
        id: 2,
        product: "5",
        name: "500ml",
        img: "/default-image.jpg",
        variant: "500ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 20,
        discounted_price: 72000
      }
    ]
  },
  "6": {
    id: "6",
    name: "Kayu Manis Batang",
    info: "Kayu manis batang premium yang dipetik dari pohon kayu manis terbaik. Mengandung cinnamaldehyde yang memberikan aroma dan rasa khas.",
    description_list: [
      "Kayu manis batang premium dari pohon terbaik",
      "Mengandung cinnamaldehyde yang memberikan aroma khas",
      "Dapat membantu mengontrol kadar gula darah",
      "Baik untuk kesehatan pencernaan",
      "Dapat membantu mengurangi peradangan",
      "Membantu meningkatkan metabolisme tubuh",
      "Cocok untuk campuran minuman atau masakan"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 15000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.1,
    total_rater: 73,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "6",
        name: "50gr",
        img: "/default-image.jpg",
        variant: "50gr",
        expiration: "2025-12-31",
        stock: 45,
        discount: 5,
        discounted_price: 14250
      },
      {
        id: 2,
        product: "6",
        name: "100gr",
        img: "/default-image.jpg",
        variant: "100gr",
        expiration: "2025-12-31",
        stock: 25,
        discount: 10,
        discounted_price: 27000
      }
    ]
  },
  "7": {
    id: "7",
    name: "Teh Hitam Pucuk",
    info: "Teh hitam pucuk premium yang dipetik dari pucuk daun teh terbaik. Mengandung kafein alami dan antioksidan yang baik untuk kesehatan.",
    description_list: [
      "Teh hitam pucuk premium dari pucuk daun terbaik",
      "Mengandung kafein alami dan antioksidan",
      "Dapat membantu meningkatkan energi dan fokus",
      "Baik untuk kesehatan jantung",
      "Dapat membantu mengurangi stres",
      "Membantu meningkatkan konsentrasi",
      "Cocok untuk diminum pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 18 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 22000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.3,
    total_rater: 89,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "7",
        name: "25gr",
        img: "/default-image.jpg",
        variant: "25gr",
        expiration: "2025-12-31",
        stock: 40,
        discount: 8,
        discounted_price: 20240
      },
      {
        id: 2,
        product: "7",
        name: "50gr",
        img: "/default-image.jpg",
        variant: "50gr",
        expiration: "2025-12-31",
        stock: 30,
        discount: 12,
        discounted_price: 38720
      }
    ]
  },
  "8": {
    id: "8",
    name: "Madu Hutan Liar",
    info: "Madu hutan liar asli yang dikumpulkan dari lebah liar di hutan alami. Mengandung nutrisi dan enzim alami yang lebih kaya.",
    description_list: [
      "Madu hutan liar asli dari lebah liar di hutan alami",
      "Mengandung nutrisi dan enzim alami yang lebih kaya",
      "Dapat membantu meningkatkan sistem kekebalan tubuh",
      "Baik untuk kesehatan tenggorokan dan pernapasan",
      "Dapat membantu meredakan batuk dan flu",
      "Membantu meningkatkan energi dan stamina",
      "Cocok untuk diminum pagi atau sebelum tidur"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 36 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 55000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.7,
    total_rater: 142,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "8",
        name: "250ml",
        img: "/default-image.jpg",
        variant: "250ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 18,
        discounted_price: 45100
      },
      {
        id: 2,
        product: "8",
        name: "500ml",
        img: "/default-image.jpg",
        variant: "500ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 22,
        discounted_price: 108900
      }
    ]
  },
  "9": {
    id: "9",
    name: "Kencur Segar",
    info: "Kencur segar berkualitas tinggi yang dipanen langsung dari perkebunan terbaik. Mengandung minyak atsiri yang memberikan aroma khas.",
    description_list: [
      "Kencur segar berkualitas tinggi dari perkebunan terbaik",
      "Mengandung minyak atsiri yang memberikan aroma khas",
      "Dapat membantu meredakan batuk dan flu",
      "Baik untuk kesehatan tenggorokan",
      "Dapat membantu meningkatkan nafsu makan",
      "Membantu meningkatkan sistem kekebalan tubuh",
      "Cocok untuk dibuat jamu atau minuman kesehatan"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 3 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 18000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.0,
    total_rater: 65,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "9",
        name: "100gr",
        img: "/default-image.jpg",
        variant: "100gr",
        expiration: "2025-12-31",
        stock: 30,
        discount: 6,
        discounted_price: 16920
      },
      {
        id: 2,
        product: "9",
        name: "250gr",
        img: "/default-image.jpg",
        variant: "250gr",
        expiration: "2025-12-31",
        stock: 20,
        discount: 10,
        discounted_price: 31500
      }
    ]
  },
  "10": {
    id: "10",
    name: "Lada Hitam Utuh",
    info: "Lada hitam utuh premium yang dipetik dari pohon lada terbaik. Mengandung piperine yang memberikan rasa pedas dan manfaat kesehatan.",
    description_list: [
      "Lada hitam utuh premium dari pohon lada terbaik",
      "Mengandung piperine yang memberikan rasa pedas",
      "Dapat membantu meningkatkan penyerapan nutrisi",
      "Baik untuk kesehatan pencernaan",
      "Dapat membantu mengurangi peradangan",
      "Membantu meningkatkan metabolisme tubuh",
      "Cocok untuk campuran masakan atau minuman"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 24 bulan setelah dibuka",
      "Bisa disimpan di kulkas untuk menjaga kesegaran"
    ],
    price: 25000,
    is_active: true,
    company: "Amimum Herbal",
    avg_rating: 4.4,
    total_rater: 98,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "10",
        name: "50gr",
        img: "/default-image.jpg",
        variant: "50gr",
        expiration: "2025-12-31",
        stock: 35,
        discount: 8,
        discounted_price: 23000
      },
      {
        id: 2,
        product: "10",
        name: "100gr",
        img: "/default-image.jpg",
        variant: "100gr",
        expiration: "2025-12-31",
        stock: 25,
        discount: 12,
        discounted_price: 44000
      }
    ]
  }
};

export default async function DetailProduct({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  let detailProduct: DetailProductType | undefined = undefined;
  let errorMessage: string | null = null;
  
  // API call dinonaktifkan sementara karena server sedang down
  // try {
  //   const data = await getDetailProductServer(productId);
  //   detailProduct = data ?? undefined;
  // } catch (err) {
  //   errorMessage = err instanceof Error ? err.message : String(err);
  // }

  // Menggunakan dummy data sementara berdasarkan productId
  detailProduct = dummyProductsData[productId] || undefined;
  
  // Jika produk tidak ditemukan, set error message
  if (!detailProduct) {
    errorMessage = "Produk tidak ditemukan";
  }
  
  // isError harus number
  const isError = errorMessage ? 500 : 0;
  return (
    <main className="pb-20">
      <ProductImage detailProduct={detailProduct} />
      <TitleProduct isLoading={false} isError={isError} data={detailProduct} />
      <ProductVariants variants={detailProduct?.variants_list ?? []} />
      <ProductInformation isLoading={false} isError={isError} datavariant={detailProduct?.variants_list?.[0]} />
      <ProductDescription isLoading={false} isError={isError} data={detailProduct} />
      <ProductPrice isLoading={false} isError={isError} data={detailProduct} datavariant={detailProduct?.variants_list?.[0]} />
    </main>
  );
}
