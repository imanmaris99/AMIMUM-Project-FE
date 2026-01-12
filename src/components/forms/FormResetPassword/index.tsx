"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import React from "react";
import { postResetPassword } from "@/services/api/reset-password";
import toast from "react-hot-toast";
import { Eye } from "@/app/(auth_layout)/register/Eye";
import { EyeOff } from "@/app/(auth_layout)/register/EyeOff";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

// Password validation schema sesuai kriteria API
const passwordSchema = z
  .string()
  .min(8, { message: "Password minimal 8 karakter" })
  .regex(/[A-Z]/, { message: "Password harus mengandung setidaknya satu huruf besar" })
  .regex(/[a-z]/, { message: "Password harus mengandung setidaknya satu huruf kecil" })
  .regex(/[0-9]/, { message: "Password harus mengandung setidaknya satu angka" })
  .regex(/[^A-Za-z0-9]/, { message: "Password harus mengandung setidaknya satu karakter spesial" });

const formSchema = z
  .object({
    email: z.string().email({ message: "Format email tidak valid" }),
    code: z.string().min(1, { message: "Kode verifikasi harus diisi" }),
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password tidak sama",
    path: ["confirm_password"],
  });

const FormResetPassword = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { login: handleGoogleLogin, isLoading: isGoogleLoading } = useGoogleLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await postResetPassword({
        email: values.email.trim().toLowerCase(),
        code: values.code.trim(),
        new_password: values.new_password,
      });

      if (response.status_code === 200) {
        setIsSuccess(true);
        toast.success(response.message || "Password berhasil direset. Silakan login dengan password baru.");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal reset password. Silakan coba lagi.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message if request was successful
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-[#00764F] text-[38px] font-bold">Password Berhasil Direset!</h1>
        </div>

        <Card className="bg-green-50 border-green-200 rounded-[5px]">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Reset Password Berhasil</h3>
            <p className="text-green-700 text-sm">
              Password Anda telah berhasil direset. Silakan login dengan password baru Anda.
            </p>
            <p className="text-green-600 text-xs mt-3">
              Anda akan diarahkan ke halaman login dalam beberapa detik...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Judul Reset Password */}
      <div className="text-center">
        <h1 className="text-[#00764F] text-[38px] font-bold">Reset Password</h1>
      </div>

      {/* Card informasi */}
      <Card className="bg-white bg-opacity-25 rounded-[5px] border-none">
        <CardContent className="p-5">
          <p className="text-[#828282] text-center text-sm leading-tight mb-3">
            Masukkan email, kode verifikasi dari email, dan password baru Anda.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-xs font-medium mb-1">Kriteria Password:</p>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• Minimal 8 karakter</li>
              <li>• Harus mengandung huruf besar</li>
              <li>• Harus mengandung huruf kecil</li>
              <li>• Harus mengandung angka</li>
              <li>• Harus mengandung karakter spesial</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 ">
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mb-5">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email yang telah terdaftar"
                        className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1"
                        aria-label="Email"
                        {...field}
                      />
                      <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code Field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mb-5">
                      <input
                        id="code"
                        type="text"
                        placeholder="Kode Verifikasi dari Email"
                        className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1"
                        aria-label="Verification Code"
                        {...field}
                      />
                      <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mb-5">
                      <input
                        id="new_password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Password Baru"
                        className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 pr-10"
                        aria-label="New Password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 p-0 bg-transparent border-none cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5 text-gray-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mb-5">
                      <input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Konfirmasi Password Baru"
                        className="w-full bg-transparent border-none outline-none text-slate-600 text-sm py-3 pb-1 pr-10"
                        aria-label="Confirm New Password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 p-0 bg-transparent border-none cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <Eye className="w-5 h-5 text-gray-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="w-full h-px bg-gray-300 absolute bottom-0 left-0"></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-[#00764F] hover:bg-[#00764F]/90 text-white rounded-[4px] font-normal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    className="mr-2 align-middle inline-block"
                    size={20}
                    label="Mereset password..."
                  />
                  <span>Mereset password...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4 mt-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-slate-500 text-sm">atau Log In menggunakan</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
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

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Belum memiliki akun?{" "}
          <span
            className="text-primary font-medium ml-1 cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Buat akun
          </span>
        </p>
      </div>
    </div>
  );
};

export default FormResetPassword;
