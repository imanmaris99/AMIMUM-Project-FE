"use client";

import React from "react";

const creativeProducts = [
  {
    title: "Sticker Vinyl",
    description: "Sticker logo, label, quote, dan desain custom untuk personal, UMKM, event, atau komunitas.",
  },
  {
    title: "Keychain Akrilik",
    description: "Gantungan kunci akrilik hasil cutting laser CO2, bisa desain nama, logo, karakter, atau souvenir.",
  },
  {
    title: "3D Print Custom",
    description: "Produk 3D print seperti fidget clicker, mini tools, dekorasi, dan model custom sesuai kebutuhan.",
  },
];

const CUSTOM_CRAFT_WHATSAPP_URL =
  "https://wa.me/6281298742102?text=Assalamu%27alaikum%20Admin%20Amimum%2C%20saya%20ingin%20konsultasi%20custom%20produk%20Amimum%20Creative.";

const CreativeCraftSection = () => {
  return (
    <section className="mx-6 mt-6 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur" aria-labelledby="creative-craft-title">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
            Amimum Creative
          </p>
          <h2 id="creative-craft-title" className="mt-1 text-lg font-bold leading-6 text-[#0D0E09]">
            Aksesoris & Custom Craft
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#6B7C73]">
            Detail kategori untuk produk kreatif buatan sendiri: sticker vinyl, keychain akrilik laser cut, produk 3D print, produk ready stock, dan pesanan custom design.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-primary">
          Kategori Baru
        </span>
      </div>

      <div className="grid gap-3">
        {creativeProducts.map((product) => (
          <article key={product.title} className="rounded-2xl bg-[#F7FBF8] p-3">
            <h3 className="text-sm font-bold text-[#0D0E09]">{product.title}</h3>
            <p className="mt-1 text-xs leading-5 text-[#6B7C73]">{product.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-amber-50/80 px-3 py-3 text-xs leading-5 text-amber-900">
        <p className="font-bold">Custom order perlu konsultasi dulu</p>
        <p className="mt-1">
          Harga dan estimasi produksi menyesuaikan desain, ukuran, bahan, warna, jumlah, dan tingkat kerumitan. Produk ready stock tetap bisa dijual terpisah saat sudah masuk katalog.
        </p>
      </div>

      <a
        href={CUSTOM_CRAFT_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
      >
        Konsultasi Custom via WhatsApp
      </a>
    </section>
  );
};

export default React.memo(CreativeCraftSection);
