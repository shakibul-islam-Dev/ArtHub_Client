"use client";
import React from "react";
import { useForm } from "react-hook-form";

export default function ProfileUpdateForm({ userData }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      password: "",
      confirmPassword: "",
      imageUrl: userData?.imageUrl || "",
    },
  });

  const onSubmit = (data) => {
    console.log("Updated Profile Data:", data);
  };

  // ইনপুট ফিল্ডগুলো ম্যাপ করার জন্য একটি অ্যারে, যাতে কোড ক্লিন থাকে
  const formFields = [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "New Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
    { name: "imageUrl", label: "Profile Image URL", type: "text" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-300">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 capitalize">
              {field.label}
            </label>
            <input
              {...register(field.name)}
              type={field.type}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder={`Enter your ${field.label.toLowerCase()}`}
            />
          </div>
        ))}

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-3.5 mt-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
