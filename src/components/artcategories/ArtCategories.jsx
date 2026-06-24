import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Palette,
  Brush,
  ShieldAlert,
  Layers,
  ArrowUpRight,
} from "lucide-react";

// ডেমো ক্যাটাগরি ডাটা
const CATEGORIES = [
  {
    id: "painting",
    name: "Painting",
    count: "1,240+ Artworks",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80",
    icon: Brush,
    bgColor: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "digital",
    name: "Digital Art",
    count: "850+ Artworks",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    icon: Palette,
    bgColor: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "sculpture",
    name: "Sculpture",
    count: "320+ Artworks",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
    icon: Layers,
    bgColor: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "sketch",
    name: "Sketch",
    count: "640+ Artworks",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80",
    icon: ShieldAlert, // এটি একটি সিম্বলিক আইকন হিসেবে রাখা হয়েছে, প্রয়োজনে অন্য আইকন দিতে পারেন
    bgColor: "from-emerald-500/20 to-teal-500/20",
  },
];

const ArtCategories = () => {
  return (
    <div className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* হেডার সেকশন */}
      <div className="border-b border-border pb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Browse by Category
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          আপনার পছন্দের মাধ্যমের ওপর ভিত্তি করে বিভিন্ন ক্যাটাগরির
          আর্টওয়ার্কগুলো এক্সপ্লোর করুন
        </p>
      </div>

      {/* ক্যাটাগরি গ্রিড লেআউট */}
      {/* মোবাইলে ১টি, ট্যাবলেটে ২টি এবং লার্জ স্ক্রিনে ৪টি কলামে সুন্দরভাবে রেসপনসিভ হবে */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              href={`/artworks?category=${category.id}`}
              className="group relative bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col h-64"
            >
              {/* ব্যাকগ্রাউন্ড ইমেজ ও গ্রেডিয়েন্ট ওভারলে */}
              <div className="absolute inset-0 z-0 bg-muted">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* ডার্ক এবং ব্লেন্ডেড ওভারলে টেক্সট ক্লিয়ার দেখার জন্য */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              </div>

              {/* কন্টেন্ট সেকশন (ইমেজের ওপর ভাসমান) */}
              <div className="relative z-10 p-5 flex flex-col justify-between h-full text-white">
                {/* আইকন ব্যাজ */}
                <div className="flex justify-between items-start">
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${category.bgColor} backdrop-blur-md border border-white/10`}
                  >
                    <IconComponent size={20} className="text-white" />
                  </div>
                  {/* হোভার করলে অ্যারো আইকনটি ওপরে ডানপাশে মুভ করবে */}
                  <div className="p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* টেক্সট ইনফো */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xl tracking-wide group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/70 font-medium">
                    {category.count}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ArtCategories;
