"use client";

import React, { useState, useEffect } from "react";

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);

        const baseUrl = process.env.NEXT_PUBLIC_URL;

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

  const handleApprove = async (id) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL;
      const res = await fetch(`${baseUrl}/api/arthub/artwork/${id}/approve`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Approval failed");

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

  // Trigger Modal Open
  const triggerDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  // Confirm Delete Action
  const confirmDeleteAction = async () => {
    if (!itemToDelete) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL;
      const res = await fetch(`${baseUrl}/api/arthub/artwork/${itemToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setArtworks((prev) => prev.filter((art) => art._id !== itemToDelete));
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert(`Error deleting artwork: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-neutral-500">
        <div className="animate-pulse font-medium">Loading...</div>
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
                  No ArtWork Found...
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
                        onClick={() => triggerDelete(art._id)} // 👈 কাস্টম মডাল ট্রিগার করবে
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

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4 transition-all transform scale-100">
            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Confirm Deletion
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Are you sure you want to delete this artwork? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setItemToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworksPage;
