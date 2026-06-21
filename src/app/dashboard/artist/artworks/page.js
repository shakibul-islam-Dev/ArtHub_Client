"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Image as ImageIcon, Trash2, FolderEdit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ManageArtWorks = () => {
  // আর্টওয়ার্ক ডেটা স্টেট (ভবিষ্যতে API বা Server Component থেকে পপুলেট করতে পারবেন)
  const [artworks, setArtworks] = useState([]);

  // আর্টওয়ার্ক ডিলিট করার হ্যান্ডলার
  const deleteArtwork = async (id) => {
    try {
      // এখানে ডিলিট সার্ভার অ্যাকশন কল করতে পারেন: await deleteArtAction(id);
      setArtworks(artworks.filter((art) => art.id !== id));
    } catch (error) {
      console.error("Failed to delete artwork:", error);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Manage Artworks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View, organize, and manage your uploaded art creations.
          </p>
        </div>

        {/* <Link href="/dashboard/artist/add-artworks" passHref>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
            <Plus size={16} /> Add Artwork
          </Button>
        </Link> */}
      </div>

      {/* ================= GALLERY CONTAINER ================= */}
      {artworks.length === 0 ? (
        /* 1. Empty State (কোনো আর্টওয়ার্ক না থাকলে) */
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="p-4 bg-white rounded-full shadow-sm text-slate-400 mb-4 border border-slate-100">
            <ImageIcon size={36} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            No Artworks Found
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mt-1">
            Your gallery is empty. Start showcasing your masterpieces today!
          </p>
          <Link href="/dashboard/artist/add-artworks" className="mt-5" passHref>
            <Button
              variant="outline"
              className="border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm"
            >
              Add your first artwork now
            </Button>
          </Link>
        </div>
      ) : (
        /* 2. Artwork Grid Gallery (আর্টওয়ার্ক থাকলে) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <Card
              key={art.id}
              className="group overflow-hidden border border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                <Image
                  src={art.imageUrl || "/placeholder.jpg"}
                  fill
                  sizes="(max-w-7xl) 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={art.title || "Artwork image"}
                  priority={false}
                />
              </div>

              {/* Artwork Meta Details */}
              <CardContent className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-1">
                  <h3
                    className="font-bold text-slate-800 text-base truncate"
                    title={art.title}
                  >
                    {art.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                      {art.category}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      ${Number(art.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <Link
                    href={`/dashboard/artist/edit-artwork/${art.id}`}
                    passHref
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 h-9"
                    >
                      <FolderEdit size={14} /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteArtwork(art.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 flex items-center justify-center gap-1.5 h-9 shadow-none"
                  >
                    <Trash2 size={14} /> Delete
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
