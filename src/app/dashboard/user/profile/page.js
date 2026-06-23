"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Phone, Camera, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

export default function ProfileUpdateForm() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  console.log("session", session);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // সেশন থেকে ডেটা আসলে ফর্মে অটো-ফিল করার জন্য
  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        password: "",
        confirmPassword: "",
      });

      // সেশনে আগে থেকে ইমেজ থাকলে সেটা প্রিভিউ হিসেবে দেখাবে
      if (session.user.image || session.user.profile_image) {
        setImagePreview(session.user.image || session.user.profile_image);
      }
    }
  }, [session, reset]);

  // ইমেজ চেঞ্জ হ্যান্ডেলার (উইথ মেমোরি ক্লিনআপ)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // পূর্বের লোকাল অবজেক্ট ইউআরএল থাকলে মেমোরি থেকে মুক্ত করা
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // কম্পোনেন্ট আনমাউন্ট হলে মেমোরি লিক রোধে প্রিভিউ ইউআরএল ক্লিনআপ
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const password = watch("password");

  // নামের প্রথম অক্ষর বের করার হেল্পার ফাংশন
  const getInitials = (name) => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const finalSubmissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ...(data.password && { password: data.password }),
        profileImage: imageFile ? imageFile.name : "No new file selected",
      };

      console.log("=== Form Data ===", finalSubmissionData);
      alert("Changes captured successfully!");

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500">
            Update your profile data locally.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* IMAGE UPLOAD & USER NAME SECTION */}
          <div className="flex flex-col items-center sm:flex-row sm:space-x-6 border-b border-slate-100 pb-6">
            <div className="relative w-24 h-24 bg-slate-900 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                // ইমেজ না থাকলে নামের প্রথম অক্ষর দেখাবে
                <span className="text-3xl font-bold text-white select-none">
                  {getInitials(session?.user?.name)}
                </span>
              )}

              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-slate-800 p-1.5 rounded-full text-white cursor-pointer hover:bg-slate-700 transition-colors z-10"
              >
                <Camera size={14} />
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-center sm:text-left mt-3 sm:mt-0">
              {/* প্রোফাইল ইমেজের নিচে কারেন্ট ইউজারের নাম */}
              <h2 className="text-lg font-bold text-slate-800">
                {session?.user?.name || "Loading Name..."}
              </h2>
              <h3 className="text-xs font-semibold text-slate-500 mt-0.5">
                Profile Picture
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                JPG, PNG or WEBP. Max 2MB.
              </p>
            </div>
          </div>

          {/* INPUT FIELDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User size={16} className="text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-100 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-100 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400"
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone size={16} className="text-slate-400" /> Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400"
                {...register("phone")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 md:col-start-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" /> New Password
                (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep old password"
                className={`w-full p-3 border rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-100 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400"
                }`}
                {...register("password", {
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" /> Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full p-3 border rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-100 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400"
                }`}
                {...register("confirmPassword", {
                  validate: (value) =>
                    !password || value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
