"use client";

import { useRouter, usePathname } from "next/navigation";
import { GoHome, GoHeart } from "react-icons/go";
import { HiOutlineWallet } from "react-icons/hi2";
import { VscAccount } from "react-icons/vsc";

const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const handleClick = (path: string) => {
    router.push(path);
  };

  const getIconClass = (path: string) => {
    return currentPath === path ? "bg-primary text-white" : "bg-white text-black";
  };

  return (
    <div className="flex flex-col gap-4 fixed bottom-0 right-0 left-0 bg-white mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
      <div className="shadow-box">
        <div className="flex justify-center items-center gap-12 h-14">
          <div className={`${getIconClass("/")} rounded-full p-2`} onClick={() => handleClick("/")}>
            <GoHome size={32} />
          </div>
          <div className={`${getIconClass("/wishlist")} rounded-full p-2`} onClick={() => handleClick("/wishlist")}>
            <GoHeart size={32} />
          </div>
          <div className={`${getIconClass("/wallet")} rounded-full p-2`} onClick={() => handleClick("/wallet")}>
            <HiOutlineWallet size={32} />
          </div>
          <div className={`${getIconClass("/account")} rounded-full p-2`} onClick={() => handleClick("/account")}>
            <VscAccount size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
