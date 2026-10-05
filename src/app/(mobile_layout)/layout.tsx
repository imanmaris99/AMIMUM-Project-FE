export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen min-h-dvh bg-[linear-gradient(180deg,#F7FCF9_0%,#FFFFFF_44%,#FFFDF7_100%)] pb-[env(safe-area-inset-bottom)]">
      {children}
    </main>
  );
}
