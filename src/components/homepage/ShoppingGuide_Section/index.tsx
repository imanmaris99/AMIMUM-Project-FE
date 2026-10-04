"use client";

import { useState } from "react";

const guideItems = [
  {
    step: "1",
    title: "Pilih produk herbal",
    description: "Cari produk dari katalog, lalu cek varian, harga, dan informasi produk sebelum membeli.",
  },
  {
    step: "2",
    title: "Pilih pickup atau jasa kirim",
    description: "Gunakan ambil di toko untuk pickup, atau jasa kirim jika ingin pesanan dikirim ke alamat tujuan.",
  },
  {
    step: "3",
    title: "Bayar resmi sesuai checkout",
    description: "Ikuti nominal dan metode pembayaran yang tampil di website. Simpan bukti jika memakai transfer/QRIS manual.",
  },
  {
    step: "4",
    title: "Pantau status pesanan",
    description: "Cek halaman transaksi/tracking. Pickup tidak memakai resi; jasa kirim menampilkan resi setelah admin menginputnya.",
  },
];

export default function ShoppingGuideSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-labelledby="shopping-guide-title"
      className="mx-4 mt-4 font-jakarta sm:mx-6"
    >
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white/95 shadow-sm backdrop-blur">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="shopping-guide-detail"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/80">
              Panduan Belanja Singkat
            </p>
            <h2 id="shopping-guide-title" className="mt-1 text-sm font-extrabold text-gray-900">
              Pilih produk → pickup/kirim → bayar → pantau status
            </h2>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Klik untuk lihat detail alur belanja, pembayaran, dan resi.
            </p>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            ⌄
          </span>
        </button>

        {isOpen && (
          <div id="shopping-guide-detail" className="border-t border-primary/10 px-4 pb-4 pt-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {guideItems.map((item) => (
                <article
                  key={item.step}
                  className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#F8FBF6] p-3 shadow-[0_8px_20px_rgba(13,14,9,0.035)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <h3 className="text-xs font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-900">
              <p className="font-bold">Info penting</p>
              <p className="mt-1">
                Pembayaran produk dilakukan lewat metode resmi yang tampil saat checkout. Jika pickup, pesanan diambil langsung di toko dan tidak ada nomor resi.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
