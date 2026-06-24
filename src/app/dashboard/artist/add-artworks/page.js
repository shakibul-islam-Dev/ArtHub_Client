import React from "react";
import AddProductForm from "./add-artworks";
import { getUserSession } from "@/lib/core/session";

const AddArtworksPage = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_URL;
  let artworksData = null;

  try {
    const res = await fetch(`${apiUrl}/api/artHub/artwork`, {
      cache: "no-store",
    });

    if (res.ok) {
      artworksData = await res.json();
    }
  } catch (error) {
    console.error("Express backend থেকে ডাটা ফেচ করতে সমস্যা হয়েছে:", error);
  }
  const user = await getUserSession();

  return (
    <div>
      <AddProductForm artist={user} initialData={artworksData}></AddProductForm>
    </div>
  );
};

export default AddArtworksPage;
