"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndExtractArtists = async () => {
      try {
        // আপনার বিদ্যমান আর্টওয়ার্ক এপিআই থেকেই ডেটা ফেচ করছি
        const response = await fetch(
          "http://localhost:5000/api/arthub/artwork",
        );
        if (!response.ok) throw new Error("Failed to fetch artworks");

        const artworks = await response.json();

        // আর্টওয়ার্ক ডেটা থেকে ইউনিক আর্টিস্ট ফিল্টার এবং গণনা করার লজিক
        const artistMap = {};

        artworks.forEach((art) => {
          // আপনার ডাটাবেজের ফিল্ডের নাম অনুযায়ী নিচের প্রোপার্টিগুলো চেঞ্জ করতে পারেন
          // (যেমন: art.artist_name অথবা art.user?.name)
          const artistName =
            art.artist_name || art.user?.name || "Unknown Artist";
          const artistAvatar =
            art.artist_avatar ||
            art.user?.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";

          if (artistMap[artistName]) {
            artistMap[artistName].count += 1;
          } else {
            artistMap[artistName] = {
              avatar: artistAvatar,
              count: 1,
            };
          }
        });

        // অবজেক্টকে অ্যারেতে কনভার্ট করে সর্বোচ্চ আর্টওয়ার্ক আপলোড করা ৪ জন আর্টিস্টকে সর্ট করা
        const extractedArtists = Object.keys(artistMap).map((name) => ({
          name,
          avatar: artistMap[name].avatar,
          totalArtworks: artistMap[name].count,
        }));

        // সবচেয়ে বেশি আর্টওয়ার্ক যার, তাকে আগে রেখে সর্ট (Descending Order)
        const topArtists = extractedArtists
          .sort((a, b) => b.totalArtworks - a.totalArtworks)
          .slice(0, 4); // প্রথম ৪ জন টপ আর্টিস্ট নিচ্ছি

        setArtists(topArtists);
      } catch (error) {
        console.error("Error extracting top artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndExtractArtists();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 text-center text-gray-500">
        Loading Top Creators...
      </div>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-semibold w-fit mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Top Creators</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Meet Our{" "}
            <span className="text-blue-600 dark:text-blue-500">
              Top Artists
            </span>
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
            The creative minds behind the most trending and breathtaking
            masterpieces.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative group overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/5 hover:border-blue-100 dark:hover:border-blue-900/30"
            >
              {/* Profile Image Wrap */}
              <div className="relative w-24 h-24 rounded-full mb-4 p-1 bg-gradient-to-tr from-blue-500 to-purple-500 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-full bg-white dark:bg-gray-800"
                />
              </div>

              {/* Artist Info */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {artist.name}
              </h3>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Digital Creator
              </p>

              {/* Stats/Metrics */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60 w-full flex justify-center items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {artist.totalArtworks}
                </span>
                <span>Artworks Live</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
