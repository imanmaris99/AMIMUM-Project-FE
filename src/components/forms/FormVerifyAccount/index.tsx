"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { postVerifyAccount } from "@/services/api/verify-account";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import React from "react";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

const formSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  code: z.string().min(1, { message: "Kode verifikasi harus diisi" }),
});

const FormVerifyAccount = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { login: handleGoogleLogin, isLoading: isGoogleLoading } = useGoogleLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    await postVerifyAccount(values, () => {
      router.push("/login");
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Judul Verifikasi Akun */}
      <div className="text-center">
        <h1 className="text-[#00764F] text-[38px] font-bold">Verifikasi Akun</h1>
      </div>

      {/* Card informasi */}
      <Card className="bg-white bg-opacity-25 rounded-[5px] border-none">
        <CardContent className="p-5">
          <div className="space-y-1">
            <p className="text-[#828282] text-center text-sm leading-tight">
              Melakukan Verifikasi Akun, dengan melengkapi dua isian dibawah :
            </p>
            <div className="pt-2 space-y-1">
              <p className="text-[#828282] text-sm">• Email yang sudah didaftarkan</p>
              <p className="text-[#828282] text-sm">• Kode verifikasi yang sudah terkirim ke email terdaftar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
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
                    <div className="relative">
                      <input
                        id="code"
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

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 bg-[#00764F] hover:bg-[#00764F]/90 text-white rounded-[4px] font-normal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 align-middle inline-block" size={20} label="Memverifikasi..." />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                "Kirim Permintaan"
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
    </div>
  );
};

export default FormVerifyAccount;