import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  // const { user, isLoading, isError, errorMessage } = useUserProfile();

  // if (isError) {
  //   return <div className="mt-14 mx-6 text-red-500 font-semibold">{errorMessage}</div>;
  // }

  return (
    <>
      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex flex-col justify-center gap-2">
              <p>Selamat Datang,</p>
              <h4 className="font-bold text-xl font-jakarta">
                di Toko Herbal <span className="text-primary">AmImUm</span>
              </h4>
              <div className="w-full mt-4">
                <Link href="/login">
                  <Button variant="secondary" className="w-1/2 text-primary bg-customGreen4 hover:bg-primary hover:text-white">
                    Silahkan masuk
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3">
            <Image src="/Logo_toko.png" alt="logo" width={100} height={125} priority />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
