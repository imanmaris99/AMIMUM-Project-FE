// Centralized Dummy Data Management
// Mengikuti struktur Backend API dan memastikan konsistensi data

import { DetailProductType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";
import { AllProductInfoType, BrandInfoType, VariantAllProductType } from "@/types/apiTypes";

// ==================== RATING TYPES ====================
export interface RatingDummyType {
  id: number;
  rate: number;
  review: string | null;
  product_id: string;
  user_id: string;
  product_name: string;
  rater_name: string;
  created_at: string;
}

export interface ProductRatingSummary {
  avg_rating: number;
  total_rater: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recent_reviews: RatingDummyType[];
}

// ==================== BRAND DATA ====================
export const BRAND_DATA = {
  "1": {
    id: 1,
    name: "Air Mancur",
    photo_url: "/airmancur 1.svg",
    description_list: [
      "Brand jamu tradisional dengan kualitas terjamin",
      "Menggunakan bahan-bahan alami pilihan",
      "Proses produksi higienis dan modern"
    ],
    category: "Jamu",
    total_product: 15,
    total_product_with_promo: 7, // 7 produk yang memiliki discount
    promo_special: 29, // Update to match actual max discount
    created_at: "2024-01-01T00:00:00Z"
  },
  "2": {
    id: 2,
    name: "Aji Mujarab",
    photo_url: "/aji-mujarab 1.svg",
    description_list: [
      "Jamu herbal berkualitas tinggi dengan khasiat mujarab",
      "Resep tradisional yang sudah terbukti",
      "Diolah dengan standar farmasi"
    ],
    category: "Jamu",
    total_product: 15,
    total_product_with_promo: 6, // 6 produk yang memiliki discount
    promo_special: 28, // Update to match actual max discount
    created_at: "2024-01-01T00:00:00Z"
  },
  "3": {
    id: 3,
    name: "Jamu Jago",
    photo_url: "/jamu_jago 1.svg",
    description_list: [
      "Jamu tradisional dengan kualitas jago",
      "Menggunakan teknologi modern",
      "Terpercaya sejak puluhan tahun"
    ],
    category: "Jamu",
    total_product: 15,
    total_product_with_promo: 8, // 8 produk yang memiliki discount
    promo_special: 30, // Update to match actual max discount
    created_at: "2024-01-01T00:00:00Z"
  },
  "4": {
    id: 4,
    name: "Nyonya Meneer",
    photo_url: "/nyonya-meneer 1.svg",
    description_list: [
      "Brand jamu premium dengan standar internasional",
      "Resep turun temurun yang sudah terbukti",
      "Kualitas terjamin dan terpercaya"
    ],
    category: "Jamu",
    total_product: 15,
    total_product_with_promo: 9, // 9 produk yang memiliki discount
    promo_special: 30,
    created_at: "2024-01-01T00:00:00Z"
  },
  "5": {
    id: 5,
    name: "Sabdo Palon",
    photo_url: "/sabdo-palon 1.svg",
    description_list: [
      "Jamu herbal dengan filosofi kesehatan holistik",
      "Mengutamakan keseimbangan tubuh dan jiwa",
      "Bahan-bahan alami berkualitas tinggi"
    ],
    category: "Jamu",
    total_product: 10,
    total_product_with_promo: 4, // 4 produk yang memiliki discount
    promo_special: 27, // Update to match actual max discount
    created_at: "2024-01-01T00:00:00Z"
  },
  "6": {
    id: 6,
    name: "Sido Muncul",
    photo_url: "/sido-muncul 1.svg",
    description_list: [
      "Pionir jamu modern dengan inovasi terdepan",
      "Menggabungkan tradisi dan teknologi",
      "Terpercaya oleh jutaan keluarga Indonesia"
    ],
    category: "Jamu",
    total_product: 15,
    total_product_with_promo: 7, // 7 produk yang memiliki discount
    promo_special: 26, // Update to match actual max discount
    created_at: "2024-01-01T00:00:00Z"
  }
} as const;

// ==================== PRODUCT TEMPLATES ====================
const PRODUCT_TEMPLATES = {
  "beras-kencur": {
    baseName: "Jamu Beras Kencur",
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
    avg_rating: 4.5,
    total_rater: 128
  },
  "kunyit-asam": {
    baseName: "Jamu Kunyit Asam",
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
    avg_rating: 4.3,
    total_rater: 95
  },
  "galian-singset": {
    baseName: "Jamu Galian Singset",
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
    avg_rating: 4.2,
    total_rater: 87
  },
  "temulawak": {
    baseName: "Jamu Temulawak",
    info: "Jamu temulawak tradisional dengan khasiat yang sudah terbukti. Mengandung kurkuminoid yang bermanfaat untuk kesehatan hati dan pencernaan serta meningkatkan nafsu makan.",
    description_list: [
      "Jamu temulawak tradisional dengan khasiat yang sudah terbukti",
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
    avg_rating: 4.4,
    total_rater: 98
  },
  "jahe-merah": {
    baseName: "Jamu Jahe Merah",
    info: "Jamu jahe merah tradisional yang menghangatkan. Mengandung senyawa aktif yang baik untuk kesehatan pernapasan dan sirkulasi darah.",
    description_list: [
      "Jamu jahe merah tradisional yang menghangatkan",
      "Mengandung senyawa aktif yang baik untuk pernapasan",
      "Dapat membantu meningkatkan sirkulasi darah",
      "Baik untuk kesehatan jantung dan pembuluh darah",
      "Dapat membantu meredakan gejala flu dan batuk",
      "Membantu menjaga daya tahan tubuh",
      "Cocok dikonsumsi saat cuaca dingin"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.1,
    total_rater: 76
  },
  "asam-urat": {
    baseName: "Jamu Asam Urat",
    info: "Jamu asam urat tradisional yang berkhasiat untuk meredakan gejala asam urat. Mengandung senyawa aktif yang membantu mengurangi kadar asam urat dalam darah.",
    description_list: [
      "Jamu asam urat tradisional yang berkhasiat",
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
    avg_rating: 4.3,
    total_rater: 76
  },
  "sirih-merah": {
    baseName: "Jamu Sirih Merah",
    info: "Jamu sirih merah tradisional yang kaya akan antioksidan. Mengandung senyawa aktif yang baik untuk kesehatan mulut dan tenggorokan serta meningkatkan daya tahan tubuh.",
    description_list: [
      "Jamu sirih merah tradisional yang kaya antioksidan",
      "Baik untuk kesehatan mulut dan tenggorokan",
      "Membantu meningkatkan daya tahan tubuh",
      "Dapat membantu meredakan batuk dan radang tenggorokan",
      "Baik untuk kesehatan gigi dan gusi",
      "Membantu melawan bakteri dan virus",
      "Cocok dikonsumsi pagi hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.2,
    total_rater: 89
  },
  "kumis-kucing": {
    baseName: "Jamu Kumis Kucing",
    info: "Jamu kumis kucing tradisional yang berkhasiat untuk kesehatan ginjal dan saluran kemih. Mengandung senyawa aktif yang membantu melancarkan buang air kecil.",
    description_list: [
      "Jamu kumis kucing tradisional yang berkhasiat",
      "Baik untuk kesehatan ginjal dan saluran kemih",
      "Membantu melancarkan buang air kecil",
      "Dapat membantu mencegah batu ginjal",
      "Baik untuk detoksifikasi tubuh",
      "Membantu mengurangi peradangan saluran kemih",
      "Cocok dikonsumsi secara rutin"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.4,
    total_rater: 92
  },
  "sambiloto": {
    baseName: "Jamu Sambiloto",
    info: "Jamu sambiloto tradisional yang dikenal sebagai 'king of bitter'. Mengandung senyawa aktif yang baik untuk meningkatkan daya tahan tubuh dan melawan infeksi.",
    description_list: [
      "Jamu sambiloto tradisional 'king of bitter'",
      "Baik untuk meningkatkan daya tahan tubuh",
      "Membantu melawan infeksi dan bakteri",
      "Dapat membantu menurunkan demam",
      "Baik untuk kesehatan liver",
      "Membantu mengurangi peradangan",
      "Cocok dikonsumsi saat sakit"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.1,
    total_rater: 78
  },
  "daun-dewa": {
    baseName: "Jamu Daun Dewa",
    info: "Jamu daun dewa tradisional yang berkhasiat untuk kesehatan jantung dan peredaran darah. Mengandung senyawa aktif yang membantu melancarkan sirkulasi darah.",
    description_list: [
      "Jamu daun dewa tradisional yang berkhasiat",
      "Baik untuk kesehatan jantung dan peredaran darah",
      "Membantu melancarkan sirkulasi darah",
      "Dapat membantu menurunkan tekanan darah",
      "Baik untuk kesehatan pembuluh darah",
      "Membantu mengurangi risiko stroke",
      "Cocok dikonsumsi secara rutin"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.3,
    total_rater: 85
  },
  "pegagan": {
    baseName: "Jamu Pegagan",
    info: "Jamu pegagan tradisional yang dikenal sebagai 'herbal untuk otak'. Mengandung senyawa aktif yang baik untuk meningkatkan daya ingat dan konsentrasi.",
    description_list: [
      "Jamu pegagan tradisional 'herbal untuk otak'",
      "Baik untuk meningkatkan daya ingat dan konsentrasi",
      "Membantu melancarkan peredaran darah ke otak",
      "Dapat membantu mengurangi stres dan kecemasan",
      "Baik untuk kesehatan saraf",
      "Membantu meningkatkan fokus dan produktivitas",
      "Cocok dikonsumsi pagi hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.5,
    total_rater: 95
  },
  "lidah-buaya": {
    baseName: "Jamu Lidah Buaya",
    info: "Jamu lidah buaya tradisional yang berkhasiat untuk kesehatan pencernaan dan kulit. Mengandung senyawa aktif yang membantu melancarkan pencernaan dan menyehatkan kulit.",
    description_list: [
      "Jamu lidah buaya tradisional yang berkhasiat",
      "Baik untuk kesehatan pencernaan dan kulit",
      "Membantu melancarkan pencernaan",
      "Dapat membantu meredakan sembelit",
      "Baik untuk kesehatan lambung",
      "Membantu menyehatkan kulit dari dalam",
      "Cocok dikonsumsi pagi atau sore hari"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.2,
    total_rater: 88
  },
  "mahkota-dewa": {
    baseName: "Jamu Mahkota Dewa",
    info: "Jamu mahkota dewa tradisional yang dikenal sebagai 'herbal anti-kanker'. Mengandung senyawa aktif yang baik untuk meningkatkan daya tahan tubuh dan melawan radikal bebas.",
    description_list: [
      "Jamu mahkota dewa tradisional 'herbal anti-kanker'",
      "Baik untuk meningkatkan daya tahan tubuh",
      "Membantu melawan radikal bebas",
      "Dapat membantu mencegah pertumbuhan sel abnormal",
      "Baik untuk detoksifikasi tubuh",
      "Membantu meningkatkan sistem imun",
      "Cocok dikonsumsi secara rutin"
    ],
    instructions_list: [
      "Simpan di tempat yang kering dan sejuk",
      "Hindari paparan sinar matahari langsung",
      "Gunakan dalam 12 bulan setelah dibuka",
      "Kocok sebelum diminum untuk hasil terbaik"
    ],
    avg_rating: 4.4,
    total_rater: 91
  }
} as const;

// ==================== PRODUCT CONFIGURATION ====================
const PRODUCT_CONFIG = {
  "1": [ // Air Mancur - 20% discount (Random: 7 discount, 8 normal)
    { template: "beras-kencur", basePrice: 15000, stock: [50, 30], hasDiscount: true },
    { template: "kunyit-asam", basePrice: 18000, stock: [40, 25], hasDiscount: false },
    { template: "temulawak", basePrice: 20000, stock: [35, 20], hasDiscount: true },
    { template: "jahe-merah", basePrice: 22000, stock: [30, 20], hasDiscount: false },
    { template: "sirih-merah", basePrice: 16000, stock: [45, 30], hasDiscount: true },
    { template: "kumis-kucing", basePrice: 19000, stock: [35, 25], hasDiscount: false },
    { template: "sambiloto", basePrice: 21000, stock: [30, 20], hasDiscount: true },
    { template: "daun-dewa", basePrice: 23000, stock: [25, 15], hasDiscount: false },
    { template: "pegagan", basePrice: 17000, stock: [40, 25], hasDiscount: true },
    { template: "lidah-buaya", basePrice: 20000, stock: [35, 20], hasDiscount: false },
    { template: "mahkota-dewa", basePrice: 22000, stock: [30, 20], hasDiscount: true },
    { template: "asam-urat", basePrice: 18000, stock: [25, 15], hasDiscount: false },
    { template: "galian-singset", basePrice: 19000, stock: [30, 20], hasDiscount: true },
    { template: "beras-kencur", basePrice: 16000, stock: [40, 25], hasDiscount: false },
    { template: "temulawak", basePrice: 21000, stock: [25, 15], hasDiscount: true }
  ],
  "2": [ // Aji Mujarab - 15% discount (Random: 6 discount, 9 normal)
    { template: "galian-singset", basePrice: 12000, stock: [45, 30], hasDiscount: true },
    { template: "asam-urat", basePrice: 13000, stock: [30, 20], hasDiscount: false },
    { template: "beras-kencur", basePrice: 13000, stock: [30, 20], hasDiscount: false },
    { template: "kunyit-asam", basePrice: 14000, stock: [25, 15], hasDiscount: true },
    { template: "pegagan", basePrice: 15000, stock: [40, 25], hasDiscount: false },
    { template: "lidah-buaya", basePrice: 16000, stock: [35, 20], hasDiscount: true },
    { template: "mahkota-dewa", basePrice: 17000, stock: [30, 20], hasDiscount: false },
    { template: "temulawak", basePrice: 18000, stock: [25, 15], hasDiscount: true },
    { template: "sirih-merah", basePrice: 16000, stock: [40, 25], hasDiscount: false },
    { template: "kumis-kucing", basePrice: 17000, stock: [35, 20], hasDiscount: false },
    { template: "sambiloto", basePrice: 18000, stock: [30, 20], hasDiscount: true },
    { template: "daun-dewa", basePrice: 19000, stock: [25, 15], hasDiscount: false },
    { template: "jahe-merah", basePrice: 20000, stock: [30, 20], hasDiscount: false },
    { template: "beras-kencur", basePrice: 14000, stock: [35, 20], hasDiscount: true },
    { template: "kunyit-asam", basePrice: 15000, stock: [30, 20], hasDiscount: false }
  ],
  "3": [ // Jamu Jago - 25% discount (Random: 8 discount, 7 normal)
    { template: "beras-kencur", basePrice: 14000, stock: [50, 30], hasDiscount: true },
    { template: "kunyit-asam", basePrice: 16000, stock: [45, 25], hasDiscount: false },
    { template: "temulawak", basePrice: 18000, stock: [40, 25], hasDiscount: true },
    { template: "jahe-merah", basePrice: 20000, stock: [35, 20], hasDiscount: true },
    { template: "sirih-merah", basePrice: 15000, stock: [40, 25], hasDiscount: false },
    { template: "kumis-kucing", basePrice: 17000, stock: [35, 20], hasDiscount: true },
    { template: "sambiloto", basePrice: 19000, stock: [30, 20], hasDiscount: false },
    { template: "daun-dewa", basePrice: 21000, stock: [25, 15], hasDiscount: true },
    { template: "pegagan", basePrice: 16000, stock: [40, 25], hasDiscount: true },
    { template: "lidah-buaya", basePrice: 18000, stock: [35, 20], hasDiscount: false },
    { template: "mahkota-dewa", basePrice: 20000, stock: [30, 20], hasDiscount: true },
    { template: "asam-urat", basePrice: 17000, stock: [25, 15], hasDiscount: false },
    { template: "galian-singset", basePrice: 19000, stock: [30, 20], hasDiscount: true },
    { template: "beras-kencur", basePrice: 15000, stock: [35, 20], hasDiscount: false },
    { template: "temulawak", basePrice: 20000, stock: [25, 15], hasDiscount: true }
  ],
  "4": [ // Nyonya Meneer - 30% discount (Random: 9 discount, 6 normal)
    { template: "beras-kencur", basePrice: 25000, stock: [40, 25], hasDiscount: true },
    { template: "kunyit-asam", basePrice: 28000, stock: [35, 20], hasDiscount: true },
    { template: "temulawak", basePrice: 30000, stock: [30, 20], hasDiscount: false },
    { template: "jahe-merah", basePrice: 32000, stock: [25, 15], hasDiscount: true },
    { template: "pegagan", basePrice: 26000, stock: [35, 20], hasDiscount: false },
    { template: "lidah-buaya", basePrice: 29000, stock: [30, 20], hasDiscount: true },
    { template: "mahkota-dewa", basePrice: 31000, stock: [25, 15], hasDiscount: false },
    { template: "sirih-merah", basePrice: 33000, stock: [20, 10], hasDiscount: true },
    { template: "kumis-kucing", basePrice: 27000, stock: [30, 20], hasDiscount: true },
    { template: "sambiloto", basePrice: 30000, stock: [25, 15], hasDiscount: false },
    { template: "daun-dewa", basePrice: 32000, stock: [20, 10], hasDiscount: true },
    { template: "asam-urat", basePrice: 28000, stock: [25, 15], hasDiscount: true },
    { template: "galian-singset", basePrice: 30000, stock: [20, 10], hasDiscount: false },
    { template: "beras-kencur", basePrice: 26000, stock: [30, 20], hasDiscount: true },
    { template: "temulawak", basePrice: 31000, stock: [20, 10], hasDiscount: true }
  ],
  "5": [ // Sabdo Palon - 18% discount (Random: 4 discount, 6 normal)
    { template: "beras-kencur", basePrice: 18000, stock: [40, 25], hasDiscount: true },
    { template: "kunyit-asam", basePrice: 20000, stock: [35, 20], hasDiscount: false },
    { template: "kumis-kucing", basePrice: 19000, stock: [30, 20], hasDiscount: false },
    { template: "sambiloto", basePrice: 21000, stock: [25, 15], hasDiscount: true },
    { template: "daun-dewa", basePrice: 22000, stock: [30, 20], hasDiscount: false },
    { template: "pegagan", basePrice: 23000, stock: [25, 15], hasDiscount: false },
    { template: "sirih-merah", basePrice: 20000, stock: [30, 20], hasDiscount: true },
    { template: "lidah-buaya", basePrice: 21000, stock: [25, 15], hasDiscount: false },
    { template: "mahkota-dewa", basePrice: 22000, stock: [20, 10], hasDiscount: false },
    { template: "asam-urat", basePrice: 19000, stock: [25, 15], hasDiscount: true }
  ],
  "6": [ // Sido Muncul - 22% discount (Random: 7 discount, 8 normal)
    { template: "beras-kencur", basePrice: 16000, stock: [50, 30], hasDiscount: true },
    { template: "kunyit-asam", basePrice: 18000, stock: [45, 25], hasDiscount: false },
    { template: "temulawak", basePrice: 20000, stock: [40, 25], hasDiscount: true },
    { template: "jahe-merah", basePrice: 22000, stock: [35, 20], hasDiscount: false },
    { template: "sirih-merah", basePrice: 17000, stock: [40, 25], hasDiscount: true },
    { template: "kumis-kucing", basePrice: 19000, stock: [35, 20], hasDiscount: false },
    { template: "sambiloto", basePrice: 21000, stock: [30, 20], hasDiscount: true },
    { template: "daun-dewa", basePrice: 23000, stock: [25, 15], hasDiscount: false },
    { template: "pegagan", basePrice: 18000, stock: [40, 25], hasDiscount: true },
    { template: "lidah-buaya", basePrice: 20000, stock: [35, 20], hasDiscount: false },
    { template: "mahkota-dewa", basePrice: 22000, stock: [30, 20], hasDiscount: true },
    { template: "asam-urat", basePrice: 19000, stock: [25, 15], hasDiscount: false },
    { template: "galian-singset", basePrice: 20000, stock: [30, 20], hasDiscount: true },
    { template: "beras-kencur", basePrice: 17000, stock: [35, 20], hasDiscount: false },
    { template: "temulawak", basePrice: 21000, stock: [25, 15], hasDiscount: true }
  ]
} as const;

// ==================== UTILITY FUNCTIONS ====================
function calculateDiscountedPrice(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100));
}

function generateProductId(brandId: string, productIndex: number): string {
  return `${brandId}${String(productIndex).padStart(2, '0')}`;
}

// ==================== IMAGE MAPPING ====================
const PRODUCT_IMAGES = {
  "beras-kencur": "/buyungupik_agr-1.svg",
  "kunyit-asam": "/buyungupik_agr-1.svg",
  "galian-singset": "/buyungupik_agr-1.svg",
  "temulawak": "/buyungupik_agr-1.svg",
  "jahe-merah": "/buyungupik_agr-1.svg",
  "asam-urat": "/buyungupik_agr-1.svg",
  "sirih-merah": "/buyungupik_agr-1.svg",
  "kumis-kucing": "/buyungupik_agr-1.svg",
  "sambiloto": "/buyungupik_agr-1.svg",
  "daun-dewa": "/buyungupik_agr-1.svg",
  "pegagan": "/buyungupik_agr-1.svg",
  "lidah-buaya": "/buyungupik_agr-1.svg",
  "mahkota-dewa": "/buyungupik_agr-1.svg"
} as const;

function createVariants(basePrice: number, discount: number, stock: number[], hasDiscount: boolean, template: string): any[] {
  const actualDiscount = hasDiscount ? discount : 0;
  const discountedPrice = hasDiscount ? calculateDiscountedPrice(basePrice, discount) : basePrice;
  const productImage = PRODUCT_IMAGES[template as keyof typeof PRODUCT_IMAGES] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center";
  
  // Data variant rasa yang konsisten
  const flavorVariants = [
    "Anggur", "Strawberry", "Cokelat", "Vanilla", 
    "Melon", "Jeruk", "Susu", "Mocca"
  ];
  
  return flavorVariants.map((flavor, index) => ({
    id: index + 1,
    product: "1",
    name: flavor,
    img: productImage,
    variant: flavor,
    expiration: "2025-12-31",
    stock: stock[index % stock.length] || Math.floor(Math.random() * 50) + 20,
    discount: actualDiscount,
    discounted_price: discountedPrice,
    updated_at: "2024-01-01T00:00:00Z"
  }));
}





// ==================== CATEGORY DATA ====================
export const CATEGORY_DATA = {
  status_code: 200,
  message: "Success",
  data: [
    {
      id: 1,
      name: "Jamu Tradisional",
      description_list: ["Jamu tradisional dengan resep turun temurun"],
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Jamu Herbal",
      description_list: ["Jamu herbal dengan bahan-bahan alami"],
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Jamu Modern",
      description_list: ["Jamu modern dengan teknologi terbaru"],
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Jamu Premium",
      description_list: ["Jamu premium dengan kualitas terbaik"],
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "Jamu Kesehatan",
      description_list: ["Jamu untuk menjaga kesehatan tubuh"],
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 6,
      name: "Jamu Kecantikan",
      description_list: ["Jamu untuk kecantikan dan perawatan"],
      created_at: "2024-01-01T00:00:00Z"
    }
  ]
};

// ==================== ARTICLE DATA ====================
export const ARTICLE_DATA = {
  status_code: 200,
  message: "Success",
  data: [
    {
      display_id: "art-001",
      title: "Manfaat Jamu Beras Kencur untuk Kesehatan",
      img: "/default-image.jpg",
      description_list: [
        "Jamu beras kencur memiliki banyak manfaat untuk kesehatan",
        "Dapat membantu meningkatkan nafsu makan",
        "Baik untuk kesehatan pencernaan"
      ]
    },
    {
      display_id: "art-002",
      title: "Cara Memilih Jamu yang Berkualitas",
      img: "/default-image.jpg",
      description_list: [
        "Pilih jamu yang memiliki izin BPOM",
        "Perhatikan tanggal kadaluarsa",
        "Pilih yang sesuai dengan kebutuhan"
      ]
    },
    {
      display_id: "art-003",
      title: "Resep Jamu Tradisional untuk Keluarga",
      img: "/default-image.jpg",
      description_list: [
        "Resep jamu yang mudah dibuat di rumah",
        "Bahan-bahan yang mudah didapat",
        "Cara penyajian yang benar"
      ]
    },
    {
      display_id: "art-004",
      title: "Tips Menyimpan Jamu dengan Benar",
      img: "/default-image.jpg",
      description_list: [
        "Simpan di tempat yang kering dan sejuk",
        "Hindari paparan sinar matahari langsung",
        "Perhatikan tanggal kadaluarsa"
      ]
    }
  ]
};

// ==================== PRODUCTION DATA ====================
export const PRODUCTION_DATA = {
  status_code: 200,
  message: "Success",
  data: Object.values(BRAND_DATA).map(brand => ({
    id: brand.id,
    name: brand.name,
    photo_url: brand.photo_url,
    description_list: brand.description_list,
    category: brand.category,
    created_at: brand.created_at
  }))
};

// ==================== PROMO DATA ====================
export const PROMO_DATA = {
  status_code: 200,
  message: "Success",
  data: Object.values(BRAND_DATA).map(brand => ({
    id: brand.id,
    name: brand.name,
    photo_url: brand.photo_url,
    promo_special: brand.promo_special
  }))
};

// ==================== RATING DATA ====================
export const RATING_DUMMY_DATA: RatingDummyType[] = [
  // Air Mancur products ratings
  {
    id: 1,
    rate: 5,
    review: "Produk berkualitas tinggi, sangat membantu untuk kesehatan. Kemasan rapi dan higienis.",
    product_id: "prod-1-1",
    user_id: "user-001",
    product_name: "Air Mancur Temulawak",
    rater_name: "Budi Santoso",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    rate: 4,
    review: "Bagus, sesuai ekspektasi. Rasa enak dan tidak terlalu pahit.",
    product_id: "prod-1-1",
    user_id: "user-002",
    product_name: "Air Mancur Temulawak",
    rater_name: "Siti Nurhaliza",
    created_at: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    rate: 5,
    review: "Sangat puas dengan produk ini. Khasiatnya terasa setelah konsumsi rutin.",
    product_id: "prod-1-2",
    user_id: "user-003",
    product_name: "Air Mancur Kunyit Asam",
    rater_name: "Ahmad Wijaya",
    created_at: "2024-01-25T09:45:00Z"
  },
  {
    id: 4,
    rate: 3,
    review: "Cukup baik, tapi harganya agak mahal untuk ukuran sachet kecil.",
    product_id: "prod-1-3",
    user_id: "user-004",
    product_name: "Air Mancur Beras Kencur",
    rater_name: "Dewi Sartika",
    created_at: "2024-02-01T16:20:00Z"
  },
  {
    id: 5,
    rate: 5,
    review: "Produk terbaik! Sudah langganan bertahun-tahun. Kualitas konsisten.",
    product_id: "prod-1-4",
    user_id: "user-005",
    product_name: "Air Mancur Jahe Merah",
    rater_name: "Rudi Hartono",
    created_at: "2024-02-05T11:30:00Z"
  },
  // Aji Mujarab products ratings
  {
    id: 6,
    rate: 4,
    review: "Jamu tradisional yang berkualitas. Rasa asli dan tidak ada bahan kimia.",
    product_id: "prod-2-1",
    user_id: "user-006",
    product_name: "Aji Mujarab Temulawak",
    rater_name: "Maya Sari",
    created_at: "2024-02-10T13:45:00Z"
  },
  {
    id: 7,
    rate: 5,
    review: "Sangat mujarab! Masalah pencernaan hilang setelah konsumsi rutin.",
    product_id: "prod-2-2",
    user_id: "user-007",
    product_name: "Aji Mujarab Kunyit Asam",
    rater_name: "Bambang Sutrisno",
    created_at: "2024-02-15T08:15:00Z"
  },
  {
    id: 8,
    rate: 4,
    review: "Bagus untuk kesehatan, tapi kemasan bisa diperbaiki lagi.",
    product_id: "prod-2-3",
    user_id: "user-008",
    product_name: "Aji Mujarab Beras Kencur",
    rater_name: "Indah Permata",
    created_at: "2024-02-20T15:30:00Z"
  },
  {
    id: 9,
    rate: 5,
    review: "Produk terpercaya! Sudah turun temurun di keluarga kami.",
    product_id: "prod-2-4",
    user_id: "user-009",
    product_name: "Aji Mujarab Jahe Merah",
    rater_name: "Suryadi",
    created_at: "2024-02-25T12:00:00Z"
  },
  {
    id: 10,
    rate: 3,
    review: "Cukup baik, tapi harganya agak mahal dibanding produk sejenis.",
    product_id: "prod-2-5",
    user_id: "user-010",
    product_name: "Aji Mujarab Sambiloto",
    rater_name: "Rina Wulandari",
    created_at: "2024-03-01T17:45:00Z"
  },
  // Jamu Jago products ratings
  {
    id: 11,
    rate: 5,
    review: "Jamu Jago memang jago! Kualitas premium dengan harga terjangkau.",
    product_id: "prod-3-1",
    user_id: "user-011",
    product_name: "Jamu Jago Temulawak",
    rater_name: "Agus Setiawan",
    created_at: "2024-03-05T10:20:00Z"
  },
  {
    id: 12,
    rate: 4,
    review: "Produk bagus, kemasan menarik dan praktis untuk dibawa.",
    product_id: "prod-3-2",
    user_id: "user-012",
    product_name: "Jamu Jago Kunyit Asam",
    rater_name: "Sari Dewi",
    created_at: "2024-03-10T14:30:00Z"
  },
  {
    id: 13,
    rate: 5,
    review: "Sangat puas! Khasiatnya terasa dan tidak ada efek samping.",
    product_id: "prod-3-3",
    user_id: "user-013",
    product_name: "Jamu Jago Beras Kencur",
    rater_name: "Dedi Kurniawan",
    created_at: "2024-03-15T09:15:00Z"
  },
  {
    id: 14,
    rate: 4,
    review: "Bagus untuk kesehatan, rasa enak dan tidak terlalu pahit.",
    product_id: "prod-3-4",
    user_id: "user-014",
    product_name: "Jamu Jago Jahe Merah",
    rater_name: "Lina Marlina",
    created_at: "2024-03-20T16:00:00Z"
  },
  {
    id: 15,
    rate: 5,
    review: "Produk terbaik! Sudah langganan dan selalu puas dengan kualitasnya.",
    product_id: "prod-3-5",
    user_id: "user-015",
    product_name: "Jamu Jago Sambiloto",
    rater_name: "Hendra Pratama",
    created_at: "2024-03-25T11:45:00Z"
  }
];

// ==================== RATING SUMMARY DATA ====================
export const RATING_SUMMARY_DATA: { [productId: string]: ProductRatingSummary } = {
  "prod-1-1": {
    avg_rating: 4.5,
    total_rater: 2,
    rating_distribution: { 5: 1, 4: 1, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-1-1").slice(0, 2)
  },
  "prod-1-2": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-1-2").slice(0, 1)
  },
  "prod-1-3": {
    avg_rating: 3.0,
    total_rater: 1,
    rating_distribution: { 5: 0, 4: 0, 3: 1, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-1-3").slice(0, 1)
  },
  "prod-1-4": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-1-4").slice(0, 1)
  },
  "prod-2-1": {
    avg_rating: 4.0,
    total_rater: 1,
    rating_distribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-2-1").slice(0, 1)
  },
  "prod-2-2": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-2-2").slice(0, 1)
  },
  "prod-2-3": {
    avg_rating: 4.0,
    total_rater: 1,
    rating_distribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-2-3").slice(0, 1)
  },
  "prod-2-4": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-2-4").slice(0, 1)
  },
  "prod-2-5": {
    avg_rating: 3.0,
    total_rater: 1,
    rating_distribution: { 5: 0, 4: 0, 3: 1, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-2-5").slice(0, 1)
  },
  "prod-3-1": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-3-1").slice(0, 1)
  },
  "prod-3-2": {
    avg_rating: 4.0,
    total_rater: 1,
    rating_distribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-3-2").slice(0, 1)
  },
  "prod-3-3": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-3-3").slice(0, 1)
  },
  "prod-3-4": {
    avg_rating: 4.0,
    total_rater: 1,
    rating_distribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-3-4").slice(0, 1)
  },
  "prod-3-5": {
    avg_rating: 5.0,
    total_rater: 1,
    rating_distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
    recent_reviews: RATING_DUMMY_DATA.filter(r => r.product_id === "prod-3-5").slice(0, 1)
  }
};

// ==================== PRODUCT GENERATION FUNCTIONS ====================

// Fungsi untuk membuat brand info sesuai dengan backend DTO
function createBrandInfo(brandId: number): BrandInfoType {
  const brand = BRAND_DATA[brandId.toString() as keyof typeof BRAND_DATA];
  if (!brand) {
    throw new Error(`Brand with ID ${brandId} not found`);
  }
  return {
    id: brand.id,
    name: brand.name,
    photo_url: brand.photo_url
  };
}

// Fungsi untuk membuat variant sesuai dengan backend DTO
function createVariantAllProduct(
  variantId: number, 
  variant: string, 
  hasDiscount: boolean = false,
  brandId?: number
): VariantAllProductType {
  // Menggunakan seed berdasarkan variantId untuk konsistensi
  const seed = variantId * 7 + variant.length;
  const basePrice = 15000 + (seed % 30000); // 15k-45k konsisten
  
  
  // Buat variasi discount berdasarkan brand untuk konsistensi dengan promo_special
  let discount = 0;
  if (hasDiscount) {
    const brandDiscountRanges: { [key: number]: { min: number; max: number } } = {
      1: { min: 15, max: 29 }, // Air Mancur: 15-29%
      2: { min: 12, max: 28 }, // Aji Mujarab: 12-28%
      3: { min: 18, max: 30 }, // Jamu Jago: 18-30%
      4: { min: 10, max: 30 }, // Nyonya Meneer: 10-30%
      6: { min: 14, max: 26 }, // Sido Muncul: 14-26%
    };
    
    const range = brandDiscountRanges[brandId || 1] || { min: 5, max: 25 };
    discount = (seed % (range.max - range.min + 1)) + range.min;
    
    
    // Ensure minimum discount of 5% for promo products
    if (discount < 5) discount = 5;
  }
  
  const discountedPrice = hasDiscount ? Math.floor(basePrice * (1 - discount / 100)) : basePrice;
  
  return {
    id: variantId,
    variant: variant,
    img: "/buyungupik_agr-1.svg",
    discount: discount,
    discounted_price: discountedPrice,
    updated_at: new Date().toISOString()
  };
}

// Fungsi untuk membuat produk sesuai dengan backend DTO
function createAllProductInfo(
  productId: string,
  productName: string,
  brandId: number,
  basePrice: number,
  hasDiscount: boolean = false
): AllProductInfoType {
  // Data variant rasa yang konsisten
  const flavorVariants = [
    "Anggur", "Strawberry", "Cokelat", "Vanilla", 
    "Melon", "Jeruk", "Susu", "Mocca"
  ];
  
  const variants = flavorVariants.map((flavor, index) => 
    createVariantAllProduct(index + 1, flavor, hasDiscount, brandId)
  );
  
  // Ensure at least one variant has the brand's highest discount
  if (hasDiscount) {
    const brand = BRAND_DATA[brandId.toString() as keyof typeof BRAND_DATA];
    if (brand) {
      const maxDiscount = brand.promo_special;
      const hasMaxDiscount = variants.some(v => v.discount === maxDiscount);
      
      if (!hasMaxDiscount) {
        // Find the variant with highest current discount and update it to max
        const highestDiscountIndex = variants.reduce((maxIndex, variant, index) => 
          variant.discount > variants[maxIndex].discount ? index : maxIndex, 0
        );
        
        const variant = variants[highestDiscountIndex];
        const newDiscountedPrice = Math.floor(variant.discounted_price / (1 - variant.discount / 100) * (1 - maxDiscount / 100));
        
        variants[highestDiscountIndex] = {
          ...variant,
          discount: maxDiscount,
          discounted_price: newDiscountedPrice
        };
      }
    }
  }

  return {
    id: productId,
    name: productName,
    price: basePrice,
    brand_info: createBrandInfo(brandId),
    all_variants: variants,
    created_at: new Date().toISOString()
  };
}

// Cache untuk mencegah duplikasi data
let cachedCardProductData: CardProductProps[] | null = null;

// Fungsi untuk menghasilkan data produk card sesuai dengan backend DTO
export function generateCardProductData(): CardProductProps[] {
  // Return cached data if available
  if (cachedCardProductData) {
    return cachedCardProductData;
  }

  const products: CardProductProps[] = [];
  let productId = 1;
  
  // Convert PRODUCT_TEMPLATES object to array for easier access
  const templateKeys = Object.keys(PRODUCT_TEMPLATES);
  const templateArray = templateKeys.map(key => PRODUCT_TEMPLATES[key as keyof typeof PRODUCT_TEMPLATES]);

  // Generate products for each brand
  Object.values(BRAND_DATA).forEach(brand => {
    const productCount = brand.total_product;
    const promoCount = brand.total_product_with_promo;
    
    // Generate products with consistent pricing
    for (let i = 0; i < productCount; i++) {
      const hasDiscount = i < promoCount;
      const basePrice = 15000 + (productId * 1000) % 30000; // 15k-45k konsisten berdasarkan productId
      
      
      try {
        const product = createAllProductInfo(
          `prod-${brand.id}-${productId}`,
          `${brand.name} ${templateArray[i % templateArray.length].baseName}`,
          brand.id,
          basePrice,
          hasDiscount
        );
        
        products.push(product);
      } catch (error) {
      }
      
      productId++;
    }
  });

  // Cache the result to prevent duplication
  cachedCardProductData = products;
  return products;
}

// Fungsi untuk menghasilkan produk berdasarkan brand
export function generateBrandProducts(brandId: string): CardProductProps[] {
  const allProducts = generateCardProductData();
  const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
  
  if (!brand) {
    return [];
  }
  
  // Filter products by brand ID
  return allProducts.filter(product => 
    product.brand_info.id === brand.id
  );
}

// Fungsi untuk menghasilkan produk promo (hanya yang ada discount)
export function generatePromoProducts(brandId: string): CardProductProps[] {
  const allProducts = generateCardProductData();
  const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
  
  if (!brand) {
    return [];
  }
  
  // Filter products by brand ID and only include those with discount
  const promoProducts = allProducts.filter(product => {
    const isFromBrand = product.brand_info.id === brand.id;
    if (!isFromBrand) return false;
    
    // Check if any variant has discount > 0 (this is the correct way)
    const hasDiscount = product.all_variants.some(variant => variant.discount > 0);
    
    
    return hasDiscount;
  });
  
  
  // Add brand's highest discount to each product for consistent display
  return promoProducts.map(product => ({
    ...product,
    brand_highest_discount: brand.promo_special // Add brand's highest discount
  }));
}

// Fungsi untuk menghasilkan detail produk sesuai dengan backend DTO
export function generateDetailProductData(): { [key: string]: DetailProductType } {
  const detailProducts: { [key: string]: DetailProductType } = {};
  const cardProducts = generateCardProductData();
  
  cardProducts.forEach(cardProduct => {
    try {
      if (cardProduct.id && cardProduct.name && cardProduct.brand_info) {
        const variants = cardProduct.all_variants.map(variant => ({
          id: variant.id,
          product: cardProduct.name,
          name: variant.variant,
          img: variant.img,
          variant: variant.variant,
          expiration: "12/25/2025",
          stock: 50 + (variant.id * 3) % 50, // 50-100 konsisten berdasarkan variant.id
          discount: variant.discount,
          discounted_price: variant.discounted_price,
          updated_at: variant.updated_at
        }));

        detailProducts[cardProduct.id] = {
          id: cardProduct.id,
          name: cardProduct.name,
          info: "1pack isi 11sachet dengan berat ± 5gram",
          variants_list: variants,
          description_list: [
            "Jamu tradisional berkualitas tinggi",
            "Menggunakan bahan-bahan alami pilihan",
            "Proses produksi higienis dan modern",
            "Baik untuk kesehatan tubuh",
            "Cocok dikonsumsi secara rutin"
          ],
          instructions_list: [
            "Simpan di tempat yang kering dan sejuk",
            "Hindari paparan sinar matahari langsung",
            "Gunakan dalam 12 bulan setelah dibuka",
            "Kocok sebelum diminum untuk hasil terbaik"
          ],
          price: cardProduct.price,
          is_active: true,
          company: cardProduct.brand_info.name,
          avg_rating: RATING_SUMMARY_DATA[cardProduct.id]?.avg_rating || 4.0,
          total_rater: RATING_SUMMARY_DATA[cardProduct.id]?.total_rater || 0,
          created_at: cardProduct.created_at,
          updated_at: new Date().toISOString()
        };
      }
    } catch (error) {
    }
  });

  return detailProducts;
}

// ==================== RATING UTILITIES ====================

// Fungsi untuk mendapatkan rating summary berdasarkan product ID
export function getProductRatingSummary(productId: string): ProductRatingSummary | null {
  return RATING_SUMMARY_DATA[productId] || null;
}

// Fungsi untuk mendapatkan semua rating berdasarkan product ID
export function getProductRatings(productId: string): RatingDummyType[] {
  return RATING_DUMMY_DATA.filter(rating => rating.product_id === productId);
}

// Fungsi untuk mendapatkan rating user berdasarkan user ID
export function getUserRatings(userId: string): RatingDummyType[] {
  return RATING_DUMMY_DATA.filter(rating => rating.user_id === userId);
}

// Fungsi untuk mendapatkan rating berdasarkan rating ID
export function getRatingById(ratingId: number): RatingDummyType | null {
  return RATING_DUMMY_DATA.find(rating => rating.id === ratingId) || null;
}

// Fungsi untuk menghitung rating summary dari data rating
export function calculateRatingSummary(ratings: RatingDummyType[]): ProductRatingSummary {
  if (ratings.length === 0) {
    return {
      avg_rating: 0,
      total_rater: 0,
      rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recent_reviews: []
    };
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
  const avgRating = totalRating / ratings.length;
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratings.forEach(rating => {
    distribution[rating.rate as keyof typeof distribution]++;
  });

  return {
    avg_rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
    total_rater: ratings.length,
    rating_distribution: distribution,
    recent_reviews: ratings
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5) // Get 5 most recent reviews
  };
}
