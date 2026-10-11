import type { Metadata } from "next";
import TrustPageShell from "@/components/trust/TrustPageShell";

export const metadata: Metadata = {
  title: "Cara Belanja",
  description: "Panduan belanja di Toko Herbal AmImUm: pilih produk, checkout, pembayaran resmi, dan pantau pesanan.",
  alternates: { canonical: "/cara-belanja" },
};

export default function CaraBelanjaPage() {
  return (
    <TrustPageShell
      eyebrow="Panduan customer"
      title="Cara Belanja di Toko Herbal AmImUm"
      description="Ikuti langkah sederhana ini agar pesanan tercatat rapi, pembayaran aman, dan status bisa dipantau dari halaman transaksi."
      sections={[
        {
          title: "1. Pilih produk dan varian",
          items: [
            "Buka katalog, kategori, brand, atau pencarian produk.",
            "Masuk ke detail produk untuk membaca deskripsi, varian, stok katalog, dan masa berlaku bila tersedia.",
            "Pilih varian sebelum menambahkan produk ke keranjang atau lanjut beli.",
          ],
        },
        {
          title: "2. Cek keranjang",
          items: [
            "Pastikan item, varian, jumlah, dan harga sudah sesuai.",
            "Jika ada produk yang tidak ingin dibeli, hapus dari keranjang sebelum checkout.",
            "Harga final mengikuti data katalog toko saat checkout.",
          ],
        },
        {
          title: "3. Pilih pengiriman atau pickup",
          items: [
            "Untuk pengiriman, isi alamat penerima dengan lengkap dan aktif.",
            "Untuk pickup, ambil pesanan setelah status berubah menjadi siap diambil.",
            "Pickup tidak memakai nomor resi kurir.",
          ],
        },
        {
          title: "4. Pilih metode pembayaran resmi",
          items: [
            "Gunakan metode pembayaran yang tampil di halaman checkout.",
            "Untuk QRIS/manual transfer, simpan bukti pembayaran sampai status dikonfirmasi.",
            "Toko tidak meminta pembayaran ke rekening/nomor selain yang tertulis di aplikasi atau dikonfirmasi admin resmi.",
          ],
        },
        {
          title: "5. Pantau status pesanan",
          items: [
            "Buka halaman Transaksi atau Lacak Pesanan untuk melihat status terbaru.",
            "Untuk delivery, nomor resi tampil setelah admin memasukkan resi resmi kurir.",
            "Untuk pickup, datang ke toko setelah status pesanan siap diambil.",
          ],
        },
      ]}
    />
  );
}
