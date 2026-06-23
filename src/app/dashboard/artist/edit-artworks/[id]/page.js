"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form"; // ১. ইমপোর্ট করা হলো
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

  // ২. useForm হুক ইনিশিয়ালাইজেশন
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

  // ৩. পেইজ লোড হলে পুরাতন ডেটা ফেচ করে setValue দিয়ে ফর্মে বসানো
  useEffect(() => {
    if (!id) return;

    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        const data = await getSingleArtPost(id);

        if (data) {
          // রিয়্যাক্ট হুক ফর্মের ফিল্ডগুলোতে ডেটা সেট করা হচ্ছে
          setValue("title", data.title || "");
          setValue("description", data.description || "");
          setValue("price", data.price || "");
          setValue("category", data.category || "");
          setValue("image_url", data.image_url || "");
          setValue("artist_profile_url", data.artist_profile_url || "");
        } else {
          alert("আর্টওয়ার্কের ডেটা খুঁজে পাওয়া যায়নি!");
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

  // ৪. সাবমিট হ্যান্ডলার (React Hook Form সফলভাবে ভ্যালিডেশন করার পর এই ডেটা পাস করবে)
  const onFormSubmit = async (data) => {
    try {
      setUpdating(true);

      // প্রাইসকে নাম্বার টাইপে কনভার্ট করা (নিরাপত্তার জন্য)
      const payload = {
        ...data,
        price: Number(data.price),
      };

      const response = await updateArtPost(id, payload);

      if (response.success) {
        alert(response.message || "আর্টওয়ার্ক সফলভাবে আপডেট হয়েছে!");
        router.push("/dashboard/artist/manage-artworks");
        router.refresh();
      } else {
        alert(response.message || "আপডেট করতে समस्या হয়েছে!");
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
        <Loader2 className="animate-spin text-slate-500" size={32} />
        <p className="text-sm text-slate-500">আর্টওয়ার্কের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* হেডার */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href="/dashboard/artist/manage-artworks">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Artwork</h1>
          <p className="text-sm text-slate-500">
            আপনার আর্টওয়ার্কের তথ্য সংশোধন করুন
          </p>
        </div>
      </div>

      {/* ফর্ম */}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-5 bg-white p-6 border rounded-xl shadow-sm"
      >
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Artwork Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Starry Night"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${errors.title ? "border-red-500 ring-red-200 focus:ring-red-400" : ""}`}
            {...register("title", { required: "টাইটেল আবশ্যিক!" })}
          />
          {errors.title && (
            <span className="text-xs text-red-500">{errors.title.message}</span>
          )}
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Category *
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 ${errors.category ? "border-red-500" : ""}`}
              {...register("category", { required: "ক্যাটাগরি সিলেক্ট করুন!" })}
            >
              <option value="">Select Category</option>
              <option value="painting">Painting</option>
              <option value="digital">Digital Art</option>
              <option value="sculpture">Sculpture</option>
              <option value="sketch">Sketch</option>
            </select>
            {errors.category && (
              <span className="text-xs text-red-500">
                {errors.category.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Price ($) *
            </label>
            <input
              type="number"
              placeholder="Price in USD"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${errors.price ? "border-red-500" : ""}`}
              {...register("price", {
                required: "মূল্য নির্ধারণ করুন!",
                min: { value: 1, message: "মূল্য ১ ডলারের বেশি হতে হবে" },
              })}
            />
            {errors.price && (
              <span className="text-xs text-red-500">
                {errors.price.message}
              </span>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Image URL *
          </label>
          <input
            type="url"
            placeholder="https://example.com/art.jpg"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${errors.image_url ? "border-red-500" : ""}`}
            {...register("image_url", { required: "ছবির ইউআরএল আবশ্যক!" })}
          />
          {errors.image_url && (
            <span className="text-xs text-red-500">
              {errors.image_url.message}
            </span>
          )}
        </div>

        {/* Artist Profile URL (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Artist Profile Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            {...register("artist_profile_url")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Description *
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your artwork..."
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${errors.description ? "border-red-500" : ""}`}
            {...register("description", {
              required: "আর্টওয়ার্কের বর্ণনা দিন!",
            })}
          />
          {errors.description && (
            <span className="text-xs text-red-500">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* সাবমিট বাটন */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updating}
            className="bg-slate-800 hover:bg-slate-900 text-white gap-2 text-sm h-10 px-5 disabled:opacity-70"
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
