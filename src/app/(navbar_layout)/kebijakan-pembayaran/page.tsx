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
      description="Pembayaran produk dilakukan melalui metode resmi yang tersedia di aplikasi. Informasi ini membantu customer membayar dengan aman dan memahami proses verifikasi."
      highlight="Untuk soft-launch, pembayaran produk mengikuti metode resmi seperti QRIS/manual transfer/pickup sesuai pilihan yang tampil. Jangan transfer ke rekening/nomor yang tidak tercantum atau tidak dikonfirmasi admin resmi."
      sections={[
        {
          title: "Metode pembayaran yang digunakan",
          items: [
            "QRIS resmi toko bila tersedia di halaman transaksi.",
            "Transfer bank manual ke rekening resmi yang tampil di aplikasi.",
            "Bayar di toko khusus pesanan pickup bila opsi tersebut tersedia.",
            "Metode online lain hanya digunakan jika tampil resmi di checkout/transaksi.",
          ],
        },
        {
          title: "Verifikasi pembayaran",
          items: [
            "Pesanan manual QRIS/transfer dapat menunggu admin memverifikasi dana masuk.",
            "Customer disarankan menyimpan bukti pembayaran sampai status berubah.",
            "Jika status belum berubah, hubungi admin dengan menyertakan nomor pesanan dan bukti pembayaran.",
          ],
        },
        {
          title: "Ongkir dan total pembayaran",
          items: [
            "Total produk dan ongkir mengikuti ringkasan checkout.",
            "Jika sistem menampilkan ongkir dibayar saat paket tiba, berarti yang dibayar saat checkout hanya total produk/metode toko.",
            "Pembayaran produk bukan COD kecuali ada instruksi resmi dari toko untuk kondisi khusus pickup/bayar di toko.",
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
