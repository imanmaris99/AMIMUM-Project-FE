import type { Metadata } from "next";
import TrustPageShell from "@/components/trust/TrustPageShell";

export const metadata: Metadata = {
  title: "Kebijakan Pengiriman & Pickup",
  description: "Kebijakan pengiriman, nomor resi, pickup toko, dan status pesanan Toko Herbal AmImUm.",
  alternates: { canonical: "/pengiriman-pickup" },
};

export default function PengirimanPickupPage() {
  return (
    <TrustPageShell
      eyebrow="Pengiriman & pickup"
      title="Kebijakan Pengiriman dan Pickup"
      description="Pesanan dapat dikirim ke alamat customer atau diambil langsung di toko sesuai opsi yang tersedia saat checkout."
      sections={[
        {
          title: "Pengiriman ke alamat",
          items: [
            "Customer wajib mengisi nama penerima, nomor WhatsApp/telepon aktif, alamat lengkap, kota, dan kode pos bila diminta.",
            "Kurir dan layanan mengikuti opsi yang tersedia di aplikasi saat checkout.",
            "Estimasi pengiriman adalah perkiraan dari layanan kurir dan dapat berubah karena kondisi operasional kurir.",
          ],
        },
        {
          title: "Nomor resi",
          items: [
            "Nomor resi tampil setelah admin menyerahkan paket ke kurir dan memasukkan resi resmi.",
            "Kode internal order/shipment bukan nomor resi kurir.",
            "Jika resi belum tersedia, pantau halaman tracking atau hubungi admin dengan nomor pesanan.",
          ],
        },
        {
          title: "Pickup / ambil di toko",
          items: [
            "Pesanan pickup tidak memakai kurir atau nomor resi.",
            "Customer datang setelah status berubah menjadi siap diambil.",
            "Bawa/tunjukkan nomor pesanan atau invoice dari halaman transaksi saat mengambil barang.",
          ],
        },
        {
          title: "Masalah alamat atau pesanan",
          items: [
            "Jika alamat salah, hubungi admin secepatnya sebelum pesanan dikirim.",
            "Setelah paket diserahkan ke kurir, perubahan alamat mengikuti kebijakan kurir.",
            "Untuk komplain barang, simpan invoice dan bukti foto/video unboxing bila diperlukan.",
          ],
        },
      ]}
    />
  );
}
