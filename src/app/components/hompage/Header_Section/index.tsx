import { IoBagOutline, IoNotificationsOutline } from "react-icons/io5";
import { Search } from "@/app/components";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SkeletonHeader } from "./SkeletonHeader";

const Header = () => {
  const { userProfile, isLoading } = useUserProfile();

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
