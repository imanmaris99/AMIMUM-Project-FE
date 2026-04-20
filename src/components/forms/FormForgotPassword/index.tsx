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
import { postForgotPassword } from "@/services/api/forgot-password";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { AUTH_FLOW_STORAGE_KEYS, saveAuthFlowEmail } from "@/lib/authFlow";

const formSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
});

const FormForgotPassword = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const { login: handleGoogleLogin, isLoading: isGoogleLoading } = useGoogleLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      const normalizedEmail = values.email.trim().toLowerCase();
      const response = await postForgotPassword({
        email: normalizedEmail,
      });
      
      if (response.status_code === 200) {
        setIsSuccess(true);
        toast.success(response.message || "Email reset password telah dikirim. Silakan cek email Anda.");
        saveAuthFlowEmail(
          AUTH_FLOW_STORAGE_KEYS.resetEmail,
          normalizedEmail
        );
        setTimeout(() => {
          router.push(
            `/reset-password?email=${encodeURIComponent(normalizedEmail)}`
          );
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal mengirim email reset password. Silakan coba lagi.";
      setApiError(errorMessage);
      form.setError("email", {
        type: "manual",
        message: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-[#00764F] text-[38px] font-bold">Email Terkirim!</h1>
        </div>
        
        <Card className="bg-green-50 border-green-200 rounded-[5px]">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Permintaan Berhasil Dikirim</h3>
            <p className="text-green-700 text-sm">
              Kami telah mengirimkan kode reset password ke email Anda.
              Silakan periksa inbox lalu lanjutkan ke form reset password.
            </p>
            <p className="text-green-600 text-xs mt-3">
              Anda akan diarahkan ke halaman reset password dalam beberapa detik...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-[#00764F] text-[38px] font-bold">Lupa Password</h1>
      </div>

      <Card className="bg-white bg-opacity-25 rounded-[5px] border-none">
        <CardContent className="p-5">
          <p className="text-[#828282] text-center text-sm leading-tight">
            Kirim permintaan ganti passwordmu melalui email yang sudah terdaftar disini !!
          </p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 mt-20">
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

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

            <Button 
              type="submit" 
              className="w-full h-10 bg-[#00764F] hover:bg-[#00764F]/90 text-white rounded-[4px] font-normal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 align-middle inline-block" size={20} label="Mengirim..." />
                  <span>Mengirim...</span>
                </>
              ) : (
                "Kirim Permintaan"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex items-center gap-4 my-4 mt-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-slate-500 text-sm">atau Log In menggunakan</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

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
  );
};

export default FormForgotPassword;
