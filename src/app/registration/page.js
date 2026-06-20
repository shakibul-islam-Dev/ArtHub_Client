"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Join Art Hub
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="mt-1 block w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Required",
                  minLength: 6,
                })}
                className="mt-1 block w-full border border-slate-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="mt-1 block w-full border border-slate-300 rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Register As:
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-slate-600">User</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="artist"
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-slate-600">Artist</span>
              </label>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Plan:
            </label>
            <div className="flex justify-between gap-2">
              <label className="flex items-center cursor-pointer flex-1 bg-white p-2 rounded border border-slate-200 hover:bg-slate-100 transition">
                <input
                  type="radio"
                  {...register("plan")}
                  value="free"
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-xs font-medium text-slate-600">
                  Free
                </span>
              </label>
              <label className="flex items-center cursor-pointer flex-1 bg-white p-2 rounded border border-slate-200 hover:bg-slate-100 transition">
                <input
                  type="radio"
                  {...register("plan")}
                  value="pro"
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-xs font-medium text-slate-600">
                  Pro
                </span>
              </label>
              <label className="flex items-center cursor-pointer flex-1 bg-white p-2 rounded border border-slate-200 hover:bg-slate-100 transition">
                <input
                  type="radio"
                  {...register("plan")}
                  value="plus"
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-xs font-medium text-slate-600">
                  Plus
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-3 text-xs text-slate-400 uppercase">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-slate-300 py-2.5 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
