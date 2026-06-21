"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Image,
  DollarSign,
  Type,
  FileText,
  Layers,
  UploadCloud,
  Loader2,
} from "lucide-react";

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      image: null,
    },
  });

  // ইমেজ সিলেক্ট করলে প্রিভিউ দেখানোর জন্য হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // এখানে আপনার API কল বা FormData লজিক হ্যান্ডেল করবেন
      console.log("Form Data Submitted:", data);

      // উদাহরণস্বরূপ: মাল্টিপার্ট ডেটা পাঠাতে চাইলে
      // const formData = new FormData();
      // formData.append("title", data.title);
      // formData.append("image", data.image[0]);

      alert("Successfully Submitted!");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
          <UploadCloud size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Add New Artwork / Product
          </h2>
          <p className="text-xs text-slate-500">
            Fill in the details below to upload your items.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
            <Type size={16} className="text-slate-400" /> Title
          </label>
          <input
            type="text"
            placeholder="Enter title"
            {...register("title", { required: "Title is required" })}
            className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-slate-50/50 ${
              errors.title
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-slate-200 focus:border-slate-400"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" /> Description
          </label>
          <textarea
            rows="4"
            placeholder="Write a detailed description..."
            {...register("description", {
              required: "Description is required",
            })}
            className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-slate-50/50 ${
              errors.description
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-slate-200 focus:border-slate-400"
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price & Category (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <DollarSign size={16} className="text-slate-400" /> Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-slate-50/50 ${
                errors.price
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:ring-slate-200 focus:border-slate-400"
              }`}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <Layers size={16} className="text-slate-400" /> Category
            </label>
            <select
              {...register("category", {
                required: "Please select a category",
              })}
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-slate-50/50 appearance-none ${
                errors.category
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:ring-slate-200 focus:border-slate-400"
              }`}
            >
              <option value="">Select Category</option>
              <option value="painting">Painting</option>
              <option value="digital-art">Digital Art</option>
              <option value="sculpture">Sculpture</option>
              <option value="photography">Photography</option>
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload Component */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
            <Image size={16} className="text-slate-400" /> Upload Image
          </label>

          <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/30 hover:bg-slate-50 transition-colors relative">
            {imagePreview ? (
              <div className="relative w-full max-h-60 rounded-lg overflow-hidden flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-contain max-h-60 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-950 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <UploadCloud className="mx-auto text-slate-400" size={36} />
                <div className="flex text-sm text-slate-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-semibold text-slate-800 hover:text-slate-950 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register("image", {
                        required: "Image file is required",
                        onChange: handleImageChange,
                      })}
                    />
                  </label>
                  <p className="pl-1 text-slate-500">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-400">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 p-3 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Artwork"
          )}
        </button>
      </form>
    </div>
  );
}
