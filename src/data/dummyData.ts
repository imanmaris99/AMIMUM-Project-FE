// Centralized Dummy Data Management
// Mengikuti struktur Backend API dan memastikan konsistensi data

import { DetailProductType } from "@/types/detailProduct";
import { CardProductProps } from "@/components/common/Search/CardProduct/types";

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
    promo_special: 20,
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
    promo_special: 15,
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
    promo_special: 25,
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
    promo_special: 18,
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
    promo_special: 22,
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
  const doublePrice = basePrice * 2;
  const doubleDiscountedPrice = hasDiscount ? calculateDiscountedPrice(doublePrice, discount) : doublePrice;
  const productImage = PRODUCT_IMAGES[template as keyof typeof PRODUCT_IMAGES] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center";
  
  return [
    {
      id: 1,
      product: "1",
      name: "60ml",
      img: productImage,
      variant: "60ml",
      expiration: "2025-12-31",
      stock: stock[0],
      discount: actualDiscount,
      discounted_price: discountedPrice,
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      product: "1",
      name: "120ml",
      img: productImage,
      variant: "120ml",
      expiration: "2025-12-31",
      stock: stock[1],
      discount: actualDiscount,
      discounted_price: doubleDiscountedPrice,
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];
}

// ==================== GENERATED DATA ====================
export function generateDetailProductData(): { [key: string]: DetailProductType } {
  const products: { [key: string]: DetailProductType } = {};
  let globalProductId = 1;

  Object.entries(PRODUCT_CONFIG).forEach(([brandId, configs]) => {
    const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
    const discount = brand.promo_special;

    configs.forEach((config, index) => {
      const template = PRODUCT_TEMPLATES[config.template as keyof typeof PRODUCT_TEMPLATES];
      const productId = String(globalProductId);
      
      products[productId] = {
        id: productId,
        name: `${template.baseName} ${brand.name}`,
        info: template.info,
        description_list: template.description_list,
        instructions_list: template.instructions_list,
        price: config.basePrice,
        is_active: true,
        company: brand.name,
        avg_rating: template.avg_rating,
        total_rater: template.total_rater,
        variants_list: createVariants(config.basePrice, discount, config.stock, config.hasDiscount, config.template),
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      };
      
      globalProductId++;
    });
  });

  return products;
}

export function generateCardProductData(): CardProductProps[] {
  const detailProducts = generateDetailProductData();
  
  return Object.values(detailProducts).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    all_variants: product.variants_list.map(variant => ({
      id: variant.id,
      variant: variant.variant,
      img: variant.img,
      discount: variant.discount,
      discounted_price: variant.discounted_price,
      updated_at: variant.updated_at
    })),
    created_at: product.created_at
  }));
}

export function generateBrandProducts(brandId: string): CardProductProps[] {
  const allProducts = generateCardProductData();
  const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
  
  if (!brand) return [];
  
  // Filter products by brand name
  return allProducts.filter(product => 
    product.name.includes(brand.name)
  );
}

export function generatePromoProducts(brandId: string): CardProductProps[] {
  // Promo products should only include products with discount
  const allProducts = generateCardProductData();
  const brand = BRAND_DATA[brandId as keyof typeof BRAND_DATA];
  
  if (!brand) return [];
  
  // Filter products by brand name and only include those with discount
  return allProducts.filter(product => {
    const isFromBrand = product.name.includes(brand.name);
    const hasDiscount = product.all_variants.some(variant => variant.discount > 0);
    return isFromBrand && hasDiscount;
  });
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
