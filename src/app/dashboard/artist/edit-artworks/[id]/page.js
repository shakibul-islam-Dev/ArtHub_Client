"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getSingleArtPost, updateArtPost } from "@/lib/actions/arthubdatabse";

const EditArtworkPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // useForm হুক ইনিশিয়ালাইজেশন
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

  // পেইজ লোড হলে পুরাতন ডেটা ফেচ করে setValue দিয়ে ফর্মে বসানো
  useEffect(() => {
    if (!id) return;

    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        const data = await getSingleArtPost(id);

        if (data) {
          // রিয়্যাক্ট হুক ফর্মের ফিল্ডগুলোতে ডেটা সেট করা হচ্ছে
          setValue("title", data.title || "");
          setValue("description", data.description || "");
          setValue("price", data.price || "");
          setValue("category", data.category || "");
          setValue("image_url", data.image_url || "");
          setValue("artist_profile_url", data.artist_profile_url || "");
        } else {
          alert("আর্টওয়ার্কের ডেটা খুঁজে পাওয়া যায়নি!");
          router.push("/dashboard/artist/manage-artworks");
        }
      } catch (error) {
        console.error("Error loading artwork:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [id, setValue, router]);

  // সাবমিট হ্যান্ডলার
  const onFormSubmit = async (data) => {
    try {
      setUpdating(true);

      // প্রাইসকে নাম্বার টাইপে কনভার্ট করা
      const payload = {
        ...data,
        price: Number(data.price),
      };

      const response = await updateArtPost(id, payload);

      if (response.success) {
        alert(response.message || "আর্টওয়ার্ক সফলভাবে আপডেট হয়েছে!");
        router.push("/dashboard/artist/manage-artworks");
        router.refresh();
      } else {
        alert(response.message || "আপডেট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      console.error("Update submit error:", error);
      alert("সার্ভার কানেকশন ফেইল্ড!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <p className="text-sm text-muted-foreground">
          আর্টওয়ার্কের তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-foreground transition-colors">
      {/* হেডার */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Link href="/dashboard/artist/manage-artworks">
          <Button
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
            আপনার আর্টওয়ার্কের তথ্য সংশোধন করুন
          </p>
        </div>
      </div>

      {/* ফর্ম */}
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
            {...register("title", { required: "টাইটেল আবশ্যিক!" })}
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
            <select
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary [&>option]:bg-[hsl(var(--card))] [&>option]:text-[hsl(var(--foreground))] appearance-none ${
                errors.category ? "border-destructive" : "border-border"
              }`}
              {...register("category", { required: "ক্যাটাগরি সিলেক্ট করুন!" })}
            >
              <option value="">Select Category</option>
              <option value="painting">Painting</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculpture</option>
              <option value="sketch">Sketch</option>
            </select>
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
              placeholder="Price in USD"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                errors.price
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-ring focus:border-primary"
              }`}
              {...register("price", {
                required: "মূল্য নির্ধারণ করুন!",
                min: { value: 1, message: "মূল্য ১ ডলারের বেশি হতে হবে" },
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
            {...register("image_url", { required: "ছবির ইউআরএল আবশ্যক!" })}
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
              required: "আর্ট精度র বর্ণনা দিন!",
            })}
          />
          {errors.description && (
            <span className="text-xs text-destructive font-medium">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* সাবমিট বাটন */}
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
