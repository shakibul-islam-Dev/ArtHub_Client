"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Lock,
  Phone,
  Camera,
  Save,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

export default function ProfileUpdateForm() {
  // --- ১. স্টেট ডিক্লেয়ারেশন ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      externalImageUrl: "", // নতুন ফিল্ডের ডিফল্ট ভ্যালু
    },
  });

  const password = watch("password");
  const externalImageUrlWatch = watch("externalImageUrl");

  // সেশন থেকে ডেটা লোড করা
  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        password: "",
        confirmPassword: "",
        externalImageUrl: "",
      });

      if (session.user.image || session.user.profile_image) {
        setImagePreview(session.user.image || session.user.profile_image);
      }
    }
  }, [session, reset]);

  // এক্সটার্নাল ইউআরএল ইনপুট দিলে লাইভ প্রিভিউ দেখানোর জন্য ইফেক্ট
  useEffect(() => {
    if (externalImageUrlWatch && !imageFile) {
      setImagePreview(externalImageUrlWatch);
    }
  }, [externalImageUrlWatch, imageFile]);

  // মেমোরি লিক রোধ করতে অবজেক্ট ইউআরএল রিভোক করা
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  // লোকাল ফাইল সিলেক্ট হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setValue("externalImageUrl", ""); // ফাইল সিলেক্ট করলে ইউআরএল ফিল্ড খালি করে দেওয়া

      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- ImgBB তে ইমেজ আপলোড করার ফাংশন ---
  const uploadToImgBB = async (imageSource) => {
    // এখানে আপনার নিজের ImgBB API Key বসাবেন
    const IMGBBB_API_KEY = "YOUR_IMGBB_API_KEY_HERE";
    const formData = new FormData();

    // যদি সোর্সটি ফাইল অবজেক্ট হয় তবে সরাসরি যুক্ত হবে, নতুবা ইউআরএল টেক্সট হিসেবে যাবে
    formData.append("image", imageSource);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (result.success) {
        return result.data.url; // ImgBB এর স্থায়ী ইমেজ লিংক
      } else {
        throw new Error(result.error?.message || "ImgBB upload failed");
      }
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      alert("Failed to upload image to ImgBB.");
      return null;
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let finalProfileImage = imagePreview; // ডিফল্ট বা বর্তমান ইমেজ

    // ১. যদি নতুন লোকাল ফাইল আপলোড করা হয়
    if (imageFile) {
      const uploadedUrl = await uploadToImgBB(imageFile);
      if (uploadedUrl) finalProfileImage = uploadedUrl;
    }
    // ২. যদি লোকাল ফাইল না থাকে কিন্তু এক্সটার্নাল ইউআরএল দেওয়া হয়
    else if (data.externalImageUrl) {
      const uploadedUrl = await uploadToImgBB(data.externalImageUrl);
      if (uploadedUrl) finalProfileImage = uploadedUrl;
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      ...(data.password && { password: data.password }),
      profileImage: finalProfileImage, // এই লিংকে এখন ImgBB এর URL থাকবে
    };

    console.log("🚀 LIVE FORM DATA SUBMITTING TO BACKEND:", payload);

    alert("Changes logged in console! Final Image URL: " + finalProfileImage);
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {/* হেডার */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500">
            Update your profile data and images.
          </p>
        </div>

        {/* ফর্ম */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* প্রোফাইল ইমেজ সেকশন */}
          <div className="flex flex-col items-center sm:flex-row sm:space-x-6 border-b border-slate-100 pb-6">
            <div className="relative w-24 h-24 bg-slate-900 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized // এক্সটার্নাল ও লোকাল ব্লব ইউআরএল সহজে দেখানোর জন্য
                />
              ) : (
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
              <h2 className="text-lg font-bold text-slate-800">
                {session?.user?.name || "Loading Name..."}
              </h2>
              <h3 className="text-xs font-semibold text-slate-500 mt-0.5">
                Profile Picture
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload a file OR provide an external image URL below.
              </p>
            </div>
          </div>

          {/* ইনপুট ফিল্ডস গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ১. নাম */}
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

            {/* ২. ইমেইল */}
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

            {/* ৩. ফোন নাম্বার */}
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

            {/* [নতুন ফিল্ড] এক্সটার্নাল ইমেজ ইউআরএল */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <LinkIcon size={16} className="text-slate-400" /> External Image
                URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400"
                {...register("externalImageUrl")}
              />
            </div>

            {/* ৪. নতুন পাসওয়ার্ড */}
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

            {/* ৫. কনফার্ম পাসওয়ার্ড */}
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

          {/* সাবমিট বাটন */}
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
