import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import WishlistWithNotification from "@/components/common/WishlistWithNotification";
import CartWithNotification from "@/components/common/CartWithNotification";
import ToastProvider from "@/components/ui/ToastProvider";

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
      </head>
      <body className="antialiased font-jakarta">
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
      </body>
    </html>
  );
}
