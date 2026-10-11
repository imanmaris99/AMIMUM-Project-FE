import { Navbar } from "../../components";
import { Suspense } from "react";
import StoreFooterPill from "@/components/common/StoreFooterPill";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen min-h-dvh bg-[linear-gradient(180deg,#F5FBF7_0%,#FFFFFF_34%,#FFFBF1_72%,#F7FBF8_100%)] pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
        <Suspense>
          {children}
          <StoreFooterPill />
        </Suspense>
      </main>
      <Navbar />
    </>
  );
}
