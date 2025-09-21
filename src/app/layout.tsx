import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import WishlistWithNotification from "@/components/common/WishlistWithNotification";
import CartWithNotification from "@/components/common/CartWithNotification";
import NotificationErrorBoundary from "@/components/common/NotificationErrorBoundary";
import ToastProvider from "@/components/ui/ToastProvider";
import { ClientErrorBoundary } from "@/components/common/ClientErrorBoundary";
import { initializeAnalytics } from "@/lib/analytics";
import { PerformanceMonitor } from "@/lib/performance";
import { getSecurityHeaders } from "@/lib/security";

export const metadata: Metadata = {
  title: "AmImUm",
  description: "Toko Herbal AmImUm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100;400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#001E14" />
        <meta name="description" content="Toko Herbal AmImUm - Produk herbal berkualitas tinggi" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo_toko.svg" />
        <meta property="og:title" content="AmImUm - Toko Herbal" />
        <meta property="og:description" content="Produk herbal berkualitas tinggi untuk kesehatan Anda" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo_toko.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AmImUm - Toko Herbal" />
        <meta name="twitter:description" content="Produk herbal berkualitas tinggi untuk kesehatan Anda" />
        <meta name="twitter:image" content="/logo_toko.svg" />
      </head>
      <body className="antialiased font-jakarta">
        <ClientErrorBoundary>
          <NotificationErrorBoundary>
            <NotificationProvider>
              <CartProvider>
                <CartWithNotification>
                  <WishlistProvider>
                    <WishlistWithNotification>
                      <TransactionProvider>
                        {children}
                        <ToastProvider />
                      </TransactionProvider>
                    </WishlistWithNotification>
                  </WishlistProvider>
                </CartWithNotification>
              </CartProvider>
            </NotificationProvider>
          </NotificationErrorBoundary>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
