import React from "react";
import AddProductForm from "./add-artworks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const AddArtworksPage = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_URL;
  let artworksData = null;

  try {
    const res = await fetch(`${apiUrl}/api/arthub/artwork`, {
      cache: "no-store",
    });

    if (res.ok) {
      artworksData = await res.json();
    }
  } catch (error) {
    console.error("Express backend থেকে ডাটা ফেচ করতে সমস্যা হয়েছে:", error);
  }

  // ২. সার্ভার সাইড থেকে কারেন্ট ইউজারের সেশন নিয়ে আসা
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user || null;

  return (
    <div>
      <AddProductForm artist={user} initialData={artworksData} />
    </div>
  );
};

export default AddArtworksPage;
