import { Navbar } from "../../components";
import { Suspense } from "react";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <Suspense>{children}</Suspense>
      </main>
      <Navbar />
    </>
  );
}
