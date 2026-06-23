"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const BoughtArtworksPage = () => {
  const boughtArtworks = [
    {
      id: "art-001",
      title: "Serenity of Cyberpunk",
      artist: "Alex Rivers",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-06-15",
      price: "$120.00",
      category: "Digital Art",
    },
    {
      id: "art-002",
      title: "Abstract Echoes",
      artist: "Elena Rostova",
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-05-28",
      price: "$350.00",
      category: "Canvas Painting",
    },
    {
      id: "art-003",
      title: "Neon Dreams",
      artist: "Marcus Vance",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-04-12",
      price: "$85.00",
      category: "3D Render",
    },
    {
      id: "art-004",
      title: "Whispering Woods",
      artist: "Sophia Martinez",
      image:
        "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-03-05",
      price: "$210.00",
      category: "Watercolor",
    },
  ];

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
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            No artworks purchased yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boughtArtworks.map((art) => (
            <div
              key={art.id}
              className="group flex flex-col bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-w-7xl) 25vw, (max-w-md) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-neutral-900/70 text-white backdrop-blur-sm rounded-md z-10">
                  {art.category}
                </span>
              </div>

              {/* Artwork Content */}
              <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-base line-clamp-1 group-hover:underline transition-all">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    By{" "}
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {art.artist}
                    </span>
                  </p>
                </div>

                {/* Meta details & Action */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500 tracking-wider">
                      Purchased
                    </p>
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {art.purchaseDate}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/artworks/${art.id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all duration-150"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoughtArtworksPage;
