import type { Metadata } from "next";
import TrustPageShell from "@/components/trust/TrustPageShell";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description: "Syarat dan ketentuan penggunaan Toko Herbal AmImUm untuk belanja, pembayaran, pengiriman, pickup, custom, dan bantuan pesanan.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <TrustPageShell
      eyebrow="Ketentuan toko"
      title="Syarat dan Ketentuan"
      description="Dengan menggunakan Toko Herbal AmImUm, customer memahami alur belanja, pembayaran, pengiriman/pickup, serta ketentuan layanan yang berlaku di toko online ini."
      highlight="Informasi produk herbal tidak dimaksudkan sebagai pengganti diagnosis, resep, atau penanganan medis profesional. Konsultasikan ke tenaga kesehatan bila memiliki kondisi khusus."
      sections={[
        {
          title: "Penggunaan toko online",
          items: [
            "Customer menggunakan aplikasi toko untuk melihat katalog, memilih varian, checkout, pembayaran, dan memantau pesanan.",
            "Customer wajib mengisi data pesanan, alamat, nomor kontak, dan catatan checkout dengan benar.",
            "Toko dapat menolak atau menunda pesanan bila data tidak lengkap, stok tidak tersedia, pembayaran belum valid, atau ada indikasi penyalahgunaan.",
          ],
        },
        {
          title: "Harga, stok, dan varian",
          items: [
            "Harga dan stok mengikuti data yang tampil saat checkout dan dapat berubah mengikuti pembaruan toko.",
            "Customer perlu memilih varian/kemasan dengan benar sebelum menambahkan ke keranjang atau membeli langsung.",
            "Jika stok berubah sebelum pembayaran/konfirmasi, admin dapat menghubungi customer untuk penyesuaian pesanan.",
          ],
        },
        {
          title: "Pembayaran resmi",
          items: [
            "Metode pembayaran resmi mengikuti halaman checkout: QRIS toko, transfer BRI pemilik toko, Midtrans, dan bayar di toko khusus pickup.",
            "Customer disarankan menyimpan bukti pembayaran sampai status pesanan terkonfirmasi.",
            "Toko tidak bertanggung jawab atas pembayaran yang dilakukan di luar kanal resmi toko atau instruksi admin resmi.",
          ],
        },
        {
          title: "Pengiriman dan pickup",
          items: [
            "Untuk delivery, customer wajib memastikan alamat dan kontak penerima benar sebelum pesanan diproses.",
            "Nomor resi tampil setelah admin memasukkan resi dari kurir terkait.",
            "Untuk pickup, customer mengambil pesanan setelah status menunjukkan pesanan siap diambil.",
            "Pickup tidak menggunakan nomor resi kurir.",
          ],
        },
        {
          title: "Produk custom",
          items: [
            "Request custom ditulis di Catatan Tambahan saat checkout/pembayaran agar admin dapat memeriksa detail pesanan.",
            "Produk custom dapat membutuhkan waktu lebih lama karena admin perlu menyiapkan bahan dan menyesuaikan desain.",
            "Jika ada opsi tambahan seperti LED/lampu atau perangkat pendukung lain, customer perlu memilih opsi tersebut secara terpisah bila tersedia.",
          ],
        },
        {
          title: "Retur, komplain, dan pembatalan",
          items: [
            "Komplain dan retur mengikuti Kebijakan Retur dan Komplain yang tersedia di halaman toko.",
            "Pembatalan pesanan hanya dapat diproses bila status pesanan masih memungkinkan dan belum masuk tahap yang tidak bisa dibatalkan.",
            "Solusi untuk pesanan bermasalah ditentukan berdasarkan bukti, status pesanan, kondisi barang, dan hasil pengecekan admin.",
          ],
        },
        {
          title: "Batasan informasi produk herbal",
          items: [
            "Deskripsi manfaat produk bersifat informasi umum dari katalog/produk dan bukan klaim penyembuhan pasti.",
            "Hasil penggunaan produk dapat berbeda pada setiap orang.",
            "Customer dengan kondisi medis, ibu hamil/menyusui, anak-anak, atau konsumsi obat tertentu sebaiknya berkonsultasi dengan tenaga kesehatan terlebih dahulu.",
          ],
        },
      ]}
    />
  );
}
