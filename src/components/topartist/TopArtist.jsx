"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const TopArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch data from both APIs concurrently
        const [artworkRes, transactionRes] = await Promise.all([
          fetch("http://localhost:5000/api/arthub/artwork"),
          fetch("http://localhost:5000/api/arthub/transactions"),
        ]);

        if (!artworkRes.ok || !transactionRes.ok) {
          throw new Error("Data Loading Problem");
        }

        const artworks = await artworkRes.json();
        const transactions = await transactionRes.json();

        // 2. Safe parsing of transaction list
        const transactionList = Array.isArray(transactions)
          ? transactions
          : transactions?.data || transactions?.transactions || [];

        // 3. Count completed sales per artist
        const salesCountMap = {};
        if (Array.isArray(transactionList)) {
          transactionList.forEach((tx) => {
            const artistId =
              tx.artistId ||
              (tx.artwork && tx.artwork.artistId) ||
              tx.artist?._id ||
              tx.artist?.id;
            if (artistId) {
              salesCountMap[artistId] = (salesCountMap[artistId] || 0) + 1;
            }
          });
        }

        // 4. Group artworks into unique artist objects
        const artworkList = Array.isArray(artworks)
          ? artworks
          : artworks?.data || [];
        const artistMap = {};

        artworkList.forEach((art) => {
          const artistInfo = art.artist;
          if (!artistInfo) return;

          const artistId = artistInfo.id || artistInfo._id;
          if (!artistId) return;

          if (!artistMap[artistId]) {
            artistMap[artistId] = {
              id: artistId,
              name: artistInfo.name || "Unknown Artist",
              specialty: artistInfo.specialty || art.category || "Artist",
              avatar:
                artistInfo.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
              coverImage:
                artistInfo.coverImage ||
                art.imageUrl ||
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
              totalArtworks: 0,
              rating: artistInfo.rating || 4.5,
              followers: artistInfo.followers || "0",
              soldCount: salesCountMap[artistId] || 0,
            };
          }

          artistMap[artistId].totalArtworks += 1;
        });

        // 5. Convert map to array, sort by sales count, and slice top 3
        const sortedArtists = Object.values(artistMap)
          .sort((a, b) => b.soldCount - a.soldCount)
          .slice(0, 3);

        setArtists(sortedArtists);
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Artist Profiles Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive font-medium">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Top Artists
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Top Artists in the Art Hub
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

      {/* Artist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artists.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No artists found.
          </div>
        ) : (
          artists.map((artist) => (
            <div
              key={artist.id}
              className="group relative bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-full"
            >
              <div className="h-28 sm:h-32 w-full overflow-hidden bg-muted relative">
                <Image
                  src={artist.coverImage}
                  alt={`${artist.name} cover`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="p-5 pt-0 flex-1 flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden -mt-8 bg-muted shadow-sm z-10 relative">
                  <Image
                    src={artist.avatar}
                    alt={artist.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="mt-3 flex-1 w-full">
                  <h3 className="font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
                    {artist.specialty}
                  </p>
                </div>

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
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {artist.soldCount}
                    </span>{" "}
                    Sold ({artist.totalArtworks} Arts)
                  </div>
                </div>

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
          ))
        )}
      </div>
    </div>
  );
};

export default TopArtist;
