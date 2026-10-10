import { AccordionExpandDefault } from "@/components";
import { ArticleProps } from "./types";
import AccordionSkeleton from "@/components/ui/AccordionExpandDefault/AccordionSkeleton";
import Footer from "../../../layout/Footer";
import React from "react";

const IMPORTANT_CUSTOMER_ARTICLE: ArticleProps = {
  display_id: -1001,
  title: "Info Penting: Pembayaran Produk dan Ongkir",
  img: "",
  description_list: [
    "📌 Wajib dibaca sebelum checkout",
    "Pesanan dibuat melalui website terlebih dahulu agar produk, jumlah, alamat, ongkir, dan total tercatat jelas.",
    "💳 Pembayaran produk",
    "Pembayaran produk dilakukan melalui QRIS resmi toko, Transfer BRI manual, atau bayar langsung di Toko Herbal Amimum khusus pickup.",
    "Pembayaran produk tidak dilakukan dengan bayar di tempat untuk pesanan kirim.",
    "🚚 Biaya kirim / ongkir",
    "Customer bisa memilih ongkir digabung dengan total pembayaran atau ongkir dibayar saat paket tiba jika kurir mendukung.",
    "Transfer manual hanya dilakukan setelah order dibuat. Detail rekening resmi toko ditampilkan di checkout/detail transaksi khusus metode transfer.",
    "Gunakan nomor WhatsApp aktif untuk konfirmasi pembayaran, packing, pengiriman, resi, dan update pesanan.",
    "#Pembayaran #Ongkir #Checkout #TokoHerbalAmimum",
  ],
};

interface ArticleSectionProps {
  articles: ArticleProps[] | null;
  errorMessage?: string | null;
}

const ArticleSection = ({ articles, errorMessage }: ArticleSectionProps) => {
  const pinnedArticles = [
    IMPORTANT_CUSTOMER_ARTICLE,
    ...((articles || []).filter(
      (article) => article.title.trim().toLowerCase() !== IMPORTANT_CUSTOMER_ARTICLE.title.toLowerCase()
    )),
  ];

  if (errorMessage) {
    return (
      <>
        <div className="mx-6 mt-6">
          <h6 className="font-semibold font-jakarta">Artikel</h6>
        </div>
        <div className="mx-6 mt-6 text-red-500 font-semibold flex justify-center items-center">
          {errorMessage}
        </div>
        <div className="mx-6 mt-6 flex flex-col gap-2">
          {pinnedArticles.map((article: ArticleProps) => (
            <AccordionExpandDefault
              key={article.display_id}
              article={article}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-6 mt-6">
        <h6 className="font-semibold font-jakarta">Artikel</h6>
      </div>

      <div className="mx-6 mt-6 flex flex-col gap-2">
        {!articles
          ? Array.from({ length: 4 }, (_, index) => (
              <AccordionSkeleton key={index} />
            ))
          : pinnedArticles.map((article: ArticleProps) => (
              <AccordionExpandDefault
                key={article.display_id}
                article={article}
              />
            ))}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default React.memo(ArticleSection);
