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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfileUpdateForm({ initialData, userId }) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      externalImageUrl: "",
    },
  });

  const password = watch("password");
  const externalImageUrlWatch = watch("externalImageUrl");

  // সার্ভার থেকে আসা initialData দিয়ে ফর্ম ইনিশিয়েট করা
  useEffect(() => {
    if (initialData) {
      const actualUser = initialData.success ? initialData.data : initialData;

      reset({
        name: actualUser?.name || "",
        email: actualUser?.email || "",
        phone: actualUser?.phone || "",
        password: "",
        confirmPassword: "",
        externalImageUrl: actualUser?.image_url || actualUser?.image || "",
      });

      if (actualUser?.image_url || actualUser?.image) {
        setImagePreview(actualUser.image_url || actualUser.image);
      }
    }
  }, [initialData, reset]);

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
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ImgBB তে ইমেজ আপলোড করার ফাংশন
  const uploadToImgBB = async (imageSource) => {
    const IMGBBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_KEY;

    if (!IMGBBB_API_KEY) {
      console.error("ImgBB API key is missing in environment variables!");
      return null;
    }

    const formData = new FormData();
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
        return result.data.url;
      } else {
        throw new Error(result.error?.message || "ImgBB upload failed");
      }
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      return null;
    }
  };

  // সাবমিট হ্যান্ডলার
  const onSubmit = async (data) => {
    if (!userId) {
      toast.error("User ID is missing!");
      return;
    }

    setIsSubmitting(true);

    try {
      // ১. সম্পূর্ণ পেলোড অবজেক্ট তৈরি
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      };

      if (data.password) {
        payload.password = data.password;
      }

      // ২. ইমেজ হ্যান্ডলিং প্রসেস
      const actualUser = initialData?.success ? initialData.data : initialData;
      let finalImageUrl =
        data.externalImageUrl ||
        actualUser?.image_url ||
        actualUser?.image ||
        "";

      if (imageFile) {
        toast.loading("Uploading image...", { id: "uploading" });
        const uploadedUrl = await uploadToImgBB(imageFile);
        toast.dismiss("uploading");

        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          toast.error("Image upload failed, using fallback/existing URL.");
        }
      }

      payload.image_url = finalImageUrl;

      // ৩. ব্যাকঅ্যান্ডে PUT রিকোয়েস্ট পাঠানো
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/artHub/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok && responseData.success) {
        toast.success(responseData.message || "Profile updated successfully!");

        // 🛠️ ৪. লাইভ সেশন আপডেট
        if (typeof window !== "undefined") {
          await authClient.getSession({ forceRefresh: true });
        }

        // ফর্মের পাসওয়ার্ড ফিল্ড এবং ফাইল স্টেট ক্লিয়ার
        setValue("password", "");
        setValue("confirmPassword", "");
        setImageFile(null);

        // ফিক্স: নতুন ডাটা দিয়ে ইন্টারনাল হুক ফর্ম স্টেট সিঙ্ক করা
        reset({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          password: "",
          confirmPassword: "",
          externalImageUrl: payload.image_url,
        });

        router.refresh();
      } else {
        toast.error(responseData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Network connection failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualUser = initialData?.success ? initialData.data : initialData;

  return (
    <div className="p-6 bg-background min-h-screen flex justify-center items-start text-foreground transition-colors select-none">
      <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
        {/* হেডার */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your profile data and images dynamically.
          </p>
        </div>

        {/* ফর্ম */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* প্রোফাইল ইমেজ সেকশন */}
          <div className="flex flex-col items-center sm:flex-row sm:space-x-6 border-b border-border pb-6">
            <div className="relative w-24 h-24 bg-muted rounded-full border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {imagePreview ? (
                /* 🛠️ ফিক্স: নেক্সট ইমেজ রিমোট ডোমেইন ক্র্যাশ এড়াতে স্ট্যান্ডার্ড কাস্টম img ব্যবহার করা ভালো */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground select-none">
                  {getInitials(actualUser?.name)}
                </span>
              )}

              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity z-10"
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
              <h2 className="text-lg font-bold text-foreground">
                {actualUser?.name || "Loading Name..."}
              </h2>
              <h3 className="text-xs font-semibold text-muted-foreground mt-0.5">
                Profile Picture
              </h3>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Upload a file OR provide an external image URL below.
              </p>
            </div>
          </div>

          {/* ইনপুট ফিল্ডস গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ১. নাম */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User size={16} className="text-muted-foreground" /> Full Name
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-ring focus:border-primary"
                }`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-xs text-destructive font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* ২. ইমেইল */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" /> Email
                Address
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-ring focus:border-primary"
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* ৩. ফোন নাম্বার */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" /> Phone
                Number
              </label>
              <input
                type="tel"
                className="w-full p-3 border border-border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                {...register("phone")}
              />
            </div>

            {/* এক্সটার্নাল ইমেজ ইউআরএল */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <LinkIcon size={16} className="text-muted-foreground" />{" "}
                External Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                {...register("externalImageUrl")}
              />
            </div>

            {/* ৪. নতুন পাসওয়ার্ড */}
            <div className="flex flex-col gap-1.5 md:col-start-1">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock size={16} className="text-muted-foreground" /> New
                Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep old password"
                className={`w-full p-3 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-ring focus:border-primary"
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

            {/* ৫. কনফার্ম পাসওয়ার্ড */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock size={16} className="text-muted-foreground" /> Confirm
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full p-3 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-ring focus:border-primary"
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

          {/* সাবমিট বাটন */}
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
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
