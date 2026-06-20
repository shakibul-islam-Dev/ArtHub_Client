// const ArtWorkDetails = () => {
//   return (
//     <div className="shadow-panel rounded-lg bg-white p-4">
//       {/* Image */}
//       {/* Title */}
//       {/* Description */}
//       {/* Price */}
//       {/* Artist name */}
//       {/* Likes */}
//       {/* category */}
//       {/* upload date */}
//       {/* buy */}
//       {/* Only For owner
//       if artist is owner of this art then he/she can edit the artwork or delete it
//       with a pop up notification
//       otherwise
//       other users can only view the artwork

//       */}
//       <div className="grid grid-cols-2 gap-4"> </div>
//     </div>
//   );
// };

// export default ArtWorkDetails;
"use client";
const ArtWorkDetails = () => {
  // Demo data for structure
  const isOwner = true;

  return (
    <div className="max-w-2xl mx-auto shadow-panel rounded-lg bg-white p-6">
      {/* Image */}
      <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
        <span className="text-gray-500">Artwork Image Placeholder</span>
      </div>

      {/* Title & Category */}
      <div className="mb-2">
        <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
          Digital Art
        </span>
        <h1 className="text-3xl font-bold text-gray-900">
          Sunset Over The Horizon
        </h1>
      </div>

      {/* Artist & Upload Date */}
      <div className="text-sm text-gray-500 mb-4">
        By <span className="font-medium text-gray-800">Jane Doe</span> •
        Uploaded on June 20, 2026
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        A breathtaking representation of a sunset over the horizon, captured
        with vibrant colors and intricate textures.
      </p>

      {/* Price & Likes */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-green-600">$150.00</div>
        <div className="flex items-center gap-2 text-gray-600">
          <span>❤️ 124 Likes</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        {isOwner ? (
          <>
            <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Edit Artwork
            </button>
            <button
              className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() =>
                alert("Are you sure you want to delete this artwork?")
              }
            >
              Delete Artwork
            </button>
          </>
        ) : (
          <button className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold">
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtWorkDetails;
