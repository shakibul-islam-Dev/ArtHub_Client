"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { createArtPost } from "@/lib/actions/arthubdatabse";
import {
  ImageIcon,
  DollarSign,
  Type,
  FileText,
  Layers,
  UploadCloud,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const { data: session } = useSession();

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_KEY;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      image: null,
    },
  });

  // ইমেজ চেঞ্জ হ্যান্ডেলার
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // প্রিভিউ রিমুভ করার হ্যান্ডেলার
  const handleRemovePreview = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let isSuccess = false;

    try {
      const file = data.image?.[0];
      if (!file) {
        toast.error("please upload an image!");
        setIsSubmitting(false);
        return;
      }

      if (!session?.user) {
        toast.error("please login first!");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Image upload failed");

      const imgData = await res.json();
      const imageUrl = imgData.data.url;

      const payload = {
        title: data.title,
        image_url: imageUrl,
        artist_name: session.user.name,
        artist_profile_url: session.user.image || "",
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        date_uploaded: new Date().toISOString(),
      };

      const dbRes = await createArtPost(payload);

      if (dbRes?.success) {
        toast.success(dbRes.message || "Successfully Saved to Database!");
        reset();
        setImagePreview(null);
        isSuccess = true;
        setIsSubmitting(false);
        if (isSuccess) {
          setTimeout(() => {
            router.push("/dashboard/artist/artworks");
            router.refresh();
          }, 500);
        }
      } else {
        toast.error(dbRes?.message || "Database-e save korte somossa hoyeche!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm my-8 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <div className="p-2 bg-muted text-muted-foreground rounded-lg">
          <UploadCloud size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Add New Artwork / Product
          </h2>
          <p className="text-xs text-muted-foreground">
            Fill in the details below to upload your items.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
            <Type size={16} className="text-muted-foreground" /> Title
          </label>
          <input
            type="text"
            placeholder="Enter title"
            {...register("title", { required: "Title is required" })}
            className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-transparent text-foreground placeholder:text-muted-foreground ${
              errors.title
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:ring-ring focus:border-primary"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
            <FileText size={16} className="text-muted-foreground" /> Description
          </label>
          <textarea
            rows="4"
            placeholder="Write a detailed description..."
            {...register("description", {
              required: "Description is required",
            })}
            className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-transparent text-foreground placeholder:text-muted-foreground ${
              errors.description
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:ring-ring focus:border-primary"
            }`}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <DollarSign size={16} className="text-muted-foreground" /> Price
              ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-transparent text-foreground placeholder:text-muted-foreground ${
                errors.price
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-ring focus:border-primary"
              }`}
            />
            {errors.price && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <Layers size={16} className="text-muted-foreground" /> Category
            </label>
            <div className="relative">
              <select
                {...register("category", {
                  required: "Please select a category",
                })}
                className={`w-full p-3 border text-sm rounded-lg focus:outline-none focus:ring-2 bg-transparent text-foreground focus:ring-ring focus:border-primary transition-colors [&>option]:bg-[hsl(var(--card))] [&>option]:text-[hsl(var(--foreground))] appearance-none ${
                  errors.category
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border"
                }`}
              >
                <option
                  value=""
                  className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                >
                  Select Category
                </option>
                <option
                  value="painting"
                  className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                >
                  Painting
                </option>
                <option
                  value="digital-art"
                  className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                >
                  Digital Art
                </option>
                <option
                  value="sculpture"
                  className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                >
                  Sculpture
                </option>
                <option
                  value="photography"
                  className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                >
                  Photography
                </option>
              </select>
            </div>
            {errors.category && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
            <ImageIcon size={16} className="text-muted-foreground" /> Upload
            Image
          </label>

          <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/20 hover:bg-muted/40 transition-colors relative">
            {imagePreview ? (
              <div className="relative w-full h-60 rounded-lg overflow-hidden flex justify-center">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain"
                  priority
                />
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="absolute top-2 right-2 bg-foreground/80 text-background p-1.5 rounded-full hover:bg-foreground transition-colors z-10"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <UploadCloud
                  className="mx-auto text-muted-foreground"
                  size={36}
                />
                <div className="flex text-sm text-foreground">
                  <label className="relative cursor-pointer bg-transparent rounded-md font-semibold text-primary hover:underline focus-within:outline-none">
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
                  <p className="pl-1 text-muted-foreground">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 p-3 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:opacity-90 transition-opacity disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center gap-2"
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
