"use client";

import React, { useState, useEffect } from "react";

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ১. ব্যাকএন্ড থেকে সব আর্টওয়ার্ক লোড করা (অ্যাডমিন প্যানেলের জন্য রোল চেক বা বিশেষ কুয়েরি পাঠানো নিরাপদ)
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);

        // এনভায়রনমেন্ট ভ্যারিয়েবল না থাকলে লোকালহোস্ট fallback হিসেবে কাজ করবে
        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

        // 🔥 ফিক্স: এখানে ?isAdminPage=true পাস করা হয়েছে
        const res = await fetch(
          `${baseUrl}/api/arthub/artwork?isAdminPage=true`,
          {
            cache: "no-store",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch artworks");

        const resData = await res.json();
        const data = Array.isArray(resData) ? resData : resData.data || [];
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // ২. অ্যাডমিন অনুমোদন (PATCH Request)
  const handleApprove = async (id) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/arthub/artwork/${id}/approve`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Approval failed");

      // স্টেট আপডেট করে স্ট্যাটাস সরাসরি "approved" এবং isApproved true করে দেওয়া
      setArtworks((prev) =>
        prev.map((art) =>
          art._id === id
            ? { ...art, status: "approved", isApproved: true }
            : art,
        ),
      );
    } catch (err) {
      alert(`Error approving artwork: ${err.message}`);
    }
  };

  // ৩. আর্টওয়ার্ক ডিলিট (DELETE Request)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?"))
      return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/arthub/artwork/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      // স্টেট থেকে ডিলিট হওয়া আর্টওয়ার্কটি রিমুভ করা
      setArtworks((prev) => prev.filter((art) => art._id !== id));
    } catch (err) {
      alert(`Error deleting artwork: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-neutral-500">
        <div className="animate-pulse font-medium">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-transparent text-foreground min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Panel: Manage Artworks</h1>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-sm font-semibold opacity-80">
              <th className="p-4">Title</th>
              <th className="p-4">Artist Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-sm">
            {artworks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-neutral-500">
                  কোনো আর্টওয়ার্ক পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              artworks.map((art) => {
                const currentStatus = art.status || "pending";
                return (
                  <tr
                    key={art._id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-4 font-medium">{art.title}</td>
                    <td className="p-4 opacity-80">
                      {art.artist_name || "Unknown Artist"}
                    </td>
                    <td className="p-4 font-semibold">${art.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                          currentStatus === "approved"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {currentStatus === "pending" && (
                        <button
                          onClick={() => handleApprove(art._id)}
                          className="bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition text-sm font-medium cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(art._id)}
                        className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded hover:opacity-90 transition text-sm font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtworksPage;
