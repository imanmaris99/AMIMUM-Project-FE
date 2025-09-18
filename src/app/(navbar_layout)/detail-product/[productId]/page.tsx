import ProductImage from "@/components/detailproduct/ProductImage";
import TitleProduct from "@/components/detailproduct/TitleProduct";
import ProductVariants from "@/components/detailproduct/ProductVariants";
import ProductInformation from "@/components/detailproduct/ProductInformation";
import ProductDescription from "@/components/detailproduct/ProductDescription";
import ProductPrice from "@/components/detailproduct/ProductPrice";
// import { getDetailProductServer } from "@/API/detail-product";
import { DetailProductType } from "@/types/detailProduct";

// Dummy data untuk detail product sementara karena server sedang down
// Sesuai dengan ProductDetailResponseDto dari API backend dan konsisten dengan search data
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
    variants_list: [
      {
        id: 1,
        product: "1",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 50,
        discount: 0,
        discounted_price: 15000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "1",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 28000,
        updated_at: "2024-01-01T00:00:00Z"
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
    variants_list: [
      {
        id: 1,
        product: "2",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 40,
        discount: 0,
        discounted_price: 18000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "2",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 32000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "3": {
    id: "3",
    name: "Jamu Galian Singset Aji Mujarab",
    info: "Jamu galian singset tradisional yang baik untuk kesehatan wanita. Mengandung senyawa aktif yang bermanfaat untuk menjaga kesehatan reproduksi dan kebugaran tubuh.",
    description_list: [
      "Jamu galian singset tradisional yang baik untuk kesehatan wanita",
      "Mengandung senyawa aktif yang bermanfaat untuk reproduksi",
      "Dapat membantu menjaga kebugaran tubuh",
      "Baik untuk kesehatan sistem reproduksi wanita",
      "Dapat membantu meningkatkan stamina dan vitalitas",
      "Membantu menjaga kesehatan organ intim",
      "Cocok dikonsumsi secara rutin untuk hasil optimal"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 12000,
    is_active: true,
    company: "Aji Mujarab",
    avg_rating: 4.2,
    total_rater: 87,
    variants_list: [
      {
        id: 1,
        product: "3",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 35,
        discount: 0,
        discounted_price: 12000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "3",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 22000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "4": {
    id: "4",
    name: "Jamu Beras Kencur Jamu Jago",
    info: "Jamu beras kencur premium dari Jamu Jago dengan kualitas terbaik. Mengandung bahan-bahan alami pilihan yang diolah dengan teknologi modern.",
    description_list: [
      "Jamu beras kencur premium dari Jamu Jago",
      "Mengandung bahan-bahan alami pilihan berkualitas tinggi",
      "Diolah dengan teknologi modern untuk menjaga kualitas",
      "Dapat membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan pencernaan",
      "Membantu meredakan perut kembung",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 14000,
    is_active: true,
    company: "Jamu Jago",
    avg_rating: 4.4,
    total_rater: 112,
    variants_list: [
      {
        id: 1,
        product: "4",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 14000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "4",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 26000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "5": {
    id: "5",
    name: "Jamu Beras Kencur Nyonya Meneer",
    info: "Jamu beras kencur premium dari Nyonya Meneer dengan resep tradisional yang sudah turun temurun. Mengandung bahan-bahan alami berkualitas tinggi.",
    description_list: [
      "Jamu beras kencur premium dari Nyonya Meneer",
      "Resep tradisional yang sudah turun temurun",
      "Mengandung bahan-bahan alami berkualitas tinggi",
      "Dapat membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan pencernaan dan lambung",
      "Membantu meredakan perut kembung dan mual",
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
    company: "Nyonya Meneer",
    avg_rating: 4.6,
    total_rater: 156,
    variants_list: [
      {
        id: 1,
        product: "5",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 25000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "5",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 0,
        discounted_price: 45000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "6": {
    id: "6",
    name: "Jamu Beras Kencur Sabdo Palon",
    info: "Jamu beras kencur tradisional dari Sabdo Palon dengan khasiat yang sudah terbukti. Mengandung senyawa aktif yang baik untuk kesehatan pencernaan.",
    description_list: [
      "Jamu beras kencur tradisional dari Sabdo Palon",
      "Khasiat yang sudah terbukti secara turun temurun",
      "Mengandung senyawa aktif yang baik untuk pencernaan",
      "Dapat membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan lambung dan usus",
      "Membantu meredakan perut kembung",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 18000,
    is_active: true,
    company: "Sabdo Palon",
    avg_rating: 4.1,
    total_rater: 73,
    variants_list: [
      {
        id: 1,
        product: "6",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 40,
        discount: 0,
        discounted_price: 18000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "6",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 32000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "7": {
    id: "7",
    name: "Jamu Beras Kencur Sido Muncul",
    info: "Jamu beras kencur dari Sido Muncul dengan kualitas terjamin. Mengandung bahan-bahan alami pilihan yang diolah dengan standar farmasi.",
    description_list: [
      "Jamu beras kencur dari Sido Muncul dengan kualitas terjamin",
      "Mengandung bahan-bahan alami pilihan berkualitas tinggi",
      "Diolah dengan standar farmasi untuk keamanan dan kualitas",
      "Dapat membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan pencernaan dan lambung",
      "Membantu meredakan perut kembung dan mual",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 16000,
    is_active: true,
    company: "Sido Muncul",
    avg_rating: 4.3,
    total_rater: 89,
    variants_list: [
      {
        id: 1,
        product: "7",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 40,
        discount: 0,
        discounted_price: 16000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "7",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 28000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "8": {
    id: "8",
    name: "Jamu Kunyit Asam Sido Muncul",
    info: "Jamu kunyit asam dari Sido Muncul dengan kualitas terjamin. Mengandung kurkumin dari kunyit dan asam jawa yang baik untuk kesehatan.",
    description_list: [
      "Jamu kunyit asam dari Sido Muncul dengan kualitas terjamin",
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
    price: 17000,
    is_active: true,
    company: "Sido Muncul",
    avg_rating: 4.7,
    total_rater: 142,
    variants_list: [
      {
        id: 1,
        product: "8",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 17000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "8",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 0,
        discounted_price: 30000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "9": {
    id: "9",
    name: "Jamu Galian Singset Sido Muncul",
    info: "Jamu galian singset dari Sido Muncul dengan kualitas terjamin. Mengandung senyawa aktif yang baik untuk kesehatan wanita.",
    description_list: [
      "Jamu galian singset dari Sido Muncul dengan kualitas terjamin",
      "Mengandung senyawa aktif yang baik untuk kesehatan wanita",
      "Dapat membantu menjaga kebugaran tubuh",
      "Baik untuk kesehatan sistem reproduksi wanita",
      "Dapat membantu meningkatkan stamina dan vitalitas",
      "Membantu menjaga kesehatan organ intim",
      "Cocok dikonsumsi secara rutin untuk hasil optimal"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 19000,
    is_active: true,
    company: "Sido Muncul",
    avg_rating: 4.0,
    total_rater: 65,
    variants_list: [
      {
        id: 1,
        product: "9",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 19000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "9",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 35000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "10": {
    id: "10",
    name: "Jamu Temulawak Sido Muncul",
    info: "Jamu temulawak dari Sido Muncul dengan kualitas terjamin. Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati dan pencernaan.",
    description_list: [
      "Jamu temulawak dari Sido Muncul dengan kualitas terjamin",
      "Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati",
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
    company: "Sido Muncul",
    avg_rating: 4.4,
    total_rater: 98,
    variants_list: [
      {
        id: 1,
        product: "10",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 35,
        discount: 0,
        discounted_price: 20000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "10",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 36000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "11": {
    id: "11",
    name: "Jamu Asam Urat Aji Mujarab",
    info: "Jamu asam urat tradisional dari Aji Mujarab yang berkhasiat untuk meredakan gejala asam urat. Mengandung senyawa aktif yang membantu mengurangi kadar asam urat dalam darah.",
    description_list: [
      "Jamu asam urat tradisional dari Aji Mujarab",
      "Berkhasiat untuk meredakan gejala asam urat",
      "Mengandung senyawa aktif yang membantu mengurangi kadar asam urat",
      "Dapat membantu meredakan nyeri sendi dan peradangan",
      "Baik untuk kesehatan ginjal dan sistem ekskresi",
      "Membantu melarutkan kristal asam urat",
      "Cocok dikonsumsi secara rutin untuk hasil optimal"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 13000,
    is_active: true,
    company: "Aji Mujarab",
    avg_rating: 4.3,
    total_rater: 76,
    variants_list: [
      {
        id: 1,
        product: "11",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 13000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "11",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 24000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "12": {
    id: "12",
    name: "Jamu Beras Kencur Aji Mujarab",
    info: "Jamu beras kencur dari Aji Mujarab dengan kualitas terjamin. Mengandung bahan-bahan alami pilihan yang diolah dengan standar farmasi untuk keamanan dan kualitas.",
    description_list: [
      "Jamu beras kencur dari Aji Mujarab dengan kualitas terjamin",
      "Mengandung bahan-bahan alami pilihan berkualitas tinggi",
      "Diolah dengan standar farmasi untuk keamanan dan kualitas",
      "Dapat membantu meningkatkan nafsu makan",
      "Baik untuk kesehatan pencernaan dan lambung",
      "Membantu meredakan perut kembung dan mual",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 13000,
    is_active: true,
    company: "Aji Mujarab",
    avg_rating: 4.1,
    total_rater: 58,
    variants_list: [
      {
        id: 1,
        product: "12",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 13000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "12",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 24000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "13": {
    id: "13",
    name: "Jamu Kunyit Asam Aji Mujarab",
    info: "Jamu kunyit asam dari Aji Mujarab dengan kualitas terjamin. Mengandung kurkumin dari kunyit dan asam jawa yang baik untuk kesehatan pencernaan dan anti-inflamasi.",
    description_list: [
      "Jamu kunyit asam dari Aji Mujarab dengan kualitas terjamin",
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
    price: 14000,
    is_active: true,
    company: "Aji Mujarab",
    avg_rating: 4.2,
    total_rater: 64,
    variants_list: [
      {
        id: 1,
        product: "13",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 14000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "13",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 0,
        discounted_price: 25000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "14": {
    id: "14",
    name: "Jamu Temulawak Aji Mujarab",
    info: "Jamu temulawak dari Aji Mujarab dengan kualitas terjamin. Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati dan pencernaan serta meningkatkan nafsu makan.",
    description_list: [
      "Jamu temulawak dari Aji Mujarab dengan kualitas terjamin",
      "Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati",
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
    price: 15000,
    is_active: true,
    company: "Aji Mujarab",
    avg_rating: 4.0,
    total_rater: 42,
    variants_list: [
      {
        id: 1,
        product: "14",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 15000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "14",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 0,
        discounted_price: 27000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "15": {
    id: "15",
    name: "Jamu Kunyit Asam Jamu Jago",
    info: "Jamu kunyit asam dari Jamu Jago dengan kualitas premium. Mengandung kurkumin dari kunyit dan asam jawa yang baik untuk kesehatan pencernaan dan anti-inflamasi.",
    description_list: [
      "Jamu kunyit asam dari Jamu Jago dengan kualitas premium",
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
    price: 15000,
    is_active: true,
    company: "Jamu Jago",
    avg_rating: 4.3,
    total_rater: 89,
    variants_list: [
      {
        id: 1,
        product: "15",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 15,
        discount: 0,
        discounted_price: 15000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "15",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 10,
        discount: 0,
        discounted_price: 27000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "16": {
    id: "16",
    name: "Jamu Galian Singset Jamu Jago",
    info: "Jamu galian singset dari Jamu Jago dengan kualitas premium. Mengandung senyawa aktif yang baik untuk kesehatan wanita dan membantu menjaga kebugaran tubuh.",
    description_list: [
      "Jamu galian singset dari Jamu Jago dengan kualitas premium",
      "Mengandung senyawa aktif yang baik untuk kesehatan wanita",
      "Dapat membantu menjaga kebugaran tubuh",
      "Baik untuk kesehatan sistem reproduksi wanita",
      "Dapat membantu meningkatkan stamina dan vitalitas",
      "Membantu menjaga kesehatan organ intim",
      "Cocok dikonsumsi secara rutin untuk hasil optimal"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 16000,
    is_active: true,
    company: "Jamu Jago",
    avg_rating: 4.1,
    total_rater: 67,
    variants_list: [
      {
        id: 1,
        product: "16",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 40,
        discount: 0,
        discounted_price: 16000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "16",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 28000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "17": {
    id: "17",
    name: "Jamu Temulawak Jamu Jago",
    info: "Jamu temulawak dari Jamu Jago dengan kualitas premium. Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati dan pencernaan serta meningkatkan nafsu makan.",
    description_list: [
      "Jamu temulawak dari Jamu Jago dengan kualitas premium",
      "Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati",
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
    price: 17000,
    is_active: true,
    company: "Jamu Jago",
    avg_rating: 4.2,
    total_rater: 73,
    variants_list: [
      {
        id: 1,
        product: "17",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 50,
        discount: 0,
        discounted_price: 17000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "17",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 35,
        discount: 0,
        discounted_price: 30000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "18": {
    id: "18",
    name: "Jamu Kunyit Asam Nyonya Meneer",
    info: "Jamu kunyit asam premium dari Nyonya Meneer dengan resep tradisional yang sudah turun temurun. Mengandung kurkumin dari kunyit dan asam jawa berkualitas tinggi.",
    description_list: [
      "Jamu kunyit asam premium dari Nyonya Meneer",
      "Resep tradisional yang sudah turun temurun",
      "Mengandung kurkumin dari kunyit dan asam jawa berkualitas tinggi",
      "Baik untuk kesehatan pencernaan dan anti-inflamasi",
      "Dapat membantu meredakan perut kembung",
      "Membantu meningkatkan nafsu makan",
      "Cocok dikonsumsi setelah makan"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 26000,
    is_active: true,
    company: "Nyonya Meneer",
    avg_rating: 4.5,
    total_rater: 134,
    variants_list: [
      {
        id: 1,
        product: "18",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 35,
        discount: 0,
        discounted_price: 26000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "18",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 25,
        discount: 0,
        discounted_price: 48000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "19": {
    id: "19",
    name: "Jamu Galian Singset Nyonya Meneer",
    info: "Jamu galian singset premium dari Nyonya Meneer dengan resep tradisional yang sudah turun temurun. Mengandung senyawa aktif yang baik untuk kesehatan wanita.",
    description_list: [
      "Jamu galian singset premium dari Nyonya Meneer",
      "Resep tradisional yang sudah turun temurun",
      "Mengandung senyawa aktif yang baik untuk kesehatan wanita",
      "Dapat membantu menjaga kebugaran tubuh",
      "Baik untuk kesehatan sistem reproduksi wanita",
      "Dapat membantu meningkatkan stamina dan vitalitas",
      "Cocok dikonsumsi secara rutin untuk hasil optimal"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 27000,
    is_active: true,
    company: "Nyonya Meneer",
    avg_rating: 4.4,
    total_rater: 98,
    variants_list: [
      {
        id: 1,
        product: "19",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 27000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "19",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 10,
        discount: 0,
        discounted_price: 50000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  "20": {
    id: "20",
    name: "Jamu Temulawak Nyonya Meneer",
    info: "Jamu temulawak premium dari Nyonya Meneer dengan resep tradisional yang sudah turun temurun. Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati dan pencernaan.",
    description_list: [
      "Jamu temulawak premium dari Nyonya Meneer",
      "Resep tradisional yang sudah turun temurun",
      "Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati",
      "Dapat membantu meningkatkan nafsu makan secara alami",
      "Baik untuk kesehatan liver dan sistem pencernaan",
      "Dapat membantu mengurangi peradangan dalam tubuh",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    price: 28000,
    is_active: true,
    company: "Nyonya Meneer",
    avg_rating: 4.6,
    total_rater: 156,
    variants_list: [
      {
        id: 1,
        product: "20",
        name: "60ml",
        img: "/default-image.jpg",
        variant: "60ml",
        expiration: "2025-12-31",
        stock: 30,
        discount: 0,
        discounted_price: 28000,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: 2,
        product: "20",
        name: "120ml",
        img: "/default-image.jpg",
        variant: "120ml",
        expiration: "2025-12-31",
        stock: 20,
        discount: 0,
        discounted_price: 52000,
        updated_at: "2024-01-01T00:00:00Z"
      }
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
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
