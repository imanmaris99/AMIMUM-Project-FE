"use client";
import React, { useMemo, useState } from "react";
import { DetailProductType } from "@/types/detailProduct";
import Spinner from "@/components/ui/Spinner";

interface ProductDescriptionProps {
  data: DetailProductType | undefined;
  isError: number;
  isLoading: boolean;
}

type DescriptionBlock =
  | { type: "summary"; text: string }
  | { type: "spec"; label: string; value: string };

const SPEC_LABELS = [
  "Nama",
  "Material",
  "Metode produksi",
  "Warna",
  "Pencahayaan",
  "Aksesoris",
  "Berat",
  "Catatan pembelian",
  "Spesifikasi produk",
  "Keunggulan produk",
  "Cocok untuk",
];

const normalizeDescriptionText = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitLongSummary = (text: string) => {
  const normalized = normalizeDescriptionText(text);
  if (!normalized) return [];

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return [normalized];

  const chunks: string[] = [];
  let current = "";

  sentences.forEach((sentence) => {
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length > 220 && current) {
      chunks.push(current);
      current = sentence;
      return;
    }
    current = next;
  });

  if (current) chunks.push(current);
  return chunks;
};

const parseDescriptionBlocks = (items: string[]): DescriptionBlock[] => {
  const text = normalizeDescriptionText(items.join(" "));
  if (!text) return [];

  const labelPattern = SPEC_LABELS.map(escapeRegExp).join("|");
  const regex = new RegExp(`(?:^|\\s)(${labelPattern})\\s*:\\s*`, "gi");
  const matches = Array.from(text.matchAll(regex));

  if (matches.length === 0) {
    return splitLongSummary(text).map((summary) => ({ type: "summary", text: summary }));
  }

  const blocks: DescriptionBlock[] = [];
  const firstIndex = matches[0].index ?? 0;
  const intro = text.slice(0, firstIndex).trim();

  splitLongSummary(intro).forEach((summary) => {
    blocks.push({ type: "summary", text: summary });
  });

  matches.forEach((match, index) => {
    const label = match[1].trim();
    const valueStart = (match.index ?? 0) + match[0].length;
    const valueEnd = matches[index + 1]?.index ?? text.length;
    const value = normalizeDescriptionText(text.slice(valueStart, valueEnd));

    if (value) {
      blocks.push({ type: "spec", label, value });
    }
  });

  return blocks;
};

const ProductDescription = ({
  isError,
  isLoading,
  data,
}: ProductDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const descriptionBlocks = useMemo(() => {
    const descriptionItems = Array.isArray(data?.description_list)
      ? data.description_list.map((item) => item?.trim()).filter(Boolean)
      : [];

    return parseDescriptionBlocks(descriptionItems);
  }, [data?.description_list]);
  const hasCustomVariant = useMemo(() => {
    const variants = Array.isArray(data?.variants_list) ? data.variants_list : [];

    return variants.some((variant) => {
      const optionName = `${variant?.name || ""} ${variant?.variant || ""}`.toLowerCase();
      return optionName.includes("custom");
    });
  }, [data?.variants_list]);
  const isLongDescription = descriptionBlocks.length > 4;
  const visibleBlocks = showFullDescription || !isLongDescription
    ? descriptionBlocks
    : descriptionBlocks.slice(0, 4);

  const handleReadMore = () => {
    setShowFullDescription((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px]">
        <Spinner className="mb-2" size={32} label="Memuat deskripsi produk..." />
        <p className="text-gray-600 text-sm">Memuat deskripsi produk...</p>
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-gray-600">Deskripsi produk belum bisa dimuat. Silakan coba lagi nanti.</div>;
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50 backdrop-blur" aria-label="Deskripsi produk">
      <div className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/80 to-white px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Detail produk</p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">Deskripsi Produk</h2>
      </div>

      <div className="space-y-3 p-4">
        {descriptionBlocks.length > 0 ? (
          <>
            <div className="space-y-2">
              {visibleBlocks.map((block, index) => {
                if (block.type === "spec") {
                  return (
                    <div
                      key={`${block.label}-${index}`}
                      className="rounded-2xl border border-emerald-50 bg-emerald-50/45 px-3 py-2.5"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">{block.label}</p>
                      <p className="mt-1 text-sm leading-6 text-gray-700">{block.value}</p>
                    </div>
                  );
                }

                return (
                  <p
                    key={`summary-${index}`}
                    className="rounded-2xl bg-gray-50/80 px-3 py-2.5 text-sm leading-7 text-gray-700"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>

            {isLongDescription && (
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                onClick={handleReadMore}
              >
                {showFullDescription ? "Tampilkan lebih sedikit" : `Baca selengkapnya (${descriptionBlocks.length - visibleBlocks.length} bagian lagi)`}
              </button>
            )}

            {hasCustomVariant && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-700">Info custom produk</p>
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  Untuk varian custom, tuliskan detail request seperti warna, kombinasi, opsi LED, nama/desain, atau catatan khusus di kolom <strong>Catatan Tambahan</strong> saat checkout/pembayaran agar admin bisa menyesuaikan pesanan.
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="rounded-2xl bg-gray-50/80 px-3 py-3 text-sm leading-6 text-gray-600">
            Deskripsi produk belum tersedia di katalog. Silakan hubungi admin toko jika membutuhkan informasi produk sebelum membeli.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductDescription;
