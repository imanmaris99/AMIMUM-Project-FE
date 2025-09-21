import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
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
            <TransactionProvider>
              {children}
              <ToastProvider />
            </TransactionProvider>
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
