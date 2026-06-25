"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Tag,
  User,
  Trash2,
  Edit3,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function ArtworkDetail() {
  const apiUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  // Better-Auth সেশন ডেটা
  const { data: session, isPending: sessionLoading } = useSession();

  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Comment Editing States
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // আর্টওয়ার্ক ডেটা ফেচ
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
          setComments(data.comments || []);
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

  // পারচেজ হ্যান্ডলার
  const handlePurchase = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // ইউজার রোল যদি আর্টিস্ট হয়, তবে সে পারচেজ করতে পারবে না
    if (session.user.role === "artist") {
      alert("Artists are not allowed to purchase artworks!");
      return;
    }

    const artistId = artwork?.artist?._id || artwork?.artist;
    if (session.user.id === artistId) {
      alert("You cannot buy your own artwork!");
      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(`${apiUrl}/api/arthub/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkId: artwork._id,
          userId: session.user.id,
        }),
      });

      const checkoutData = await res.json();
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        alert("Failed to initiate checkout");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // কমেন্ট সাবমিট
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/api/arthub/artwork/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          userId: session.user.id,
          username: session.user.name,
        }),
      });

      if (res.ok) {
        const updatedArtwork = await res.json();
        setComments(updatedArtwork.comments || []);
        setNewComment("");
      }
    } catch (err) {
      console.error("Comment post error:", err);
    }
  };

  // কমেন্ট এডিট সেভ
  const handleEditSubmit = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/arthub/artwork/${id}/comment/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editingText }),
        },
      );

      if (res.ok) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, text: editingText } : c,
          ),
        );
        setEditingCommentId(null);
        setEditingText("");
      }
    } catch (err) {
      console.error("Comment edit error:", err);
    }
  };

  // কমেন্ট ডিলিট
  const handleCommentDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/arthub/artwork/${id}/comment/${commentId}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Comment delete error:", err);
    }
  };

  // আর্টওয়ার্ক পোস্ট ডিলিট
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/arthub/artwork/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Artwork delete error:", err);
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

  const artImage = artwork.imageUrl || artwork.image_url || artwork.image;
  const artistName =
    artwork.artist?.name || artwork.artist || artwork.artistName;
  const artistId = artwork.artist?._id || artwork.artist;

  // কারেন্ট সেশন ইউজার আইডি মিলিয়ে ওনারশিপ চেক
  const isArtistOwner = session?.user?.id === artistId;

  // 🛠️ মেইন কন্ডিশন: লগইন করা ইউজারের রোল যদি "artist" হয়, তবে পারচেজ বাটন ইনঅ্যাক্টিভ হবে
  const isPurchaseDisabled = session?.user?.role === "artist";

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
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
                    {artwork.description ||
                      "No description provided for this artwork."}
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
                  {artwork.createdAt && (
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Created
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                        {new Date(artwork.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Call To Actions */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 space-y-3">
                {isArtistOwner && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/artist/edit-artwork/${id}`)
                      }
                      className="h-12 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.99]"
                    >
                      <Edit3 size={16} className="mr-2" />
                      Edit Post
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      className="h-12 font-bold rounded-xl transition-all shadow-md active:scale-[0.99]"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                )}

                {/* 🛠️ ইউজার রোল 'artist' হলে পারচেজ বাটনটি ডিসেবলড এবং ইনঅ্যাক্টিভ দেখাবে */}
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
                    {actionLoading
                      ? "Processing order..."
                      : "Purchase Masterpiece"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Community Discussion */}
        <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-lg p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Community Discussion
            </h2>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                session?.user
                  ? "Share your thoughts about this artwork..."
                  : "Please log in to comment..."
              }
              disabled={!session?.user}
              rows={3}
              className="w-full p-3.5 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none disabled:opacity-60"
              required
            />
            {session?.user && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 font-semibold rounded-xl px-5 transition-all shadow-sm"
                >
                  Comment
                </Button>
              </div>
            )}
          </form>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
                No comments posted yet.
              </p>
            ) : (
              comments.map((comment) => {
                const isCommentOwner =
                  session?.user?.id === comment.userId ||
                  comment.username === session?.user?.name;
                const isEditing = editingCommentId === comment._id;

                return (
                  <div
                    key={comment._id}
                    className="p-4 bg-gray-50/60 dark:bg-gray-950/40 rounded-xl border border-gray-100 dark:border-gray-800/80 space-y-2.5 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                        {comment.username}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                        {comment.createdAt &&
                          new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-1">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-gray-950 border border-blue-500 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none"
                          rows={2}
                        />
                        <div className="flex space-x-2 text-xs">
                          <button
                            onClick={() => handleEditSubmit(comment._id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md"
                          >
                            Save Change
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 break-words leading-relaxed">
                          {comment.text}
                        </p>

                        {isCommentOwner && (
                          <div className="flex items-center space-x-2.5 shrink-0 pt-0.5">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditingText(comment.text);
                              }}
                              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleCommentDelete(comment._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
