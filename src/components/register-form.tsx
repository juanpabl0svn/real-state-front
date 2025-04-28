"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerUser, verifyOtp } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  userSchema,
  OtpFormSchema,
  UserFormSchema,
  otpSchema,
} from "@/lib/zod";
import { useAppStore } from "@/stores/app-store";
import { toast } from "react-hot-toast";
import usePhone from "@/hooks/use-phone";

export function RegisterForm() {
  const router = useRouter();
  const [seeOtp, setSeeOtp] = useState(false);
  const { isLoading, setIsLoading, setData, data } = useAppStore();

  const formOtp = useForm<OtpFormSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  usePhone();

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  async function onSubmit(values: UserFormSchema) {
    setIsLoading(true);
    try {
      const user = await registerUser(values);
      if (user.error) throw new Error("User with this email already exists.");

      toast.success(
        "Registered successfully! Please check your email for the OTP."
      );

      setSeeOtp(true);
      setData({
        email: values.email,
        id: user.user_id,
      });
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitOtp(values: OtpFormSchema) {
    setIsLoading(true);
    try {
      const otp = await verifyOtp(data?.id!, values.otp);

      if (otp.error) throw new Error(otp.message);

      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const signInWithGoogle = async () => await signIn("google");

  return seeOtp ? (
    <Card className="w-full">
      <CardHeader>
        <Button
          variant="ghost"
          onClick={() => setSeeOtp(false)}
          className="w-16"
        >
          <span className="mr-2 text-gray">← Back</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Verify your email number</h2>
          <p className="text-muted-foreground">
            We have sent a verification code to your email{" "}
            <span className="text-gray-400">{data?.email}</span> . Please enter
            it below.
          </p>
          <Form {...formOtp}>
            <form
              onSubmit={formOtp.handleSubmit((data) => onSubmitOtp(data))}
              className="space-y-6"
            >
              <FormField
                control={formOtp.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="w-full">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      aria-label="phone"
                      placeholder="3001231234"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  O continuar con
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={signInWithGoogle}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Iniciar sesión con Google
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
