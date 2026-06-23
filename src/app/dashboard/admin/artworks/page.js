"use client";
import React, { useState } from "react";

const initialArtworks = [
  {
    id: 1,
    title: "Sunset Waves",
    artist: "Rahim Ahmed",
    price: "$500",
    status: "pending",
  },
  {
    id: 2,
    title: "Abstract Soul",
    artist: "Karim Ullah",
    price: "$750",
    status: "approved",
  },
  { id: 3, title: "Mountain Peak", artist: "Sumon Das", price: "$300" },
];

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState(initialArtworks);

  const handleApprove = (id) => {
    setArtworks(
      artworks.map((art) =>
        art.id === id ? { ...art, status: "approved" } : art,
      ),
    );
  };

  const handleDelete = (id) => {
    setArtworks(artworks.filter((art) => art.id !== id));
  };

  return (
    <div className="p-6 bg-transparent text-foreground min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Artworks</h1>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left">
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
            {artworks.map((art) => {
              const currentStatus = art.status || "pending";
              return (
                <tr
                  key={art.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="p-4 font-medium">{art.title}</td>
                  <td className="p-4 opacity-80">{art.artist}</td>
                  <td className="p-4 font-semibold">{art.price}</td>
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
                        onClick={() => handleApprove(art.id)}
                        className="bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition text-sm font-medium cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded hover:opacity-90 transition text-sm font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtworksPage;
