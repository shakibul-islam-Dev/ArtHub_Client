"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export default function FeatureArtWorks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArtworks = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${baseUrl}/api/arthub/artwork`);

        if (!response.ok) {
          throw new Error("Failed to fetch artworks");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const latestSix = data.slice(0, 6);
          setArtworks(latestSix);
        }
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArtworks();
  }, []);

  return (
    <section className="w-full py-20 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 block mb-2">
              Curated Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Artworks
            </h2>
          </div>
          <Link
            href="/browse-artworks"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group transition-colors"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100/70 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 animate-pulse"
              >
                <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          /* Artworks Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art, index) => {
              const artImage = art.image_url || "";

              return (
                <motion.div
                  key={art._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800/80 hover:border-blue-500 dark:hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Image Wrapper */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-950">
                    {artImage && (
                      <Image
                        src={artImage}
                        alt={art.title || "Artwork"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                        priority={index < 3}
                      />
                    )}

                    {/* Sold Tag Overlay */}
                    {art.isSold && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-20 shadow-sm uppercase tracking-wider">
                        Sold Out
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <Link
                        href={`/artwork-deatil/${art._id}`}
                        className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-black transition-all shadow-sm"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wider">
                      {art.category
                        ? art.category.replace("-", " ")
                        : "Digital Art"}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {art.title || "Untitled Masterpiece"}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        By{" "}
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {art.artist_name || "Unknown Artist"}
                        </span>
                      </p>
                      {art.price && (
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ${art.price}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
