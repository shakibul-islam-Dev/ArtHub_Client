"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";

const ProfileUpdateForm = ({ initialData, userId, role }) => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [imageError, setImageError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      image: initialData?.image || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        image: initialData.image || "",
      });
      setImageError(false);
    }
  }, [initialData, reset]);

  const imageUrl = useWatch({
    control,
    name: "image",
    defaultValue: initialData?.image || "",
  });

  const userName = useWatch({
    control,
    name: "name",
    defaultValue: initialData?.name || "",
  });

  const initialCharacter = userName?.trim()
    ? userName.trim().charAt(0).toUpperCase()
    : "U";

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // 🎯 আপনার ডিফাইন করা ভ্যারিয়েবল (ডট মিসিং ফিক্সড)
  const imageBB = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_KEY;

  const onSubmit = async (data) => {
    setStatusMessage({ type: "", text: "" });
    try {
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      // 🎯 যদি ইনপুটে নতুন কোনো ফাইলের অবজেক্ট বা ইমেজ ইউআরএল থাকে, সেটাকে ImgBB তে আপলোড করার লজিক
      // (যদি আপনি ইনপুট ফিল্ডে সরাসরি ফাইল পাস করেন)
      if (data.image && data.image[0] instanceof File) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imageBB}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          updateData.image = imgbbData.data.display_url; // আপলোডেড CDN লিঙ্ক সেট হলো
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_URL || "";

      const response = await fetch(`${apiUrl}/api/arthub/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setStatusMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      router.refresh();
    } catch (error) {
      console.error("Update failed:", error);
      setStatusMessage({ type: "error", text: "Something went wrong!" });
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">
          Update Profile
        </h2>
        {role && (
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            Role: {role}
          </span>
        )}
      </div>

      {statusMessage.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
            statusMessage.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col items-center justify-center gap-3 pb-2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-zinc-900 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner">
            {imageUrl?.trim() && !imageError ? (
              <img
                src={imageUrl.trim()}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-3xl font-bold text-white tracking-wider select-none">
                {initialCharacter}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Avatar Preview
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:text-zinc-100 transition-all ${
              errors.name
                ? "border-red-500 ring-1 ring-red-500"
                : "border-slate-300 dark:border-zinc-700"
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:text-zinc-100 transition-all ${
              errors.email
                ? "border-red-500 ring-1 ring-red-500"
                : "border-slate-300 dark:border-zinc-700"
            }`}
            placeholder="example@mail.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
            Password{" "}
            <span className="text-xs text-slate-400 font-normal">
              (Optional)
            </span>
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Leave blank to keep unchanged"
            className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:text-zinc-100 transition-all"
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
            Profile Image URL
          </label>
          <input
            type="text"
            {...register("image")}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent dark:text-zinc-100 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 text-white font-semibold rounded-lg shadow-md transition-all ${
            isSubmitting
              ? "bg-slate-400 dark:bg-zinc-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          }`}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
