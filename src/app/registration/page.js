"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const RegistrationPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "user",
    },
  });

  const password = watch("password");

  const { onChange: onImageChange, ...restImageRegister } = register("image");

  const handleImageSelect = (e) => {
    onImageChange(e);
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_KEY;
    if (!apiKey) {
      console.error("ImgBB API key is missing. Check your .env file.");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const resData = await response.json();
      if (resData.success) {
        return resData.data.url;
      } else {
        console.error("ImgBB Upload Error:", resData.error);
        return null;
      }
    } catch (err) {
      console.error("Failed to upload image to ImgBB:", err);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    let imageUrl = "";

    try {
      if (formData.image && formData.image.length > 0) {
        const file = formData.image[0];
        toast.info("Uploading profile picture...");
        const uploadedUrl = await uploadToImgBB(file);

        if (!uploadedUrl) {
          toast.error("Image upload failed. Registration aborted.");
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.username,
        image: imageUrl || undefined,
        role: formData.role,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
      } else {
        toast.success("Registration successful!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("An Unexpected error during registration:", error);
      toast.error("An unexpected error occurred.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md border border-transparent dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Register To Art Hub
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className={`mt-1 block w-full border ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm p-2 focus:outline-none focus:ring-2`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className={`mt-1 block w-full border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm p-2 focus:outline-none focus:ring-2`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profile Picture
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                    <Upload className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click to upload avatar
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...restImageRegister}
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Role
            </label>
            <div className="flex gap-4 text-gray-900 dark:text-gray-300">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="mr-2 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />{" "}
                User
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="artist"
                  className="mr-2 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />{" "}
                Artist
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition"
          >
            Sign up with Google
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
