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
  { id: 3, title: "Mountain Peak", artist: "Sumon Das", price: "$300" }, // এখানে status নেই, তাই এরর হচ্ছিল
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Artworks</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Title</th>
              <th className="p-4 font-semibold text-gray-700">Artist Name</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {artworks.map((art) => (
              <tr key={art.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-800">{art.title}</td>
                <td className="p-4 text-gray-600">{art.artist}</td>
                <td className="p-4 text-gray-800 font-medium">{art.price}</td>
                <td className="p-4">
                  {/* এখানে || 'pending' যোগ করা হয়েছে যাতে status না থাকলেও এরর না দেয় */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      (art.status || "pending") === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {(art.status || "pending").toUpperCase()}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {(art.status || "pending") === "pending" && (
                    <button
                      onClick={() => handleApprove(art.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtworksPage;
