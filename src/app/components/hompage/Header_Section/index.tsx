import { IoNotificationsOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { Search } from "@/app/components";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { SkeletonHeader } from "./SkeletonHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { user, isLoading, isError, errorMessage } = useUserProfile();

  if (isError) {
    return (
      <div className="mt-14 mx-6 text-red-500 font-semibold">
        {errorMessage}
      </div>
    );
  }

  return (
    <>
      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            {isLoading && user ? (
              <SkeletonHeader />
            ) : !user ? (
              <div className="flex flex-col justify-center gap-2">
                <p>Selamat Datang,</p>
                <h4 className="font-bold text-xl font-jakarta">
                  di Toko Herbal <span className="text-primary">AmImUm</span>
                </h4>
                <div className="w-full mt-4">
                  <Link href="/login">
                    <Button
                      variant="secondary"
                      className="w-1/2 text-primary bg-customGreen4 hover:bg-primary hover:text-white"
                    >
                      Silahkan masuk
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p>Selamat Datang,</p>
                <h4 className="font-bold text-xl font-jakarta">
                  {user.firstname} {user.lastname}
                </h4>
              </>
            )}
          </div>

          <div className="flex justify-center items-center gap-3">
            {!user ? (
              <Image src="/Logo_toko.png" alt="logo" width={100} height={125} priority />
            ) : (
              <>
                <FiShoppingCart size={32} style={{ strokeWidth: 1.5 }} />
                <IoNotificationsOutline size={32} />
              </>
            )}
          </div>
        </div>

        {/* <div className="mx-6 mt-3">
          <Search />
        </div> */}
      </header>
    </>
  );
};

export default Header;
