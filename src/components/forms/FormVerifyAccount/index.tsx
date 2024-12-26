"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { postVerifyAccount } from "@/API/verify-account";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  code: z.string(),
});

const FormVerifyAccount = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await postVerifyAccount(values, () => {
      router.push("/login");
    });
  };

  return (
    <div>
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-center text-[32px] font-bold text-primary">Verifikasi Akun</CardTitle>
          <Card>
            <CardContent className="p-5 text-gray-500">
              <h3 className="text-center text-lg font-bold">Melakukan Verifikasi Akun, dengan melengkapi dua isian dibawah :</h3>
              <ul className="list-disc list-outside pt-2 px-5 text-sm text-wrap text-justify space-y-2">
                <li>Email yang sudah didaftarkan</li>
                <li>Kode verifikasi yang sudah terkirim ke email terdaftar</li>
              </ul>
            </CardContent>
          </Card>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email" className="hidden">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="Email yang telah terdaftar" type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="code" className="hidden">
                        Kode Verifikasi
                      </FormLabel>
                      <FormControl>
                        <Input id="code" placeholder="Kode verifikasi dari email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full my-5">
                  Kirim Permintaan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormVerifyAccount;
