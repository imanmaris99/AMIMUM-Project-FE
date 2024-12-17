// import type { Metadata } from "next";
import "../globals.css";
import { Navbar } from "../../components";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Navbar/>
    </>

  );
}
