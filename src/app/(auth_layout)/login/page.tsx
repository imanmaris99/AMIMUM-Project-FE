"use client";

import React, { useState } from "react";
import { HeaderLogin } from "@/components";
import { Eye } from "../register/Eye";
import { EyeOff } from "../register/EyeOff";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "raziul.cse@gmail.com",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", formData);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };


  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mx-auto max-w-[440px] min-w-[360px] h-screen relative flex flex-col overflow-hidden">
      <HeaderLogin />
      <div className="px-6 py-4 h-full flex flex-col relative z-10">
        <div className="w-full max-w-sm mx-auto mt-20">
          <h1 className="text-3xl font-bold text-primary text-center mb-6">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1"
                aria-label="Email"
                required
              />
              <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex items-center justify-between">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 pr-20"
                  aria-label="Password"
                  required
                />
                <div className="flex items-center gap-2 absolute right-0 top-1/2 transform -translate-y-1/2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    Lupa Password?
                  </button>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition-colors mt-4"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4 mt-10">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-slate-500 text-sm">atau Log In menggunakan</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors mb-4"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              Log In dengan Google
            </div>
          </button>

          {/* Create Account Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum memiliki akun? 
              <span 
                className="text-primary font-medium ml-1 cursor-pointer hover:underline"
                onClick={() => router.push("/register")}
              >
                Buat akun
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Logo brand di bagian bawah */}
      <div className="absolute bottom-0 right-0 w-[220px] h-[242px] transform rotate-[20deg] opacity-25 z-0">
        <div className="relative w-full h-full">
          <div className="absolute top-[49px] left-[1.75px] w-[200px] h-[200px] bg-[#B0D5C7] bg-opacity-25 rounded-full"></div>
          <div className="relative z-10 w-[175px] h-[200px] mx-auto mt-[-4px]">
            <Image
              src="/logo_toko.svg"
              alt="Logo Toko"
              width={175}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;