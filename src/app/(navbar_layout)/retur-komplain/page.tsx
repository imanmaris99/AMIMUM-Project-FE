import type { Metadata } from "next";
import TrustPageShell from "@/components/trust/TrustPageShell";

export const metadata: Metadata = {
  title: "Kebijakan Retur dan Komplain",
  description: "Kebijakan retur, komplain, dan bantuan pesanan Toko Herbal AmImUm agar customer memahami alur pelaporan dengan aman.",
  alternates: { canonical: "/retur-komplain" },
};

export default function ReturKomplainPage() {
  return (
    <TrustPageShell
      eyebrow="Bantuan pesanan"
      title="Kebijakan Retur dan Komplain"
      description="Panduan ini membantu customer menyampaikan kendala pesanan dengan jelas, aman, dan mudah ditindaklanjuti oleh admin toko."
      highlight="Retur atau komplain diproses berdasarkan bukti pesanan, kondisi produk, dan pengecekan admin. Jangan membuang kemasan/foto bukti sebelum laporan selesai ditinjau."
      sections={[
        {
          title: "Kapan customer bisa mengajukan komplain?",
          items: [
            "Produk yang diterima berbeda dari pesanan atau varian yang dipilih.",
            "Jumlah item tidak sesuai dengan ringkasan pesanan.",
            "Produk rusak karena proses pengiriman dan ada bukti foto/video saat paket diterima.",
            "Status pembayaran/pesanan belum sesuai setelah customer melakukan pembayaran melalui metode resmi toko.",
          ],
        },
        {
          title: "Batas waktu pelaporan",
          items: [
            "Laporkan kendala secepatnya setelah pesanan diterima agar pengecekan lebih mudah.",
            "Untuk produk rusak/kurang/salah item, disarankan melapor maksimal 1x24 jam setelah paket diterima atau pickup dilakukan.",
            "Komplain yang masuk terlalu lama tetap bisa ditinjau, tetapi keputusan mengikuti bukti dan kondisi pesanan.",
          ],
        },
        {
          title: "Bukti yang perlu disiapkan",
          items: [
            "Nomor pesanan atau screenshot detail transaksi.",
            "Foto/video paket saat dibuka bila kendala terkait barang rusak, salah, atau kurang.",
            "Foto label pengiriman/resi untuk pesanan delivery bila tersedia.",
            "Bukti pembayaran untuk kendala verifikasi pembayaran manual.",
          ],
        },
        {
          title: "Alur penanganan admin",
          items: [
            "Admin mengecek nomor pesanan, item, status pembayaran, dan bukti yang dikirim customer.",
            "Jika kendala valid, admin akan menawarkan solusi sesuai kasus: koreksi informasi, pengiriman kekurangan, penggantian, atau opsi lain yang disepakati.",
            "Untuk pickup, pengecekan dapat dilakukan langsung saat pengambilan bila memungkinkan.",
            "Untuk delivery, keputusan juga mempertimbangkan kondisi paket dan bukti penerimaan.",
          ],
        },
        {
          title: "Ketentuan yang tidak termasuk retur",
          items: [
            "Perubahan keinginan setelah produk diterima tanpa kendala pada produk/pesanan.",
            "Produk sudah digunakan/diubah/dirusak setelah diterima tanpa bukti kendala awal.",
            "Kesalahan alamat atau kontak yang diinput customer sehingga kurir tidak dapat mengirim dengan benar.",
            "Kendala yang berasal dari pembayaran di luar kanal resmi toko.",
          ],
        },
        {
          title: "Catatan khusus produk custom",
          items: [
            "Produk custom mengikuti catatan/request customer dan konfirmasi admin sebelum diproses.",
            "Perbedaan kecil warna/tekstur/hasil akhir bisa terjadi karena bahan, layar perangkat, atau proses pembuatan.",
            "Komplain produk custom tetap bisa diajukan bila hasil tidak sesuai kesepakatan utama atau ada kerusakan yang terbukti.",
          ],
        },
      ]}
    />
  );
}
