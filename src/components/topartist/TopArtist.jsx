"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const DUMMY_ARTISTS = [
  {
    id: "dummy-1",
    name: "Zainul Abedin",
    specialty: "Fine Arts & Sketching",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    coverImage:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
    totalArtworks: 12,
    rating: 4.9,
    followers: "4.5K",
    soldCount: 38,
  },
  {
    id: "dummy-2",
    name: "S.M. Sultan",
    specialty: "Oil Painting",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    coverImage:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500",
    totalArtworks: 8,
    rating: 4.8,
    followers: "3.2K",
    soldCount: 29,
  },
  {
    id: "dummy-3",
    name: "Shahabuddin Ahmed",
    specialty: "Contemporary Art",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    coverImage:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500",
    totalArtworks: 15,
    rating: 4.7,
    followers: "5.1K",
    soldCount: 24,
  },
];

const TopArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: tokenData, error: tokenError } = await authClient.token();
        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication token missing. Loading showcase...");
        }

        const jwtToken = tokenData.token;
        const baseUrl = process.env.NEXT_PUBLIC_URL;

        const requestHeaders = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        };

        const [artworkRes, transactionRes] = await Promise.all([
          fetch(`${baseUrl}/api/arthub/artwork`, { headers: requestHeaders }),
          fetch(`${baseUrl}/api/arthub/transactions`, {
            headers: requestHeaders,
          }),
        ]);

        if (!artworkRes.ok || !transactionRes.ok) {
          throw new Error("API data unavailable");
        }

        const artworks = await artworkRes.json();
        const transactions = await transactionRes.json();

        const transactionList = Array.isArray(transactions)
          ? transactions
          : transactions?.data || transactions?.transactions || [];

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

        const sortedArtists = Object.values(artistMap)
          .sort((a, b) => b.soldCount - a.soldCount)
          .slice(0, 3);

        if (sortedArtists.length === 0) {
          setArtists(DUMMY_ARTISTS);
        } else {
          setArtists(sortedArtists);
        }
      } catch (err) {
        console.warn("Falling back to dummy data due to:", err.message);

        setArtists(DUMMY_ARTISTS);
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
        {artists.map((artist) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtist;
