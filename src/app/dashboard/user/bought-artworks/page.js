import React from "react";

const BoughtArtworksPage = () => {
  // Mock Data for Purchased Artworks
  const boughtArtworks = [
    {
      id: "art-001",
      title: "Serenity of Cyberpunk",
      artist: "Alex Rivers",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-06-15",
      price: "$120.00",
      category: "Digital Art",
    },
    {
      id: "art-002",
      title: "Abstract Echoes",
      artist: "Elena Rostova",
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-05-28",
      price: "$350.00",
      category: "Canvas Painting",
    },
    {
      id: "art-003",
      title: "Neon Dreams",
      artist: "Marcus Vance",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-04-12",
      price: "$85.00",
      category: "3D Render",
    },
    {
      id: "art-004",
      title: "Whispering Woods",
      artist: "Sophia Martinez",
      image:
        "https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=500&auto=format&fit=crop&q=80",
      purchaseDate: "2026-03-05",
      price: "$210.00",
      category: "Watercolor",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Bought Artworks
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Browse through and manage your personal collection of purchased
            masterpieces.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-indigo-50/60 dark:bg-indigo-950/30 px-3 py-1.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            Total Collection:
          </span>
          <span className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
            {boughtArtworks.length} Items
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      {boughtArtworks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No artworks purchased yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boughtArtworks.map((art) => (
            <div
              key={art.id}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/70 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-black/60 text-white backdrop-blur-sm rounded-md">
                  {art.category}
                </span>
              </div>

              {/* Artwork Content */}
              <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-950 dark:text-white text-base line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    By{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {art.artist}
                    </span>
                  </p>
                </div>

                {/* Meta details & Action */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                      Purchased
                    </p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {art.purchaseDate}
                    </p>
                  </div>
                  <a
                    href={`/dashboard/artworks/${art.id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-950 rounded-xl transition-all duration-150"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoughtArtworksPage;
