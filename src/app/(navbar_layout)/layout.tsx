import { Navbar } from "../../components";
import { Suspense } from "react";
import { WishlistProvider } from "@/contexts/WishlistContext";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WishlistProvider>
      <main>
        <Suspense>{children}</Suspense>
      </main>
      <Navbar />
    </WishlistProvider>
  );
}
