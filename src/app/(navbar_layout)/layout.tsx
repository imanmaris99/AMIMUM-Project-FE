import { Navbar } from "../../components";
import { Suspense } from "react";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen min-h-dvh bg-[linear-gradient(180deg,#F7FCF9_0%,#FFFFFF_44%,#FFFDF7_100%)] pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
        <Suspense>{children}</Suspense>
      </main>
      <Navbar />
    </>
  );
}
