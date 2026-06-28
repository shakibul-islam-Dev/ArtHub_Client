"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Tag,
  User,
  Trash2,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Comments from "@/components/Comments";
import { toast } from "react-toastify";

export default function ArtworkDetail() {
  const apiUrl = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { data: session, isPending: sessionLoading } = useSession();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (session) {
      console.log("=== Active Session Found ===");
    }
  }, [session]);

  useEffect(() => {
    const fetchArtworkData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`${apiUrl}/api/arthub/artwork/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch artwork detail");
        }

        const data = await response.json();
        if (data) {
          setArtwork(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error reading single artwork client side:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkData();
  }, [id, apiUrl]);

  const artImage = artwork?.image_url || artwork?.imageUrl || artwork?.image;
  const artistName =
    artwork?.artist_name || artwork?.artist?.name || "Unknown Artist";
  const artistId =
    artwork?.artist_id || artwork?.artist?._id || artwork?.artist;
  const artDescription = artwork?.description || artwork?.desc;
  const uploadDate = artwork?.date_uploaded || artwork?.createdAt;

  const isArtistOwner = session?.user?.id === artistId;
  const isPurchaseDisabled = session?.user?.role === "artist";

  const handlePurchase = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (session.user.role === "artist") {
      toast.error("Artists are not allowed to purchase artworks!");
      return;
    }

    if (session.user.id === artistId) {
      toast.error("You cannot buy your own artwork!");
      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(`${apiUrl}/api/arthub/checkout/single-artwork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          artworkId: artwork._id,
          title: artwork.title,
          price: artwork.price,
          imageUrl: artImage,
          userId: session.user.id,
          userEmail: session.user.email,
        }),
      });

      const checkoutData = await res.json();
      if (checkoutData?.success && checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        alert(checkoutData?.message || "Failed to initiate checkout");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || sessionLoading)
    return (
      <div className="min-h-[70vh] flex flex-col gap-3 items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span>Loading artwork metrics...</span>
      </div>
    );

  if (error || !artwork)
    return (
      <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center px-4">
        <div className="p-4 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          <Trash2 size={32} />
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          Artwork not found
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Artwork Main Container */}
      <div className="max-w-6xl mx-auto space-y-8 mb-8">
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Hub
          </Link>
        </div>

        {/* Main Artwork Frame Card */}
        <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800/80 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Wrapper */}
            <div className="relative w-full h-[350px] sm:h-[480px] lg:h-[540px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-inner group aspect-square md:aspect-auto">
              <img
                src={artImage}
                alt={artwork.title || "Artwork"}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Right Column: Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full tracking-wider uppercase border border-blue-100 dark:border-blue-900/30">
                    <Tag size={12} />
                    {artwork.category || "Art"}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {artwork.title || "Untitled"}
                </h1>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User size={14} className="text-gray-500" />
                  </div>
                  <span>By:</span>
                  <Link
                    href={`/artists/${artistId}`}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    {artistName}
                  </Link>
                </div>

                <div className="bg-gray-50/70 dark:bg-gray-950/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 mt-2">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {artDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/60">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Valued At
                    </p>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ${(artwork.price || 0).toLocaleString()}
                    </p>
                  </div>
                  {uploadDate && (
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Created
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                        {new Date(uploadDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Call To Action */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60">
                {isPurchaseDisabled ? (
                  <Button
                    disabled
                    className="w-full h-12 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold text-base rounded-xl cursor-not-allowed opacity-60 transition-all"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {isArtistOwner
                      ? "You Own This Masterpiece"
                      : "Artists Cannot Purchase"}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePurchase}
                    disabled={actionLoading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {actionLoading ? "Processing order..." : "Buy Now"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section Placed Properly at the Bottom */}
      <div className="max-w-6xl mx-auto">
        <Comments
          artworkId={artwork?._id}
          initialComments={artwork?.comments || []}
        />
      </div>
    </div>
  );
}
