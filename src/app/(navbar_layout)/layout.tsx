import type { Metadata } from "next";
import "../globals.css";
import { Navbar } from "../../components";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
      <body className="antialiased font-jakarta font-inter">
        <main>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
        <Navbar />
      </body>
    </html>
  );
}
