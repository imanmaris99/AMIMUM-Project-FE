import type { Metadata } from "next";
import "./globals.css";
import { jakarta } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Toko Herbal AmImUm",
  description: "Toko Herbal - Menyediakan produk herbal berkualitas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
