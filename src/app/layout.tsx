import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
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
// Performance and analytics imports removed - will be initialized in client components

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "400", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "400", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning={true} className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head suppressHydrationWarning={true}>
        <meta name="viewport" content="width=device-width, initial-scale=1" suppressHydrationWarning={true} />
        <meta name="theme-color" content="#001E14" suppressHydrationWarning={true} />
        <meta name="description" content="Toko Herbal AmImUm - Produk herbal berkualitas tinggi" suppressHydrationWarning={true} />
        <meta name="robots" content="index, follow" suppressHydrationWarning={true} />
        <link rel="icon" href="/favicon.ico" suppressHydrationWarning={true} />
        <link rel="apple-touch-icon" href="/logo_toko.svg" suppressHydrationWarning={true} />
        <meta property="og:title" content="AmImUm - Toko Herbal" suppressHydrationWarning={true} />
        <meta property="og:description" content="Produk herbal berkualitas tinggi untuk kesehatan Anda" suppressHydrationWarning={true} />
        <meta property="og:type" content="website" suppressHydrationWarning={true} />
        <meta property="og:image" content="/logo_toko.svg" suppressHydrationWarning={true} />
        <meta name="twitter:card" content="summary_large_image" suppressHydrationWarning={true} />
        <meta name="twitter:title" content="AmImUm - Toko Herbal" suppressHydrationWarning={true} />
        <meta name="twitter:description" content="Produk herbal berkualitas tinggi untuk kesehatan Anda" suppressHydrationWarning={true} />
        <meta name="twitter:image" content="/logo_toko.svg" suppressHydrationWarning={true} />
        <script
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress hydration warnings globally
              (function() {
                if (typeof window !== 'undefined') {
                  // Suppress console errors for hydration mismatches
                  const originalConsoleError = console.error;
                  console.error = function(...args) {
                    if (args[0] && typeof args[0] === 'string' && args[0].includes('A tree hydrated but some attributes')) {
                      return; // Suppress hydration warnings
                    }
                    originalConsoleError.apply(console, args);
                  };
                  
                  // Suppress React hydration warnings
                  const originalWarn = console.warn;
                  console.warn = function(...args) {
                    if (args[0] && typeof args[0] === 'string' && args[0].includes('A tree hydrated but some attributes')) {
                      return; // Suppress hydration warnings
                    }
                    originalWarn.apply(console, args);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-jakarta" suppressHydrationWarning={true}>
        <ClientErrorBoundary>
          <NotificationErrorBoundary>
            <NotificationProvider>
              <CartProvider>
                <CartWithNotification>
                  <WishlistProvider>
                    <WishlistWithNotification>
                      <TransactionProvider>
                        <div suppressHydrationWarning={true}>
                          {children}
                        </div>
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
