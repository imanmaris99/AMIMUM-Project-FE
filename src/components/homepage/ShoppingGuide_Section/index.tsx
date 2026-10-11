"use client";

import Link from "next/link";

const guideLinks = [
  {
    href: "/cara-belanja",
    title: "Cara Belanja",
    description: "Alur pilih produk, checkout, bayar, dan pantau pesanan.",
  },
  {
    href: "/kebijakan-pembayaran",
    title: "Pembayaran",
    description: "Metode resmi, verifikasi, dan keamanan pembayaran.",
  },
  {
    href: "/pengiriman-pickup",
    title: "Pengiriman & Pickup",
    description: "Aturan resi, kurir, dan ambil langsung di toko.",
  },
];

export default function ShoppingGuideSection() {
  return (
    <section
      aria-labelledby="shopping-guide-title"
      className="mx-4 mt-4 font-jakarta sm:mx-6"
    >
      <div className="rounded-2xl border border-primary/10 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/80">
              Panduan resmi toko
            </p>
            <h2 id="shopping-guide-title" className="mt-1 text-sm font-extrabold text-gray-900">
              Belanja, bayar, dan lacak pesanan
            </h2>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Informasi lengkap sudah dipisahkan agar customer tidak bingung.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            Resmi
          </span>
        </div>

        <div className="mt-3 grid gap-2">
          {guideLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3 py-3 transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-emerald-900">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-emerald-800/80">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-lg font-bold text-emerald-700 transition group-hover:translate-x-0.5">
                  ›
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
