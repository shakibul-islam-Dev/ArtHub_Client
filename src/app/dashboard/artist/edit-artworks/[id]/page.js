"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const EditArtworkPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      artist_profile_url: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/arthub/artwork/${id}`,
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error("Failed to fetch artwork data");

        const data = await res.json();
        if (!isMounted) return;

        const finalData = data?.data || data;

        if (finalData) {
          setOriginalData(finalData);

          setValue("title", finalData.title || "");
          setValue("description", finalData.description || "");
          setValue(
            "price",
            finalData.price !== undefined ? String(finalData.price) : "",
          );
          setValue("category", finalData.category || "");
          setValue("image_url", finalData.image_url || "");
          setValue("artist_profile_url", finalData.artist_profile_url || "");
        } else {
          toast.error("Artwork data not found!");
          router.replace("/dashboard/artist/artworks");
        }
      } catch (error) {
        console.error("Error loading artwork:", error);
        toast.error("Failed to load artwork details!");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArtworkDetails();

    return () => {
      isMounted = false;
    };
  }, [id, setValue, router]);

  const onFormSubmit = async (formData) => {
    try {
      setUpdating(true);

      const payload = {
        ...originalData,
        title: String(formData.title).trim(),
        description: String(formData.description).trim(),
        price: Number(formData.price),
        category: String(formData.category).trim(),
        image_url: String(formData.image_url).trim(),
        artist_profile_url: String(formData.artist_profile_url).trim(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/arthub/artwork/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const response = await res.json();

      if (
        res.ok &&
        (response.success ||
          response.modifiedCount > 0 ||
          response.acknowledged ||
          response._id)
      ) {
        toast.success(response.message || "Artwork updated successfully!");
        router.refresh();

        setTimeout(() => {
          router.push("/dashboard/artist/artworks");
        }, 500);
      } else {
        toast.error(
          response.message || "No changes detected or failed to update!",
        );
      }
    } catch (error) {
      console.error("Update submit error:", error);
      toast.error("Server connection failed!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Loading artwork details...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-foreground transition-colors">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Link href="/dashboard/artist/artworks" passHref>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Artwork</h1>
          <p className="text-sm text-muted-foreground">
            Modify your artwork information below
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-5 bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm"
      >
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Artwork Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Starry Night"
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:ring-ring focus:border-primary"
            }`}
            {...register("title", { required: "Title is required!" })}
          />
          {errors.title && (
            <span className="text-xs text-destructive font-medium">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              Category *
            </label>
            <div className="relative">
              <select
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary [&>option]:bg-[hsl(var(--card))] [&>option]:text-[hsl(var(--foreground))] appearance-none ${
                  errors.category ? "border-destructive" : "border-border"
                }`}
                {...register("category", {
                  required: "Please select a category!",
                })}
              >
                <option value="">Select Category</option>
                <option value="painting">Painting</option>
                <option value="digital-art">Digital Art</option>
                <option value="sculpture">Sculpture</option>
                <option value="photography">Photography</option>
              </select>
            </div>
            {errors.category && (
              <span className="text-xs text-destructive font-medium">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Price in USD"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                errors.price
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-ring focus:border-primary"
              }`}
              {...register("price", {
                required: "Price is required!",
                min: { value: 0, message: "Price cannot be negative" },
              })}
            />
            {errors.price && (
              <span className="text-xs text-destructive font-medium">
                {errors.price.message}
              </span>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Image URL *
          </label>
          <input
            type="url"
            placeholder="https://example.com/art.jpg"
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              errors.image_url
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:ring-ring focus:border-primary"
            }`}
            {...register("image_url", { required: "Image URL is required!" })}
          />
          {errors.image_url && (
            <span className="text-xs text-destructive font-medium">
              {errors.image_url.message}
            </span>
          )}
        </div>

        {/* Artist Profile URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Artist Profile Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            {...register("artist_profile_url")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            Description *
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your artwork..."
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              errors.description
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:ring-ring focus:border-primary"
            }`}
            {...register("description", {
              required: "Description is required!",
            })}
          />
          {errors.description && (
            <span className="text-xs text-destructive font-medium">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updating}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-2 text-sm h-10 px-5 transition-opacity disabled:opacity-70"
          >
            {updating ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Updating...
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditArtworkPage;
