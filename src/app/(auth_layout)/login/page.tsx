"use client";

import React, { useState, useEffect } from "react";
import { HeaderLogin } from "@/components";
import { Eye } from "../register/Eye";
import { EyeOff } from "../register/EyeOff";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SessionManager, generateSecureToken, validateEmail } from "@/lib/auth";
import { RateLimiter, validatePassword, sanitizeUserInput } from "@/lib/security";
import { toast } from "react-hot-toast";
import { postLogin } from "@/services/api/login";
import { handleGoogleLogin as handleGoogleAuth } from "@/lib/googleAuth";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { API_ENDPOINTS } from "@/lib/apiConfig";
import { getTokenExpiry, parseLoginResult, UserProfileResponseShape } from "@/lib/loginParser";

type LoginFlowError = Error & {
  isAccountInactive?: boolean;
  statusCode?: number;
};

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLocked, setIsLocked] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isAccountInactive, setIsAccountInactive] = useState(false);
  const [inactiveEmail, setInactiveEmail] = useState<string>("");

  useEffect(() => {
    if (SessionManager.isAuthenticated()) {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    }
  }, [router, isSuccess]);

  useEffect(() => {
    const clientId = localStorage.getItem('client_id') || generateSecureToken();
    localStorage.setItem('client_id', clientId);
    
    const checkLockStatus = () => {
      const remaining = RateLimiter.getRemainingTime(clientId);
      const isCurrentlyLocked = !RateLimiter.checkLimit(clientId);
      
      setIsLocked(isCurrentlyLocked);
      setRemainingTime(remaining);
    };

    checkLockStatus();
    const interval = setInterval(checkLockStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Sanitize inputs
    const sanitizedEmail = sanitizeUserInput(formData.email);
    const sanitizedPassword = sanitizeUserInput(formData.password);

    // Validasi email dengan enhanced security
    if (!sanitizedEmail.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!validateEmail(sanitizedEmail)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validasi password dengan enhanced security
    if (!sanitizedPassword) {
      newErrors.password = "Password harus diisi";
    } else {
      const passwordValidation = validatePassword(sanitizedPassword);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error('Akun terkunci karena terlalu banyak percobaan login.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      const clientId = localStorage.getItem('client_id') || generateSecureToken();
      localStorage.setItem('client_id', clientId);
      
      if (!RateLimiter.checkLimit(clientId)) {
        setIsLocked(true);
        const remaining = RateLimiter.getRemainingTime(clientId);
        const minutes = Math.ceil(remaining / 60000);
        toast.error(`Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.`);
        setIsSubmitting(false);
        return;
      }
      
      const sanitizedEmail = sanitizeUserInput(formData.email).toLowerCase();
      const sanitizedPassword = sanitizeUserInput(formData.password);
      
      const response = await postLogin({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      
      if (response.status_code === 200) {
        const { user: parsedUser, backendToken } = parseLoginResult(response, sanitizedEmail);

        const user = {
          id: generateSecureToken(),
          email: parsedUser.email,
          name: parsedUser.name,
          firstname: parsedUser.firstname,
          role: parsedUser.role,
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        
        const token = {
          token: backendToken || generateSecureToken(),
          expiresAt: backendToken ? getTokenExpiry(backendToken) : new Date(Date.now() + 24 * 60 * 60 * 1000),
          refreshToken: generateSecureToken(),
        };
        
        SessionManager.setSession(user, token);

        if (backendToken) {
          try {
            const profileResponse = await axiosInstance.get<UserProfileResponseShape>(
              API_ENDPOINTS.USER_PROFILE,
              {
                headers: {
                  Authorization: `Bearer ${backendToken}`,
                },
              }
            );
            const profile = profileResponse?.data?.data;
            const profileFirstname = profile?.firstname?.trim() || profile?.first_name?.trim();
            const profileLastname = profile?.lastname?.trim() || profile?.last_name?.trim();
            const profileEmail = profile?.email?.trim() || user.email;
            const profileName = `${profileFirstname ?? ''} ${profileLastname ?? ''}`.trim() || user.name;

            SessionManager.setSession(
              {
                ...user,
                email: profileEmail,
                name: profileName,
                firstname: profileFirstname || user.firstname,
                role: profile?.role === 'admin' ? ('admin' as const) : user.role,
              },
              token
            );
          } catch {
            // Keep login successful even when profile sync fails.
          }
        }

        RateLimiter.resetLimit(clientId);
        
        setIsSuccess(true);
        toast.success(response.message || 'Login berhasil! Mengarahkan ke halaman utama...');
        
        setTimeout(() => {
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(redirectUrl);
          } else {
            router.push("/");
          }
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.";
      const typedError = error as LoginFlowError;
      
      let isInactiveError = false;
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 403) {
          isInactiveError = true;
        }
      }
      
      if (!isInactiveError) {
        const errorLower = errorMessage.toLowerCase();
        isInactiveError = typedError?.isAccountInactive === true || 
                          typedError?.statusCode === 403 ||
                          errorLower.includes("tidak aktif") || 
                          errorLower.includes("not active") ||
                          errorLower.includes("belum terverifikasi") ||
                          errorLower.includes("not verified") ||
                          errorLower.includes("account is not active") ||
                          errorLower.includes("akun anda tidak aktif") ||
                          errorLower.includes("your account is not active") ||
                          errorLower.includes("please contact support") ||
                          errorLower.includes("akun anda") && errorLower.includes("aktif") ||
                          errorLower.includes("account") && errorLower.includes("active");
      }
      
      if (isInactiveError) {
        setIsAccountInactive(true);
        setInactiveEmail(formData.email.trim().toLowerCase());
        setApiError("");
        setErrors({});
        toast.error("Akun belum terverifikasi. Silakan cek email Anda untuk kode verifikasi.");
      } else {
        const clientId = localStorage.getItem('client_id') || generateSecureToken();
        const isStillAllowed = RateLimiter.incrementAttempt(clientId);
        
        if (!isStillAllowed) {
          setIsLocked(true);
          const remaining = RateLimiter.getRemainingTime(clientId);
          const minutes = Math.ceil(remaining / 60000);
          const rateLimitMessage = `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.`;
          setApiError(rateLimitMessage);
          setErrors({ general: rateLimitMessage });
          toast.error(rateLimitMessage);
        } else {
          setApiError(errorMessage);
          setErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };


  const handleGoogleLoginClick = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);
    setApiError(null);

    try {
      const result = await handleGoogleAuth();

      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message || "Login dengan Google berhasil! Mengarahkan ke halaman utama...");

        setTimeout(() => {
          if (SessionManager.isAuthenticated()) {
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
              sessionStorage.removeItem('redirectAfterLogin');
              router.push(redirectUrl);
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        setApiError(result.message || "Login dengan Google gagal. Silakan coba lagi.");
        toast.error(result.message || "Login dengan Google gagal. Silakan coba lagi.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login dengan Google gagal. Silakan coba lagi.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show success message if login was successful
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-[440px] min-w-[360px] h-screen relative flex flex-col overflow-hidden">
        <HeaderLogin />
        <div className="px-6 py-4 h-full flex flex-col relative z-10">
          <div className="w-full max-w-sm mx-auto mt-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary mb-6">Login Berhasil!</h1>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Selamat Datang!</h3>
              <p className="text-green-700 text-sm mb-3">
                Anda telah berhasil login ke akun Anda. 
                Selamat berbelanja di AmImUm!
              </p>
              <p className="text-green-600 text-xs">
                Anda akan diarahkan ke halaman utama dalam beberapa detik...
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
  }

  return (
    <div className="mx-auto max-w-[440px] min-w-[360px] h-screen relative flex flex-col overflow-hidden">
      <HeaderLogin />
      <div className="px-6 py-4 h-full flex flex-col relative z-10">
        <div className="w-full max-w-sm mx-auto mt-20">
          <h1 className="text-3xl font-bold text-primary text-center mb-6">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            {isLocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm font-semibold mb-1">
                  Akun terkunci karena terlalu banyak percobaan login
                </p>
                {remainingTime > 0 && (
                  <p className="text-red-500 text-xs">
                    Coba lagi dalam {Math.ceil(remainingTime / 60000)} menit {Math.ceil((remainingTime % 60000) / 1000)} detik
                  </p>
                )}
              </div>
            )}

            {isAccountInactive && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800 text-sm font-semibold mb-2">
                  Akun Anda belum terverifikasi
                </p>
                <p className="text-yellow-700 text-xs mb-3">
                  Silakan cek email Anda untuk kode verifikasi. Jika tidak menerima email, klik tombol di bawah untuk verifikasi akun.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (inactiveEmail) {
                      sessionStorage.setItem('verifyEmail', inactiveEmail);
                    }
                    router.push("/verify-account");
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                >
                  Verifikasi Akun
                </button>
              </div>
            )}

            {errors.general && !isLocked && !isAccountInactive && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {apiError && !errors.general && !isLocked && !isAccountInactive && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

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
                required
              />
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.email ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex items-center justify-between">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Password"
                  className={`w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 pr-20 ${errors.password ? 'text-red-500' : ''}`}
                  aria-label="Password"
                  autoComplete="current-password"
                  name="password"
                  id="password"
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
              <div className={`w-full h-px absolute bottom-0 left-0 ${errors.password ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLocked}
              className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
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
            onClick={handleGoogleLoginClick}
            disabled={isGoogleLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              {isGoogleLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    G
                  </div>
                  Log In dengan Google
                </>
              )}
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