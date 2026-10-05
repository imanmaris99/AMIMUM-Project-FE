export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="min-h-screen w-full bg-transparent">
        {children}
      </div>
    </main>
  );
}
