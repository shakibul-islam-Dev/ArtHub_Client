import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ডেমো আর্টিস্ট ডাটা (৩ জন আর্টিস্ট)
const DEMO_ARTISTS = [
  {
    id: "1",
    name: "Zainul Abedin",
    specialty: "Fine Arts & Sketching",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80",
    totalArtworks: 42,
    rating: 4.9,
    followers: "12.5K",
  },
  {
    id: "2",
    name: "S M Sultan",
    specialty: "Oil Painting",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
    totalArtworks: 28,
    rating: 4.8,
    followers: "9.2K",
  },
  {
    id: "3",
    name: "Shahabuddin Ahmed",
    specialty: "Contemporary Impressionism",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80",
    totalArtworks: 35,
    rating: 4.9,
    followers: "15.1K",
  },
];

const TopArtist = () => {
  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* হেডার সেকশন: মোবাইলে ফ্লেক্স-কলাম এবং ট্যাবে ফ্লেক্স-রো */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Top Artists
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            আমাদের প্ল্যাটফর্মের জনপ্রিয় এবং শীর্ষস্থানীয় শিল্পীদের প্রোফাইল
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto gap-2 text-sm h-9 native-touch-target"
          asChild
        >
          <Link href="/artists">
            View All Artists <ArrowRight size={16} />
          </Link>
        </Button>
      </div>

      {/* আর্টিস্ট কার্ড গ্রিড: রেসপনসিভ ব্রেকপয়েন্ট অ্যাডজাস্টমেন্ট */}
      {/* ৩টি কার্ডের জন্য md:grid-cols-3 ব্যবহার করা হয়েছে যাতে বড় স্ক্রিনে ডানপাশ খালি না থাকে */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {DEMO_ARTISTS.map((artist) => (
          <div
            key={artist.id}
            className="group relative bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full"
          >
            {/* কভার ইমেজ কন্টেইনার */}
            <div className="h-28 sm:h-32 w-full overflow-hidden bg-muted relative">
              <Image
                src={artist.coverImage}
                alt={`${artist.name} cover`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* প্রোফাইল কন্টেন্ট সেকশন */}
            <div className="p-5 pt-0 flex-1 flex flex-col items-center text-center relative">
              {/* আর্টিস্ট অ্যাভাটার */}
              <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden -mt-8 bg-muted shadow-sm z-10 relative">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* নাম এবং স্পেশালটি */}
              <div className="mt-3 flex-1 w-full">
                <h3 className="font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                  {artist.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
                  {artist.specialty}
                </p>
              </div>

              {/* রেটিং ও ফলোয়ার সংখ্যা: ছোট স্ক্রিনেও যাতে টেক্সট ওভারল্যাপ না করে */}
              <div className="flex items-center justify-around gap-2 my-4 w-full border-y border-border/60 py-2.5 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-foreground">{artist.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart
                    size={14}
                    className="text-destructive fill-destructive/10"
                  />
                  <span className="text-foreground">{artist.followers}</span>
                </div>
                <div>
                  <span className="text-foreground">
                    {artist.totalArtworks}
                  </span>{" "}
                  Arts
                </div>
              </div>

              {/* প্রোফাইল দেখার বাটন */}
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-medium h-9"
                asChild
              >
                <Link href={`/artists/${artist.id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtist;
