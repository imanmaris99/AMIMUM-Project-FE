"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { postRegister } from "@/services/api/register";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import React from "react";

const formSchema = z
  .object({
    firstname: z.string().min(2, { message: "Nama depan minimal 2 karakter" }),
    lastname: z.string().min(2, { message: "Nama belakang minimal 2 karakter" }),
    gender: z.enum(["male", "female"], { message: "Pilih jenis kelamin" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    phone: z.string().min(13, { message: "Nomor HP minimal 10 digit" }).max(14,{ message: "Nomor HP maksimal 11 digit" }),
    password: z
      .string()
      .min(6, { message: "Password minimal 6 karakter" })
      .regex(/[a-zA-Z0-9]/, { message: "Password harus berisi huruf atau angka" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });

const RegisterForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      gender: undefined,
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      await postRegister(registerData);
      toast.success("Silakan verifikasi akun melalui email Anda.")
      setTimeout(() => {
        router.push("/verify-account");
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data?.detail;
        toast.error(apiError?.message || "Gagal mendaftar. Silakan coba lagi.");
      } else {
        toast.error("Terjadi kendala saat mendaftar. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-7">
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-center text-[32px] font-bold text-primary">Daftar Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="fullname" className="hidden">
                        Nama depan
                      </FormLabel>
                      <FormControl>
                        <Input id="firstname" placeholder="Nama Depan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="lastname" className="hidden">
                        Nama belakang
                      </FormLabel>
                      <FormControl>
                        <Input id="lastname" placeholder="Nama Belakang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="gender" className="hidden">
                        Jenis kelamin
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Jenis Kelamin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Laki-Laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email" className="hidden">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="Email" type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone" className="hidden">
                        Nomor HP
                      </FormLabel>
                      <FormControl>
                        <PhoneInput {...field} defaultCountry="ID" placeholder="Nomor HP" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password" className="hidden">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput id="password" placeholder="Password minimal 6 karakter" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="hidden">Konfirmasi password</FormLabel>
                      <FormControl>
                        <PasswordInput id="confirmPassword" placeholder="Konfirmasi password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <Button type="submit" className="w-full my-5" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 align-middle inline-block" size={20} label="Mendaftar..." />
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  "Daftar Akun"
                )}
              </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="underline font-bold">
              Masuk sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;