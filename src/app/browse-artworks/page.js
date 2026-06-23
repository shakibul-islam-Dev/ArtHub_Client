"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@heroui/react";
import { getArtPost } from "@/lib/actions/arthubdatabse";
import Link from "next/link";
import Image from "next/image";

const BrowseArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, and Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const data = await getArtPost();
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
  }, []);

  // 1. Extract unique categories dynamically from database results
  const categories = [
    "All",
    ...new Set(artworks.map((art) => art.category).filter(Boolean)),
  ];

  // 2. Client-side Processing: Filter and Sort logic combined
  const processedArtworks = artworks
    .filter((art) => {
      const title = (art.title || "").toLowerCase();
      const artist = (art.artist || art.artistName || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = title.includes(query) || artist.includes(query);

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
      // 'newest' fallback: sorting by date/id descending
      const dateA = a.createdAt || a._id || a.id || "";
      const dateB = b.createdAt || b._id || b.id || "";
      return dateB.localeCompare(dateA);
    });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Browse Artworks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Displaying all original masterpieces directly from the database.
          </p>
        </div>

        {/* Search, Filter, and Sort Controls Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Price Range ($)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                className="space-y-4 border border-slate-100 p-4 rounded-2xl bg-white shadow-sm"
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
              const artistName =
                art.artist || art.artistName || "Unknown Artist";

              return (
                <div
                  key={artId}
                  className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                    <Image
                      src={artImage}
                      alt={art.title || "Artwork"}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-slate-700 shadow-sm">
                      {art.category || "Art"}
                    </span>
                  </div>

                  {/* Artwork Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {art.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        by {artistName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <span className="text-lg font-black text-slate-900">
                        ${art.price || 0}
                      </span>
                      <Link
                        href={`/artwork-detail/${artId}`}
                        className="text-xs font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-3 py-1.5 rounded-lg transition-all"
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
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 font-medium">
              No matching artworks found. Try refining your search parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseArtworksPage;
