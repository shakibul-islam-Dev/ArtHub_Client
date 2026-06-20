"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

// ১. ডেমো আর্টওয়ার্ক ডাটা সেটআপ
const DEMO_ARTWORKS = [
  {
    id: 1,
    title: "Mystic Crimson",
    artist: "Anika Rahman",
    price: 120,
    category: "Painting",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500",
    date: "2026-05-10",
  },
  {
    id: 2,
    title: "Neon Cyberpunk City",
    artist: "Zayan Islam",
    price: 85,
    category: "Digital Art",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500",
    date: "2026-06-01",
  },
  {
    id: 3,
    title: "Silent Marble Meditation",
    artist: "Sufian Ahmed",
    price: 450,
    category: "Sculpture",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500",
    date: "2026-04-15",
  },
  {
    id: 4,
    title: "Golden Hour Symphony",
    artist: "Anika Rahman",
    price: 190,
    category: "Painting",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=500",
    date: "2026-06-18",
  },
  {
    id: 5,
    title: "Abstract Geometry",
    artist: "Tahmid Hasan",
    price: 65,
    category: "Digital Art",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    date: "2026-02-20",
  },
  {
    id: 6,
    title: "Ethereal Echoes",
    artist: "Zayan Islam",
    price: 310,
    category: "Painting",
    image: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=500",
    date: "2026-06-19",
  },
  {
    id: 7,
    title: "Clay of the Soul",
    artist: "Sufian Ahmed",
    price: 220,
    category: "Sculpture",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500",
    date: "2026-05-25",
  },
  {
    id: 8,
    title: "Fragments of Time",
    artist: "Tahmid Hasan",
    price: 140,
    category: "Digital Art",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?w=500",
    date: "2026-06-05",
  },
];

const BrowseArtworksPage = () => {
  // ২. স্টেটস (State Management)
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState(500); // ম্যাক্সিমাম প্রাইজ লিমিট

  // ৩. ডামি লোডিং ইফেক্ট (Real-life API Fetching এর অনুভূতি দেওয়ার জন্য)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // ৪. ফিল্টারিং এবং সর্টিং লজিক
  const filteredArtworks = DEMO_ARTWORKS.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.artist.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || art.category === category;
    const matchesPrice = art.price <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return new Date(b.date) - new Date(a.date); // Default: Newest
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* হেডার সেকশন */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Browse Artworks
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore and collect original masterpieces from global creators.
            </p>
          </div>

          {/* সার্চ ইনপুট */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* ফিল্টার এবং কন্ট্রোল বার */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            {/* ক্যাটাগরি ফিল্টার */}
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Painting">Painting</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Sculpture">Sculpture</option>
              </select>
            </div>

            {/* সর্টিং ফিল্টার */}
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* প্রাইজ রেঞ্জ স্লাইডার */}
          <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[200px]">
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-blue-600 font-bold">${priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* আর্টওয়ার্ক ডিসপ্লে গ্রিড */}
        {loading ? (
          // রিকোয়ারমেন্ট অনুযায়ী রেসপন্সিভ স্কেলিটন লোডার
          // mobile: 2 cols | tablet: 3 cols | desktop: 4 cols
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
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
        ) : filteredArtworks.length > 0 ? (
          // রেসপন্সিভ আর্ট কার্ড গ্রিড
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* ইমেজ কন্টেইনার */}
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <Image
                    src={art.image}
                    alt={art.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-slate-700 shadow-sm">
                    {art.category}
                  </span>
                </div>

                {/* আর্ট ডিটেইলস */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      by {art.artist}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="text-lg font-black text-slate-900">
                      ${art.price}
                    </span>
                    <Link
                      href={`/artwork-details`}
                      className="text-xs font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ফিল্টারের সাথে কোনো ডাটা ম্যাচ না করলে ফ্রেন্ডলি মেসেজ
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 font-medium">
              No artworks match your selected filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setPriceRange(500);
                setSortBy("newest");
              }}
              className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseArtworksPage;
