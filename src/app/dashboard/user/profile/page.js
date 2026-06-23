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

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        password: "",
        confirmPassword: "",
      });

      if (session.user.image || session.user.profile_image) {
        setImagePreview(session.user.image || session.user.profile_image);
      }
    }
  }, [session, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const password = watch("password");

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
    <div className="p-6 min-h-screen flex justify-center items-start bg-transparent text-current">
      <div className="w-full max-w-2xl bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm opacity-70">
            Update your profile data locally.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* IMAGE UPLOAD & USER NAME SECTION */}
          <div className="flex flex-col items-center sm:flex-row sm:space-x-6 border-b border-border pb-6">
            <div className="relative w-24 h-24 bg-muted text-muted-foreground rounded-full border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold select-none">
                  {getInitials(session?.user?.name)}
                </span>
              )}

              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity z-10"
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
              <h2 className="text-lg font-bold">
                {session?.user?.name || "Loading Name..."}
              </h2>
              <h3 className="text-xs font-semibold opacity-70 mt-0.5">
                Profile Picture
              </h3>
              <p className="text-xs opacity-50 mt-1">
                JPG, PNG or WEBP. Max 2MB.
              </p>
            </div>
          </div>

          {/* INPUT FIELDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} className="opacity-60" /> Full Name
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-foreground/50"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-xs text-destructive font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail size={16} className="opacity-60" /> Email Address
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.email
                    ? "border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-foreground/50"
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} className="opacity-60" /> Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-3 border border-border bg-input text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-foreground/50"
                {...register("phone")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 md:col-start-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="opacity-60" /> New Password
                (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep old password"
                className={`w-full p-3 border rounded-lg text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.password
                    ? "border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-foreground/50"
                }`}
                {...register("password", {
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <span className="text-xs text-destructive font-medium">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="opacity-60" /> Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full p-3 border rounded-lg text-sm bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.confirmPassword
                    ? "border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-foreground/50"
                }`}
                {...register("confirmPassword", {
                  validate: (value) =>
                    !password || value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-destructive font-medium">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground disabled:opacity-50 rounded-lg text-sm font-medium shadow-sm cursor-pointer transition-opacity"
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
