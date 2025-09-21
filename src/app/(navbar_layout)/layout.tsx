import { Navbar } from "../../components";
import { Suspense } from "react";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
        <Suspense>{children}</Suspense>
      </main>
      <Navbar />
    </>
  );
}
