"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          ` ${process.env.NEXT_PUBLIC_URL}/api/arthub/artwork`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch artworks");
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setArtworks(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (artworks.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [artworks, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % artworks.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length,
    );
  };

  const currentBgImage =
    artworks[currentIndex]?.image_url || artworks[currentIndex]?.image || "";

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {currentBgImage && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center filter blur-sm pointer-events-none"
            style={{ backgroundImage: `url(${currentBgImage})` }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center w-full py-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 text-sm font-medium mb-6 shadow-sm backdrop-blur-sm"
        >
          <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Total {artworks.length || 0}+ Masterpieces Live</span>
        </motion.div>

        {/* Banner Title / Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight"
        >
          Discover & Buy <br />
          <span className="text-blue-600 dark:text-blue-500">Original Art</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl font-normal leading-relaxed"
        >
          Explore a curated universe of digital concepts, traditional paintings,
          and futuristic designs directly from global creators.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={() => router.push("/browse-artworks")}
            className="group px-8 py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded-xl flex items-center gap-2.5 transition-all duration-200 shadow-md shadow-blue-600/10 hover:shadow-lg text-base"
          >
            Browse Artworks
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {artworks.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm transition-all hidden md:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm transition-all hidden md:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {artworks.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-5 bg-blue-600 dark:bg-blue-500"
                  : "w-1.5 bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom Subtle Border Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 dark:bg-gray-900" />
    </section>
  );
}
