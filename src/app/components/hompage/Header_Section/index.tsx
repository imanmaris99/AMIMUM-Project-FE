import { IoBagOutline, IoNotificationsOutline } from "react-icons/io5";
import { Search } from "@/app/components";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SkeletonHeader } from "./SkeletonHeader";

const Header = () => {
  const { userProfile, isLoading, isError } = useUserProfile();

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

  return (
    <>
      <header>
        <div className="flex justify-between items-center mt-14 mx-6">
          <div className="flex flex-col justify-center gap-2">
            {isLoading ? (
              <SkeletonHeader />
            ) : (
              <>
                <p>Selamat Datang,</p>
                <h4 className="font-bold text-xl font-jakarta">
                  {userProfile?.firstname} {userProfile?.lastname}
                </h4>
              </>
            )}
          </div>

          <div className="flex justify-center items-center gap-3">
            <IoBagOutline size={32} />
            <IoNotificationsOutline size={32} />
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
