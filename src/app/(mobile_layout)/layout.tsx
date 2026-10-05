import StoreFooterPill from "@/components/common/StoreFooterPill";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen min-h-dvh bg-[linear-gradient(180deg,#F1FAF5_0%,#FFFFFF_34%,#FFFBF1_72%,#F4FBF7_100%)] pb-[env(safe-area-inset-bottom)]">
      {children}
      <StoreFooterPill className="pb-[calc(1.5rem+env(safe-area-inset-bottom))]" />
    </main>
  );
}
