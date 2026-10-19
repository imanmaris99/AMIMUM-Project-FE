import { AiFillStar } from "react-icons/ai";
import { DetailProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface TitleProductProps {
  data: DetailProductType | null | undefined;
  isError: number | string | null;
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const TitleProduct = ({ isError, isLoading, data }: TitleProductProps) => {
  if (isError && typeof isError === "string") {
    return <div className="text-red-500 text-center mt-4">{isError}</div>;
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80px]">
        <Spinner className="mb-2" size={32} label="Memuat judul produk..." />
        <p className="text-gray-600 text-sm">Memuat judul produk...</p>
      </div>
    );
  }
  if (!data) {
    return <div className="text-gray-500">Data produk belum tersedia.</div>;
  }

  const productName = data.name?.trim() || "Produk katalog";
  const brandName = data.company?.trim() || "Brand belum tersedia";
  const variants = Array.isArray(data.variants_list) ? data.variants_list : [];
  const activePrices = variants
    .map((variant) => Number(variant.discounted_price || data.price || 0))
    .filter((price) => Number.isFinite(price) && price > 0);
  const minPrice = activePrices.length ? Math.min(...activePrices) : Number(data.price || 0);
  const totalStock = variants.reduce((sum, variant) => sum + (typeof variant.stock === "number" ? Math.max(variant.stock, 0) : 0), 0);
  const stockLabel = totalStock > 0 ? `Stok tersedia ${totalStock}` : "Stok perlu konfirmasi";

  return (
    <section className="overflow-hidden rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50 backdrop-blur" aria-label="Ringkasan produk">
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">{brandName}</p>
            <h1 className="mt-1 text-xl font-bold leading-7 text-gray-950">{productName}</h1>
          </div>
          <a
            href="#product-ratings"
            aria-label="Lihat rating dan ulasan pembeli terverifikasi"
            className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-orange-700 ring-1 ring-orange-100"
          >
            <AiFillStar aria-hidden="true" />
            <span className="text-xs font-bold">Lihat ulasan</span>
          </a>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-white px-3 py-3 ring-1 ring-emerald-50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7C73]">Mulai dari</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0D0E09]">{minPrice > 0 ? formatCurrency(minPrice) : "Harga mengikuti varian"}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[#3F715F]">
          <span className="rounded-full bg-[#EAF5EF] px-3 py-1">{variants.length || 0} pilihan varian</span>
          <span className="rounded-full bg-[#EAF5EF] px-3 py-1">{stockLabel}</span>
          <span className="rounded-full bg-[#F7F9F8] px-3 py-1 text-[#5F6F67]">Harga final saat checkout</span>
        </div>
      </div>
    </section>
  );
};

export default TitleProduct;
