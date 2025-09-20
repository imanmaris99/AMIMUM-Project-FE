"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GoHome, GoHeart } from "react-icons/go";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { VscAccount } from "react-icons/vsc";
import { HiOutlineTruck } from "react-icons/hi2";
import { useTransaction } from "@/contexts/TransactionContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const { transactions } = useTransaction();
  const { totalItems: cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  // State untuk melacak notifikasi yang sudah dilihat
  const [viewedNotifications, setViewedNotifications] = useState({
    wishlist: false,
    trackOrder: false,
    transaction: false
  });

  // Load viewed notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) {
      try {
        setViewedNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading viewed notifications:', error);
      }
    }
  }, []);

  // Save viewed notifications to localStorage
  useEffect(() => {
    localStorage.setItem('viewedNotifications', JSON.stringify(viewedNotifications));
  }, [viewedNotifications]);

  const handleClick = (path: string) => {
    router.push(path);
  };

  const getIconClass = (path: string) => {
    return currentPath === path ? "bg-primary text-white" : "bg-white text-black";
  };

  // Calculate active transactions (pending, completed)
  const activeTransactions = transactions.filter(t => 
    t.status === 'pending' || t.status === 'completed'
  ).length;

  // Calculate wishlist items count
  const wishlistCount = wishlistItems.length;

  // Get transaction status info for track order
  const getTransactionStatusInfo = () => {
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    const completedCount = transactions.filter(t => t.status === 'completed').length;
    
    if (pendingCount > 0) {
      return { count: pendingCount, status: 'pending', color: 'bg-yellow-500' };
    } else if (completedCount > 0) {
      return { count: completedCount, status: 'completed', color: 'bg-green-500' };
    }
    return null;
  };

  const trackOrderStatus = getTransactionStatusInfo();

  // Mark notifications as viewed when user visits the page
  useEffect(() => {
    if (currentPath === '/wishlist') {
      setViewedNotifications(prev => ({ ...prev, wishlist: true }));
    } else if (currentPath === '/track-order') {
      setViewedNotifications(prev => ({ ...prev, trackOrder: true }));
    } else if (currentPath === '/transaction') {
      setViewedNotifications(prev => ({ ...prev, transaction: true }));
    }
  }, [currentPath]);

  // Reset notifications when new data is added
  useEffect(() => {
    // Reset wishlist notification if wishlist is empty
    if (wishlistCount === 0) {
      setViewedNotifications(prev => ({ ...prev, wishlist: false }));
    }
    
    // Reset track order notification if no active transactions
    if (transactions.length === 0) {
      setViewedNotifications(prev => ({ ...prev, trackOrder: false, transaction: false }));
    }
  }, [wishlistCount, transactions.length]);

  // Show badge only if there are items AND user hasn't viewed the page yet
  const showWishlistBadge = wishlistCount > 0 && !viewedNotifications.wishlist;
  const showTrackOrderBadge = trackOrderStatus && !viewedNotifications.trackOrder;
  const showTransactionBadge = transactions.length > 0 && !viewedNotifications.transaction;

  return (
    <div className="flex flex-col gap-4 fixed bottom-0 right-0 left-0 bg-white mx-auto z-50" style={{ maxWidth: '440px', width: '100%' }}>
      <div className="shadow-box">
        <div className="flex justify-center items-center gap-8 h-14">
          <div className={`${getIconClass("/")} rounded-full p-2 cursor-pointer`} onClick={() => handleClick("/")}>
            <GoHome size={32} />
          </div>
          <div className={`${getIconClass("/wishlist")} rounded-full p-2 cursor-pointer relative`} onClick={() => handleClick("/wishlist")}>
            <GoHeart size={32} />
            {showWishlistBadge && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {wishlistCount}
              </div>
            )}
          </div>
          <div className={`${getIconClass("/track-order")} rounded-full p-2 cursor-pointer relative`} onClick={() => handleClick("/track-order")}>
            <HiOutlineTruck size={32} />
            {showTrackOrderBadge && (
              <div className={`absolute -top-1 -right-1 ${trackOrderStatus.color} text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold`}>
                {trackOrderStatus.count}
              </div>
            )}
          </div>
          <div className={`${getIconClass("/transaction")} rounded-full p-2 cursor-pointer relative`} onClick={() => handleClick("/transaction")}>
            <HiOutlineDocumentText size={32} />
            {showTransactionBadge && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {transactions.length}
              </div>
            )}
          </div>
          <div className={`${getIconClass("/profile")} rounded-full p-2 cursor-pointer`} onClick={() => handleClick("/profile")}>
            <VscAccount size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
