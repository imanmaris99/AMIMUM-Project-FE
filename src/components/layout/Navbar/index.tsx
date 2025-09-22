"use client";

import { useRouter, usePathname } from "next/navigation";
import { GoHome, GoHeart } from "react-icons/go";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { VscAccount } from "react-icons/vsc";
import { HiOutlineTruck } from "react-icons/hi2";
import { useNotification } from "@/contexts/NotificationContext";

const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const { getNotificationCount, resetNotification } = useNotification();

  const handleClick = (path: string) => {
    // Reset notification when user clicks on tracking, transaction, or wishlist menu
    if (path === "/track-order") {
      resetNotification("tracking");
    } else if (path === "/transaction") {
      resetNotification("transaction");
    } else if (path === "/wishlist") {
      resetNotification("wishlist");
    }
    
    router.push(path);
  };

  const getIconClass = (path: string) => {
    return currentPath === path
      ? "bg-primary text-white"
      : "bg-white text-black";
  };

  // Badge component
  const Badge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    
    return (
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
        {count > 99 ? "99+" : count}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col gap-4 fixed bottom-0 right-0 left-0 bg-white mx-auto z-50"
      style={{ maxWidth: "440px", width: "100%" }}
      suppressHydrationWarning={true}
    >
      <div className="shadow-box" suppressHydrationWarning={true}>
        <div className="flex justify-center items-center gap-8 h-14" suppressHydrationWarning={true}>
          <div
            className={`${getIconClass("/")} rounded-full p-2 cursor-pointer`}
            onClick={() => handleClick("/")}
            suppressHydrationWarning={true}
          >
            <GoHome size={32} />
          </div>

          <div
            className={`${getIconClass(
              "/wishlist"
            )} rounded-full p-2 cursor-pointer relative`}
            onClick={() => handleClick("/wishlist")}
            suppressHydrationWarning={true}
          >
            <GoHeart size={32} />
            <Badge count={getNotificationCount("wishlist")} />
          </div>

          <div
            className={`${getIconClass(
              "/track-order"
            )} rounded-full p-2 cursor-pointer relative`}
            onClick={() => handleClick("/track-order")}
            suppressHydrationWarning={true}
          >
            <HiOutlineTruck size={32} />
            <Badge count={getNotificationCount("tracking")} />
          </div>

          <div
            className={`${getIconClass(
              "/transaction"
            )} rounded-full p-2 cursor-pointer relative`}
            onClick={() => handleClick("/transaction")}
            suppressHydrationWarning={true}
          >
            <HiOutlineDocumentText size={32} />
            <Badge count={getNotificationCount("transaction")} />
          </div>

          <div
            className={`${getIconClass(
              "/profile"
            )} rounded-full p-2 cursor-pointer`}
            onClick={() => handleClick("/profile")}
            suppressHydrationWarning={true}
          >
            <VscAccount size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
