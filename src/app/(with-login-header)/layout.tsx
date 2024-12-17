import "../globals.css";
import { HeaderLogin } from "@/components";

export default function HeaderLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
            <div className="bg-[url('/bg-image.png')] bg-cover w-full h-full">
                <HeaderLogin/>
                {children}
            </div>
  );
}
