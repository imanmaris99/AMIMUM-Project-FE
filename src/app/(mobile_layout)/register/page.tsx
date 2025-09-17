"use client";

import React, { useState } from "react";
import { Eye } from "./Eye";
import { EyeOff } from "./EyeOff";
import { HeaderRegister } from "@/components";

const Register = () => {
  const [formData, setFormData] = useState({
    namaDepan: "",
    namaBelakang: "",
    jenisKelamin: "",
    email: "raziul.cse@gmail.com",
    nomorHp: "",
    password: "",
    cekPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  return (
    <div className="bg-[#e6f1ed] h-screen overflow-hidden">
      <HeaderRegister />
      <div className="mx-auto max-w-[440px] min-w-[360px] bg-[#e6f1ed] h-screen relative flex flex-col">
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-primary text-center mb-8">
              Registrasi
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama Depan */}
              <div className="relative">
                <input
                  type="text"
                  value={formData.namaDepan}
                  onChange={(e) => handleInputChange("namaDepan", e.target.value)}
                  placeholder="Nama Depan"
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-4 pb-1"
                  aria-label="First Name"
                />
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Nama Belakang */}
              <div className="relative">
                <input
                  type="text"
                  value={formData.namaBelakang}
                  onChange={(e) => handleInputChange("namaBelakang", e.target.value)}
                  placeholder="Nama Belakang"
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-4 pb-1"
                  aria-label="Last Name"
                />
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Jenis Kelamin */}
              <div className="relative">
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => handleInputChange("jenisKelamin", e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm appearance-none py-4 pb-1"
                  aria-label="Gender"
                >
                  <option value="" disabled>
                    Jenis Kelamin
                  </option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[#000113] text-sm py-4 pb-1"
                  aria-label="Email"
                />
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Nomor HP */}
              <div className="relative">
                <input
                  type="tel"
                  value={formData.nomorHp}
                  onChange={(e) => handleInputChange("nomorHp", e.target.value)}
                  placeholder="Nomor Hp"
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-4 pb-1"
                  aria-label="Phone Number"
                />
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm pr-10 py-4 pb-1"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-0 p-0 bg-transparent border-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Konfirmasi Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.cekPassword}
                  onChange={(e) => handleInputChange("cekPassword", e.target.value)}
                  placeholder="Cek Password"
                  className="w-full bg-transparent border-none outline-none text-slate-600 text-sm pr-10 py-4 pb-1"
                  aria-label="Confirm Password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-0 top-0 p-0 bg-transparent border-none cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition-colors mt-6"
              >
                Submit
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Sudah memiliki akun? 
                  <span className="text-primary font-medium ml-1 cursor-pointer hover:underline">
                    Log in disini
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Register;
