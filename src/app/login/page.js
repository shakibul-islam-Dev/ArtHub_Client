"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      });

      if (error) {
        console.error("Login Error:", error);
        alert(error.message || "Login failed");
      } else {
        alert("Login successful!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl border-gray-100 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-2 flex flex-col items-center text-center pb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
            <LogIn size={22} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
            Welcome Back To Art Hub! Please enter your details to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Google Sign In Button */}
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-3 h-11 border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl font-medium text-gray-700 dark:text-gray-200 transition-all active:scale-[0.98]"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.945 11.945 0 0 0 12 0C7.355 0 3.303 2.502 1.097 6.223l4.169 3.542z"
              />
              <path
                fill="#4285F4"
                d="M24 12.24c0-.851-.076-1.669-.218-2.455H12v4.647h6.731a5.752 5.752 0 0 1-2.491 3.773l3.91 3.037C22.433 19.106 24 15.918 24 12.24z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235L1.097 17.777A11.947 11.947 0 0 0 12 24c3.218 0 5.924-1.058 7.898-2.896l-3.91-3.037a7.124 7.124 0 0 1-4.01 1.13c-3.1 0-5.74-2.112-6.712-4.962z"
              />
              <path
                fill="#34A853"
                d="M1.097 6.223A11.83 11.83 0 0 0 0 12c0 2.072.534 4.02 1.47 5.727l4.17-3.542a7.126 7.126 0 0 1-.374-2.185c0-1.802.483-3.493 1.327-4.962L1.097 6.223z"
              />
            </svg>
            Sign in with Google
          </Button>

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            <span className="px-3 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">
              Or credentials login
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <Input
                {...register("email", { required: "Email is required" })}
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`h-11 rounded-xl bg-gray-50/50 dark:bg-gray-950/50 focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:focus-visible:ring-blue-500/5 ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500/10"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-11 rounded-xl bg-gray-50/50 dark:bg-gray-950/50 pr-10 focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:focus-visible:ring-blue-500/5 ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500/10"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Login Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50 mt-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pt-2 pb-6 flex justify-center border-t border-gray-100 dark:border-gray-800/60 mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/registration"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-0.5"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
