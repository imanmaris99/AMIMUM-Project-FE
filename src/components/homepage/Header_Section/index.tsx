"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check if user is logged in (dummy implementation)
    // In real app, this would check localStorage, cookies, or API
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      const email = localStorage.getItem('userEmail');
      
      if (loginStatus === 'true' && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      }
    };

    checkLoginStatus();
    
    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail("");
    // Redirect to login page
    window.location.href = '/login';
  };

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
              {isLoggedIn ? (
                <div className="w-full mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600">Halo, {userEmail}</p>
                      <Button 
                        variant="outline" 
                        className="w-1/2 text-primary border-primary hover:bg-primary hover:text-white"
                        onClick={handleLogout}
                      >
                        Keluar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full mt-4">
                  <Link href="/login">
                    <Button variant="secondary" className="w-1/2 text-primary bg-customGreen4 hover:bg-primary hover:text-white">
                      Silahkan masuk
                    </Button>
                  </Link>
                </div>
              )}
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
