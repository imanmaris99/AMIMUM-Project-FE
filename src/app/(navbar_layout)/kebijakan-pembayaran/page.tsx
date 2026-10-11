import type { Metadata } from "next";
import TrustPageShell from "@/components/trust/TrustPageShell";

export const metadata: Metadata = {
  title: "Kebijakan Pembayaran",
  description: "Kebijakan pembayaran resmi Toko Herbal AmImUm untuk QRIS, transfer manual, pickup, dan status verifikasi pesanan.",
  alternates: { canonical: "/kebijakan-pembayaran" },
};

export default function KebijakanPembayaranPage() {
  return (
    <TrustPageShell
      eyebrow="Pembayaran resmi"
      title="Kebijakan Pembayaran"
      description="Pembayaran produk mengikuti pilihan yang tersedia di checkout: QRIS resmi toko, transfer BRI pemilik toko, Midtrans sebagai pihak ketiga penyedia pembayaran, dan bayar di toko khusus pickup."
      highlight="Untuk pesanan kirim, pembayaran produk dilakukan melalui QRIS toko, transfer BRI pemilik toko, atau Midtrans. Pilihan bayar langsung di toko hanya untuk pesanan pickup/ambil di toko."
      sections={[
        {
          title: "Metode pembayaran yang digunakan",
          items: [
            "QRIS resmi toko untuk pembayaran langsung ke QRIS Toko Herbal Amimum.",
            "Transfer ke rekening BRI pemilik toko yang tampil di aplikasi.",
            "Midtrans sebagai pihak ketiga penyedia layanan pembayaran online, seperti VA/QRIS/e-wallet/kartu sesuai halaman Midtrans.",
            "Bayar langsung di toko hanya tersedia untuk pesanan pickup/ambil di toko.",
          ],
        },
        {
          title: "Verifikasi pembayaran",
          items: [
            "Pesanan QRIS toko dan transfer BRI dapat menunggu admin memverifikasi dana masuk.",
            "Customer disarankan menyimpan bukti pembayaran sampai status berubah.",
            "Jika status belum berubah, hubungi admin dengan menyertakan nomor pesanan dan bukti pembayaran.",
          ],
        },
        {
          title: "Ongkir dan total pembayaran",
          items: [
            "Total produk dan ongkir mengikuti ringkasan checkout.",
            "Jika sistem menampilkan ongkir dibayar saat paket tiba, berarti yang dibayar saat checkout hanya total produk/metode toko.",
            "Bayar di tempat hanya berlaku untuk pesanan pickup di toko, bukan untuk pesanan kirim.",
          ],
        },
        {
          title: "Keamanan pembayaran",
          items: [
            "Admin tidak meminta password, PIN, OTP, atau akses akun customer.",
            "Abaikan permintaan pembayaran di luar kanal resmi toko.",
            "Jika ada nominal berbeda, gunakan nominal terbaru yang tampil di halaman transaksi atau konfirmasi admin resmi.",
          ],
        },
      ]}
    />
  );
}
