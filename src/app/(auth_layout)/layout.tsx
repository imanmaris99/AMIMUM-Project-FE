export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="bg-[url('/bg-image.png')] bg-cover w-full h-full">
        {children}
      </div>
    </main>
  );
}
