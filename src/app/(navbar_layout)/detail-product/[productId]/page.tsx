import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
// import { getDetailProductServer } from "@/API/detail-product";
import { DetailProductType } from "@/types/detailProduct";

// Dummy data untuk detail product sementara karena server sedang down
// Sesuai dengan ProductDetailResponseDto dari API backend
const dummyProductsData: { [key: string]: DetailProductType } = {
  "1": {
    id: "1",
    name: "Jamu Beras Kencur Air Mancur",
    info: "Jamu beras kencur tradisional dengan khasiat yang sudah terbukti. Terbuat dari bahan-bahan alami pilihan yang diolah secara higienis untuk menjaga kualitas dan manfaatnya.",
    description_list: [
      "Jamu beras kencur tradisional dengan khasiat yang sudah terbukti",
      "Terbuat dari bahan-bahan alami pilihan yang diolah secara higienis",
      "Mengandung senyawa aktif yang baik untuk kesehatan pencernaan",
      "Dapat membantu meredakan perut kembung dan mual",
      "Membantu meningkatkan nafsu makan secara alami",
      "Baik untuk kesehatan lambung dan usus",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 15000,
    is_active: true,
    company: "Air Mancur",
    avg_rating: 4.5,
    total_rater: 128,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "1",
        name: "100ml",
        img: "/default-image.jpg",
        variant: "100ml",
        expiration: "2025-12-31",
        stock: 50,
        discount: 10,
        discounted_price: 13500
      },
      {
        id: 2,
        product: "1",
        name: "200ml",
        img: "/default-image.jpg",
        variant: "200ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 15,
        discounted_price: 25500
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "2": {
    id: "2",
    name: "Jamu Kunyit Asam Air Mancur",
    info: "Jamu kunyit asam tradisional yang menyegarkan. Mengandung kurkumin dari kunyit dan asam jawa yang baik untuk kesehatan pencernaan dan anti-inflamasi.",
    description_list: [
      "Jamu kunyit asam tradisional yang menyegarkan",
      "Mengandung kurkumin dari kunyit dan asam jawa",
      "Baik untuk kesehatan pencernaan dan anti-inflamasi",
      "Dapat membantu meredakan perut kembung",
      "Membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan lambung",
      "Cocok dikonsumsi setelah makan"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 18000,
    is_active: true,
    company: "Air Mancur",
    avg_rating: 4.3,
    total_rater: 95,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "2",
        name: "100ml",
        img: "/default-image.jpg",
        variant: "100ml",
        expiration: "2025-12-31",
        stock: 40,
        discount: 10,
        discounted_price: 16200
      },
      {
        id: 2,
        product: "2",
        name: "200ml",
        img: "/default-image.jpg",
        variant: "200ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 15,
        discounted_price: 30600
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "3": {
    id: "3",
    name: "Jamu Temulawak Air Mancur",
    info: "Jamu temulawak tradisional yang baik untuk kesehatan hati dan pencernaan. Mengandung kurkuminoid yang bermanfaat untuk meningkatkan nafsu makan dan menjaga kesehatan liver.",
    description_list: [
      "Jamu temulawak tradisional yang baik untuk kesehatan hati",
      "Mengandung kurkuminoid yang bermanfaat untuk pencernaan",
      "Dapat membantu meningkatkan nafsu makan secara alami",
      "Baik untuk kesehatan liver dan sistem pencernaan",
      "Dapat membantu mengurangi peradangan dalam tubuh",
      "Membantu menjaga kesehatan saluran cerna",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 20000,
    is_active: true,
    company: "Air Mancur",
    avg_rating: 4.2,
    total_rater: 87,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "3",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 35,
        discount: 10,
        discounted_price: 18000
      },
      {
        id: 2,
        product: "3",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 15,
        discounted_price: 32000
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "4": {
    id: "4",
    name: "Jamu Jahe Merah Air Mancur",
    info: "Jamu jahe merah tradisional yang menghangatkan tubuh. Mengandung senyawa aktif yang baik untuk kesehatan pernapasan dan membantu meredakan batuk serta flu.",
    description_list: [
      "Jamu jahe merah tradisional yang menghangatkan tubuh",
      "Mengandung senyawa aktif yang baik untuk kesehatan pernapasan",
      "Dapat membantu meredakan batuk dan flu",
      "Baik untuk kesehatan tenggorokan dan saluran pernapasan",
      "Dapat membantu meningkatkan sistem kekebalan tubuh",
      "Membantu meredakan perut kembung dan mual",
      "Cocok dikonsumsi saat cuaca dingin atau saat sakit"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 22000,
    is_active: true,
    company: "Air Mancur",
    avg_rating: 4.4,
    total_rater: 112,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "4",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 10,
        discounted_price: 19800
      },
      {
        id: 2,
        product: "4",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 15,
        discounted_price: 35200
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "5": {
    id: "5",
    name: "Jamu Sari Kurma Air Mancur",
    info: "Jamu sari kurma tradisional yang kaya akan nutrisi. Mengandung vitamin dan mineral alami yang baik untuk kesehatan tubuh dan membantu meningkatkan energi.",
    description_list: [
      "Jamu sari kurma tradisional yang kaya akan nutrisi",
      "Mengandung vitamin dan mineral alami yang baik untuk kesehatan",
      "Dapat membantu meningkatkan energi dan stamina",
      "Baik untuk kesehatan pencernaan dan metabolisme",
      "Dapat membantu meningkatkan sistem kekebalan tubuh",
      "Membantu menjaga kesehatan jantung dan pembuluh darah",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 25000,
    is_active: true,
    company: "Air Mancur",
    avg_rating: 4.6,
    total_rater: 156,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "5",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 10,
        discounted_price: 22500
      },
      {
        id: 2,
        product: "5",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 15,
        discounted_price: 40000
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "6": {
    id: "6",
    name: "Jamu Brotowali Air Mancur",
    info: "Jamu brotowali tradisional yang pahit namun berkhasiat. Mengandung senyawa aktif yang baik untuk kesehatan dan membantu menjaga daya tahan tubuh.",
    description_list: [
      "Jamu brotowali tradisional yang pahit namun berkhasiat",
      "Mengandung senyawa aktif yang baik untuk kesehatan",
      "Dapat membantu menjaga daya tahan tubuh",
      "Baik untuk kesehatan kulit dan membantu meredakan gatal",
      "Dapat membantu mengontrol kadar gula darah",
      "Membantu meningkatkan sistem kekebalan tubuh",
      "Cocok dikonsumsi untuk menjaga kesehatan secara rutin"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 16000,
    is_active: true,
    company: "Air Mancur",
    avg_rating: 4.1,
    total_rater: 73,
    image_url: "/default-image.jpg",
    variants_list: [
      {
        id: 1,
        product: "6",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 40,
        discount: 10,
        discounted_price: 14400
      },
      {
        id: 2,
        product: "6",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 15,
        discounted_price: 25600
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
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
