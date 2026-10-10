"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";

interface SearchPageBoxProps {
  initialQuery?: string;
}

const SearchPageBox = ({ initialQuery = "" }: SearchPageBoxProps) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      inputRef.current?.focus();
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <section className="mx-4 mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:mx-6">
      <div className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Cari Katalog</p>
        <h1 className="mt-1 text-xl font-bold text-[#0D0E09]">Temukan produk herbal</h1>
        <p className="mt-1 text-sm leading-5 text-[#6B7C73]">
          Ketik nama produk, brand, kategori, atau kebutuhan. Hasil yang tampil mengikuti katalog toko.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-3 py-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
        <CiSearch className="h-6 w-6 flex-shrink-0 text-emerald-700" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          inputMode="search"
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-gray-900 placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
          placeholder="Contoh: madu, jamu, minyak, custom craft"
          aria-label="Cari produk di katalog Toko Herbal Amimum"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="h-10 rounded-xl bg-[#00764F] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#005A3C] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Cari
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {['Madu', 'Jamu siap minum', 'Rempah', 'Custom craft'].map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(keyword)}`)}
            className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
          >
            {keyword}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchPageBox;
