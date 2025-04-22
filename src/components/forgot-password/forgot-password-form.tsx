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
import {
  registerUser,
  restorePassword,
  verifyOtp,
  verifyOtpPassword,
} from "@/lib/actions";

import { toast } from "react-hot-toast";

import { Card, CardContent, CardHeader } from "../ui/card";
import {
  OtpFormSchema,
  otpSchema,
  ForgotPasswordFormSchema,
  forgotPasswordSchema,
} from "@/lib/zod";
import { useAppStore } from "@/stores/app-store";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [seeOtp, setSeeOtp] = useState(false);
  const { isLoading, setIsLoading, setData, data } = useAppStore();

  const formOtp = useForm<OtpFormSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormSchema) {
    setIsLoading(true);
    try {
      const restorePasswordResult = await restorePassword(values.email);

      if (restorePasswordResult.error)
        throw new Error(restorePasswordResult.message);

      toast.success(
        "Password reset successfully!. Please check your email for the OTP."
      );

      setSeeOtp(true);

      setData({
        email: values.email,
        password: values.password,
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
      const otp = await verifyOtpPassword(
        data?.email,
        values.otp,
        data?.password
      );

      if (otp.error) throw new Error(otp.message);

      toast.success(
        "Email verified successfully!. You can now login with your new password."
      );
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Repeat your password to confirm it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending code..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
