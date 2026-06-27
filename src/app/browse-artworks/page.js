"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@heroui/react";
import Link from "next/link";

const BrowseArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, and Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ব্যাকএন্ড ইউআরএল কনফিগারেশন
  const apiUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/arthub/artwork`);

        if (!response.ok) {
          throw new Error("Failed to fetch artworks");
        }

        const data = await response.json();
        if (data) {
          setArtworks(data);
        }
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [apiUrl]);

  // ১. ইউনিক ক্যাটাগরি এক্সট্রাক্ট করা (ডাইনামিক)
  const categories = [
    "All",
    ...new Set(artworks.map((art) => art.category).filter(Boolean)),
  ];

  // ২. ক্লায়েন্ট-সাইড ফিল্টারিং এবং সর্টিং প্রসেসিং
  const processedArtworks = artworks
    .filter((art) => {
      const title = (art.title || "").toLowerCase();

      // ডাটাবেজের artist_name ফিল্ড ব্যাকআপসহ হ্যান্ডেল করা হয়েছে
      const artistName = (
        art.artist_name ||
        art.artist ||
        art.artistName ||
        "Unknown Artist"
      ).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = title.includes(query) || artistName.includes(query);

      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;

      const artPrice = art.price || 0;
      const matchesMinPrice =
        minPrice === "" || artPrice >= parseFloat(minPrice);
      const matchesMaxPrice =
        maxPrice === "" || artPrice <= parseFloat(maxPrice);

      return (
        matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "price-high") {
        return (b.price || 0) - (a.price || 0);
      }
      // ডাটাবেজের date_uploaded এবং createdAt দুইটাই চেক করা হচ্ছে সর্টিং-এর জন্য
      const dateA = a.date_uploaded || a.createdAt || a._id || "";
      const dateB = b.date_uploaded || b.createdAt || b._id || "";
      return dateB.localeCompare(dateA);
    });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            Browse Artworks
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Displaying all original masterpieces directly from the database.
          </p>
        </div>

        {/* Search, Filter, and Sort Controls Panel */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end transition-colors">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-colors [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-950 dark:[&>option]:text-neutral-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Price Range ($)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-colors"
              />
              <span className="text-neutral-400 dark:text-neutral-500 text-sm">
                to
              </span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-colors [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-950 dark:[&>option]:text-neutral-100"
            >
              <option value="newest">Newest Artworks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Artwork Display Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="space-y-4 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm"
              >
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                  <Skeleton className="h-4 w-2/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : processedArtworks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {processedArtworks.map((art) => {
              const artId = art._id || art.id;
              const artImage =
                art.image_url ||
                art.image ||
                "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500";

              // ডেটাবেজের "artist_name" কি-টি এখানে সফলভাবে ব্যবহার করা হয়েছে
              const artistName =
                art.artist_name ||
                art.artist ||
                art.artistName ||
                "Unknown Artist";

              return (
                <div
                  key={artId}
                  className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                    <img
                      src={artImage}
                      alt={art.title || "Artwork"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-neutral-700 dark:text-neutral-300 shadow-sm z-10">
                      {art.category || "Art"}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-neutral-800 dark:text-neutral-100 line-clamp-1 group-hover:underline transition-colors">
                        {art.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                        by {artistName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-lg font-black text-neutral-900 dark:text-neutral-50">
                        ${art.price || 0}
                      </span>
                      <Link
                        href={`/artwork-detail/${artId}`}
                        className="text-xs font-bold text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-700 group-hover:text-white dark:group-hover:text-neutral-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <p className="text-neutral-400 dark:text-neutral-500 font-medium">
              No matching artworks found. Try refining your search parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseArtworksPage;
