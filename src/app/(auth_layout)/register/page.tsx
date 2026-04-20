"use client";

import React, { useState } from "react";
import { Eye } from "./Eye";
import { EyeOff } from "./EyeOff";
import { HeaderRegister } from "@/components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { postRegister } from "@/services/api/register";
import toast from "react-hot-toast";
import { AUTH_FLOW_STORAGE_KEYS, saveAuthFlowEmail } from "@/lib/authFlow";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaDepan: "",
    namaBelakang: "",
    jenisKelamin: "",
    email: "",
    nomorHp: "",
    password: "",
    cekPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validasi nama depan
    if (!formData.namaDepan.trim()) {
      newErrors.namaDepan = "Nama depan harus diisi";
    }

    // Validasi nama belakang
    if (!formData.namaBelakang.trim()) {
      newErrors.namaBelakang = "Nama belakang harus diisi";
    }

    // Validasi jenis kelamin
    if (!formData.jenisKelamin) {
      newErrors.jenisKelamin = "Jenis kelamin harus dipilih";
    }

    // Validasi email
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validasi nomor HP
    if (!formData.nomorHp.trim()) {
      newErrors.nomorHp = "Nomor HP harus diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.nomorHp)) {
      newErrors.nomorHp = "Format nomor HP tidak valid";
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Validasi konfirmasi password
    if (!formData.cekPassword) {
      newErrors.cekPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.cekPassword) {
      newErrors.cekPassword = "Password tidak sama";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Map gender dari "laki-laki"/"perempuan" ke "male"/"female"
      const genderMap: { [key: string]: "male" | "female" } = {
        "laki-laki": "male",
        "perempuan": "female",
      };

      const registerData = {
        firstname: formData.namaDepan.trim(),
        lastname: formData.namaBelakang.trim(),
        gender: genderMap[formData.jenisKelamin] || "male",
        email: formData.email.trim(),
        phone: formData.nomorHp.trim(),
        password: formData.password,
      };

      const response = await postRegister(registerData);
      
      if (response.status_code === 201) {
        setIsSuccess(true);
        toast.success(response.message || "Registrasi berhasil!");
        saveAuthFlowEmail(
          AUTH_FLOW_STORAGE_KEYS.verifyEmail,
          registerData.email
        );
        
        setTimeout(() => {
          router.push(
            `/verify-account?email=${encodeURIComponent(registerData.email)}`
          );
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal mendaftar. Silakan coba lagi.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Show success message if registration was successful
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-[440px] min-w-[360px] h-screen relative flex flex-col overflow-hidden">
        <HeaderRegister />
        <div className="px-6 py-4 h-full flex flex-col relative z-10">
          <div className="w-full max-w-sm mx-auto mt-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-6">Registrasi Berhasil!</h1>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Akun Berhasil Dibuat</h3>
              <p className="text-green-700 text-sm mb-3">
                Selamat! Akun Anda telah berhasil dibuat. 
                Silakan verifikasi akun Anda untuk melanjutkan.
              </p>
              <p className="text-green-600 text-xs">
                Anda akan diarahkan ke halaman verifikasi dalam beberapa detik...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[440px] min-w-[360px] h-screen relative flex flex-col overflow-hidden">
      <HeaderRegister />
      <div className="px-6 py-4 h-full flex flex-col relative z-10">
        <div className="w-full max-w-sm mx-auto mt-20">
          <h1 className="text-3xl font-bold text-primary text-center mb-6">
            Registrasi
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Depan */}
            <div className="relative">
              <input
                type="text"
                value={formData.namaDepan}
                onChange={(e) => handleInputChange("namaDepan", e.target.value)}
                placeholder="Nama Depan"
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 ${errors.namaDepan ? 'text-red-500' : ''}`}
                aria-label="First Name"
                autoComplete="given-name"
                name="firstname"
              />
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.namaDepan ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.namaDepan && (
                <p className="text-red-500 text-xs mt-1">{errors.namaDepan}</p>
              )}
            </div>

            {/* Nama Belakang */}
            <div className="relative">
              <input
                type="text"
                value={formData.namaBelakang}
                onChange={(e) => handleInputChange("namaBelakang", e.target.value)}
                placeholder="Nama Belakang"
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 ${errors.namaBelakang ? 'text-red-500' : ''}`}
                aria-label="Last Name"
                autoComplete="family-name"
                name="lastname"
              />
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.namaBelakang ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.namaBelakang && (
                <p className="text-red-500 text-xs mt-1">{errors.namaBelakang}</p>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div className="relative">
              <select
                value={formData.jenisKelamin}
                onChange={(e) => handleInputChange("jenisKelamin", e.target.value)}
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm appearance-none py-3 pb-1 ${errors.jenisKelamin ? 'text-red-500' : ''}`}
                aria-label="Gender"
                autoComplete="sex"
                name="gender"
              >
                <option value="" disabled>
                  Jenis Kelamin
                </option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.jenisKelamin ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.jenisKelamin && (
                <p className="text-red-500 text-xs mt-1">{errors.jenisKelamin}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 ${errors.email ? 'text-red-500' : ''}`}
                aria-label="Email"
                autoComplete="email"
                name="email"
              />
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.email ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Nomor HP */}
            <div className="relative">
              <input
                type="tel"
                value={formData.nomorHp}
                onChange={(e) => handleInputChange("nomorHp", e.target.value)}
                placeholder="Nomor Hp"
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 ${errors.nomorHp ? 'text-red-500' : ''}`}
                aria-label="Phone Number"
                autoComplete="tel"
                name="phone"
              />
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.nomorHp ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.nomorHp && (
                <p className="text-red-500 text-xs mt-1">{errors.nomorHp}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Password"
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm pr-10 py-3 pb-1 ${errors.password ? 'text-red-500' : ''}`}
                aria-label="Password"
                autoComplete="new-password"
                name="password"
                id="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-0 p-0 bg-transparent border-none cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.password ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.cekPassword}
                onChange={(e) => handleInputChange("cekPassword", e.target.value)}
                placeholder="Cek Password"
                className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm pr-10 py-3 pb-1 ${errors.cekPassword ? 'text-red-500' : ''}`}
                aria-label="Confirm Password"
                autoComplete="new-password"
                name="confirmPassword"
                id="confirmPassword"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-0 top-0 p-0 bg-transparent border-none cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.cekPassword ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.cekPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.cekPassword}</p>
              )}
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                "Submit"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Sudah memiliki akun? 
                <span 
                  className="text-primary font-medium ml-1 cursor-pointer hover:underline"
                  onClick={() => router.push("/login")}
                >
                  Log in disini
                </span>
              </p>
            </div>
          </form>
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

export default Register;
