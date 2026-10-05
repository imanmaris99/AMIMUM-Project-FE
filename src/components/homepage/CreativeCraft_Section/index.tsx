"use client";

import React, { useState } from "react";

const creativeProducts = [
  {
    title: "Custom Sticker",
    description: "Sticker vinyl, label, quote, event, komunitas, dan kebutuhan UMKM.",
  },
  {
    title: "Cutting Akrilik & Craft Souvenir",
    description: "Keychain, papan penghargaan, rak akrilik, grafir, PVC, tripleks, kulit sintetis, dan craft lain sesuai uji bahan.",
  },
  {
    title: "Custom 3D Print",
    description: "Fidget clicker, mini tools, dekorasi, prototype, model custom, dan produk kreatif lain.",
  },
];

const CUSTOM_CRAFT_WHATSAPP_URL =
  "https://wa.me/6281298742102?text=Assalamu%27alaikum%20Admin%20Amimum%2C%20saya%20ingin%20konsultasi%20custom%20produk%20Amimum%20Creative.";

const CreativeCraftSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mx-6 mt-5 overflow-hidden rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur" aria-labelledby="creative-craft-title">
      <div className="flex items-center justify-between gap-3 bg-[#F7FBF8] px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Jendela Info Kategori
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
              Amimum Creative
            </p>
            <h2 id="creative-craft-title" className="mt-1 text-lg font-bold leading-6 text-[#0D0E09]">
              Aksesoris & Custom Craft
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#6B7C73]">
              Custom bisa mulai dari sticker, cutting/grafir akrilik & craft souvenir, sampai 3D print.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-primary">
            Kategori Baru
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls="creative-craft-detail"
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#F7FBF8] px-3 py-2.5 text-left text-sm font-bold text-primary transition-colors hover:bg-emerald-50"
        >
          <span>Detail kategori</span>
          <span className={`text-base transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true">
            ⌄
          </span>
        </button>

        {isExpanded && (
          <div id="creative-craft-detail" className="mt-4">
            <div className="grid gap-2.5">
              {creativeProducts.map((product) => (
                <article key={product.title} className="rounded-2xl bg-[#F7FBF8] px-3 py-2.5">
                  <h3 className="text-sm font-bold text-[#0D0E09]">{product.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#6B7C73]">{product.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-amber-50/80 px-3 py-3 text-xs leading-5 text-amber-900">
              <p className="font-bold">Custom order perlu konsultasi dulu</p>
              <p className="mt-1">
                Layanan custom berlaku untuk sticker, cutting/grafir akrilik dan craft souvenir, serta 3D print. Untuk laser CO2, area kerja 30×20 cm dengan daya 40 watt; bahan dan hasil produksi menyesuaikan desain, ukuran, jumlah, material, serta tingkat kerumitan.
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
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(CreativeCraftSection);
