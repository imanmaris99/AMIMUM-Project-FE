import { IoBagOutline, IoNotificationsOutline } from "react-icons/io5";
import { Search } from "@/app/components";
import { useUserProfile } from "@/API/hooks/useUserProfile";
import { SkeletonHeader } from "./SkeletonHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  const { userProfile, isLoading, isError } = useUserProfile();

  if (isError) {
    switch (isError) {
      case 404:
        return <div>Data tidak ditemukan. Silakan coba lagi nanti.</div>;
      case 409:
        return <div>Terjadi konflik data. Silakan coba lagi nanti.</div>;
      case 500:
        return <div>Terjadi kesalahan server. Silakan coba lagi nanti.</div>;
      default:
        break;
    }
  }

  return (
    <>
      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            {isLoading && userProfile ? (
              <SkeletonHeader />
            ) : !userProfile ? (
              <div className="flex flex-col justify-center gap-2">
                <p>Selamat Datang,</p>
                <h4 className="font-bold text-xl font-jakarta">
                  di Toko Herbal <span className="text-primary">AmImUm</span>
                </h4>
                <div className="w-full">
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
                  {userProfile.firstname} {userProfile.lastname}
                </h4>
              </>
            )}
          </div>

          <div className="flex justify-center items-center gap-3">
            {!userProfile ? (
              <Image src="/logo_toko.png" alt="logo" width={100} height={100} />
            ) : (
              <>
                <IoBagOutline size={32} />
                <IoNotificationsOutline size={32} />
              </>
            )}
          </div>
        </div>

        <div className="mx-6 mt-6">
          <Search />
        </div>
      </header>
    </>
  );
};

export default Header;
