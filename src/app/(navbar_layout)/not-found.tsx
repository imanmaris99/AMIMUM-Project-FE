"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to homepage after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-400">404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak ditemukan. 
          Anda akan diarahkan ke halaman utama dalam beberapa detik.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="bg-[#006A47] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#005A3C] transition-colors"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={handleGoBack}
            className="bg-white text-[#006A47] border border-[#006A47] px-6 py-3 rounded-lg font-medium hover:bg-[#E6F2F0] transition-colors"
          >
            Kembali Sebelumnya
          </button>
        </div>

        {/* Auto Redirect Info */}
        <p className="text-sm text-gray-500 mt-6">
          Otomatis kembali ke beranda dalam 3 detik...
        </p>

        {/* Logo/Brand */}
        <div className="mt-8 flex items-center justify-center">
          <Image
            src="/logo_toko.svg"
            alt="Amimum Logo"
            width={120}
            height={40}
            className="opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
