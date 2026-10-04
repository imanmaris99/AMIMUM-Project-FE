const guideItems = [
  {
    step: "1",
    title: "Pilih produk herbal",
    description: "Cari produk dari katalog, lalu cek varian, harga, dan informasi produk sebelum membeli.",
  },
  {
    step: "2",
    title: "Pilih cara terima pesanan",
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
  return (
    <section
      aria-labelledby="shopping-guide-title"
      className="mx-4 mt-5 rounded-3xl border border-primary/10 bg-white/90 px-4 py-5 font-jakarta shadow-sm backdrop-blur sm:mx-6"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">
          Panduan Belanja
        </p>
        <h2 id="shopping-guide-title" className="mt-1 text-lg font-extrabold tracking-tight text-gray-900">
          Cara Belanja di Toko Herbal Amimum
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Ringkas, jelas, dan aman: pilih produk, tentukan pickup atau jasa kirim, lalu pantau status dari halaman transaksi.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {guideItems.map((item) => (
          <article
            key={item.step}
            className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#F8FBF6] p-4 shadow-[0_8px_24px_rgba(13,14,9,0.04)]"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
            </div>
            <p className="text-xs leading-5 text-gray-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-900">
        <p className="font-bold">Info penting</p>
        <p className="mt-1">
          Pembayaran produk dilakukan lewat metode resmi yang tampil saat checkout. Ongkir mengikuti pilihan pengiriman; jika pickup, pesanan diambil langsung di toko dan tidak ada nomor resi.
        </p>
      </div>
    </section>
  );
}
