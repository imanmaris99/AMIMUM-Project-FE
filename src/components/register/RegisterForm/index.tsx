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
import { postRegister } from "@/API/register";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    firstname: z.string().min(2, { message: "First Name must be at least 2 characters long" }),
    lastname: z.string().min(2, { message: "Last Name must be at least 2 characters long" }),
    gender: z.enum(["male", "female"], { message: "Choose gender male or female" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(13, { message: "Phone number must be 10 digits" }).max(14,{ message: "Phone number must be 11 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const RegisterForm = () => {
  const router = useRouter();

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
    try {
      console.log(values);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      await postRegister(registerData);
      // const successMessage = response?.message
      toast.success("Silahkan Verifikasi Akun")
      setTimeout(() => {
        router.push("/verify-account");
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data?.detail;
        toast.error(apiError?.message || "An error occurred. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-7">
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-center text-[32px] font-bold text-primary">Register</CardTitle>
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
                        First Name
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
                        Last Name
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
                        Gender
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
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneInput {...field} defaultCountry="ID" placeholder="Nomor Telpon" />
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
                        <PasswordInput id="password" placeholder="Password" autoComplete="new-password" {...field} />
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
                      <FormLabel className="hidden">Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput id="confirmPassword" placeholder="Cek Password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <Button type="submit" className="w-full my-5"> Submit</Button>
               <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                  success: {
                    duration: 5000,
                    style: {
                      background: 'rgb(134 239 172)',
                      color:'black',
                      opacity:"0.5"
                    },
                    iconTheme: {
                      primary: 'green',
                      secondary: 'white',
                    },
                  },
                  error:{
                    style: {
                      background: 'rgb(252 165 165)',
                      color:'black',
                      opacity:"0.5"
                    },
                    iconTheme: {
                      primary: 'red',
                      secondary: 'white',
                    },
                  }
                }}
                />
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-bold">
              Login Now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;