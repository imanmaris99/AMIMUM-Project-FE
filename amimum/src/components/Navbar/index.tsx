"use client";

import Icon from "../Icon";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const handleClick = (path: string) => {
    router.push(path);
  };

  const getIconClass = (path: string) => {
    return currentPath === path ? "bg-primary" : "bg-white";
  };

  return (
    <div className="flex flex-col gap-4 fixed bottom-0 right-0 left-0 bg-white mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
      <div className="shadow-box">
        <div className="flex justify-center items-center gap-12 h-14">
          <div className={`${getIconClass("/")} rounded-full p-2`} onClick={() => handleClick("/")}>
            <Icon icon="home" />
          </div>
          <div className={`${getIconClass("/wishlist")} rounded-full p-2`} onClick={() => handleClick("/wishlist")}>
            <Icon icon="heart" />
          </div>
          <div className={`${getIconClass("/wallet")} rounded-full p-2`} onClick={() => handleClick("/wallet")}>
            <Icon icon="wallet" />
          </div>
          <div className={`${getIconClass("/account")} rounded-full p-2`} onClick={() => handleClick("/account")}>
            <Icon icon="account" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
