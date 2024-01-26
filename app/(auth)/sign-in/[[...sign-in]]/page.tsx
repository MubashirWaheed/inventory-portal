"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useSession, useSignIn } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled" })
    .email("This is not a valid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };
  // values: z.infer<typeof formSchema>
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;

    const { email, password } = values;

    try {
      const result = await signIn?.create({
        identifier: email,
        password,
      });

      if (result?.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      setErrorMessage("Wrong credentials");
      console.error("error", err.errors[0].longMessage);
    }
  };

  return (
    <div className="flex items-center justify-center mt-[70px]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login to the portal</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        onFocus={clearErrorMessage}
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        onFocus={clearErrorMessage}
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <div className="mt-0">
                  <FormMessage className="mt-0 pt-0">
                    {errorMessage}
                  </FormMessage>
                </div>
              )}
              <div className="flex justify-center ">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
