"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Image as ImageIcon,
  Trash2,
  FolderEdit,
  Loader2,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { deleteArtPost } from "@/lib/actions/arthubdatabse";

const ManageArtWorks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { data: session, isPending } = useSession();

  // ব্যাকএন্ড API থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchArtworks = async () => {
      if (isPending || !session?.user) return;

      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/artHub/artwork");
        const allArtworks = await res.json();

        // বর্তমান লগইন থাকা আর্টিস্টের নাম দিয়ে ডাটা ফিল্টার
        const userSpecificArt = allArtworks.filter(
          (art) => art.artist_name === session.user.name,
        );

        setArtworks(userSpecificArt);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [session, isPending]);

  // ২. আসল ডিলিট লজিক (Server Action এর মাধ্যমে)
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "আপনি কি নিশ্চিত যে এই আর্টওয়ার্কটি ডিলিট করতে চান?",
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(id); // ডিলিট শুরু হলে ঐ নির্দিষ্ট আইডিতে লোডার দেখাবে
      const response = await deleteArtPost(id);

      if (response.success) {
        alert(response.message);
        // UI স্টেট থেকে ডিলিট হওয়া আইটেমটি ইনস্ট্যান্ট রিমুভ করা
        setArtworks((prev) => prev.filter((art) => art._id !== id));
      } else {
        alert(response.message || "ডিলিট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("সার্ভার কানেকশন ফেইল্ড!");
    } finally {
      setDeletingId(null);
    }
  };

  // লোডিং স্টেট
  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="animate-spin text-slate-500" size={28} />
        <p className="text-sm text-slate-500">ডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* হেডার */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Artworks</h1>
          <p className="text-sm text-slate-500">
            শিল্পী: {session?.user?.name}
          </p>
        </div>
        <Link href="/dashboard/artist/add-artworks">
          <Button className="bg-slate-800 hover:bg-slate-900 text-white gap-2 text-sm">
            <Plus size={16} /> নতুন আর্ট যোগ করুন
          </Button>
        </Link>
      </div>

      {/* আর্টওয়ার্ক লিস্ট/গ্রিড */}
      {artworks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <ImageIcon size={36} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-600 font-medium">
            আপনার যোগ করা কোনো আর্টওয়ার্ক পাওয়া যায়নি!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <Card
              key={art._id}
              className="overflow-hidden border border-slate-200 bg-white rounded-xl flex flex-col"
            >
              {/* ছবি প্রিভিউ */}
              <div className="relative w-full aspect-[4/3] bg-slate-100">
                <Image
                  src={art.image_url || "/placeholder.jpg"}
                  fill
                  className="object-cover"
                  alt={art.title || "Artwork"}
                  unoptimized
                />
              </div>

              {/* মেটা ডেটা ও বাটন */}
              <CardContent className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base truncate">
                    {art.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                      {art.category}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      ${art.price}
                    </span>
                  </div>
                </div>

                {/* অ্যাকশন বাটন সমূহ */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  {/* ৩. ইডিট বাটনকে ডাইনামিক পেইজে লিংকআপ করা হলো */}
                  <Link
                    href={`/dashboard/artist/edit-artworks/${art._id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 h-9"
                    >
                      <FolderEdit size={14} /> Edit
                    </Button>
                  </Link>

                  {/* ৪. ডিলিট বাটন */}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === art._id} // ডিলিট চলাকালীন বাটন ডিজেবল থাকবে
                    onClick={() => handleDelete(art._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 gap-1.5 h-9 shadow-none disabled:opacity-50"
                  >
                    {deletingId === art._id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    {deletingId === art._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageArtWorks;
