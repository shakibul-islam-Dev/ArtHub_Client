"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { Calendar, Tag } from "lucide-react";

const BoughtArtworksPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

  // States
  const [boughtArtworks, setBoughtArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটাবেজ থেকে কেনা আর্টওয়ার্কের ডেটা নিয়ে আসা
  useEffect(() => {
    const fetchBoughtArtworks = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        // আপনার ট্রানজেকশন হিস্ট্রি এপিআই কল করা হচ্ছে (যা আমরা একটু আগে ব্যাকএন্ডে ফিক্স করেছি)
        const res = await fetch(
          `${apiUrl}/api/arthub/checkout/history/${session.user.id}`,
        );
        const result = await res.json();

        if (result.success) {
          setBoughtArtworks(result.data);
        }
      } catch (error) {
        console.error("Error fetching bought artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtArtworks();
  }, [session?.user?.id, apiUrl]);

  // সেশন বা এপিআই লোড হওয়ার মেইন স্পিনার
  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-white dark:bg-neutral-950">
        <Spinner size="lg" color="primary" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Loading your collection...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen transition-colors duration-300">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            Bought Artworks
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            Browse through and manage your personal collection of purchased
            masterpieces.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 self-start sm:self-auto">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Total Collection:
          </span>
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {boughtArtworks.length} Items
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      {boughtArtworks.length === 0 ? (
        <div className="text-center py-24 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            No artworks purchased yet.
          </p>
          <Link
            href="/artworks"
            className="mt-4 inline-flex text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl"
          >
            Explore Masterpieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boughtArtworks.map((item) => {
            // পপুলেট হওয়া অবজেক্ট থেকে আর্টওয়ার্কের মূল ডাটা রিড করা হচ্ছে
            const art = item.artworkId || {};
            const artworkId = art._id || item.artworkId;
            const artworkTitle = art.title || "Deleted Artwork";
            const artworkImage = art.imageUrl || art.image_url || null;
            const artistName = art.artistName || "Unknown Artist";
            const category = art.category || "General";

            return (
              <div
                key={item._id}
                className="group flex flex-col bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                  {artworkImage ? (
                    <img
                      src={artworkImage}
                      alt={artworkTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-neutral-400 dark:text-neutral-600 flex flex-col items-center gap-1">
                      <Tag size={24} />
                      <span className="text-[10px]">No Image Available</span>
                    </div>
                  )}

                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-neutral-900/70 text-white backdrop-blur-sm rounded-md z-10">
                    {category}
                  </span>
                </div>

                {/* Artwork Content */}
                <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-base line-clamp-1 group-hover:underline transition-all">
                      {artworkTitle}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      By{" "}
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {artistName}
                      </span>
                    </p>
                  </div>

                  {/* Meta details & Action */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500 tracking-wider">
                        Paid Amount
                      </p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ${item.amount}
                      </p>
                    </div>

                    {/* ডিটেইলস দেখার লিংক (যদি আর্টওয়ার্ক ডিলিট না হয়ে থাকে) */}
                    {art._id ? (
                      <Link
                        href={`/artwork/${artworkId}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all duration-150"
                      >
                        View Details
                      </Link>
                    ) : (
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-600 italic">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BoughtArtworksPage;
