"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
// import { postForgotPassword } from "@/API/forgot-password";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import React from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const FormForgotPassword = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Dummy email list untuk simulasi
  const dummyEmails = [
    "admin@amimum.com",
    "user@amimum.com", 
    "test@amimum.com",
    "demo@amimum.com"
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if email exists in dummy data
    const emailExists = dummyEmails.includes(values.email.toLowerCase());
    
    if (emailExists) {
      setIsSuccess(true);
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      // Show error for non-existent email
      form.setError("email", {
        type: "manual",
        message: "Email tidak terdaftar dalam sistem"
      });
    }
    
    setIsSubmitting(false);
  };

  // Show success message if request was successful
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
              Kami telah mengirimkan link reset password ke email Anda. 
              Silakan periksa inbox dan ikuti instruksi yang diberikan.
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
      {/* Judul Lupa Password */}
      <div className="text-center">
        <h1 className="text-[#00764F] text-[38px] font-bold">Lupa Password</h1>
      </div>

      {/* Card informasi */}
      <Card className="bg-white bg-opacity-25 rounded-[5px] border-none">
        <CardContent className="p-5">
          <p className="text-[#828282] text-center text-sm leading-tight mb-3">
            Kirim permintaan ganti passwordmu melalui email yang sudah terdaftar disini !!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-xs font-medium mb-1">Email untuk testing:</p>
            <p className="text-blue-700 text-xs">
              admin@amimum.com, user@amimum.com, test@amimum.com, demo@amimum.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 mt-20">
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

            {/* Submit Button */}
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

      {/* Divider */}
      <div className="flex items-center gap-4 my-4 mt-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-slate-500 text-sm">atau Log In menggunakan</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={() => console.log("Google login clicked")}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors mb-4"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            G
          </div>
          Log In dengan Google
        </div>
      </button>

      {/* Register Link */}
      <div className="bg-white bg-opacity-40 rounded-[10px] px-4 py-3">
        <p className="text-center text-sm text-[#475569]">
          Belum memiliki akun? <span 
            className="text-[#00764F] font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >Buat akun</span>
        </p>
      </div>
    </div>
  );
};

export default FormForgotPassword;
