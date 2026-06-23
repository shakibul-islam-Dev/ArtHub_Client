"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      plan: "free",
    },
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.username,
        additionalFields: {
          role: formData.role,
          plan: formData.plan,
        },
        callbackURL: "/",
      });

      if (error) {
        alert(error.message || "Registration failed");
      } else {
        alert("Registration successful!");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Registration error:", err);
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
      <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800/80 transition-all duration-300">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900/30">
            <UserPlus size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Join Art Hub and start sharing masterpieces
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-700 transition-all duration-200 shadow-sm active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="px-3 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">
            Or register with email
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="mt-1.5 block w-full bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 outline-none transition-all duration-200"
              placeholder="johndoe"
            />
            {errors.username && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1.5 block w-full bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 outline-none transition-all duration-200"
              placeholder="name@example.com"
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className="mt-1.5 block w-full bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 pr-10 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 outline-none transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="mt-1.5 block w-full bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 pr-10 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 outline-none transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Role Selection (Modern Segmented UI) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-950/60 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
              <label className="flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all select-none has-[:checked]:bg-white dark:has-[:checked]:bg-gray-900 has-[:checked]:shadow-sm has-[:checked]:text-blue-600 dark:has-[:checked]:text-blue-400 text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="sr-only"
                />
                <span className="text-sm font-semibold">Regular User</span>
              </label>
              <label className="flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all select-none has-[:checked]:bg-white dark:has-[:checked]:bg-gray-900 has-[:checked]:shadow-sm has-[:checked]:text-blue-600 dark:has-[:checked]:text-blue-400 text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  {...register("role")}
                  value="artist"
                  className="sr-only"
                />
                <span className="text-sm font-semibold">Artist Creator</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition shadow-md hover:shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
