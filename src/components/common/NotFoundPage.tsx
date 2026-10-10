"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type NotFoundPageProps = {
  showFooterSpace?: boolean;
};

const NotFoundPage = ({ showFooterSpace = true }: NotFoundPageProps) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoSearch = () => {
    router.push("/search");
  };

  const handleGoCatalog = () => {
    router.push("/#catalog-section");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className={`min-h-screen bg-[linear-gradient(180deg,#F1FAF5_0%,#FFFFFF_34%,#FFFBF1_72%,#F4FBF7_100%)] px-4 py-6 ${
        showFooterSpace ? "pb-[calc(6.5rem+env(safe-area-inset-bottom))]" : "pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      }`}
    >
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col justify-center">
        <section className="rounded-3xl bg-white/95 p-5 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
            <span className="text-4xl font-black text-[#006A47]">404</span>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Halaman tidak ditemukan
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-[#0D0E09]">
            Link ini belum tersedia di toko
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#6B7C73]">
            Maaf, halaman yang bro buka mungkin sudah berubah, salah alamat, atau produk belum tersedia. Silakan lanjut dari katalog resmi Toko Herbal AmImUm.
          </p>

          <div className="mt-5 rounded-3xl bg-emerald-50/70 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Arah cepat
            </p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-[#4B5C54]">
              <li>• Cari produk herbal lewat halaman pencarian.</li>
              <li>• Kembali ke beranda untuk promo dan kategori terbaru.</li>
              <li>• Jika link berasal dari chat lama, cek katalog terbaru dulu.</li>
            </ul>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={handleGoHome}
              className="rounded-2xl bg-[#006A47] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#005A3C]"
            >
              Kembali ke Beranda
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoSearch}
                className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-[#006A47] transition-colors hover:bg-emerald-50"
              >
                Cari Produk
              </button>
              <button
                type="button"
                onClick={handleGoCatalog}
                className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-[#006A47] transition-colors hover:bg-emerald-50"
              >
                Lihat Katalog
              </button>
            </div>
            <button
              type="button"
              onClick={handleGoBack}
              className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-[#0D0E09] transition-colors hover:bg-emerald-100"
            >
              Kembali Sebelumnya
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Image
              src="/logo_toko.svg"
              alt="Logo Toko Herbal AmImUm"
              width={132}
              height={44}
              className="opacity-80"
              priority
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotFoundPage;
