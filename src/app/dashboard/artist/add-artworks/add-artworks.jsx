export const dynamic = "force-dynamic";
("use client");

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";

export default function AddProductForm({ artist }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const DATABASE_API_URL = process.env.NEXT_PUBLIC_URL || "";
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_KEY;

  const currentArtistName = artist?.name
    ? String(artist.name).trim()
    : "Unknown Artist";
  const currentArtistImage = artist?.image ? String(artist.image).trim() : "";

  const currentArtistId = artist?.id
    ? String(artist.id).trim()
    : artist?._id || "";

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

  const handleRemovePreview = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const file = data.image?.[0];
      if (!file) {
        toast.error("Please upload an image!");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formData },
      );

      if (!res.ok) throw new Error("Image upload failed");

      const imgData = await res.json();
      const imageUrl = imgData.data.url;

      const payload = {
        title: String(data.title).trim(),
        image_url: String(imageUrl).trim(),
        description: String(data.description).trim(),
        price: Number(data.price),
        category: String(data.category).trim(),

        artist_id: currentArtistId,
        artist_name: String(currentArtistName).trim(),
        artist_profile_url: String(currentArtistImage).trim(),

        user: {
          id: currentArtistId,
          name: String(currentArtistName).trim(),
          image: String(currentArtistImage).trim(),
          role: "artist",
        },

        isSold: false,
        date_uploaded: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${DATABASE_API_URL}/api/arthub/artwork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData?.message || `Failed to save product!`);
        setIsSubmitting(false);
        return;
      }

      const dbRes = await response.json();

      if (dbRes?.success || dbRes?._id) {
        toast.success("Successfully Saved to Database!");
        reset();
        setImagePreview(null);
        setTimeout(() => {
          router.push("/dashboard/artist/artworks");
          router.refresh();
        }, 500);
      }
    } catch (error) {
      console.error("Client Error:", error);
      toast.error("Connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm my-8 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/60">
          <Avatar
            src={currentArtistImage || undefined}
            name={currentArtistName.charAt(0).toUpperCase()}
            size="sm"
            className="w-6 h-6 text-[10px] bg-primary text-primary-foreground font-semibold"
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground leading-none font-medium">
              Posting as
            </span>
            <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
              {currentArtistName}
            </span>
          </div>
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
                <option value="">Select Category</option>
                <option value="painting">Painting</option>
                <option value="digital-art">Digital Art</option>
                <option value="sculpture">Sculpture</option>
                <option value="photography">Photography</option>
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
