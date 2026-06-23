"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { getArtPost } from "@/lib/actions/arthubdatabse";
import Link from "next/link";
import Image from "next/image";

export default function FeatureArtWorks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArtworks = async () => {
      try {
        setLoading(true);
        const data = await getArtPost();
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
    <section className="w-full py-20 bg-[#0b0c10] text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-sm font-semibold tracking-wider uppercase text-cyan-400 block mb-2">
              Curated Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-purple-300">
              Featured Artworks
            </h2>
          </div>
          <Link
            href="/browse-artworks"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 group transition-colors"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 animate-pulse"
              >
                <div className="w-full aspect-[4/3] bg-gray-800 rounded-xl mb-4" />
                <div className="h-5 bg-gray-800 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          /* Artworks Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art, index) => {
              const artImage = art.image_url || art.image || "";
              return (
                <motion.div
                  key={art.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gray-900/30 border border-gray-800/80 hover:border-purple-500/30 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 flex flex-col"
                >
                  {/* Image Wrapper */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-950">
                    {artImage && (
                      <Image
                        src={artImage}
                        alt={art.title || "Artwork"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={index < 3}
                      />
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <Link
                        href={`/artwork/${art.id}`}
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-medium text-cyan-400 mb-1.5 uppercase tracking-wider">
                      {art.category || "Digital Art"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {art.title || "Untitled Masterpiece"}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/60">
                      <p className="text-xs text-gray-500">
                        By{" "}
                        <span className="text-gray-400 font-medium">
                          {art.artist || "Unknown Artist"}
                        </span>
                      </p>
                      {art.price && (
                        <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
