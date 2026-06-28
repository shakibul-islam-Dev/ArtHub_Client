"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Star, Heart, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/arthub/artwork`,
        );
        if (!res.ok) {
          throw new Error("Failed to load category data from artworks");
        }

        const data = await res.json();
        const artworkList = Array.isArray(data) ? data : data?.data || [];

        const categoryMap = {};

        artworkList.forEach((art) => {
          const categoryName = art.category || "General Art";

          if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = {
              id: categoryName.toLowerCase().replace(/\s+/g, "-"),
              name: categoryName,
              coverImage:
                art.imageUrl ||
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
              ratingSum: 0,
              artworksCount: 0,
              likesSum: 0,
              soldCount: 0,
            };
          }

          categoryMap[categoryName].artworksCount += 1;
          categoryMap[categoryName].ratingSum += Number(art.rating || 4.7);
          categoryMap[categoryName].likesSum += Number(
            art.likes || art.views || 120,
          );

          if (art.isSold || art.status === "sold") {
            categoryMap[categoryName].soldCount += 1;
          } else {
            categoryMap[categoryName].soldCount += Number(art.soldCount || 0);
          }
        });

        const processedCategories = Object.values(categoryMap).map((cat) => {
          const avgRating = (cat.ratingSum / cat.artworksCount).toFixed(1);

          const formattedLikes =
            cat.likesSum >= 1000
              ? `${(cat.likesSum / 1000).toFixed(1)}K`
              : cat.likesSum.toString();

          return {
            id: cat.id,
            name: cat.name,
            specialty: `${cat.artworksCount} ${cat.artworksCount === 1 ? "Piece" : "Pieces"} Available`,
            coverImage: cat.coverImage,
            rating: avgRating,
            followers: formattedLikes,
            soldCount: cat.soldCount,
            totalArtworks: cat.artworksCount,
          };
        });

        const topCategories = processedCategories
          .sort((a, b) => b.totalArtworks - a.totalArtworks)
          .slice(0, 3);

        setCategories(topCategories);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse">
          Curating Top Categories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-4">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-gray-100 dark:border-gray-900 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Sparkles size={14} />
            <span>Trending Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Top Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore the most sought-after styles and movements in Art Hub.
          </p>
        </div>
        <Button
          variant="light"
          className="group text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-4 h-10 rounded-lg transition-all"
          asChild
        >
          <Link href="/browse-artworks">
            View Full Directory
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-border text-muted-foreground text-sm">
            No active categories found at the moment.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="group flex flex-col w-full bg-white dark:bg-gray-900/20 border border-gray-200/80 dark:border-gray-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-500"
            >
              {/* Cover Image Container */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-muted relative">
                <Image
                  src={category.coverImage}
                  alt={`${category.name} collection`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Visual Category Label Floating on Image */}
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/90 dark:bg-gray-900/90 text-foreground px-3 py-1.5 rounded-md shadow-sm backdrop-blur-sm">
                    {category.specialty.split(" ")[0]} Items
                  </span>
                </div>
              </div>

              {/* Meta & Actions Info Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-1">
                    Curated Masterpieces & Originals
                  </p>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 border-y border-gray-100 dark:border-gray-800/60 py-3.5 text-center">
                  <div className="space-y-1 border-r border-gray-100 dark:border-gray-800/60">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Rating
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                      <Star
                        size={14}
                        className="text-amber-500 fill-amber-500"
                      />
                      <span>{category.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 border-r border-gray-100 dark:border-gray-800/60">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Appreciation
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                      <Heart
                        size={14}
                        className="text-rose-500 fill-rose-500"
                      />
                      <span>{category.followers}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Acquired
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {category.soldCount}{" "}
                      <span className="text-[11px] font-medium text-muted-foreground">
                        pcs
                      </span>
                    </p>
                  </div>
                </div>

                {/* Call To Action Button */}
                <Button
                  variant="flat"
                  className="w-full text-xs font-semibold h-11 bg-gray-50 hover:bg-blue-600 dark:bg-gray-900/60 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white text-foreground rounded-xl transition-all duration-300"
                  asChild
                >
                  <Link
                    href={`/browse-artworks?category=${encodeURIComponent(category.name)}`}
                  >
                    Browse Collection
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TopCategories;
