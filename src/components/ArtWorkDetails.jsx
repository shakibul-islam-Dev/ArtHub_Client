"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSingleArtPost } from "@/lib/actions/arthubdatabse";
import Image from "next/image";
import Link from "next/link";

const MOCK_COMMENTS = [
  {
    _id: "c1",
    username: "Anika_ArtLover",
    text: "The color contrast in this piece is absolutely magnificent! Captures the true essence of Dhaka rain.",
    createdAt: "2026-06-16T14:22:00.000Z",
  },
  {
    _id: "c2",
    username: "Rahat_007",
    text: "Is there a physical canvas version available or is this strictly digital?",
    createdAt: "2026-06-17T09:05:00.000Z",
  },
];

export default function ArtworkDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Comment Editing States
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [user] = useState({
    id: "user_123",
    token: "mock_jwt_token",
    role: "buyer",
  });

  useEffect(() => {
    const fetchArtworkData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(false);
        const data = await getSingleArtPost(id);
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
  }, [id]);

  const handlePurchase = () => {
    if (!user) return router.push("/login");
    if (user.id === artwork?.artist?._id || user.id === artwork?.artist) {
      alert("You cannot buy your own artwork!");
      return;
    }
    setActionLoading(true);
    alert(
      `Redirecting to Stripe Checkout for: ${artwork?.title} ($${artwork?.price})`,
    );
    setActionLoading(false);
  };

  // Create Comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      _id: `c_${Date.now()}`,
      username: "You (Logged In User)",
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  // Setup Edit Mode
  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  // Save Edited Comment
  const handleEditSubmit = (commentId) => {
    if (!editingText.trim()) return;

    setComments(
      comments.map((c) =>
        c._id === commentId
          ? { ...c, text: editingText, createdAt: new Date().toISOString() }
          : c,
      ),
    );
    setEditingCommentId(null);
    setEditingText("");
  };

  // Delete Comment
  const handleCommentDelete = (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      setComments(comments.filter((c) => c._id !== commentId));
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this artwork?")) {
      alert("Artwork deleted successfully! (Mock Action)");
      router.push("/");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-[#8be9fd] bg-[#282a36] min-h-screen flex flex-col gap-2 items-center justify-center font-semibold">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#44475a] border-t-[#bd93f9]" />
        Loading artwork metrics...
      </div>
    );

  if (error || !artwork)
    return (
      <div className="p-6 text-[#ff5555] bg-[#282a36] min-h-screen flex flex-col gap-4 items-center justify-center">
        <p className="text-xl font-bold">Artwork not found</p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#44475a] text-white text-sm rounded-lg hover:bg-[#6272a4] transition"
        >
          Back to Gallery
        </Link>
      </div>
    );

  const artImage = artwork.imageUrl || artwork.image_url || artwork.image;
  const artistName =
    artwork.artist?.name ||
    artwork.artist ||
    artwork.artistName ||
    "Unknown Artist";
  const artistId = artwork.artist?._id || artwork.artist || "unknown";
  const isArtistOwner = user?.id === artistId;

  return (
    <div className="min-h-screen bg-[#282a36] text-[#f8f8f2] p-6">
      <div className="max-w-6xl mx-auto bg-[#1e1f29] rounded-xl overflow-hidden shadow-2xl border border-[#44475a]">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left: Image Card */}
          <div className="relative w-full h-[450px] rounded-lg overflow-hidden bg-[#282a36] border border-[#44475a]">
            <Image
              src={artImage}
              alt={artwork.title || "Artwork"}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          {/* Right: Info Card */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-[#bd93f9] text-[#282a36] text-xs font-bold rounded-full tracking-wider uppercase">
                {artwork.category || "Art"}
              </span>
              <h1 className="text-3xl font-bold text-[#8be9fd]">
                {artwork.title || "Untitled"}
              </h1>

              <p className="text-sm text-[#6272a4]">
                By:{" "}
                <Link
                  href={`/artists/${artistId}`}
                  className="text-[#ff79c6] hover:underline font-medium"
                >
                  {artistName}
                </Link>
              </p>

              <p className="text-[#f8f8f2] leading-relaxed bg-[#282a36] p-4 rounded-lg border border-[#44475a]">
                {artwork.description ||
                  "No description provided for this artwork."}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#44475a]">
                <div>
                  <p className="text-xs text-[#6272a4]">Price</p>
                  <p className="text-2xl font-bold text-[#50fa7b]">
                    ${(artwork.price || 0).toLocaleString()}
                  </p>
                </div>
                {artwork.createdAt && (
                  <div className="text-right">
                    <p className="text-xs text-[#6272a4]">Uploaded On</p>
                    <p className="text-sm">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 pt-4 border-t border-[#44475a]">
              {isArtistOwner ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => alert("Navigating to edit form...")}
                    className="flex-1 py-3 bg-[#ffb86c] text-[#282a36] font-bold rounded-lg hover:bg-[#ffb86c]/90 transition"
                  >
                    Edit Artwork
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-[#ff5555] text-white font-bold rounded-lg hover:bg-[#ff5555]/90 transition"
                  >
                    Delete Artwork
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={actionLoading}
                  className="w-full py-4 bg-[#50fa7b] text-[#282a36] font-bold text-lg rounded-lg hover:bg-[#50fa7b]/90 transition disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : "Purchase Artwork"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-[#44475a] p-6 bg-[#282a36]/50">
          <h2 className="text-xl font-bold text-[#8be9fd] mb-4">Discussion</h2>

          {/* Comment Creation Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this artwork..."
              rows={3}
              className="w-full p-3 bg-[#282a36] border border-[#44475a] rounded-lg focus:outline-none focus:border-[#bd93f9] text-[#f8f8f2] placeholder-[#6272a4]"
              required
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#bd93f9] text-[#282a36] font-bold rounded-lg hover:bg-[#bd93f9]/90 transition"
            >
              Post Comment
            </button>
          </form>

          {/* Comments Feed */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {comments.map((comment) => {
              // Permit editing/deleting mock items explicitly tagged as current user
              const isCommentOwner =
                comment.username === "You (Logged In User)";
              const isEditing = editingCommentId === comment._id;

              return (
                <div
                  key={comment._id}
                  className="p-4 bg-[#1e1f29] rounded-lg border border-[#44475a] flex flex-col justify-between space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-[#ff79c6]">
                      {comment.username}
                    </span>
                    <span className="text-xs text-[#6272a4]">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {isEditing ? (
                    /* Edit Mode Input Layout */
                    <div className="space-y-2 mt-1">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full p-2 bg-[#282a36] border border-[#bd93f9] rounded text-sm text-[#f8f8f2] focus:outline-none"
                        rows={2}
                      />
                      <div className="flex space-x-2 text-xs">
                        <button
                          onClick={() => handleEditSubmit(comment._id)}
                          className="px-3 py-1 bg-[#50fa7b] text-[#282a36] font-bold rounded hover:bg-[#50fa7b]/90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 bg-[#44475a] text-white rounded hover:bg-[#6272a4]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Mode Text & Actions Layout */
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <p className="text-sm text-[#f8f8f2] flex-1 break-words">
                        {comment.text}
                      </p>

                      {isCommentOwner && (
                        <div className="flex space-x-3 text-xs font-semibold shrink-0 pt-1 sm:pt-0">
                          <button
                            onClick={() => startEditing(comment)}
                            className="text-[#ffb86c] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCommentDelete(comment._id)}
                            className="text-[#ff5555] hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
