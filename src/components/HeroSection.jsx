"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getArtPost } from "@/lib/actions/arthubdatabse";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const data = await getArtPost();
      if (data && data.length > 0) {
        setArtworks(data);
      }
    };
    getData();
  }, []);

  // অটোমেটিক স্লাইডার ইফেক্ট (৫ সেকেন্ড পরপর চেঞ্জ হবে)
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

  // কারেন্ট স্লাইডের ইমেজ URL বের করার মেথড
  const currentBgImage =
    artworks[currentIndex]?.image_url || artworks[currentIndex]?.image || "";

  return (
    <section className="relative w-full min-h-[90vh] py-12 md:py-0 flex items-center justify-center overflow-hidden bg-[#0b0c10]">
      {/* স্লাইডার ব্যাকগ্রাউন্ড অ্যানিমেশন */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: currentBgImage ? `url(${currentBgImage})` : "none",
          }}
        />
      </AnimatePresence>

      {/* Glowing Tech Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[150px]" />

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Total {artworks.length || 0}+ Masterpieces Live</span>
        </motion.div>

        {/* Banner Title / Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-purple-400 tracking-tight leading-tight"
        >
          Discover & Buy <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
            Original Art
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-base md:text-xl text-gray-400 max-w-2xl font-light tracking-wide"
        >
          Explore a curated universe of digital concepts, traditional paintings,
          and futuristic designs directly from global creators.
        </motion.p>

        {/* CTA Button: Browse Artworks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10"
        >
          <button
            onClick={() => router.push("/browse-artworks")}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-cyan-500/20 text-base"
          >
            Browse Artworks
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* স্লাইডার নেভিগেশন কন্ট্রোল (বাম ও ডান বাটন) */}
      {artworks.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all hidden md:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all hidden md:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* স্লাইডার ডট ইন্ডিকেটরস */}
      {artworks.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-purple-500"
                  : "w-1.5 bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom Subtle Grid Line Effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
    </section>
  );
}
