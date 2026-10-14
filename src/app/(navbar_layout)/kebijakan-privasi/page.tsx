import type { Metadata } from "next";
import TrustPageShell from "@/components/trust/TrustPageShell";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Toko Herbal AmImUm tentang data customer, akun, alamat, transaksi, dan keamanan penggunaan toko online.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <TrustPageShell
      eyebrow="Privasi customer"
      title="Kebijakan Privasi"
      description="Halaman ini menjelaskan bagaimana Toko Herbal AmImUm menggunakan data customer untuk kebutuhan akun, checkout, pengiriman/pickup, pembayaran, dan layanan bantuan pesanan."
      highlight="Toko tidak pernah meminta password, PIN, OTP, atau akses akun pribadi customer. Gunakan hanya kanal resmi yang tersedia di aplikasi dan halaman toko."
      sections={[
        {
          title: "Data yang dapat digunakan",
          items: [
            "Data akun seperti nama dan email/nomor kontak yang digunakan untuk login atau komunikasi pesanan.",
            "Data alamat penerima untuk kebutuhan pengiriman barang.",
            "Data transaksi seperti nomor pesanan, item, varian, jumlah, metode pembayaran, dan status pesanan.",
            "Catatan tambahan dari customer, termasuk request custom bila customer menuliskannya saat checkout.",
          ],
        },
        {
          title: "Tujuan penggunaan data",
          items: [
            "Memproses pesanan, pembayaran, pengiriman, pickup, dan histori transaksi customer.",
            "Membantu admin mengecek pembayaran, status order, komplain, retur, atau pertanyaan customer.",
            "Menampilkan riwayat transaksi dan lacak pesanan sesuai status pesanan customer.",
            "Meningkatkan kualitas layanan toko, katalog produk, dan pengalaman belanja customer.",
          ],
        },
        {
          title: "Pembayaran dan pihak ketiga",
          items: [
            "Pembayaran dapat menggunakan QRIS toko, transfer BRI pemilik toko, Midtrans sebagai pihak ketiga penyedia pembayaran, atau bayar di toko khusus pickup.",
            "Untuk pembayaran melalui Midtrans atau layanan pihak ketiga, customer mengikuti halaman dan ketentuan penyedia layanan tersebut.",
            "Toko tidak menyimpan data sensitif kartu, OTP, PIN, atau password pembayaran customer.",
          ],
        },
        {
          title: "Keamanan akun customer",
          items: [
            "Customer bertanggung jawab menjaga akses email, password, OTP, dan perangkat pribadi.",
            "Admin tidak akan meminta password customer untuk membantu pesanan.",
            "Jika ada aktivitas mencurigakan, segera hubungi admin resmi dan ubah password akun bila diperlukan.",
          ],
        },
        {
          title: "Penyimpanan histori pesanan",
          items: [
            "Riwayat transaksi disimpan agar customer dan admin dapat melakukan pengecekan pesanan bila dibutuhkan.",
            "Tracking aktif untuk pesanan selesai dapat dipindahkan ke arsip setelah periode tertentu, tetapi detail transaksi tetap dapat digunakan sebagai bukti pembelian.",
            "Data dapat disimpan selama diperlukan untuk kebutuhan layanan, administrasi, audit internal, dan kewajiban operasional toko.",
          ],
        },
        {
          title: "Permintaan bantuan data",
          items: [
            "Customer dapat menghubungi admin resmi untuk koreksi informasi pesanan atau alamat sebelum pesanan diproses.",
            "Permintaan terkait data akan ditinjau sesuai kebutuhan operasional, keamanan akun, dan status pesanan.",
            "Untuk pesanan yang sudah diproses atau dikirim, perubahan data mengikuti kemampuan operasional toko dan kurir.",
          ],
        },
      ]}
    />
  );
}
