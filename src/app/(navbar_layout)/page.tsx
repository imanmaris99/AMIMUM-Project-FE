// import { fetchArticlesServer } from "@/API/articles";
// import { GetAllPromoServer } from "@/API/brand";
// import { fetchCategoriesServer } from "@/API/tag-categories";
// import { GetAllBrandServer } from "@/API/brand";
import HomeClient from "./HomeClient";

// Dummy data untuk sementara karena server sedang down
const dummyData = {
  articles: [
    {
      display_id: 1,
      title: "Manfaat Jahe untuk Kesehatan",
      img: "/default-image.jpg",
      description_list: [
        "Jahe mengandung senyawa anti-inflamasi yang dapat membantu mengurangi peradangan",
        "Dapat membantu meredakan mual dan gangguan pencernaan",
        "Membantu meningkatkan sistem kekebalan tubuh",
        "Dapat membantu mengurangi nyeri otot dan sendi"
      ]
    },
    {
      display_id: 2,
      title: "Khasiat Kunyit untuk Tubuh",
      img: "/default-image.jpg",
      description_list: [
        "Kunyit mengandung kurkumin yang memiliki sifat antioksidan",
        "Dapat membantu mengurangi risiko penyakit jantung",
        "Membantu melindungi otak dari penuaan",
        "Dapat membantu mencegah kanker"
      ]
    },
    {
      display_id: 3,
      title: "Manfaat Temulawak untuk Hati",
      img: "/default-image.jpg",
      description_list: [
        "Temulawak mengandung kurkuminoid yang baik untuk kesehatan hati",
        "Dapat membantu meningkatkan nafsu makan",
        "Baik untuk kesehatan pencernaan",
        "Dapat membantu mengurangi peradangan"
      ]
    },
    {
      display_id: 4,
      title: "Khasiat Teh Hijau untuk Metabolisme",
      img: "/default-image.jpg",
      description_list: [
        "Teh hijau mengandung antioksidan tinggi",
        "Dapat membantu meningkatkan metabolisme tubuh",
        "Baik untuk kesehatan jantung",
        "Dapat membantu mencegah penuaan dini"
      ]
    }
  ],
  promo: [
    {
      id: 1,
      name: "Air Mancur",
      photo_url: "/airmancur 1.svg",
      promo_special: 20
    },
    {
      id: 2,
      name: "Aji Mujarab",
      photo_url: "/aji-mujarab 1.svg",
      promo_special: 15
    },
    {
      id: 3,
      name: "Jamu Jago",
      photo_url: "/jamu_jago 1.svg",
      promo_special: 25
    },
    {
      id: 4,
      name: "Nyonya Meneer",
      photo_url: "/nyonya-meneer 1.svg",
      promo_special: 30
    },
    {
      id: 5,
      name: "Sabdo Palon",
      photo_url: "/sabdo-palon 1.svg",
      promo_special: 18
    },
    {
      id: 6,
      name: "Sido Muncul",
      photo_url: "/sido-muncul 1.svg",
      promo_special: 22
    }
  ],
  categories: [
    { id: 1, name: "Herbal", created_at: "2024-01-01" },
    { id: 2, name: "Rempah", created_at: "2024-01-01" },
    { id: 3, name: "Teh", created_at: "2024-01-01" },
    { id: 4, name: "Madu", created_at: "2024-01-01" },
    { id: 5, name: "Jamu", created_at: "2024-01-01" },
    { id: 6, name: "Bumbu", created_at: "2024-01-01" }
  ],
  productions: [
    {
      id: 1,
      name: "Air Mancur",
      photo_url: "/airmancur 1.svg",
      description_list: ["Perusahaan jamu tradisional terpercaya", "Berkualitas tinggi sejak 1960"],
      category: "Jamu",
      created_at: "2024-01-01"
    },
    {
      id: 2,
      name: "Aji Mujarab",
      photo_url: "/aji-mujarab 1.svg",
      description_list: ["Spesialis jamu herbal berkualitas", "Produk alami tanpa bahan kimia"],
      category: "Herbal",
      created_at: "2024-01-01"
    },
    {
      id: 3,
      name: "Jamu Jago",
      photo_url: "/jamu_jago 1.svg",
      description_list: ["Jamu tradisional pilihan keluarga", "Khasiat terbukti turun temurun"],
      category: "Jamu",
      created_at: "2024-01-01"
    },
    {
      id: 4,
      name: "Nyonya Meneer",
      photo_url: "/nyonya-meneer 1.svg",
      description_list: ["Jamu premium dengan standar internasional", "Inovasi dalam pengolahan herbal"],
      category: "Rempah",
      created_at: "2024-01-01"
    },
    {
      id: 5,
      name: "Sabdo Palon",
      photo_url: "/sabdo-palon 1.svg",
      description_list: ["Jamu tradisional Jawa asli", "Resep warisan leluhur"],
      category: "Teh",
      created_at: "2024-01-01"
    },
    {
      id: 6,
      name: "Sido Muncul",
      photo_url: "/sido-muncul 1.svg",
      description_list: ["Jamu modern dengan teknologi terdepan", "Kombinasi tradisi dan inovasi"],
      category: "Madu",
      created_at: "2024-01-01"
    },
    {
      id: 7,
      name: "Herbalife",
      photo_url: "/default-image.jpg",
      description_list: ["Nutrisi herbal modern", "Produk kesehatan terpercaya"],
      category: "Herbal",
      created_at: "2024-01-01"
    },
    {
      id: 8,
      name: "McCormick",
      photo_url: "/default-image.jpg",
      description_list: ["Rempah-rempah berkualitas", "Bumbu masakan terbaik"],
      category: "Rempah",
      created_at: "2024-01-01"
    },
    {
      id: 9,
      name: "Twinings",
      photo_url: "/default-image.jpg",
      description_list: ["Teh premium Inggris", "Kualitas terbaik sejak 1706"],
      category: "Teh",
      created_at: "2024-01-01"
    },
    {
      id: 10,
      name: "Madu Hutan",
      photo_url: "/default-image.jpg",
      description_list: ["Madu alami dari hutan", "Khasiat murni tanpa campuran"],
      category: "Madu",
      created_at: "2024-01-01"
    },
    {
      id: 11,
      name: "Bumbu Dapur",
      photo_url: "/default-image.jpg",
      description_list: ["Bumbu masakan lengkap", "Rasa autentik Indonesia"],
      category: "Bumbu",
      created_at: "2024-01-01"
    },
    {
      id: 12,
      name: "Jamu Cap Jago",
      photo_url: "/default-image.jpg",
      description_list: ["Jamu tradisional berkualitas", "Khasiat terbukti"],
      category: "Jamu",
      created_at: "2024-01-01"
    }
  ]
};

export default async function Home() {
  // API calls dinonaktifkan sementara karena server sedang down
  // let articles = null;
  // let articleError = null;
  // let promo = null;
  // let promoError = null;
  // let categories = null;
  // let categoryError = null;
  // let productions = null;
  // let productionError = null;
  // try {
  //   articles = await fetchArticlesServer();
  // } catch (err: unknown) {
  //   articleError = err instanceof Error ? err.message : "Gagal mengambil data artikel.";
  // }
  // try {
  //   promo = await GetAllPromoServer();
  // } catch (err: unknown) {
  //   promoError = err instanceof Error ? err.message : "Gagal mengambil data promo.";
  // }
  // try {
  //   categories = await fetchCategoriesServer();
  // } catch (err: unknown) {
  //   categoryError = err instanceof Error ? err.message : "Gagal mengambil data kategori.";
  // }
  // try {
  //   productions = await GetAllBrandServer();
  // } catch (err: unknown) {
  //   productionError = err instanceof Error ? err.message : "Gagal mengambil data brand.";
  // }
  
  return (
    <HomeClient
      categories={dummyData.categories}
      productions={dummyData.productions}
      categoryError={null}
      productionError={null}
      promo={dummyData.promo}
      promoError={null}
      articles={dummyData.articles}
      articleError={null}
    />
  );
}
