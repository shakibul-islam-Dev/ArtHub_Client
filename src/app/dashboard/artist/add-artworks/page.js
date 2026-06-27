import React from "react";
import AddProductForm from "./add-artworks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const AddArtworksPage = async () => {
  let user = null;

  try {
    const reqHeaders = await headers();

    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    user = session?.user || null;
  } catch (error) {
    console.error("Better-Auth সেশন গেট করতে সমস্যা হয়েছে:", error);
  }

  return (
    <div>
      <AddProductForm artist={user} />
    </div>
  );
};

export default AddArtworksPage;
