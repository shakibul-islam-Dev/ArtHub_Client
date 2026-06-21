"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// --- ডেমো ডাটা (MOCK DATA) ---
const MOCK_ARTWORK = {
  _id: "art_999",
  title: "Stormy Nights Over Dhaka",
  description:
    "A breathtaking digital painting capturing the raw emotion and chaotic beauty of a monsoon thunderstorm over the urban landscape of Dhaka. Created using a custom brush palette with heavy oil textures.",
  price: 1250,
  category: "Digital Painting",
  imageUrl:
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
  artist: {
    _id: "artist_555",
    name: "Zayan Ahmed",
  },
};

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
  const id = params?.id || "art_999";

  const [artwork, setArtwork] = useState(MOCK_ARTWORK);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [user] = useState({
    id: "user_123",
    token: "mock_jwt_token",
    role: "buyer",
  });

  const handlePurchase = () => {
    if (!user) return router.push("/login");
    if (user.id === artwork.artist._id) {
      alert("You cannot buy your own artwork!");
      return;
    }
    setActionLoading(true);
    alert(
      `Redirecting to Stripe Checkout for: ${artwork.title} ($${artwork.price})`,
    );
    setActionLoading(false);
  };

  // Comment Handler
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

  // Delete Handler
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this artwork?")) {
      alert("Artwork deleted successfully! (Mock Action)");
      router.push("/");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-white bg-[#282a36] min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error || !artwork)
    return (
      <div className="p-6 text-red-500 bg-[#282a36] min-h-screen flex items-center justify-center">
        Artwork not found
      </div>
    );

  const isArtistOwner = user?.id === artwork.artist?._id;

  return (
    <div className="min-h-screen bg-[#282a36] text-[#f8f8f2] p-6">
      <div className="max-w-6xl mx-auto bg-[#1e1f29] rounded-xl overflow-hidden shadow-2xl border border-[#44475a]">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left: Image Card */}
          <div className="relative w-full h-[450px] rounded-lg overflow-hidden bg-[#282a36] border border-[#44475a]">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
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
                {artwork.category}
              </span>
              <h1 className="text-3xl font-bold text-[#8be9fd]">
                {artwork.title}
              </h1>

              <p className="text-sm text-[#6272a4]">
                By:{" "}
                <Link
                  href={`/artists/${artwork.artist?._id}`}
                  className="text-[#ff79c6] hover:underline font-medium"
                >
                  {artwork.artist?.name}
                </Link>
              </p>

              <p className="text-[#f8f8f2] leading-relaxed bg-[#282a36] p-4 rounded-lg border border-[#44475a]">
                {artwork.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#44475a]">
                <div>
                  <p className="text-xs text-[#6272a4]">Price</p>
                  <p className="text-2xl font-bold text-[#50fa7b]">
                    ${artwork.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6272a4]">Uploaded On</p>
                  <p className="text-sm">
                    {new Date(artwork.createdAt).toLocaleDateString()}
                  </p>
                </div>
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

          {/* Comment Form */}
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
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-3 bg-[#1e1f29] rounded-lg border border-[#44475a]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-[#ff79c6]">
                    {comment.username}
                  </span>
                  <span className="text-xs text-[#6272a4]">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#f8f8f2]">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
